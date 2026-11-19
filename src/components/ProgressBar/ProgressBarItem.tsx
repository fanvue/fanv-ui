import * as React from "react";
import { cn } from "@/utils/cn";

/** Colour mode for a progress bar item — brand green or theme-aware monochrome. */
export type ProgressBarItemVariant = "brand" | "mono";
/** Pill thickness — `"default"` (8px) or `"small"` (4px). */
export type ProgressBarItemSize = "default" | "small";

export interface ProgressBarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether this item is filled (completed). @default false */
  active?: boolean;
  /** Colour mode. @default "brand" */
  variant?: ProgressBarItemVariant;
  /** Pill thickness — `"default"` (8px) or `"small"` (4px). @default "default" */
  size?: ProgressBarItemSize;
}

const ACTIVE_COLOR: Record<ProgressBarItemVariant, string> = {
  brand: "bg-progress-bar-brand-active",
  mono: "bg-progress-bar-mono-active",
};

const INACTIVE_COLOR: Record<ProgressBarItemVariant, string> = {
  brand: "bg-progress-bar-brand-inactive",
  mono: "bg-progress-bar-mono-inactive",
};

/**
 * A single rounded segment used to compose a stepped progress indicator. Render
 * a row of these (see {@link ProgressBarSteps}) to represent discrete steps.
 *
 * @example
 * ```tsx
 * <ProgressBarItem active variant="brand" />
 * ```
 */
export const ProgressBarItem = React.forwardRef<HTMLDivElement, ProgressBarItemProps>(
  ({ active = false, variant = "brand", size = "default", className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "w-full rounded-full",
        size === "small" ? "h-1" : "h-2",
        active ? ACTIVE_COLOR[variant] : INACTIVE_COLOR[variant],
        className,
      )}
      {...props}
    />
  ),
);

ProgressBarItem.displayName = "ProgressBarItem";
