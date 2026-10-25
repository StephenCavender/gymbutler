// User settings shared by the backend and the web app (imported as
// @gymbutler/backend/convex/model/settings). Stored settings may omit any
// field; read them through withDefaults().

export type WeightUnit = "kg" | "lbs";

export interface Settings {
  weightUnit: WeightUnit;
  percentagesMin: number;
  percentagesMax: number;
  percentagesStep: number;
}

export const DEFAULT_SETTINGS: Settings = {
  weightUnit: "kg",
  percentagesMin: 50,
  percentagesMax: 100,
  percentagesStep: 5,
};

export const PERCENTAGE_LIMITS = { min: 0, max: 100, stepMin: 1, stepMax: 50 } as const;

export function withDefaults(stored: Partial<Settings> | null | undefined): Settings {
  return { ...DEFAULT_SETTINGS, ...stripUndefined(stored ?? {}) };
}

/** Why the settings are invalid, or null when they are valid. */
export function settingsError(s: Settings): string | null {
  const { percentagesMin: min, percentagesMax: max, percentagesStep: step } = s;
  const { min: lo, max: hi, stepMin, stepMax } = PERCENTAGE_LIMITS;
  if (![min, max, step].every(Number.isInteger)) return "Percentages must be whole numbers";
  if (min < lo || max > hi) return `Percentages must be between ${lo} and ${hi}`;
  if (min > max) return "Minimum % must not be above maximum %";
  if (step < stepMin || step > stepMax) return `Step must be between ${stepMin} and ${stepMax}`;
  return null;
}

function stripUndefined<T extends object>(o: T): Partial<T> {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<T>;
}
