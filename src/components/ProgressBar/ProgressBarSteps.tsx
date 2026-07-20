import * as React from "react";
import { cn } from "@/utils/cn";
import {
  ProgressBarItem,
  type ProgressBarItemSize,
  type ProgressBarItemVariant,
} from "./ProgressBarItem";

export interface ProgressBarStepsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Total number of steps (segments). Values below 1 are treated as 1. */
  steps: number;
  /** Number of completed steps, clamped to `0`–`steps`. */
  value: number;
  /** Colour mode. @default "brand" */
  variant?: ProgressBarItemVariant;
  /** Pill thickness — `"default"` (8px) or `"small"` (4px). @default "default" */
  size?: ProgressBarItemSize;
  /** Accessible label for the `progressbar` role. @default "Progress" */
  ariaLabel?: string;
  /** Human-readable text alternative for the current value (e.g. "Step 2 of 4"). */
  ariaValueText?: string;
}

/**
 * A segmented (stepped) progress indicator built from {@link ProgressBarItem}
 * pills. Fills the first `value` of `steps` segments.
 *
 * @example
 * ```tsx
 * <ProgressBarSteps steps={4} value={2} variant="brand" />
 * ```
 */
export const ProgressBarSteps = React.forwardRef<HTMLDivElement, ProgressBarStepsProps>(
  (
    {
      steps,
      value,
      variant = "brand",
      size = "default",
      ariaLabel,
      ariaValueText,
      className,
      ...props
    },
    ref,
  ) => {
    const total = Math.max(1, Math.floor(steps));
    const completed = Math.min(total, Math.max(0, Math.floor(value)));

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-label={ariaLabel ?? "Progress"}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={completed}
        aria-valuetext={ariaValueText}
        className={cn("flex w-full items-center gap-1", className)}
        {...props}
      >
        {Array.from({ length: total }, (_, index) => (
          <ProgressBarItem
            key={index}
            active={index < completed}
            variant={variant}
            size={size}
            className="flex-1"
          />
        ))}
      </div>
    );
  },
);

ProgressBarSteps.displayName = "ProgressBarSteps";
