import type { Settings } from "@gymbutler/backend/convex/model/settings";

// Settings kept on this device (signed out, and as a mirror when signed in).
// Keys predate the Convex sync; keep them so saved choices survive.
const KEYS = {
  weightUnit: "gymbutler-weight-unit",
  percentagesMin: "gymbutler-pct-min",
  percentagesMax: "gymbutler-pct-max",
  percentagesStep: "gymbutler-pct-step",
} as const satisfies Record<keyof Settings, string>;

type KeyValueStore = Pick<Storage, "getItem" | "setItem">;

/** The settings saved on this device; unreadable values are skipped. */
export function readLocalSettings(storage: KeyValueStore): Partial<Settings> {
  const out: Partial<Settings> = {};
  const unit = storage.getItem(KEYS.weightUnit);
  if (unit === "kg" || unit === "lbs") out.weightUnit = unit;
  for (const key of ["percentagesMin", "percentagesMax", "percentagesStep"] as const) {
    const raw = storage.getItem(KEYS[key]);
    const n = raw === null ? NaN : Number(raw);
    if (Number.isInteger(n)) out[key] = n;
  }
  return out;
}

export function writeLocalSettings(storage: KeyValueStore, change: Partial<Settings>): void {
  for (const [key, value] of Object.entries(change) as [keyof Settings, unknown][]) {
    if (value !== undefined) storage.setItem(KEYS[key], String(value));
  }
}
