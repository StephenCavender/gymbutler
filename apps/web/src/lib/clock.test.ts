import { describe, expect, it } from "vitest";

import {
  elapsedMs,
  finishCountdown,
  isRunning,
  mark,
  newClock,
  pause,
  remainingMs,
  splits,
  currentSplitMs,
  start,
} from "./clock";

describe("clock", () => {
  it("starts stopped at zero", () => {
    const c = newClock();
    expect(isRunning(c)).toBe(false);
    expect(elapsedMs(c, 1_000)).toBe(0);
  });

  it("counts time while running", () => {
    const c = start(newClock(), 1_000);
    expect(isRunning(c)).toBe(true);
    expect(elapsedMs(c, 3_500)).toBe(2_500);
  });

  it("excludes time spent paused", () => {
    let c = start(newClock(), 0);
    c = pause(c, 2_000);
    expect(elapsedMs(c, 5_000)).toBe(2_000);
    c = start(c, 5_000);
    expect(elapsedMs(c, 6_000)).toBe(3_000);
  });

  it("ignores start while running and pause while paused", () => {
    const running = start(newClock(), 0);
    expect(start(running, 5_000)).toBe(running);
    const paused = pause(running, 1_000);
    expect(pause(paused, 9_000)).toBe(paused);
  });
});

describe("marks (laps / rounds)", () => {
  it("splits elapsed time at each mark, excluding pauses", () => {
    let c = start(newClock(), 0);
    c = mark(c, 30_000); // split 1: 30s
    c = pause(c, 40_000);
    c = start(c, 100_000); // 60s paused
    c = mark(c, 125_000); // split 2: 10s + 25s
    expect(splits(c)).toEqual([30_000, 35_000]);
  });

  it("records when each mark happened", () => {
    const c = mark(start(newClock(), 0), 30_000);
    expect(c.marks[0]).toEqual({ elapsedMs: 30_000, at: 30_000 });
  });

  it("times the split in progress", () => {
    let c = start(newClock(), 0);
    c = mark(c, 30_000);
    expect(currentSplitMs(c, 45_000)).toBe(15_000);
  });
});

describe("countdown", () => {
  it("counts down from the target", () => {
    const c = start(newClock(), 0);
    expect(remainingMs(c, 300_000, 60_000)).toBe(240_000);
  });

  it("never goes below zero", () => {
    const c = start(newClock(), 0);
    expect(remainingMs(c, 10_000, 15_000)).toBe(0);
  });

  it("stops exactly at the target once time is up", () => {
    const c = finishCountdown(start(newClock(), 0), 10_000, 15_000);
    expect(isRunning(c)).toBe(false);
    expect(elapsedMs(c, 99_000)).toBe(10_000);
  });

  it("leaves an unfinished countdown running", () => {
    const c = start(newClock(), 0);
    expect(finishCountdown(c, 10_000, 5_000)).toBe(c);
  });
});
