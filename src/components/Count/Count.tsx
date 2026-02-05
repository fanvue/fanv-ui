import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";

export type CountVariant = "Default" | "Brand" | "Pink" | "Info" | "Success" | "Warning";
export type CountSize = "Small" | "Medium" | "Large";

function getDisplayValue(value: number, max: number): string {
  return value > max ? `${max}+` : value.toString();
}

const sizeClasses: Record<CountSize, string> = {
  Small: "h-4 min-w-4 px-1 text-[9px]",
  Medium: "h-5 min-w-5 px-1.5 text-[10px]",
  Large: "h-6 min-w-6 px-2 text-xs",
};

export interface CountProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual style variant of the count */
  variant?: CountVariant;
  /** Size of the count badge */
  size?: CountSize;
  /** The count value to display */
  value?: number;
  /** Maximum value to display before showing overflow (e.g., "99+") */
  max?: number;
  /** Render as a different element using Radix Slot */
  asChild?: boolean;
}

export const Count = React.forwardRef<HTMLSpanElement, CountProps>(
  (
    {
      className,
      variant = "Default",
      size = "Medium",
      value = 0,
      max = 99,
      asChild = false,
      children,
      ...props
    },
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
          "inline-flex shrink-0 items-center justify-center rounded-full font-bold tabular-nums leading-none",
          sizeClasses[size],
          variant === "Default" && "bg-error-500 text-body-white-solid-constant",
          variant === "Brand" && "bg-brand-green-500 text-body-black-solid-constant",
          variant === "Pink" && "bg-brand-pink-500 text-body-black-solid-constant",
          variant === "Info" && "bg-info-500 text-body-white-solid-constant",
          variant === "Success" && "bg-success-500 text-body-white-solid-constant",
          variant === "Warning" && "bg-warning-500 text-body-black-solid-constant",
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
