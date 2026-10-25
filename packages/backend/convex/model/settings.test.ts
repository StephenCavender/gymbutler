import { describe, expect, it } from "vitest";

import { DEFAULT_SETTINGS, settingsError, withDefaults } from "./settings";

describe("withDefaults", () => {
  it("fills missing fields from the defaults", () => {
    expect(withDefaults({ weightUnit: "lbs" })).toEqual({ ...DEFAULT_SETTINGS, weightUnit: "lbs" });
  });

  it("returns the defaults for null", () => {
    expect(withDefaults(null)).toEqual(DEFAULT_SETTINGS);
  });

  it("ignores fields explicitly set to undefined", () => {
    expect(withDefaults({ percentagesMin: undefined })).toEqual(DEFAULT_SETTINGS);
  });
});

describe("settingsError", () => {
  const valid = DEFAULT_SETTINGS;

  it("accepts the defaults", () => {
    expect(settingsError(valid)).toBeNull();
  });

  it("accepts min equal to max", () => {
    expect(settingsError({ ...valid, percentagesMin: 80, percentagesMax: 80 })).toBeNull();
  });

  it.each([
    ["min above max", { percentagesMin: 90, percentagesMax: 80 }],
    ["min below 0", { percentagesMin: -5 }],
    ["max above 100", { percentagesMax: 105 }],
    ["fractional percentages", { percentagesMin: 52.5 }],
    ["step of 0", { percentagesStep: 0 }],
    ["step above 50", { percentagesStep: 55 }],
    ["fractional step", { percentagesStep: 2.5 }],
  ])("rejects %s", (_, change) => {
    expect(settingsError({ ...valid, ...change })).toEqual(expect.any(String));
  });
});
