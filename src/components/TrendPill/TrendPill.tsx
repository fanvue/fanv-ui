import * as React from "react";
import { MinusIcon } from "../Icons/MinusIcon";
import { PlusIcon } from "../Icons/PlusIcon";
import { Pill } from "../Pill/Pill";

/** Whether a change is an improvement or a decline. */
export type TrendDirection = "positive" | "negative";

/** Props for {@link TrendPill}. */
export interface TrendPillProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** The change itself, already formatted (e.g. "$240 vs Jun"). */
  label: React.ReactNode;
  /** Drives the colour and the leading glyph. */
  trend: TrendDirection;
  /**
   * Announced before {@link label} when `trend` is `"positive"`. Overridable
   * because the component cannot translate it. @default "Increase"
   */
  increaseLabel?: string;
  /** As {@link increaseLabel}, for `"negative"`. @default "Decrease" */
  decreaseLabel?: string;
}

/**
 * A filled pill stating a change, green for positive and red for negative
 * (Figma `V2 Trend Pill`).
 *
 * Distinct from {@link ChartCard}'s `trendChip`, which is Figma's `V2 Trend`: an
 * unfilled arrow and label sitting beside a headline. Use this one where the
 * change needs to hold its own against surrounding content rather than trail a
 * number, such as inside a list row.
 *
 * @example
 * ```tsx
 * <TrendPill label="$240 vs Jun" trend="positive" />
 * ```
 */
export const TrendPill = React.forwardRef<HTMLSpanElement, TrendPillProps>(
  ({ label, trend, increaseLabel = "Increase", decreaseLabel = "Decrease", ...props }, ref) => {
    const isPositive = trend === "positive";

    return (
      <Pill
        ref={ref}
        variant={isPositive ? "green" : "red"}
        leftIcon={isPositive ? <PlusIcon /> : <MinusIcon />}
        {...props}
      >
        {/*
         * `Pill` renders `leftIcon` inside `aria-hidden`, so without this the only
         * channel carrying the direction is the green/red fill and the label itself
         * says nothing about which way it went — WCAG 1.4.1, and the direction is
         * the point of a trend.
         */}
        <span className="sr-only">{isPositive ? increaseLabel : decreaseLabel}</span>
        {label}
      </Pill>
    );
  },
);

TrendPill.displayName = "TrendPill";
