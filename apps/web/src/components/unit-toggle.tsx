import type { WeightUnit } from "@gymbutler/backend/convex/model/settings";

import { FieldGroup } from "@/components/field-group";

/** kg / lbs segmented toggle. */
export function UnitToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: WeightUnit;
  onChange: (unit: WeightUnit) => void;
}) {
  return (
    <FieldGroup label={label}>
      <div className="flex rounded-md border">
        {(["kg", "lbs"] as const).map((unit) => (
          <button
            key={unit}
            type="button"
            aria-pressed={value === unit}
            onClick={() => onChange(unit)}
            className={`flex-1 px-4 py-2 text-sm transition-colors ${
              value === unit ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            {unit}
          </button>
        ))}
      </div>
    </FieldGroup>
  );
}
