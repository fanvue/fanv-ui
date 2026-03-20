import * as React from "react";
import { Legend as RechartsLegend } from "recharts";
import type { LegendPayload } from "recharts/types/component/DefaultLegendContent";
import { cn } from "../../utils/cn";
import { filterVisiblePayload, resolveConfigEntry } from "./chartUtils";
import { useChart } from "./useChart";

/** Re-export of Recharts `Legend` — use with `content={<ChartLegendContent />}`. */
export const ChartLegend = RechartsLegend;

/** Props for {@link ChartLegendContent}. */
export interface ChartLegendContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Legend payload data. Passed by Recharts. */
  payload?: readonly LegendPayload[];
  /** Vertical alignment — controls padding direction. @default "bottom" */
  verticalAlign?: "top" | "bottom";
  /** Hide the color/icon indicator. @default false */
  hideIcon?: boolean;
  /** Data key used to resolve the display name from config. */
  nameKey?: string;
}

/**
 * Styled legend content for use with `<ChartLegend content={<ChartLegendContent />} />`.
 *
 * Reads chart config from context to resolve labels and icons.
 *
 * @example
 * ```tsx
 * <ChartLegend content={<ChartLegendContent />} />
 * ```
 */
export const ChartLegendContent = React.forwardRef<HTMLDivElement, ChartLegendContentProps>(
  ({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
    const { config } = useChart();

    if (!payload?.length) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className,
        )}
      >
        {filterVisiblePayload(payload).map((item) => {
          const key = String(nameKey || item.dataKey || "value");
          const itemConfig = resolveConfigEntry(config, item, key);

          return (
            <div
              key={item.value}
              className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-content-tertiary"
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: item.color }}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
      </div>
    );
  },
);

ChartLegendContent.displayName = "ChartLegendContent";
