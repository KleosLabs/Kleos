import { WalletActivity } from "../types";

export interface EchoLink {
  a: string;        // wallet A
  b: string;        // wallet B
  programId: string;
  count: number;    // how many time near overlaps
  strength: number; // 0–1, normalized by max count
}

// finds wallet pairs that touch the same program within a short time window
export function analyzeEcho(
  peerLogs: Record<string, WalletActivity[]>,
  windowSeconds = 300
): EchoLink[] {
  // group all actions by program to keep comparisons local
  const byProgram: Record<string, Array<{ w: string; t: number }>> = {};

  for (const [wallet, logs] of Object.entries(peerLogs)) {
    for (const a of logs) {
      if (!byProgram[a.programId]) byProgram[a.programId] = [];
      byProgram[a.programId].push({ w: wallet, t: a.timestamp });
    }
  }

  // walk each program timeline and count overlaps within the window
  const pairCounts: Record<string, number> = {};

  for (const [programId, events] of Object.entries(byProgram)) {
    events.sort((x, y) => x.t - y.t);

    for (let i = 0; i < events.length; i++) {
      const e1 = events[i];
      let j = i + 1;

      while (j < events.length && events[j].t - e1.t <= windowSeconds) {
        const e2 = events[j];

        if (e1.w !== e2.w) {
          // canonicalize pair so (a,b) === (b,a)
          const [a, b] = e1.w < e2.w ? [e1.w, e2.w] : [e2.w, e1.w];
          const key = `${programId}|${a}|${b}`;
          pairCounts[key] = (pairCounts[key] || 0) + 1;
        }
        j++;
      }
    }
  }

  // turn counts into links and normalize strength
  const links: EchoLink[] = Object.entries(pairCounts).map(([key, count]) => {
    const [programId, a, b] = key.split("|");
    return { a, b, programId, count, strength: 0 };
  });

  const maxCount = links.reduce((m, l) => (l.count > m ? l.count : m), 0) || 1;
  for (const l of links) l.strength = l.count / maxCount;

  return links;
}
