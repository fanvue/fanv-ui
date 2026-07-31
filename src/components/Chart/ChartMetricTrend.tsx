import * as React from "react";
import { Area, AreaChart, YAxis } from "recharts";
import { cn } from "../../utils/cn";
import { ChartContainer } from "./ChartContainer";
import type { ChartConfig } from "./types";

/**
 * Each card carries its own gradient in the design: red on Retention Rate,
 * green on Average Fan Lifetime. The DS has no `special-chart-green`, so the
 * green maps to `teal` (#28ba8e) — the emerald in the Figma render, as opposed
 * to `lime` (#8fcb3a), which is yellow-green.
 */
export type ChartMetricTrendColor = "red" | "teal";

const CHART_COLORS: Record<ChartMetricTrendColor, string> = {
  red: "var(--color-special-chart-red)",
  teal: "var(--color-special-chart-teal)",
};

/** Props for {@link ChartMetricTrend}. */
export interface ChartMetricTrendProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value. Also the flat-line height when `series` is absent. */
  value: number;
  /** Gradient and stroke colour. */
  color: ChartMetricTrendColor;
  /** History to plot. Needs more than one point to draw a shape. */
  series?: number[];
}

/**
 * The small area chart inside a metric tile, per the `V2 Area Chart Item` slot of
 * the Figma insight card.
 *
 * `series` is optional because the endpoints behind these cards often return a
 * single scalar with no history. With nothing to plot the chart draws a flat line
 * at the current value rather than collapsing the slot, so the card keeps the
 * height and shape the design gives it. The line is deliberately level rather
 * than shaped, so it asserts no history that the data cannot support.
 *
 * @example
 * ```tsx
 * <ChartMetricTrend value={42} color="teal" />
 * ```
 */
export const ChartMetricTrend = React.forwardRef<HTMLDivElement, ChartMetricTrendProps>(
  ({ value, color, series, className, ...props }, ref) => {
    const points = series && series.length > 1 ? series : [value, value];
    const chartData = points.map((point, index) => ({ index, value: point }));
    const chartConfig: ChartConfig = { value: { color: CHART_COLORS[color] } };
    // Per instance, not per colour: two same-colour cards would otherwise emit the
    // same id and every `url(#...)` in the document would resolve to whichever
    // rendered first. `useId` emits colons, which are legal in an `id` but break
    // `querySelector`, so strip them.
    const gradientId = `metric-trend-gradient-${React.useId().replace(/:/g, "")}`;

    return (
      // 106px is the design's `V2 Area Chart Item` slot height.
      <ChartContainer
        ref={ref}
        config={chartConfig}
        className={cn("block aspect-auto h-[106px] w-full", className)}
        {...props}
      >
        <AreaChart data={chartData} margin={{ top: 4, bottom: 0, left: 0, right: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0} />
            </linearGradient>
          </defs>
          {/*
           * Padded domain so a flat line sits inside the plot area instead of
           * along its floor, where it would read as a zero value.
           */}
          <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-value)"
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    );
  },
);

ChartMetricTrend.displayName = "ChartMetricTrend";
