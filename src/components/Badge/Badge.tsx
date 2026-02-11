import { Slot, Slottable } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";

const badgeVariants = {
  variant: {
    default: "bg-neutral-100 text-neutral-400",
    dark: "bg-background-800 text-body-300 dark:text-body-white-solid-constant",
    success: "bg-neutral-100 text-neutral-400",
    warning: "bg-neutral-100 text-neutral-400",
    error: "bg-neutral-100 text-neutral-400",
    special: "bg-neutral-100 text-neutral-400",
    info: "bg-neutral-100 text-neutral-400",
    online: "bg-background-200 text-brand-green-500",
    brand: "bg-brand-green-500 text-body-black-solid-constant",
    pink: "bg-brand-pink-500 text-body-black-solid-constant",
    brandLight: "bg-brand-green-50 text-body-black-solid-constant",
    pinkLight: "bg-brand-pink-50 text-body-black-solid-constant",
  },
  dotColor: {
    default: "bg-body-black-solid-constant",
    dark: "bg-body-300 dark:bg-body-white-solid-constant",
    success: "bg-success-500",
    warning: "bg-warning-500",
    error: "bg-error-500",
    special: "bg-special-500",
    info: "bg-info-500",
    online: "bg-brand-green-500",
    brand: "bg-body-black-solid-constant",
    pink: "bg-body-black-solid-constant",
    brandLight: "bg-body-black-solid-constant",
    pinkLight: "bg-body-black-solid-constant",
  },
} as const;

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
  /** Visual style variant of the badge */
  variant?: BadgeVariant;
  /** Show left status indicator dot */
  leftDot?: boolean;
  /** Left icon element */
  leftIcon?: React.ReactNode;
  /** Right icon element */
  rightIcon?: React.ReactNode;
  /** Render as a different element using Radix Slot */
  asChild?: boolean;
}

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
          "typography-caption-semibold inline-flex h-5 items-center gap-2 rounded-full px-2",
          // Variant styles
          badgeVariants.variant[variant],
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
        {leftDot && (
          <span
            className={cn("size-1 shrink-0 rounded-full", badgeVariants.dotColor[variant])}
            aria-hidden="true"
          />
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

Badge.displayName = "Badge";
