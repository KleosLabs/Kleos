// utility functions for working with timestamps in wallet activity

export function toDate(ts: number): Date {
  // // mock data timestamps are in seconds, convert to ms if needed
  return ts < 1e12 ? new Date(ts * 1000) : new Date(ts);
}

export function formatDate(ts: number): string {
  return toDate(ts).toISOString();
}

export function minutesBetween(a: number, b: number): number {
  return Math.abs(toDate(a).getTime() - toDate(b).getTime()) / 60000;
}
