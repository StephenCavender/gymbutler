import type { api } from "@gymbutler/backend/convex/_generated/api";
import type { FunctionArgs } from "convex/server";

import { elapsedMs, splits, type Clock } from "./clock";

export type TimerSessionLog = FunctionArgs<typeof api.timer.log>;
export type StopwatchSessionLog = FunctionArgs<typeof api.stopwatch.log>;

/** Shorter unfinished sessions are treated as accidental and not logged. */
export const MIN_LOGGED_MS = 10_000;

const seconds = (ms: number) => Math.round(ms / 10) / 100;

/** What to log for a timer session, or null if it isn't worth logging. */
export function timerSessionLog(c: Clock, targetMs: number, now: number): TimerSessionLog | null {
  const elapsed = elapsedMs(c, now);
  const completed = elapsed >= targetMs;
  if (!completed && elapsed < MIN_LOGGED_MS) return null;
  return {
    totalSeconds: seconds(Math.min(elapsed, targetMs)),
    rounds: splits(c).map((ms, i) => ({
      roundNumber: i + 1,
      durationSeconds: seconds(ms),
      timestamp: c.marks[i]!.at,
    })),
    status: completed ? "completed" : "cancelled",
  };
}

/** What to log for a stopwatch session, or null if it isn't worth logging. */
export function stopwatchSessionLog(c: Clock, now: number): StopwatchSessionLog | null {
  const elapsed = elapsedMs(c, now);
  if (elapsed < MIN_LOGGED_MS) return null;
  return {
    totalTimeSeconds: seconds(elapsed),
    laps: splits(c).map((ms, i) => ({
      lapNumber: i + 1,
      lapTimeSeconds: seconds(ms),
      totalTimeSeconds: seconds(c.marks[i]!.elapsedMs),
      timestamp: c.marks[i]!.at,
    })),
    status: "completed",
  };
}
