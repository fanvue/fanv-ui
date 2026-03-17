import * as React from "react";
import { cn } from "../../utils/cn";

/** A single item in a {@link ChartPieLegend}. */
export interface ChartPieLegendItem {
  /** Display label. Pass translated string for i18n. */
  label: React.ReactNode;
  /** Numeric value for this slice. Used to calculate the proportional bar width. */
  value: number;
  /** Formatted display value (e.g. "$4,500"). If omitted, `value.toLocaleString()` is used. */
  formattedValue?: React.ReactNode;
  /** Slice color (CSS value). */
  color: string;
  /** Optional icon to show instead of the color dot. */
  icon?: React.ReactNode;
}

/** Props for {@link ChartPieLegend}. */
export interface ChartPieLegendProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Legend items to display. */
  items: ChartPieLegendItem[];
}

/**
 * A side legend for pie/donut charts that shows each slice's label,
 * formatted value, and a proportional progress bar.
 *
 * @example
 * ```tsx
 * <ChartPieLegend
 *   items={[
 *     { label: "Subscriptions", value: 4500, formattedValue: "$4,500", color: "var(--color-special-chart-teal)" },
 *     { label: "Messages", value: 2100, formattedValue: "$2,100", color: "var(--color-special-chart-sky)" },
 *     { label: "Tips", value: 1200, formattedValue: "$1,200", color: "var(--color-special-chart-orange)" },
 *   ]}
 * />
 * ```
 */
export const ChartPieLegend = React.forwardRef<HTMLDivElement, ChartPieLegendProps>(
  ({ items, className, ...props }, ref) => {
    const total = items.reduce((sum, item) => sum + item.value, 0);

    return (
      <div ref={ref} className={cn("flex flex-col gap-3", className)} {...props}>
        {items.map((item) => (
          <div key={`${item.color}-${item.value}`} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              {item.icon ?? (
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              )}
              <span className="typography-regular-body-sm min-w-0 flex-1 truncate text-foreground-secondary">
                {item.label}
              </span>
              <span className="typography-semibold-body-md text-foreground-default tabular-nums">
                {item.formattedValue ?? item.value.toLocaleString()}
              </span>
            </div>
            <div
              className="h-1.5 rounded-full"
              style={{
                backgroundColor: item.color,
                width: total > 0 ? `${(item.value / total) * 100}%` : "0%",
              }}
            />
          </div>
        ))}
      </div>
    );
  },
);

ChartPieLegend.displayName = "ChartPieLegend";
