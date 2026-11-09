import type * as React from "react";
import { CartesianGrid, ReferenceLine } from "recharts";

/**
 * Props for {@link ChartGrid}. Forwarded to Recharts' `CartesianGrid`; `xAxisId` and
 * `yAxisId` also place the zero baseline. The line colour, opacity and dash are fixed by
 * the design system, so `stroke`, `strokeOpacity` and `strokeDasharray` are not accepted.
 */
export type ChartGridProps = Omit<
  React.ComponentProps<typeof CartesianGrid>,
  "stroke" | "strokeOpacity" | "strokeDasharray"
>;

/**
 * The design-system grid for cartesian charts: faint solid horizontal lines and one
 * stronger solid baseline at value 0. Render it as a direct child of a Recharts
 * `<LineChart>`, `<AreaChart>` or `<BarChart>`.
 *
 * Grid lines use `neutral-alphas-200` at 40% opacity, the colour `ChartContainer` gives
 * Recharts' default grid. The baseline uses `border-strong`. With no data Recharts has
 * no x-axis scale, so the baseline is not drawn.
 *
 * The baseline extends the y-axis domain to include zero, so it stays visible when
 * every value is negative. Leave `<YAxis domain>` at its default: the axis then starts
 * at zero, or at the lowest value when the data goes below zero.
 *
 * @example
 * ```tsx
 * <ChartContainer config={chartConfig}>
 *   <LineChart data={data}>
 *     <ChartGrid />
 *     <XAxis dataKey="day" />
 *     <YAxis />
 *     <Line dataKey="net" stroke="var(--color-net)" />
 *   </LineChart>
 * </ChartContainer>
 * ```
 */
export function ChartGrid(props: ChartGridProps) {
  return (
    <>
      <CartesianGrid
        vertical={false}
        {...props}
        stroke="var(--color-neutral-alphas-200)"
        strokeOpacity={0.4}
      />
      <ReferenceLine
        y={0}
        xAxisId={props.xAxisId}
        yAxisId={props.yAxisId}
        stroke="var(--color-border-strong)"
        ifOverflow="extendDomain"
      />
    </>
  );
}

ChartGrid.displayName = "ChartGrid";
