import { WalletActivity } from "../types";

export interface MemoryTrail {
  programId: string;       // the program where the action started
  startedAction: string;   // first action in the sequence
  missingFollowUp: string; // expected action that never happened
  lastSeen: number;        // timestamp of the starting action
}

// finds actions that were started but never completed
export function analyzeMemoryMap(walletActivity: WalletActivity[]): MemoryTrail[] {
  const trails: MemoryTrail[] = [];

  // simple example: what we expect to see after certain actions
  const actionPairs: Record<string, string> = {
    "add_liquidity": "remove_liquidity",
    "bridge_in": "swap",
    "stake": "unstake"
  };

  for (const [start, followUp] of Object.entries(actionPairs)) {
    const started = walletActivity.find((a) => a.actionType === start);
    const finished = walletActivity.find((a) => a.actionType === followUp);

    if (started && !finished) {
      trails.push({
        programId: started.programId,
        startedAction: start,
        missingFollowUp: followUp,
        lastSeen: started.timestamp
      });
    }
  }

  return trails;
}
