import { labelClassName } from "@gymbutler/ui/components/label";
import { cn } from "@gymbutler/ui/lib/utils";
import { useId, type ReactNode } from "react";

/**
 * A labelled group of controls (toggle buttons, several inputs). Use instead of
 * <Label>, which may only name a single form control.
 */
export function FieldGroup({
  label,
  className,
  children,
}: {
  label: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id} className={cn("space-y-2", className)}>
      <span id={id} className={labelClassName}>
        {label}
      </span>
      {children}
    </div>
  );
}
