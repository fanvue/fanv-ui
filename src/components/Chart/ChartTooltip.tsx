import * as React from "react";
import { Tooltip as RechartsTooltip } from "recharts";
import type { NameType, Payload, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { cn } from "../../utils/cn";
import { filterVisiblePayload, resolveConfigEntry } from "./chartUtils";
import type { ChartConfigEntry } from "./types";
import { useChart } from "./useChart";

/** Re-export of Recharts `Tooltip` — use with `content={<ChartTooltipContent />}`. */
export const ChartTooltip = RechartsTooltip;

/** Indicator shape rendered beside each tooltip row. */
export type ChartTooltipIndicator = "dot" | "line" | "dashed";

/** Props for {@link ChartTooltipContent}. */
export interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the tooltip is currently active/visible. Passed by Recharts. */
  active?: boolean;
  /** Tooltip payload data. Passed by Recharts. */
  payload?: Payload<ValueType, NameType>[];
  /** Axis label. Passed by Recharts. */
  label?: string | number;
  /** Custom label formatter. */
  labelFormatter?: (
    label: string | number,
    payload: Payload<ValueType, NameType>[],
  ) => React.ReactNode;
  /** Custom value formatter. */
  formatter?: (
    value: ValueType,
    name: NameType,
    item: Payload<ValueType, NameType>,
    index: number,
    payload: Payload<ValueType, NameType>[],
  ) => React.ReactNode;
  /** CSS class for the label element. */
  labelClassName?: string;
  /** Hide the tooltip header label. @default false */
  hideLabel?: boolean;
  /** Hide the color indicator beside each row. @default false */
  hideIndicator?: boolean;
  /** Visual style of the color indicator. @default "dot" */
  indicator?: ChartTooltipIndicator;
  /**
   * Data key used to resolve the display name from config.
   * Useful when the payload `name` differs from the config key.
   */
  nameKey?: string;
  /**
   * Data key used to resolve the header label from config.
   * Falls back to the first payload item's `dataKey`.
   */
  labelKey?: string;
  /** Override indicator color for all rows. */
  color?: string;
}

function TooltipRow({
  item,
  itemConfig,
  indicator,
  indicatorColor,
  hideIndicator,
  nestLabel,
  tooltipLabel,
}: {
  item: Payload<ValueType, NameType>;
  itemConfig: ChartConfigEntry | undefined;
  indicator: ChartTooltipIndicator;
  indicatorColor: unknown;
  hideIndicator: boolean;
  nestLabel: boolean;
  tooltipLabel: React.ReactNode;
}) {
  return (
    <>
      {itemConfig?.icon ? (
        <itemConfig.icon />
      ) : (
        !hideIndicator && (
          <div
            className={cn("shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)", {
              "h-2.5 w-2.5": indicator === "dot",
              "w-1": indicator === "line",
              "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
              "my-0.5": nestLabel && indicator === "dashed",
            })}
            style={
              {
                "--color-bg": indicatorColor,
                "--color-border": indicatorColor,
              } as React.CSSProperties
            }
          />
        )
      )}
      <div
        className={cn(
          "flex flex-1 justify-between leading-none",
          nestLabel ? "items-end" : "items-center",
        )}
      >
        <div className="grid gap-1.5">
          {nestLabel ? tooltipLabel : null}
          <span className="text-content-tertiary">{itemConfig?.label || item.name}</span>
        </div>
        {item.value !== undefined && (
          <span className="font-medium font-mono text-content-primary tabular-nums">
            {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
          </span>
        )}
      </div>
    </>
  );
}

/**
 * Styled tooltip content for use with `<ChartTooltip content={<ChartTooltipContent />} />`.
 *
 * Reads chart config from context to resolve labels, colors, and icons.
 * Supports dot/line/dashed indicators. Pass translated `label`s in config for i18n.
 *
 * @example
 * ```tsx
 * <ChartTooltip
 *   content={<ChartTooltipContent indicator="line" />}
 * />
 * ```
 */
export const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref,
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) return null;

      const [item] = payload;
      const key = String(labelKey || item?.dataKey || item?.name || "value");
      const itemConfig = resolveConfigEntry(config, item, key);
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      if (labelFormatter && payload) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value as string | number, payload)}
          </div>
        );
      }

      if (!value) return null;
      return <div className={cn("font-medium", labelClassName)}>{value}</div>;
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

    if (!active || !payload?.length) return null;

    const nestLabel = payload.length === 1 && indicator !== "dot";

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-32 items-start gap-1.5 rounded-xs border border-neutral-alphas-200 bg-surface-primary px-2.5 py-1.5 text-xs shadow-lg",
          className,
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {filterVisiblePayload(payload).map((item, index) => {
            const key = String(nameKey || item.dataKey || item.name || "value");
            const itemConfig = resolveConfigEntry(config, item, key);
            const indicatorColor =
              color || (item.payload as Record<string, unknown>)?.fill || item.color;

            return (
              <div
                key={`${item.dataKey ?? item.name ?? index}`}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-content-tertiary",
                  indicator === "dot" && "items-center",
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, payload)
                ) : (
                  <TooltipRow
                    item={item}
                    itemConfig={itemConfig}
                    indicator={indicator}
                    indicatorColor={indicatorColor}
                    hideIndicator={hideIndicator}
                    nestLabel={nestLabel}
                    tooltipLabel={tooltipLabel}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

ChartTooltipContent.displayName = "ChartTooltipContent";
