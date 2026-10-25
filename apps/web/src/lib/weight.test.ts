import { describe, expect, it } from "vitest";

import { calculatePercentages, convertWeight, otherUnit } from "./weight";

describe("convertWeight", () => {
  it("converts kg to lbs", () => {
    expect(convertWeight(100, "kg")).toBeCloseTo(220.462);
  });

  it("converts lbs to kg", () => {
    expect(convertWeight(225, "lbs")).toBeCloseTo(102.058, 3);
  });

  it("round-trips within rounding error", () => {
    expect(convertWeight(convertWeight(140, "kg"), "lbs")).toBeCloseTo(140, 3);
  });

  it("returns 0 for 0", () => {
    expect(convertWeight(0, "kg")).toBe(0);
  });
});

describe("otherUnit", () => {
  it("flips between kg and lbs", () => {
    expect(otherUnit("kg")).toBe("lbs");
    expect(otherUnit("lbs")).toBe("kg");
  });
});

describe("calculatePercentages", () => {
  it("lists rows from max down to min, inclusive", () => {
    const rows = calculatePercentages(200, 50, 100, 5);
    expect(rows.map((r) => r.percentage)).toEqual([100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50]);
  });

  // The original mobile app omitted the 100% row when max was 100.
  // The web app deliberately includes it.
  it("includes the 100% row", () => {
    expect(calculatePercentages(200, 50, 100, 5)[0]).toEqual({ percentage: 100, weight: 200 });
  });

  it("computes each weight as a percentage of the input", () => {
    expect(calculatePercentages(140, 70, 80, 5)).toEqual([
      { percentage: 80, weight: 112 },
      { percentage: 75, weight: 105 },
      { percentage: 70, weight: 98 },
    ]);
  });

  it("stops before min when the step does not land on it", () => {
    expect(calculatePercentages(100, 50, 100, 20).map((r) => r.percentage)).toEqual([100, 80, 60]);
  });

  it("returns a single row when min equals max", () => {
    expect(calculatePercentages(100, 80, 80, 5)).toEqual([{ percentage: 80, weight: 80 }]);
  });

  it("returns no rows when min is above max", () => {
    expect(calculatePercentages(100, 90, 80, 5)).toEqual([]);
  });
});
