import { Slot, Slottable } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";

const badgeVariants = {
  type: {
    Default: "bg-neutral-100 text-neutral-400",
    Dark: "bg-background-800 text-body-300",
    Success: "bg-neutral-100 text-neutral-400",
    Warning: "bg-neutral-100 text-neutral-400",
    Error: "bg-neutral-100 text-neutral-400",
    Special: "bg-neutral-100 text-neutral-400",
    Info: "bg-neutral-100 text-neutral-400",
    Online: "bg-background-100 text-brand-green-500",
    Brand: "bg-brand-green-500 text-body-500",
    Pink: "bg-brand-pink-500 text-body-500",
    "Brand light": "bg-brand-green-50 text-body-500",
    "Pink light": "bg-brand-pink-50 text-body-500",
  },
  dotColor: {
    Default: "bg-body-500",
    Dark: "bg-body-300",
    Success: "bg-success-500",
    Warning: "bg-warning-500",
    Error: "bg-error-500",
    Special: "bg-special-500",
    Info: "bg-info-500",
    Online: "bg-brand-green-500",
    Brand: "bg-body-500",
    Pink: "bg-body-500",
    "Brand light": "bg-body-500",
    "Pink light": "bg-body-500",
  },
} as const;

export type BadgeType = keyof typeof badgeVariants.type;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual style variant of the badge (matches Figma "Type" property) */
  type?: BadgeType;
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
      type = "Default",
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
          "inline-flex h-5 items-center gap-2 rounded-full px-2",
          // Typography
          "font-semibold text-[9px] uppercase leading-none tracking-[0.9px]",
          // Variant styles
          badgeVariants.type[type],
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
            className={cn("size-1 shrink-0 rounded-full", badgeVariants.dotColor[type])}
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
