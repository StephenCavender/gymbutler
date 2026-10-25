export type WeightUnit = "kg" | "lbs";

export interface PercentageRow {
  percentage: number;
  weight: number;
}

const LBS_PER_KG = 2.20462;
const KG_PER_LB = 0.453592;

export function otherUnit(unit: WeightUnit): WeightUnit {
  return unit === "kg" ? "lbs" : "kg";
}

export function convertWeight(weight: number, fromUnit: WeightUnit): number {
  return fromUnit === "kg" ? weight * LBS_PER_KG : weight * KG_PER_LB;
}

/** Rows from `max` down to `min` (inclusive) in `step` increments. */
export function calculatePercentages(
  weight: number,
  min: number,
  max: number,
  step: number,
): PercentageRow[] {
  const results: PercentageRow[] = [];

  for (let pct = max; pct >= min; pct -= step) {
    results.push({ percentage: pct, weight: (weight * pct) / 100 });
  }

  return results;
}
