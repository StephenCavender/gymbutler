import { Card } from "@gymbutler/ui/components/card";
import { Input } from "@gymbutler/ui/components/input";
import { Label } from "@gymbutler/ui/components/label";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { calculatePercentages } from "@/lib/weight";
import { PercentageRangeFields } from "@/components/percentage-range-fields";
import { useSettings } from "@/components/settings-provider";
import { UnitToggle } from "@/components/unit-toggle";

export const Route = createFileRoute("/percentages")({
  component: PercentagesPage,
});

function PercentagesPage() {
  const [weight, setWeight] = useState("");
  const { settings, update } = useSettings();
  const {
    weightUnit: unit,
    percentagesMin: min,
    percentagesMax: max,
    percentagesStep: step,
  } = settings;

  const weightNum = parseFloat(weight) || 0;
  const percentages = calculatePercentages(weightNum, min, max, step);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-3xl font-bold">Weight Percentages</h1>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="weight">Weight ({unit})</Label>
              <Input
                id="weight"
                type="number"
                inputMode="decimal"
                placeholder={`Enter weight in ${unit}`}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="text-lg"
              />
            </div>
            <UnitToggle
              label="Unit"
              value={unit}
              onChange={(weightUnit) => update({ weightUnit })}
            />
          </div>

          <PercentageRangeFields />
        </div>
      </Card>

      {weightNum > 0 && (
        <Card className="mt-6 p-6">
          <h2 className="mb-4 text-xl font-semibold">
            {weightNum} {unit} =
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {percentages.map((result) => (
              <div
                key={result.percentage}
                className="rounded-lg border bg-muted/50 p-3 text-center"
              >
                <div className="text-sm text-muted-foreground">{result.percentage}%</div>
                <div className="text-lg font-semibold">
                  {result.weight.toFixed(1)} {unit}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
