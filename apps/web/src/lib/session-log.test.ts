import { describe, expect, it } from "vitest";

import { finishCountdown, mark, newClock, pause, start } from "./clock";
import { stopwatchSessionLog, timerSessionLog } from "./session-log";

describe("timerSessionLog", () => {
  it("logs a finished countdown as completed, with its rounds", () => {
    let c = start(newClock(), 0);
    c = mark(c, 25_000);
    c = finishCountdown(c, 60_000, 61_000);
    expect(timerSessionLog(c, 60_000, 70_000)).toEqual({
      totalSeconds: 60,
      rounds: [{ roundNumber: 1, durationSeconds: 25, timestamp: 25_000 }],
      status: "completed",
    });
  });

  it("logs an abandoned countdown as cancelled, counting only running time", () => {
    let c = start(newClock(), 0);
    c = pause(c, 15_000);
    expect(timerSessionLog(c, 60_000, 500_000)).toEqual({
      totalSeconds: 15,
      rounds: [],
      status: "cancelled",
    });
  });

  it("skips a countdown abandoned within 10 seconds", () => {
    const c = pause(start(newClock(), 0), 9_000);
    expect(timerSessionLog(c, 60_000, 9_000)).toBeNull();
  });

  it("logs a short countdown that finished", () => {
    const c = finishCountdown(start(newClock(), 0), 5_000, 5_000);
    expect(timerSessionLog(c, 5_000, 5_000)?.status).toBe("completed");
  });
});

describe("stopwatchSessionLog", () => {
  it("logs total time and laps with hundredths", () => {
    let c = start(newClock(), 0);
    c = mark(c, 12_345);
    c = pause(c, 20_000);
    expect(stopwatchSessionLog(c, 99_000)).toEqual({
      totalTimeSeconds: 20,
      laps: [{ lapNumber: 1, lapTimeSeconds: 12.35, totalTimeSeconds: 12.35, timestamp: 12_345 }],
      status: "completed",
    });
  });

  it("skips runs under 10 seconds", () => {
    expect(stopwatchSessionLog(pause(start(newClock(), 0), 5_000), 5_000)).toBeNull();
  });
});
