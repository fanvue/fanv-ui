import * as React from "react";
import { ResponsiveContainer } from "recharts";
import { cn } from "../../utils/cn";
import { ChartStyle } from "./ChartStyle";
import type { ChartConfig } from "./types";
import { ChartContext } from "./useChart";

/** Props for {@link ChartContainer}. */
export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Series configuration mapping data keys to labels, colors, and icons. */
  config: ChartConfig;
  /**
   * Recharts chart element(s) to render inside the responsive container.
   * Typically a single `<AreaChart>`, `<BarChart>`, `<LineChart>`, etc.
   */
  children: React.ComponentProps<typeof ResponsiveContainer>["children"];
}

/**
 * Wraps a Recharts chart with responsive sizing, design-token theming, and
 * accessible config context for tooltips and legends.
 *
 * @example
 * ```tsx
 * <ChartContainer config={chartConfig} className="min-h-48">
 *   <LineChart data={data} accessibilityLayer>
 *     <Line dataKey="revenue" stroke="var(--color-revenue)" />
 *   </LineChart>
 * </ChartContainer>
 * ```
 */
export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ id, className, children, config, ...props }, ref) => {
    const uniqueId = React.useId();
    const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

    return (
      <ChartContext.Provider value={{ config }}>
        <div
          ref={ref}
          data-slot="chart"
          data-chart={chartId}
          className={cn(
            "flex aspect-video justify-center text-xs",
            "[&_.recharts-cartesian-axis-tick_text]:fill-foreground-tertiary",
            "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-neutral-200",
            "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-neutral-200",
            "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
            "[&_.recharts-layer]:outline-hidden",
            "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-neutral-200",
            "[&_.recharts-radial-bar-background-sector]:fill-neutral-100",
            "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-neutral-100",
            "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-neutral-200",
            "[&_.recharts-sector]:outline-hidden",
            "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
            "[&_.recharts-surface]:outline-hidden",
            className,
          )}
          {...props}
        >
          <ChartStyle id={chartId} config={config} />
          <ResponsiveContainer>{children}</ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    );
  },
);
ChartContainer.displayName = "ChartContainer";
