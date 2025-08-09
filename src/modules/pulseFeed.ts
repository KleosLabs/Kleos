import { WalletActivity } from "../types";

export interface PulseSignal {
  programId: string;       // program name or ID
  recentActions: number;   // actions within the recent window
  lastActive: number;      // timestamp of last action
  attentionScore: number;  // normalized score (0–1)
}

// looks at recent wallet activity and finds which programs
// have been getting the most attention in the chosen time window.
export function analyzePulse(walletActivity: WalletActivity[], lookbackHours = 24): PulseSignal[] {
  const now = Date.now() / 1000; // current time in seconds
  const cutoff = now - lookbackHours * 3600;

  const programStats: Record<string, { count: number; lastActive: number }> = {};

  for (const tx of walletActivity) {
    if (tx.timestamp >= cutoff) {
      if (!programStats[tx.programId]) {
        programStats[tx.programId] = { count: 0, lastActive: 0 };
      }
      programStats[tx.programId].count++;
      if (tx.timestamp > programStats[tx.programId].lastActive) {
        programStats[tx.programId].lastActive = tx.timestamp;
      }
    }
  }

  const maxCount = Math.max(...Object.values(programStats).map(s => s.count), 1);

  return Object.entries(programStats).map(([programId, stats]) => ({
    programId,
    recentActions: stats.count,
    lastActive: stats.lastActive,
    attentionScore: stats.count / maxCount
  }));
}
