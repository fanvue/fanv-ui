import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";

export type CountVariant = "default" | "brand" | "pink" | "info" | "success" | "warning";

function getDisplayValue(value: number, max: number): string {
  return value > max ? `${max}+` : value.toString();
}

export interface CountProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual style variant of the count */
  variant?: CountVariant;
  /** The count value to display */
  value?: number;
  /** Maximum value to display before showing overflow (e.g., "99+") */
  max?: number;
  /** Render as a different element using Radix Slot */
  asChild?: boolean;
}

export const Count = React.forwardRef<HTMLSpanElement, CountProps>(
  (
    { className, variant = "default", value = 0, max = 99, asChild = false, children, ...props },
    ref,
  ) => {
    if (value === 0 && !children) {
      return null;
    }

    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 font-bold text-[10px] tabular-nums leading-none",
          variant === "default" && "bg-error-500 text-body-white-solid-constant",
          variant === "brand" && "bg-brand-green-500 text-body-black-solid-constant",
          variant === "pink" && "bg-brand-pink-500 text-body-black-solid-constant",
          variant === "info" && "bg-info-500 text-body-white-solid-constant",
          variant === "success" && "bg-success-500 text-body-white-solid-constant",
          variant === "warning" && "bg-warning-500 text-body-black-solid-constant",
          className,
        )}
        {...props}
      >
        {children ?? getDisplayValue(value, max)}
      </Comp>
    );
  },
);

Count.displayName = "Count";
