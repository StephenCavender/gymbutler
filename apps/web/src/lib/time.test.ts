import { describe, expect, it } from "vitest";

import { durationStats, formatDuration, formatStopwatch } from "./time";

describe("formatDuration", () => {
  it.each([
    [0, "0:00"],
    [5, "0:05"],
    [65, "1:05"],
    [599, "9:59"],
    [3600, "1:00:00"],
    [3661, "1:01:01"],
  ])("formats %i seconds as %s", (seconds, expected) => {
    expect(formatDuration(seconds)).toBe(expected);
  });
});

describe("formatStopwatch", () => {
  it.each([
    [0, "0:00.00"],
    [1.5, "0:01.50"],
    [61.25, "1:01.25"],
    [3661.75, "1:01:01.75"],
  ])("formats %d seconds as %s", (seconds, expected) => {
    expect(formatStopwatch(seconds)).toBe(expected);
  });

  // Floating-point: 0.29 % 1 * 100 is 28.999…
  it.each([
    [0.29, "0:00.29"],
    [1.13, "0:01.13"],
    [59.57, "0:59.57"],
  ])("shows exact hundredths for %d", (seconds, expected) => {
    expect(formatStopwatch(seconds)).toBe(expected);
  });

  it("truncates rather than rounds hundredths", () => {
    expect(formatStopwatch(1.999)).toBe("0:01.99");
  });
});

describe("durationStats", () => {
  it("returns null with fewer than two durations", () => {
    expect(durationStats([])).toBeNull();
    expect(durationStats([30])).toBeNull();
  });

  it("returns average, best (shortest) and worst (longest)", () => {
    expect(durationStats([60, 45, 90])).toEqual({ average: 65, best: 45, worst: 90 });
  });
});
