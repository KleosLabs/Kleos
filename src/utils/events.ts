import { WalletActivity } from "../types";

// group events by programId
export function groupByProgram(events: WalletActivity[]): Record<string, WalletActivity[]> {
  return events.reduce<Record<string, WalletActivity[]>>((acc, e) => {
    if (!acc[e.programId]) acc[e.programId] = [];
    acc[e.programId].push(e);
    return acc;
  }, {});
}

// count how many times each actionType appears
export function countActions(events: WalletActivity[]): Record<string, number> {
  return events.reduce<Record<string, number>>((acc, e) => {
    acc[e.actionType] = (acc[e.actionType] ?? 0) + 1;
    return acc;
  }, {});
}

// get events for a specific wallet address (if present in mock data)
export function filterByWallet(events: WalletActivity[], wallet: string): WalletActivity[] {
  return events.filter((e) => e.wallet === wallet);
}
