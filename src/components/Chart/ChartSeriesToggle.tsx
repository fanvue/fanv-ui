import * as React from "react";
import { cn } from "../../utils/cn";
import { Chip } from "../Chip/Chip";

/** A single toggleable series in a {@link ChartSeriesToggle}. */
export interface ChartSeriesToggleItem {
  /** Unique key matching the data series key and ChartConfig key. */
  key: string;
  /** Human-readable label. Pass translated string for i18n. */
  label: React.ReactNode;
  /** Series color (CSS value). Shown as indicator dot. */
  color: string;
}

/** Props for {@link ChartSeriesToggle}. */
export interface ChartSeriesToggleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Available series that can be toggled. */
  items: ChartSeriesToggleItem[];
  /** Set of currently visible series keys. */
  value: Set<string>;
  /** Called when a series is toggled. Receives the updated Set. */
  onValueChange: (value: Set<string>) => void;
}

/**
 * Renders a grid of toggleable {@link Chip}s that control which series are
 * visible on a multi-series chart. Each toggle shows a series colour dot and a
 * label, and exposes its state through `aria-pressed`.
 *
 * @example
 * ```tsx
 * const [visible, setVisible] = useState(new Set(["subscription", "message", "tip"]));
 *
 * <ChartSeriesToggle
 *   items={[
 *     { key: "subscription", label: "Subscription", color: "var(--color-special-chart-teal)" },
 *     { key: "message", label: "Message", color: "var(--color-special-chart-sky)" },
 *     { key: "tip", label: "Tip", color: "var(--color-special-chart-orange)" },
 *   ]}
 *   value={visible}
 *   onValueChange={setVisible}
 * />
 * ```
 */
export const ChartSeriesToggle = React.forwardRef<HTMLDivElement, ChartSeriesToggleProps>(
  ({ className, items, value, onValueChange, ...props }, ref) => {
    const toggle = (key: string) => {
      const next = new Set(value);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      onValueChange(next);
    };

    return (
      <div ref={ref} className={cn("grid grid-cols-2 gap-2 sm:grid-cols-3", className)} {...props}>
        {items.map((item) => (
          <Chip
            key={item.key}
            size="32"
            className="justify-start"
            selected={value.has(item.key)}
            onClick={() => toggle(item.key)}
            leftIcon={
              <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
            }
          >
            {item.label}
          </Chip>
        ))}
      </div>
    );
  },
);

ChartSeriesToggle.displayName = "ChartSeriesToggle";
