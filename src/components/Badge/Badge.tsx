import { Slot, Slottable } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";

const badgeVariants = {
  variant: {
    default: "bg-neutral-100 text-foreground-secondary",
    dark: "bg-neutral-50 text-foreground-inverse dark:text-foreground-onaccentinverse",
    success: "bg-neutral-100 text-foreground-secondary",
    warning: "bg-neutral-100 text-foreground-secondary",
    error: "bg-neutral-100 text-foreground-secondary",
    special: "bg-neutral-100 text-foreground-secondary",
    info: "bg-neutral-100 text-foreground-secondary",
    online: "bg-neutral-100 text-brand-accent-default",
    brand: "bg-brand-accent-default text-foreground-onaccent",
    pink: "bg-brand-secondary-default text-foreground-onaccent",
    brandLight: "bg-brand-accent-muted text-foreground-onaccent",
    pinkLight: "bg-brand-secondary-muted text-foreground-onaccent",
  },
  dotColor: {
    default: "bg-foreground-onaccent",
    dark: "bg-foreground-inverse dark:bg-foreground-onaccentinverse",
    success: "bg-success-default",
    warning: "bg-warning-default",
    error: "bg-error-default",
    special: "bg-special-default",
    info: "bg-info-default",
    online: "bg-brand-accent-default",
    brand: "bg-foreground-onaccent",
    pink: "bg-foreground-onaccent",
    brandLight: "bg-foreground-onaccent",
    pinkLight: "bg-foreground-onaccent",
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
          "typography-semibold-body-sm inline-flex h-5 items-center gap-2 rounded-full px-2",
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
        <Slottable>{children}</Slottable>
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
