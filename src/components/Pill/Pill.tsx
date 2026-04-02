import { Slot, Slottable } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";

const pillVariants = {
  variant: {
    green: "bg-success-surface text-success-content",
    grey: "bg-neutral-alphas-50 text-content-secondary",
    blue: "bg-info-surface text-info-content",
    gold: "bg-warning-surface text-warning-content",
    pinkLight: "bg-brand-secondary-muted text-content-primary",
    base: "bg-buttons-primary text-content-primary-inverted",
    brand: "bg-brand-primary-default text-content-always-black",
    brandLight: "bg-brand-primary-muted text-content-always-black",
    beta: "bg-brand-secondary-default text-content-always-black",
    error: "bg-error-content text-error-surface",
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
    {
      className,
      variant = "green",
      leftIcon,
      rightIcon,
      asChild = false,
      onClick,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        data-testid="pill"
        className={cn(
          // Base styles
          "inline-flex min-w-0 items-center justify-center gap-2 rounded-full px-3 py-1",
          // Typography
          "typography-semibold-body-sm",
          // Variant styles
          pillVariants.variant[variant],
          // Interactive
          onClick && "cursor-pointer",
          // Manual CSS overrides
          className,
        )}
        onClick={onClick}
        {...props}
      >
        {leftIcon && (
          <span className="flex [&>svg]:size-3" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        {asChild ? (
          <Slottable>{children}</Slottable>
        ) : (
          <span className="min-w-0 truncate">{children}</span>
        )}
        {rightIcon && (
          <span className="flex [&>svg]:size-3" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </Comp>
    );
  },
);

Pill.displayName = "Pill";
