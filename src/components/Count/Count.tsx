import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";

/**
 * Colour variant for the count badge.
 *
 * V2 Notification Count (Fanvue Library) types: `default`, `brand`, `contrast`.
 * Remaining values are retained extensions for existing consumers.
 */
export type CountVariant =
  | "default"
  | "contrast"
  | "brand"
  | "alert"
  | "pink"
  | "info"
  | "success"
  | "warning";

/** Size of the count badge, aligned with button and icon-button sizes. */
export type CountSize = "16" | "24" | "32";

function getDisplayValue(value: number, max: number): string {
  return value > max ? `${max}+` : value.toString();
}

function variantClasses(variant: CountVariant): string {
  switch (variant) {
    case "default":
      return "bg-content-primary text-content-primary-inverted";
    case "contrast":
      // V2: on dark or coloured hosts (filled buttons, images)
      return "bg-content-always-white text-content-always-black";
    case "brand":
      return "bg-brand-primary-default text-content-always-black";
    case "alert":
      return "bg-error-content text-content-always-white";
    case "pink":
      return "bg-brand-secondary-default text-content-always-black";
    case "info":
      return "bg-info-content text-content-always-white";
    case "success":
      return "bg-success-content text-content-always-white";
    case "warning":
      return "bg-warning-content text-content-always-black";
  }
}

export interface CountProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Colour variant of the count badge.
   * Figma V2 types: `default` | `brand` | `contrast`. @default "default"
   */
  variant?: CountVariant;
  /** Numeric value to display. Renders nothing when `0` and no `children` are provided. @default 0 */
  value?: number;
  /** Maximum value before showing overflow (e.g. `"99+"`). @default 99 */
  max?: number;
  /**
   * When `false`, renders an 8px unread dot instead of a numeric amount
   * (Figma Show Amount=False). @default true
   */
  showAmount?: boolean;
  /** Size of the count badge. @default "32" */
  size?: CountSize;
  /** Merge props onto a child element instead of rendering a `<span>`. @default false */
  asChild?: boolean;
}

/**
 * V2 Notification Count — a small badge for unread activity on nav items,
 * icons, buttons, or chips. Truncates values above `max` (e.g. `"99+"`).
 * Renders nothing when the value is `0` and no children are provided.
 *
 * @example
 * ```tsx
 * <Count value={5} variant="brand" />
 * <Count value={1} variant="brand" showAmount={false} />
 * ```
 */
export const Count = React.forwardRef<HTMLSpanElement, CountProps>(
  (
    {
      className,
      variant = "default",
      value = 0,
      max = 99,
      showAmount = true,
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
    const colors = variantClasses(variant);

    if (!showAmount) {
      return (
        <Comp
          ref={ref}
          data-testid="count"
          className={cn("inline-flex size-2 shrink-0 rounded-full", colors, className)}
          {...props}
        />
      );
    }

    return (
      <Comp
        ref={ref}
        data-testid="count"
        className={cn(
          "typography-description-12px-semibold inline-flex shrink-0 items-center justify-center rounded-full tabular-nums leading-none",
          size === "16" && "h-3 min-w-3 px-0.5 text-[8px]",
          // Kept at 16px so nav / IconButton badges don't grow; Chip nests this size.
          size === "24" && "h-4 min-w-4 px-1 text-[10px]",
          size === "32" && "h-5 min-w-5 px-1.5 text-[12px]",
          colors,
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
