import type * as React from "react";
import { CartesianGrid, ReferenceLine } from "recharts";

/**
 * Props for {@link ChartGrid}. Forwarded to Recharts' `CartesianGrid`, after the defaults;
 * `xAxisId` and `yAxisId` also place the zero baseline.
 */
export type ChartGridProps = React.ComponentProps<typeof CartesianGrid>;

/**
 * The design-system grid for cartesian charts: dotted horizontal lines and one solid
 * baseline at value 0, above and below which every other line stays dotted. Render
 * it as a direct child of a Recharts `<LineChart>`, `<AreaChart>` or `<BarChart>`.
 *
 * Grid lines use `neutral-alphas-200`, the colour `ChartContainer` gives Recharts'
 * default grid. The baseline uses `border-strong`.
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
        stroke="var(--color-neutral-alphas-200)"
        strokeDasharray="2 4"
        {...props}
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
