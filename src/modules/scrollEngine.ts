import { WalletActivity, BehaviorPattern } from "../types";

/**
 * Analyze wallet interactions and detect rituals based on repeated behavior.
 */
export function analyzeScroll(walletActivity: WalletActivity[]): BehaviorPattern[] {
  const frequencyMap: Record<string, number> = {};

  for (const act of walletActivity) {
    frequencyMap[act.programId] = (frequencyMap[act.programId] || 0) + 1;
  }

  const patterns: BehaviorPattern[] = [];

  for (const [programId, count] of Object.entries(frequencyMap)) {
    if (count >= 3) {
      patterns.push({
        type: "ritual",
        confidence: Math.min(1, count / 10),
        tags: ["repetition", "program-focused"],
        summary: `Repeated interaction with ${programId} (${count}x)`
      });
    }
  }

  return patterns;
}
