import type * as React from "react";
import { cn } from "@/utils/cn";

export function AutocompleteHelperText({
  id,
  error,
  children,
}: {
  id: string;
  error: boolean;
  children: React.ReactNode;
}) {
  return (
    <p
      id={id}
      className={cn(
        "typography-regular-body-sm px-2 pt-1 pb-0.5",
        error ? "text-error-default" : "text-foreground-secondary",
      )}
    >
      {children}
    </p>
  );
}
