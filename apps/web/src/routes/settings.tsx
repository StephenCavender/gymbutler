import { api } from "@gymbutler/backend/convex/_generated/api";
import { Button } from "@gymbutler/ui/components/button";
import { Card } from "@gymbutler/ui/components/card";
import { Input } from "@gymbutler/ui/components/input";
import { Label } from "@gymbutler/ui/components/label";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const settings = useQuery(api.settings.get);
  const upsertSettings = useMutation(api.settings.upsert);

  const [theme, setTheme] = useState("system");
  const [locale, setLocale] = useState("en");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [percentagesMin, setPercentagesMin] = useState(50);
  const [percentagesMax, setPercentagesMax] = useState(100);
  const [percentagesStep, setPercentagesStep] = useState(5);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setTheme(settings.theme ?? "system");
      setLocale(settings.locale ?? "en");
      setWeightUnit(settings.weightUnit ?? "kg");
      setPercentagesMin(settings.percentagesMin ?? 50);
      setPercentagesMax(settings.percentagesMax ?? 100);
      setPercentagesStep(settings.percentagesStep ?? 5);
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await upsertSettings({
        theme,
        locale,
        weightUnit,
        percentagesMin,
        percentagesMax,
        percentagesStep,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-3xl font-bold">Settings</h1>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Appearance</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <div className="flex gap-2">
                {["light", "dark", "system"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={`flex-1 rounded border p-2 text-sm capitalize transition-colors ${
                      theme === t
                        ? "border-primary bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Language</h2>
          <div className="space-y-2">
            <Label htmlFor="locale">Language</Label>
            <div className="flex gap-2">
              {[
                { value: "en", label: "English" },
                { value: "es", label: "Español" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLocale(value)}
                  className={`flex-1 rounded border p-2 text-sm transition-colors ${
                    locale === value
                      ? "border-primary bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Units</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Weight Unit</Label>
              <div className="flex gap-2">
                {[
                  { value: "kg", label: "Kilograms (kg)" },
                  { value: "lbs", label: "Pounds (lbs)" },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setWeightUnit(value)}
                    className={`flex-1 rounded border p-2 text-sm transition-colors ${
                      weightUnit === value
                        ? "border-primary bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Percentage Calculator Settings</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min">Minimum %</Label>
              <Input
                id="min"
                type="number"
                value={percentagesMin}
                onChange={(e) => setPercentagesMin(parseInt(e.target.value) || 50)}
                min={0}
                max={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max">Maximum %</Label>
              <Input
                id="max"
                type="number"
                value={percentagesMax}
                onChange={(e) => setPercentagesMax(parseInt(e.target.value) || 100)}
                min={0}
                max={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="step">Step</Label>
              <Input
                id="step"
                type="number"
                value={percentagesStep}
                onChange={(e) => setPercentagesStep(parseInt(e.target.value) || 5)}
                min={1}
                max={50}
              />
            </div>
          </div>
        </Card>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}