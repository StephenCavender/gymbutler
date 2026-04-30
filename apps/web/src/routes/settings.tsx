import { Button } from "@gymbutler/ui/components/button";
import { Card } from "@gymbutler/ui/components/card";
import { Input } from "@gymbutler/ui/components/input";
import { Label } from "@gymbutler/ui/components/label";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

const STORAGE_KEYS = {
  theme: "gymbutler-theme",
  locale: "gymbutler-locale",
  weightUnit: "gymbutler-weight-unit",
  percentagesMin: "gymbutler-pct-min",
  percentagesMax: "gymbutler-pct-max",
  percentagesStep: "gymbutler-pct-step",
};

function SettingsPage() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState("dark");
  const [locale, setLocale] = useState("en");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [percentagesMin, setPercentagesMin] = useState(50);
  const [percentagesMax, setPercentagesMax] = useState(100);
  const [percentagesStep, setPercentagesStep] = useState(5);

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    if (savedTheme) setTheme(savedTheme);

    const savedLocale = localStorage.getItem(STORAGE_KEYS.locale);
    if (savedLocale) {
      setLocale(savedLocale);
      i18n.changeLanguage(savedLocale);
    }

    const savedUnit = localStorage.getItem(STORAGE_KEYS.weightUnit);
    if (savedUnit) setWeightUnit(savedUnit);

    const savedMin = localStorage.getItem(STORAGE_KEYS.percentagesMin);
    if (savedMin) setPercentagesMin(parseInt(savedMin));

    const savedMax = localStorage.getItem(STORAGE_KEYS.percentagesMax);
    if (savedMax) setPercentagesMax(parseInt(savedMax));

    const savedStep = localStorage.getItem(STORAGE_KEYS.percentagesStep);
    if (savedStep) setPercentagesStep(parseInt(savedStep));
  }, [i18n]);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    localStorage.setItem(STORAGE_KEYS.locale, locale);
    localStorage.setItem(STORAGE_KEYS.weightUnit, weightUnit);
    localStorage.setItem(STORAGE_KEYS.percentagesMin, percentagesMin.toString());
    localStorage.setItem(STORAGE_KEYS.percentagesMax, percentagesMax.toString());
    localStorage.setItem(STORAGE_KEYS.percentagesStep, percentagesStep.toString());

    i18n.changeLanguage(locale);
    alert(t('settings.saved'));
  };

  const themes = [
    { value: "light", label: t('settings.light') },
    { value: "dark", label: t('settings.dark') },
    { value: "system", label: t('settings.system') },
  ];

  const languages = [
    { value: "en", label: t('settings.english') },
    { value: "es", label: t('settings.spanish') },
  ];

  const units = [
    { value: "kg", label: t('percentages.kilograms') },
    { value: "lbs", label: t('percentages.pounds') },
  ];

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-3xl font-bold">{t('settings.title')}</h1>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">{t('settings.theme')}</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">{t('settings.theme')}</Label>
              <div className="flex gap-2">
                {themes.map((tObj) => (
                  <button
                    key={tObj.value}
                    type="button"
                    onClick={() => setTheme(tObj.value)}
                    className={`flex-1 rounded border p-2 text-sm capitalize transition-colors ${
                      theme === tObj.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    {tObj.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">{t('settings.language')}</h2>
          <div className="space-y-2">
            <Label htmlFor="locale">{t('settings.language')}</Label>
            <div className="flex gap-2">
              {languages.map(({ value, label }) => (
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
          <h2 className="mb-4 text-lg font-semibold">{t('settings.weightUnit')}</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('settings.weightUnit')}</Label>
              <div className="flex gap-2">
                {units.map(({ value, label }) => (
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
          <h2 className="mb-4 text-lg font-semibold">{t('settings.percentageSettings')}</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min">{t('settings.minimumPercentage')}</Label>
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
              <Label htmlFor="max">{t('settings.maximumPercentage')}</Label>
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
              <Label htmlFor="step">{t('settings.increment')}</Label>
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

        <Button onClick={handleSave} className="w-full">
          {t('settings.save')}
        </Button>
      </div>
    </div>
  );
}
