import { Button } from "@gymbutler/ui/components/button";
import { Card } from "@gymbutler/ui/components/card";
import { Input } from "@gymbutler/ui/components/input";
import { Label } from "@gymbutler/ui/components/label";
import { createFileRoute } from "@tanstack/react-router";
import type { WeightUnit } from "@gymbutler/backend/convex/model/settings";
import { useState } from "react";

import { convertWeight, otherUnit } from "@/lib/weight";
import { FieldGroup } from "@/components/field-group";
import { useSettings } from "@/components/settings-provider";
import { UnitToggle } from "@/components/unit-toggle";

export const Route = createFileRoute("/convert")({
  component: ConvertPage,
});

function ConvertPage() {
  const [weight, setWeight] = useState("");
  const { settings } = useSettings();
  // Starts from the preferred unit; switching here doesn't change the setting.
  const [chosenUnit, setFromUnit] = useState<WeightUnit | null>(null);
  const fromUnit = chosenUnit ?? settings.weightUnit;

  const weightNum = parseFloat(weight) || 0;
  const toUnit = otherUnit(fromUnit);
  const converted = convertWeight(weightNum, fromUnit);

  const handleSwapUnits = () => {
    setFromUnit(otherUnit(fromUnit));
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-3xl font-bold">Weight Converter</h1>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                type="number"
                inputMode="decimal"
                placeholder={`Enter weight in ${fromUnit}`}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="text-lg"
              />
            </div>
            <UnitToggle label="From" value={fromUnit} onChange={setFromUnit} />
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapUnits}
              className="rounded-full"
              aria-label="Swap units"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 16V4M7 4L3 8M7 4L11 8" />
                <path d="M17 8V20M17 20L21 16M17 20L13 16" />
              </svg>
            </Button>
          </div>

          <FieldGroup label="Result">
            <output className="block rounded-lg border bg-muted/50 p-4 text-center">
              <div className="text-4xl font-bold">
                {weightNum > 0 ? converted.toFixed(2) : "—"} {toUnit}
              </div>
            </output>
          </FieldGroup>

          {weightNum > 0 && (
            <div className="rounded-lg bg-muted/30 p-4 text-center text-sm text-muted-foreground">
              <p className="mb-2">Quick conversion trick:</p>
              <p>Divide by 2, then subtract 10% ≈ {fromUnit === "kg" ? "lbs" : "kg"}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
