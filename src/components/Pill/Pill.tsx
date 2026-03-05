import { Slot, Slottable } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";

const pillVariants = {
  variant: {
    green: "bg-success-background text-success-default",
    grey: "bg-neutral-100 text-foreground-secondary",
    blue: "bg-info-background text-info-default",
    gold: "bg-warning-background text-warning-default",
    pinkLight: "bg-brand-secondary-muted text-foreground-default",
    base: "bg-neutral-solid text-foreground-inverse",
    brand: "bg-brand-accent-default text-foreground-onaccent",
    brandLight: "bg-brand-accent-muted text-foreground-onaccent",
    beta: "bg-brand-secondary-default text-foreground-onaccent",
    error: "bg-error-default text-error-background",
  },
} as const;

/** Colour variant of the pill. */
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
  /** Colour variant of the pill. @default "green" */
  variant?: PillVariant;
  /** Icon element displayed before the label. */
  leftIcon?: React.ReactNode;
  /** Icon element displayed after the label. */
  rightIcon?: React.ReactNode;
  /** Merge props onto a child element instead of rendering a `<span>`. @default false */
  asChild?: boolean;
}

/**
 * A small rounded label for categorisation, status, or tagging.
 *
 * @example
 * ```tsx
 * <Pill variant="brand">New</Pill>
 * ```
 */
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
          "typography-semibold-body-sm",
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
