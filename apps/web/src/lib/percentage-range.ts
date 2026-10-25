import { settingsError, type Settings } from "@gymbutler/backend/convex/model/settings";

export type RangeSettings = Pick<Settings, "percentagesMin" | "percentagesMax" | "percentagesStep">;

/** What the user has typed into the min / max / step inputs. */
export interface RangeDraft {
  min: string;
  max: string;
  step: string;
}

export function toDraft(s: RangeSettings): RangeDraft {
  return {
    min: String(s.percentagesMin),
    max: String(s.percentagesMax),
    step: String(s.percentagesStep),
  };
}

/** The range a draft describes, or why it can't be saved yet. */
export function parseDraft(
  draft: RangeDraft,
  rest: Omit<Settings, keyof RangeSettings>,
): { ok: true; value: RangeSettings } | { ok: false; error: string } {
  const [min, max, step] = [draft.min, draft.max, draft.step].map((s) =>
    s.trim() === "" ? NaN : Number(s),
  );
  if ([min, max, step].some(Number.isNaN)) return { ok: false, error: "Enter all three values" };
  const value = { percentagesMin: min, percentagesMax: max, percentagesStep: step };
  const error = settingsError({ ...rest, ...value });
  return error ? { ok: false, error } : { ok: true, value };
}

export function sameRange(a: RangeSettings, b: RangeSettings): boolean {
  return (
    a.percentagesMin === b.percentagesMin &&
    a.percentagesMax === b.percentagesMax &&
    a.percentagesStep === b.percentagesStep
  );
}
