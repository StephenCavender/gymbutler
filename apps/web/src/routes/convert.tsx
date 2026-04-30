import { Button } from "@gymbutler/ui/components/button";
import { Card } from "@gymbutler/ui/components/card";
import { Input } from "@gymbutler/ui/components/input";
import { Label } from "@gymbutler/ui/components/label";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/convert")({
  component: ConvertPage,
});

function ConvertPage() {
  const { t } = useTranslation();
  const [weight, setWeight] = useState("");
  const [fromUnit, setFromUnit] = useState<"kg" | "lbs">("kg");

  const weightNum = parseFloat(weight) || 0;
  const toUnit = fromUnit === "kg" ? "lbs" : "kg";
  const converted = convertWeight(weightNum, fromUnit);

  const handleSwapUnits = () => {
    setFromUnit(fromUnit === "kg" ? "lbs" : "kg");
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-3xl font-bold">{t('convert.title')}</h1>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="weight">{t('convert.enterWeight')}</Label>
              <Input
                id="weight"
                type="number"
                inputMode="decimal"
                placeholder={`${t('convert.enterWeight')} ${fromUnit}`}
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
                  onClick={() => setFromUnit("kg")}
                  className={`flex-1 px-4 py-2 text-sm transition-colors ${
                    fromUnit === "kg"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {t('convert.kilograms')}
                </button>
                <button
                  type="button"
                  onClick={() => setFromUnit("lbs")}
                  className={`flex-1 px-4 py-2 text-sm transition-colors ${
                    fromUnit === "lbs"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {t('convert.pounds')}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapUnits}
              className="rounded-full"
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

          <div className="space-y-2">
            <Label>{t('convert.pounds')} / {t('convert.kilograms')}</Label>
            <div className="rounded-lg border bg-muted/50 p-4 text-center">
              <div className="text-4xl font-bold">
                {weightNum > 0 ? converted.toFixed(2) : "—"} {toUnit}
              </div>
            </div>
          </div>

          {weightNum > 0 && (
            <div className="rounded-lg bg-muted/30 p-4 text-center text-sm text-muted-foreground">
              <p className="mb-2">{t('convert.quickTrick')}</p>
              <p>
                {t('convert.divideBy2')} ≈ {fromUnit === "kg" ? t('convert.pounds') : t('convert.kilograms')}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function convertWeight(weight: number, fromUnit: "kg" | "lbs"): number {
  if (fromUnit === "kg") {
    return weight * 2.20462;
  } else {
    return weight * 0.453592;
  }
}
