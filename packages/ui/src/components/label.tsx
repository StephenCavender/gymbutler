import { cn } from "@gymbutler/ui/lib/utils";
import * as React from "react";

/** Label styling, for elements that name a group rather than a single control. */
const labelClassName =
  "flex items-center gap-2 text-xs leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return <label data-slot="label" className={cn(labelClassName, className)} {...props} />;
}

export { Label, labelClassName };
