const pad = (n: number) => n.toString().padStart(2, "0");

/** Whole seconds as `m:ss`, or `h:mm:ss` once an hour is reached. */
export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/** Fractional seconds as `m:ss.cc`, or `h:mm:ss.cc` once an hour is reached. */
export function formatStopwatch(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const cs = Math.floor((totalSeconds % 1) * 100);
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}.${pad(cs)}` : `${m}:${pad(s)}.${pad(cs)}`;
}

export interface DurationStats {
  average: number;
  best: number;
  worst: number;
}

/** Average/best/worst of a set of durations, or null with fewer than two. */
export function durationStats(durations: number[]): DurationStats | null {
  if (durations.length < 2) return null;
  return {
    average: durations.reduce((a, b) => a + b, 0) / durations.length,
    best: Math.min(...durations),
    worst: Math.max(...durations),
  };
}
