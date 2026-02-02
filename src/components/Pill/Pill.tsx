import { Slot, Slottable } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";

const pillVariants = {
  style: {
    Green: "bg-success-50 text-success-500",
    Grey: "bg-neutral-100 text-body-200",
    Blue: "bg-info-50 text-info-500",
    Gold: "bg-warning-50 text-warning-500",
    "Pink Light": "bg-brand-pink-50 text-body-100",
    Base: "bg-neutral-400 text-body-300",
    Brand: "bg-brand-green-500 text-body-500",
    "Brand light": "bg-brand-green-50 text-body-500",
    Beta: "bg-brand-pink-500 text-body-500",
    Error: "bg-error-500 text-error-50",
  },
} as const;

export type PillVariant = keyof typeof pillVariants.style;

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual style variant of the pill (matches Figma "style" property) */
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
    { className, variant = "Green", leftIcon, rightIcon, asChild = false, children, ...props },
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
          "font-semibold text-xs leading-4",
          // Variant styles
          pillVariants.style[variant],
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
