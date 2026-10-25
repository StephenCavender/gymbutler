// A pausable clock driven by timestamps, so it stays accurate when the
// browser throttles timers (background tabs, locked phones). The stopwatch
// counts up on it and the timer counts down on it; laps and rounds are marks.
// All functions are pure: pass `now` (Date.now()) in.

export interface Mark {
  /** Clock time at the mark (pauses excluded). */
  elapsedMs: number;
  /** Wall-clock time of the mark. */
  at: number;
}

export interface Clock {
  /** Time accumulated before the current run. */
  accumulatedMs: number;
  /** When the current run started, or null while paused. */
  startedAt: number | null;
  marks: Mark[];
}

export const newClock = (): Clock => ({ accumulatedMs: 0, startedAt: null, marks: [] });

export const isRunning = (c: Clock): boolean => c.startedAt !== null;

export function elapsedMs(c: Clock, now: number): number {
  return c.accumulatedMs + (c.startedAt === null ? 0 : now - c.startedAt);
}

export function start(c: Clock, now: number): Clock {
  return isRunning(c) ? c : { ...c, startedAt: now };
}

export function pause(c: Clock, now: number): Clock {
  return isRunning(c) ? { ...c, accumulatedMs: elapsedMs(c, now), startedAt: null } : c;
}

/** Record a lap / round at the current clock time. */
export function mark(c: Clock, now: number): Clock {
  return { ...c, marks: [...c.marks, { elapsedMs: elapsedMs(c, now), at: now }] };
}

/** Duration of each completed lap / round. */
export function splits(c: Clock): number[] {
  return c.marks.map((m, i) => m.elapsedMs - (i === 0 ? 0 : c.marks[i - 1]!.elapsedMs));
}

/** Duration of the lap / round in progress. */
export function currentSplitMs(c: Clock, now: number): number {
  return elapsedMs(c, now) - (c.marks.at(-1)?.elapsedMs ?? 0);
}

export function remainingMs(c: Clock, targetMs: number, now: number): number {
  return Math.max(0, targetMs - elapsedMs(c, now));
}

/** Once a countdown reaches its target, stop the clock exactly there. */
export function finishCountdown(c: Clock, targetMs: number, now: number): Clock {
  if (!isRunning(c) || elapsedMs(c, now) < targetMs) return c;
  return { ...c, accumulatedMs: targetMs, startedAt: null };
}
