import { Slot, Slottable } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/utils/cn.ts";

const badgeVariants = {
  variant: {
    default: "bg-buttons-secondary-default text-content-primary",
    dark: "bg-neutral-alphas-600 text-content-always-white",
    success: "bg-buttons-secondary-default text-content-primary",
    warning: "bg-buttons-secondary-default text-content-primary",
    error: "bg-buttons-secondary-default text-content-primary",
    special: "bg-buttons-secondary-default text-content-primary",
    info: "bg-buttons-secondary-default text-content-primary",
    successColour: "bg-success-surface text-content-primary",
    warningColour: "bg-warning-surface text-content-primary",
    errorColour: "bg-error-surface text-content-primary",
    infoColour: "bg-info-surface text-content-primary",
    aiGenerated: "bg-buttons-always-white-default text-content-always-black",
    negative: "bg-buttons-secondary-negative-default text-content-primary-inverted",
    alwaysWhite: "bg-buttons-secondary-negative-default text-content-always-white",
    online: "bg-background-primary text-brand-primary-default",
    brand: "bg-brand-primary-default text-content-always-black",
    pink: "bg-brand-secondary-default text-content-always-black",
    brandLight: "bg-brand-primary-muted text-content-primary",
    pinkLight: "bg-brand-secondary-muted text-content-primary",
  },
  dotColor: {
    default: "bg-icons-primary",
    dark: "bg-content-always-white",
    success: "bg-success-content",
    warning: "bg-warning-content",
    error: "bg-error-content",
    special: "bg-special-default",
    info: "bg-info-content",
    successColour: "bg-success-content",
    warningColour: "bg-warning-content",
    errorColour: "bg-error-content",
    infoColour: "bg-info-content",
    aiGenerated: "bg-content-always-black",
    negative: "bg-icons-primary-inverted",
    alwaysWhite: "bg-brand-primary-default",
    online: "bg-brand-primary-default",
    brand: "bg-content-always-black",
    pink: "bg-content-always-black",
    brandLight: "bg-content-always-black",
    pinkLight: "bg-content-always-black",
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
  | "successColour"
  | "warningColour"
  | "errorColour"
  | "infoColour"
  | "aiGenerated"
  | "negative"
  | "alwaysWhite"
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
          "typography-badge-badgecaps inline-flex h-5 min-w-0 items-center gap-1 rounded-full px-2",
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
          <span
            className="flex shrink-0 items-center justify-center [&>svg]:size-2.5"
            aria-hidden="true"
          >
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
          <span className="min-w-0 truncate [text-box:trim-both_cap_alphabetic]">{children}</span>
        )}
        {rightIcon && (
          <span
            className="flex shrink-0 items-center justify-center [&>svg]:size-2.5"
            aria-hidden="true"
          >
            {rightIcon}
          </span>
        )}
      </Comp>
    );
  },
);

Badge.displayName = "Badge";
