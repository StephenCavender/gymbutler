import { Card } from "@gymbutler/ui/components/card";
import { createFileRoute, Link } from "@tanstack/react-router";

import { FieldGroup } from "@/components/field-group";
import { PercentageRangeFields } from "@/components/percentage-range-fields";
import { useSettings } from "@/components/settings-provider";
import { useTheme } from "@/components/theme-provider";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

const optionClass = (selected: boolean) =>
  `flex-1 rounded border p-2 text-sm transition-colors ${
    selected ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted"
  }`;

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { settings, savedTo, update } = useSettings();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-2 text-3xl font-bold">Settings</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        {savedTo === "account" ? (
          "Changes save to your account automatically."
        ) : (
          <>
            Changes save on this device.{" "}
            <Link to="/login" className="underline">
              Sign in
            </Link>{" "}
            to use them everywhere.
          </>
        )}
      </p>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Appearance</h2>
          <FieldGroup label="Theme">
            <div className="flex gap-2">
              {(["light", "dark", "system"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={theme === t}
                  onClick={() => setTheme(t)}
                  className={`${optionClass(theme === t)} capitalize`}
                >
                  {t}
                </button>
              ))}
            </div>
          </FieldGroup>
          <p className="mt-2 text-xs text-muted-foreground">Theme is saved per device.</p>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Units</h2>
          <FieldGroup label="Weight Unit">
            <div className="flex gap-2">
              {(
                [
                  { value: "kg", label: "Kilograms (kg)" },
                  { value: "lbs", label: "Pounds (lbs)" },
                ] as const
              ).map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={settings.weightUnit === value}
                  onClick={() => update({ weightUnit: value })}
                  className={optionClass(settings.weightUnit === value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </FieldGroup>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Percentage Table</h2>
          <PercentageRangeFields />
        </Card>
      </div>
    </div>
  );
}
