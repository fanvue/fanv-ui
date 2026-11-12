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

const GRID_STROKE = "var(--color-neutral-alphas-200)";
const BASELINE_STROKE = "var(--color-border-strong)";

const zeroRow: HorizontalCoordinatesGenerator = ({ yAxis }) => {
  const y = yAxis?.scale?.map(0);
  return typeof y === "number" && Number.isFinite(y) ? [y] : [];
};

/**
 * The design-system grid for cartesian charts: faint solid horizontal lines
 * (`neutral-alphas-200` at 40%) and a stronger `border-strong` baseline at value 0.
 * Render it as a direct child of a Recharts `<LineChart>`, `<AreaChart>` or `<BarChart>`,
 * and leave `<YAxis domain>` at its default.
 *
 * The baseline is a one-row grid placed by the y scale, not a visible `ReferenceLine`,
 * because Recharts draws no `ReferenceLine` while `data` is empty (there is no x scale).
 * The hidden `ReferenceLine` only keeps 0 inside the y domain when every value is negative.
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
export function ChartGrid({ xAxisId, yAxisId, ...props }: ChartGridProps) {
  const axes = { xAxisId, yAxisId };
  return (
    <>
      <CartesianGrid
        vertical={false}
        {...axes}
        {...props}
        stroke={GRID_STROKE}
        strokeOpacity={0.4}
      />
      <CartesianGrid
        vertical={false}
        {...axes}
        horizontalCoordinatesGenerator={zeroRow}
        stroke={BASELINE_STROKE}
        zIndex={DefaultZIndexes.line}
      />
      <ReferenceLine {...axes} y={0} stroke="none" ifOverflow="extendDomain" />
    </>
  );
}

ChartGrid.displayName = "ChartGrid";
