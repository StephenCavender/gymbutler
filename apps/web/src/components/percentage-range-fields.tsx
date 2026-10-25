import { PERCENTAGE_LIMITS } from "@gymbutler/backend/convex/model/settings";
import { Input } from "@gymbutler/ui/components/input";
import { Label } from "@gymbutler/ui/components/label";
import { useEffect, useId, useState } from "react";

import { useSettings } from "@/components/settings-provider";
import { parseDraft, sameRange, toDraft, type RangeDraft } from "@/lib/percentage-range";

const { min: lo, max: hi, stepMin, stepMax } = PERCENTAGE_LIMITS;
const FIELDS = [
  { key: "min", label: "Min %", min: lo, max: hi },
  { key: "max", label: "Max %", min: lo, max: hi },
  { key: "step", label: "Step", min: stepMin, max: stepMax },
] as const;

/** Min / max / step inputs for the percentages table, saved to settings once valid. */
export function PercentageRangeFields() {
  const { settings, update } = useSettings();
  const [draft, setDraft] = useState<RangeDraft>(() => toDraft(settings));
  const id = useId();
  const { percentagesMin, percentagesMax, percentagesStep, ...rest } = settings;
  const parsed = parseDraft(draft, rest);

  // Follow changes made elsewhere (Settings page, another device), unless the
  // draft already says the same thing.
  useEffect(() => {
    setDraft((prev) => {
      const current = parseDraft(prev, rest);
      return current.ok && sameRange(current.value, settings) ? prev : toDraft(settings);
    });
  }, [percentagesMin, percentagesMax, percentagesStep]);

  const onChange = (key: keyof RangeDraft, value: string) => {
    const next = { ...draft, [key]: value };
    setDraft(next);
    const result = parseDraft(next, rest);
    if (result.ok && !sameRange(result.value, settings)) update(result.value);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-4">
        {FIELDS.map(({ key, label, min, max }) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={`${id}-${key}`}>{label}</Label>
            <Input
              id={`${id}-${key}`}
              type="number"
              inputMode="numeric"
              min={min}
              max={max}
              value={draft[key]}
              onChange={(e) => onChange(key, e.target.value)}
              aria-invalid={!parsed.ok}
              aria-describedby={parsed.ok ? undefined : `${id}-error`}
            />
          </div>
        ))}
      </div>
      {!parsed.ok && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {parsed.error}
        </p>
      )}
    </div>
  );
}
