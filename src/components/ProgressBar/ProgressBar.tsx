import * as React from "react";
import { cn } from "@/utils/cn";

export type ProgressBarSize = "default" | "small";
export type ProgressBarVariant = "default" | "generic";

export interface ProgressBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Current progress value (0-100) */
  value: number;
  /** Size variant - "default" (12px track) or "small" (6px track) */
  size?: ProgressBarSize;
  /** Color variant - "default" uses color-coded progress, "generic" always green */
  variant?: ProgressBarVariant;
  /** Title content shown at top left */
  title?: React.ReactNode;
  /** Show the completion percentage at top */
  showCompletion?: boolean;
  /** Steps label shown at top right (e.g. "2/8 steps") */
  stepsLabel?: React.ReactNode;
  /** Helper content at bottom left */
  helperLeft?: React.ReactNode;
  /** Helper content at bottom right */
  helperRight?: React.ReactNode;
  /** Icon shown at bottom left before helper text */
  leftIcon?: React.ReactNode;
  /** Accessible label for the progress bar (defaults to "Progress"). Use this for i18n. */
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
