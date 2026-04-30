import { Button } from "@gymbutler/ui/components/button";
import { Card } from "@gymbutler/ui/components/card";
import { Input } from "@gymbutler/ui/components/input";
import { Label } from "@gymbutler/ui/components/label";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/percentages")({
  component: PercentagesPage,
});

function PercentagesPage() {
  const { t } = useTranslation();
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const [min, setMin] = useState(50);
  const [max, setMax] = useState(100);
  const [step, setStep] = useState(5);

  const weightNum = parseFloat(weight) || 0;
  const percentages = calculatePercentages(weightNum, min, max, step);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-3xl font-bold">{t('percentages.title')}</h1>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="weight">{t('percentages.weight')} ({unit})</Label>
              <Input
                id="weight"
                type="number"
                inputMode="decimal"
                placeholder={`${t('percentages.enterWeight')} ${unit}`}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('percentages.unit')}</Label>
              <div className="flex rounded-md border">
                <button
                  type="button"
                  onClick={() => setUnit("kg")}
                  className={`flex-1 px-4 py-2 text-sm transition-colors ${
                    unit === "kg"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {t('percentages.kilograms')}
                </button>
                <button
                  type="button"
                  onClick={() => setUnit("lbs")}
                  className={`flex-1 px-4 py-2 text-sm transition-colors ${
                    unit === "lbs"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {t('percentages.pounds')}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min">{t('settings.minimumPercentage')}</Label>
              <Input
                id="min"
                type="number"
                value={min}
                onChange={(e) => setMin(parseInt(e.target.value) || 50)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max">{t('settings.maximumPercentage')}</Label>
              <Input
                id="max"
                type="number"
                value={max}
                onChange={(e) => setMax(parseInt(e.target.value) || 100)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="step">{t('settings.increment')}</Label>
              <Input
                id="step"
                type="number"
                value={step}
                onChange={(e) => setStep(parseInt(e.target.value) || 5)}
              />
            </div>
          </div>
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
                <div className="text-sm text-muted-foreground">
                  {result.percentage}%
                </div>
                <div className="text-lg font-semibold">
                  {result.weight.toFixed(1)} {unit}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {weightNum === 0 && (
        <div className="mt-6 text-center text-muted-foreground">
          {t('percentages.noData')}
        </div>
      )}
    </div>
  );
}

function calculatePercentages(
  weight: number,
  min: number,
  max: number,
  step: number
): Array<{ percentage: number; weight: number }> {
  const results: Array<{ percentage: number; weight: number }> = [];

  for (let pct = max; pct >= min; pct -= step) {
    results.push({
      percentage: pct,
      weight: (weight * pct) / 100,
    });
  }

  return results;
}
