import { describe, expect, it } from "vitest";

import { parseDraft, sameRange, toDraft } from "./percentage-range";

const rest = { weightUnit: "kg" as const };

describe("parseDraft", () => {
  it("parses a valid range", () => {
    expect(parseDraft({ min: "60", max: "90", step: "10" }, rest)).toEqual({
      ok: true,
      value: { percentagesMin: 60, percentagesMax: 90, percentagesStep: 10 },
    });
  });

  it("round-trips through toDraft", () => {
    const value = { percentagesMin: 50, percentagesMax: 100, percentagesStep: 5 };
    expect(parseDraft(toDraft(value), rest)).toEqual({ ok: true, value });
  });

  it("waits for an empty field", () => {
    expect(parseDraft({ min: "", max: "90", step: "10" }, rest)).toEqual({
      ok: false,
      error: "Enter all three values",
    });
  });

  // Typing "100" over "90" passes through "1", which is below min.
  it("rejects a half-typed value that breaks the range", () => {
    const result = parseDraft({ min: "50", max: "1", step: "5" }, rest);
    expect(result.ok).toBe(false);
  });

  it("rejects fractional input", () => {
    expect(parseDraft({ min: "52.5", max: "90", step: "5" }, rest).ok).toBe(false);
  });
});

describe("sameRange", () => {
  it("compares all three values", () => {
    const a = { percentagesMin: 50, percentagesMax: 100, percentagesStep: 5 };
    expect(sameRange(a, { ...a })).toBe(true);
    expect(sameRange(a, { ...a, percentagesStep: 10 })).toBe(false);
  });
});
