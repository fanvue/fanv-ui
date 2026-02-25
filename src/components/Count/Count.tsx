import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";

/** Colour variant for the count badge. */
export type CountVariant = "default" | "brand" | "pink" | "info" | "success" | "warning";

/** Size of the count badge, aligned with button and icon-button sizes. */
export type CountSize = "16" | "24" | "32";

function getDisplayValue(value: number, max: number): string {
  return value > max ? `${max}+` : value.toString();
}

export interface CountProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Colour variant of the count badge. @default "default" */
  variant?: CountVariant;
  /** Numeric value to display. Renders nothing when `0` and no `children` are provided. @default 0 */
  value?: number;
  /** Maximum value before showing overflow (e.g. `"99+"`). @default 99 */
  max?: number;
  /** Size of the count badge. @default "32" */
  size?: CountSize;
  /** Merge props onto a child element instead of rendering a `<span>`. @default false */
  asChild?: boolean;
}

/**
 * A numeric badge typically used for notification counts. Automatically
 * truncates values above `max` (e.g. `"99+"`). Renders nothing when the
 * value is `0` and no children are provided.
 *
 * @example
 * ```tsx
 * <Count value={5} variant="brand" />
 * ```
 */
export const Count = React.forwardRef<HTMLSpanElement, CountProps>(
  (
    {
      className,
      variant = "default",
      value = 0,
      max = 99,
      size = "32",
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    if (value === 0 && !children) {
      return null;
    }

    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        className={cn(
          "typography-caption-semibold inline-flex shrink-0 items-center justify-center rounded-full tabular-nums leading-none",
          size === "16" && "h-3 min-w-3 px-0.5 text-[8px]",
          size === "24" && "h-4 min-w-4 px-1 text-[10px]",
          size === "32" && "h-5 min-w-5 px-1.5 text-[12px]",
          variant === "default" && "bg-error-500 text-body-white-solid-constant",
          variant === "brand" && "bg-brand-green-500 text-body-black-solid-constant",
          variant === "pink" && "bg-brand-pink-500 text-body-black-solid-constant",
          variant === "info" && "bg-info-500 text-body-white-solid-constant",
          variant === "success" && "bg-success-500 text-body-white-solid-constant",
          variant === "warning" && "bg-warning-500 text-body-black-solid-constant",
          className,
        )}
        {...props}
      >
        {children ?? getDisplayValue(value, max)}
      </Comp>
    );
  },
);

Count.displayName = "Count";
