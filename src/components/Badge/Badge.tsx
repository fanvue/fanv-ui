import { Slot, Slottable } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";

const badgeVariants = {
  variant: {
    default: "bg-neutral-alphas-50 text-content-secondary",
    dark: "bg-neutral-alphas-150 text-content-on-brand-inverted",
    success: "bg-neutral-alphas-50 text-content-secondary",
    warning: "bg-neutral-alphas-50 text-content-secondary",
    error: "bg-neutral-alphas-50 text-content-secondary",
    special: "bg-neutral-alphas-50 text-content-secondary",
    info: "bg-neutral-alphas-50 text-content-secondary",
    online: "bg-bg-primary text-brand-primary-default",
    brand: "bg-brand-primary-default text-content-on-brand",
    pink: "bg-brand-secondary-default text-content-on-brand",
    brandLight: "bg-brand-primary-muted text-content-on-brand",
    pinkLight: "bg-brand-secondary-muted text-content-on-brand",
  },
  dotColor: {
    default: "bg-content-on-brand",
    dark: "bg-content-primary-inverted",
    success: "bg-success-content",
    warning: "bg-warning-content",
    error: "bg-error-content",
    special: "bg-special-default",
    info: "bg-info-content",
    online: "bg-brand-primary-default",
    brand: "bg-content-on-brand",
    pink: "bg-content-on-brand",
    brandLight: "bg-content-on-brand",
    pinkLight: "bg-content-on-brand",
  },
} as const;

/** Visual style variant of the badge. */
export type BadgeVariant =
  | "default"
  | "dark"
  | "success"
  | "warning"
  | "error"
  | "special"
  | "info"
  | "online"
  | "brand"
  | "pink"
  | "brandLight"
  | "pinkLight";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual style variant of the badge. @default "default" */
  variant?: BadgeVariant;
  /** Whether to show a coloured status dot at the leading edge. @default true */
  leftDot?: boolean;
  /** Icon element displayed before the label. */
  leftIcon?: React.ReactNode;
  /** Icon element displayed after the label. */
  rightIcon?: React.ReactNode;
  /** Merge props onto a child element instead of rendering a `<span>`. @default false */
  asChild?: boolean;
}

/**
 * A small inline label for status, category, or metadata information.
 *
 * @example
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * ```
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      leftDot = true,
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
        data-testid="badge"
        className={cn(
          // Base styles
          "typography-semibold-body-sm inline-flex h-5 min-w-0 items-center gap-2 rounded-full px-2",
          // Variant styles
          badgeVariants.variant[variant],
          // Interactive
          onClick && "cursor-pointer",
          // Manual CSS overrides
          className,
        )}
        onClick={onClick}
        {...props}
      >
        {leftIcon && (
          <span className="flex size-3" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        {leftDot && (
          <span
            className={cn("size-1 shrink-0 rounded-full", badgeVariants.dotColor[variant])}
            aria-hidden="true"
          />
        )}
        {asChild ? (
          <Slottable>{children}</Slottable>
        ) : (
          <span className="min-w-0 truncate">{children}</span>
        )}
        {rightIcon && (
          <span className="flex size-3" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </Comp>
    );
  },
);

Badge.displayName = "Badge";
