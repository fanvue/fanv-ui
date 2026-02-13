import * as React from "react";
import { cn } from "@/utils/cn";

/** Track height — `"default"` (12px) or `"small"` (6px). */
export type ProgressBarSize = "default" | "small";
/** Colour mode — `"default"` uses red/yellow/green by value, `"generic"` always uses brand green. */
export type ProgressBarVariant = "default" | "generic";

export interface ProgressBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Current progress value, clamped to 0–100. */
  value: number;
  /** Track height — `"default"` (12px) or `"small"` (6px). @default "default" */
  size?: ProgressBarSize;
  /** Colour mode — `"default"` is colour-coded by value, `"generic"` always uses brand green. @default "default" */
  variant?: ProgressBarVariant;
  /** Title content shown at the top-left of the bar. */
  title?: React.ReactNode;
  /** Whether to display the completion percentage above the track. @default false */
  showCompletion?: boolean;
  /** Steps label shown at the top-right (e.g. `"2/8 steps"`). */
  stepsLabel?: React.ReactNode;
  /** Helper content at the bottom-left of the bar. */
  helperLeft?: React.ReactNode;
  /** Helper content at the bottom-right of the bar. */
  helperRight?: React.ReactNode;
  /** Icon shown at the bottom-left before the helper text. */
  leftIcon?: React.ReactNode;
  /** Accessible label for the `progressbar` role. @default "Progress" */
  ariaLabel?: string;
}

const TRACK_HEIGHT: Record<ProgressBarSize, string> = {
  default: "h-3",
  small: "h-1.5",
};

const GAP: Record<ProgressBarSize, string> = {
  default: "gap-3",
  small: "gap-1",
};

function getDefaultBarColor(value: number): string {
  if (value >= 100) return "bg-success-500";
  if (value >= 40) return "bg-warning-500";
  return "bg-error-500";
}

function getDefaultTextColor(value: number): string {
  if (value >= 100) return "text-success-500";
  if (value >= 40) return "text-warning-500";
  return "text-error-500";
}

/**
 * A horizontal progress indicator with optional title, completion percentage,
 * step count, and helper text. The bar colour reflects progress when using the
 * `"default"` variant.
 *
 * @example
 * ```tsx
 * <ProgressBar value={65} title="Upload" showCompletion />
 * ```
 */
export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      size = "default",
      variant = "default",
      title,
      showCompletion = false,
      stepsLabel,
      helperLeft,
      helperRight,
      leftIcon,
      ariaLabel,
      className,
      ...props
    },
    ref,
  ) => {
    const clampedValue = Math.min(100, Math.max(0, value));
    const isGeneric = variant === "generic";
    const isSmall = size === "small";

    const barColor = isGeneric ? "bg-brand-green-500" : getDefaultBarColor(clampedValue);
    const textColor = isGeneric ? "text-brand-green-500" : getDefaultTextColor(clampedValue);

    const showHeader = title != null || showCompletion || stepsLabel != null;
    const showFooter = leftIcon != null || helperLeft != null || helperRight != null;

    return (
      <div ref={ref} className={cn("flex w-full flex-col", GAP[size], className)} {...props}>
        {showHeader && (
          <div className="flex w-full items-end justify-between">
            {title != null && <p className="typography-caption-semibold text-body-100">{title}</p>}
            {showCompletion && (
              <span
                className={cn(textColor, isSmall ? "typography-heading-3" : "typography-heading-1")}
              >
                {Math.round(clampedValue)}%
              </span>
            )}
            {stepsLabel != null && (
              <span className="typography-caption-regular text-body-100">{stepsLabel}</span>
            )}
          </div>
        )}

        <div
          role="progressbar"
          aria-label={ariaLabel ?? "Progress"}
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
          className={cn("relative w-full rounded-full bg-neutral-100", TRACK_HEIGHT[size])}
        >
          <div
            className={cn(
              "absolute inset-y-0 left-0 rounded-full transition-[width] duration-300 ease-in-out",
              barColor,
            )}
            style={{ width: `${clampedValue}%` }}
          />
        </div>

        {showFooter && (
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-1">
              {leftIcon != null && (
                <span className="flex size-5 items-center justify-center" aria-hidden="true">
                  {leftIcon}
                </span>
              )}
              {helperLeft != null && (
                <span className="typography-caption-regular text-primary-500">{helperLeft}</span>
              )}
            </div>
            {helperRight != null && (
              <span className="typography-caption-regular text-primary-500">{helperRight}</span>
            )}
          </div>
        )}
      </div>
    );
  },
);

ProgressBar.displayName = "ProgressBar";
