import type * as React from "react";
import { CartesianGrid, DefaultZIndexes, ReferenceLine } from "recharts";
import type { HorizontalCoordinatesGenerator } from "recharts/types/cartesian/CartesianGrid";

/**
 * Props for {@link ChartGrid}. Forwarded to Recharts' `CartesianGrid`; `xAxisId` and
 * `yAxisId` also place the zero baseline. The line colour, opacity and dash are fixed by
 * the design system, so `stroke`, `strokeOpacity` and `strokeDasharray` are not accepted.
 */
export type ChartGridProps = Omit<
  React.ComponentProps<typeof CartesianGrid>,
  "stroke" | "strokeOpacity" | "strokeDasharray"
>;

const zeroRow: HorizontalCoordinatesGenerator = ({ yAxis }) => {
  const y = yAxis?.scale?.map(0);
  return typeof y === "number" && Number.isFinite(y) ? [y] : [];
};

/**
 * The design-system grid for cartesian charts: solid horizontal lines and one stronger
 * solid baseline at value 0. Render it as a direct child of a Recharts `<LineChart>`,
 * `<AreaChart>` or `<BarChart>`.
 *
 * Grid lines use `neutral-alphas-200` at 40% opacity, the look of a Recharts default grid
 * with `strokeOpacity={0.4}` inside `ChartContainer`. The baseline uses `border-strong`
 * and sits above the chart's series, at the same layer as Recharts' `ReferenceLine`.
 *
 * The baseline is a one-row grid placed by the y-axis scale rather than a `ReferenceLine`,
 * because a `ReferenceLine` needs an x-axis scale and Recharts has none while `data` is
 * empty. The row skips Recharts' tick-label collision check, which would drop a zero row
 * sitting on the chart's top edge. The hidden `ReferenceLine` only extends the y-axis
 * domain to include zero, so the baseline stays visible when every value is negative.
 * Leave `<YAxis domain>` at its default: the axis then starts at zero, or at the lowest
 * value when the data goes below zero.
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
      <CartesianGrid
        vertical={false}
        horizontalCoordinatesGenerator={zeroRow}
        xAxisId={props.xAxisId}
        yAxisId={props.yAxisId}
        stroke="var(--color-border-strong)"
        zIndex={DefaultZIndexes.line}
      />
      <ReferenceLine
        y={0}
        xAxisId={props.xAxisId}
        yAxisId={props.yAxisId}
        stroke="none"
        ifOverflow="extendDomain"
      />
    </>
  );
}

ChartGrid.displayName = "ChartGrid";
