import { describe, expect, it } from "vitest";

import { readLocalSettings, writeLocalSettings } from "./local-settings";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    data,
  };
}

describe("readLocalSettings", () => {
  it("returns nothing for an empty device", () => {
    expect(readLocalSettings(memoryStorage())).toEqual({});
  });

  it("reads values saved under the existing keys", () => {
    const storage = memoryStorage({
      "gymbutler-weight-unit": "lbs",
      "gymbutler-pct-min": "60",
      "gymbutler-pct-max": "90",
      "gymbutler-pct-step": "10",
    });
    expect(readLocalSettings(storage)).toEqual({
      weightUnit: "lbs",
      percentagesMin: 60,
      percentagesMax: 90,
      percentagesStep: 10,
    });
  });

  it("skips values it cannot read", () => {
    const storage = memoryStorage({
      "gymbutler-weight-unit": "stone",
      "gymbutler-pct-min": "abc",
      "gymbutler-pct-step": "2.5",
    });
    expect(readLocalSettings(storage)).toEqual({});
  });
});

describe("writeLocalSettings", () => {
  it("round-trips through readLocalSettings", () => {
    const storage = memoryStorage();
    writeLocalSettings(storage, { weightUnit: "lbs", percentagesStep: 10 });
    expect(readLocalSettings(storage)).toEqual({ weightUnit: "lbs", percentagesStep: 10 });
  });

  it("leaves fields it was not given alone", () => {
    const storage = memoryStorage({ "gymbutler-pct-min": "60" });
    writeLocalSettings(storage, { weightUnit: "kg" });
    expect(storage.data.get("gymbutler-pct-min")).toBe("60");
  });
});
