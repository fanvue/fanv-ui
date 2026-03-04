import { Slot, Slottable } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";

const badgeVariants = {
  variant: {
    default: "gap-2 bg-neutral-50 text-neutral-solid",
    dark: "gap-2 bg-primitives-color-blackalpha-600 text-foreground-onaccentinverse",
    success: "gap-2 bg-neutral-50 text-neutral-solid",
    warning: "gap-2 bg-neutral-50 text-neutral-solid",
    error: "gap-2 bg-neutral-50 text-neutral-solid",
    special: "gap-2 bg-neutral-50 text-neutral-solid",
    info: "gap-2 bg-neutral-50 text-neutral-solid",
    online: "gap-1 bg-surface-page text-brand-accent-default",
    brand: "gap-1 bg-brand-accent-default text-foreground-onaccent",
    pink: "gap-1 bg-brand-secondary-default text-foreground-onaccent",
    brandLight: "gap-1 bg-brand-accent-muted text-foreground-default",
    pinkLight: "gap-1 bg-brand-secondary-muted text-foreground-default",
    successBg: "gap-1 bg-success-background text-foreground-default",
    warningBg: "gap-1 bg-warning-background text-foreground-default",
    errorBg: "gap-1 bg-error-background text-foreground-default",
    infoBg: "gap-1 bg-info-background text-foreground-default",
  },
  dotColor: {
    default: "bg-foreground-default",
    dark: "bg-foreground-default",
    success: "bg-success-default",
    warning: "bg-warning-default",
    error: "bg-error-default",
    special: "bg-special-default",
    info: "bg-info-default",
    online: "bg-brand-accent-default",
    brand: "bg-foreground-onaccent",
    pink: "bg-foreground-onaccent",
    brandLight: "bg-foreground-default",
    pinkLight: "bg-foreground-default",
    successBg: "bg-success-default",
    warningBg: "bg-warning-default",
    errorBg: "bg-error-default",
    infoBg: "bg-info-default",
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
  | "pinkLight"
  | "successBg"
  | "warningBg"
  | "errorBg"
  | "infoBg";

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
          "typography-semibold-body-sm inline-flex h-5 items-center rounded-full px-2",
          // Variant styles
          badgeVariants.variant[variant],
          // Manual CSS overrides
          className,
        )}
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
