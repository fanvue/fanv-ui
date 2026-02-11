import { Slot, Slottable } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";

const pillVariants = {
  variant: {
    green: "bg-success-50 text-success-500",
    grey: "bg-neutral-100 text-body-200",
    blue: "bg-info-50 text-info-500",
    gold: "bg-warning-50 text-warning-500",
    pinkLight: "bg-brand-pink-50 text-body-100",
    base: "bg-neutral-400 text-body-300",
    brand: "bg-brand-green-500 text-body-black-solid-constant",
    brandLight: "bg-brand-green-50 text-body-black-solid-constant",
    beta: "bg-brand-pink-500 text-body-black-solid-constant",
    error: "bg-error-500 text-error-50",
  },
} as const;

export type PillVariant =
  | "green"
  | "grey"
  | "blue"
  | "gold"
  | "pinkLight"
  | "base"
  | "brand"
  | "brandLight"
  | "beta"
  | "error";

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual style variant of the pill */
  variant?: PillVariant;
  /** Left icon element */
  leftIcon?: React.ReactNode;
  /** Right icon element */
  rightIcon?: React.ReactNode;
  /** Render as a different element using Radix Slot */
  asChild?: boolean;
}

export const Pill = React.forwardRef<HTMLSpanElement, PillProps>(
  (
    { className, variant = "green", leftIcon, rightIcon, asChild = false, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        data-testid="pill"
        className={cn(
          // Base styles
          "inline-flex items-center justify-center gap-2 rounded-full px-3 py-1",
          // Typography
          "typography-caption-semibold",
          // Variant styles
          pillVariants.variant[variant],
          // Manual CSS overrides
          className,
        )}
        {...props}
      >
        {leftIcon && (
          <span className="flex" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <Slottable>{children}</Slottable>
        {rightIcon && (
          <span className="flex" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </Comp>
    );
  },
);

Pill.displayName = "Pill";
