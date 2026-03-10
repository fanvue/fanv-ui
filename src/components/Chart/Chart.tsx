import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/utils/cn";

const THEMES = { light: "", dark: ".dark" } as const;

/**
 * Configuration for chart series. Maps data keys to human-readable labels,
 * optional icons, and color values (or per-theme color overrides).
 *
 * @example
 * ```tsx
 * const config = {
 *   revenue: { label: "Revenue", color: "var(--color-special-chart-teal)" },
 *   expenses: { label: "Expenses", color: "var(--color-special-chart-sky)" },
 * } satisfies ChartConfig;
 * ```
 */
export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Chart configuration mapping data keys to labels, icons, and colors. */
  config: ChartConfig;
  /**
   * The Recharts chart element to render inside the responsive container.
   * Must be a valid child of `ResponsiveContainer`.
   */
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
}

/**
 * Responsive chart wrapper that provides theming context and CSS variable injection.
 * Wrap any Recharts chart with this component.
 *
 * @example
 * ```tsx
 * <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
 *   <BarChart data={data}>
 *     <Bar dataKey="value" fill="var(--color-value)" />
 *   </BarChart>
 * </ChartContainer>
 * ```
 */
const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ id, className, children, config, style, ...props }, ref) => {
    const uniqueId = React.useId();
    const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

    const { inlineStyles, themeConfig } = React.useMemo(() => buildChartStyles(config), [config]);

    return (
      <ChartContext.Provider value={{ config }}>
        <div
          id={id}
          data-chart={chartId}
          ref={ref}
          className={cn(
            "flex aspect-video text-xs",
            "[&_.recharts-cartesian-axis-tick-value]:fill-foreground-default",
            "[&_.recharts-polar-angle-axis-tick-value]:fill-foreground-default",
            "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-neutral-200/50",
            "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-neutral-200",
            "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
            "[&_.recharts-layer]:outline-hidden",
            "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-neutral-200",
            "[&_.recharts-radial-bar-background-sector]:fill-neutral-100",
            "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-neutral-100",
            "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-neutral-200",
            "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
            "[&_.recharts-sector]:outline-hidden",
            "[&_.recharts-surface]:outline-hidden",
            className,
          )}
          style={{ ...inlineStyles, ...style } as React.CSSProperties}
          {...props}
        >
          {themeConfig.length > 0 && <ChartStyle id={chartId} config={themeConfig} />}
          <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    );
  },
);
ChartContainer.displayName = "ChartContainer";

function buildChartStyles(config: ChartConfig) {
  const inlineStyles: Record<string, string> = {};
  const themeConfig: [string, ChartConfig[string]][] = [];

  for (const [key, itemConfig] of Object.entries(config)) {
    if (itemConfig.theme) {
      themeConfig.push([key, itemConfig]);
    } else if (itemConfig.color) {
      inlineStyles[`--color-${key}`] = itemConfig.color;
    }
  }

  return { inlineStyles, themeConfig };
}

const ChartStyle = ({ id, config }: { id: string; config: [string, ChartConfig[string]][] }) => {
  if (!config.length) {
    return null;
  }

  return (
    <style
      // biome-ignore lint/security/noDangerouslySetInnerHtml: required for per-theme color overrides that cannot be expressed as inline styles
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${config
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  );
};

/**
 * Recharts `Tooltip` re-export for use with {@link ChartTooltipContent}.
 */
const ChartTooltip = RechartsPrimitive.Tooltip;

type TooltipPayloadEntry = RechartsPrimitive.TooltipPayloadEntry;

export interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the tooltip is currently active (injected by Recharts). */
  active?: boolean;
  /** Tooltip payload entries (injected by Recharts). */
  payload?: readonly TooltipPayloadEntry[];
  /** Axis label for the hovered data point (injected by Recharts). */
  label?: React.ReactNode;
  /** Custom label formatter. */
  labelFormatter?: (
    label: React.ReactNode,
    payload: readonly TooltipPayloadEntry[],
  ) => React.ReactNode;
  /** Custom value formatter. */
  formatter?: (
    value: RechartsPrimitive.TooltipValueType,
    name: string | number | undefined,
    item: TooltipPayloadEntry,
    index: number,
    payload: readonly TooltipPayloadEntry[],
  ) => React.ReactNode;
  /** Additional CSS class for the label element. */
  labelClassName?: string;
  /** Override color for all indicators. */
  color?: string;
  /** Whether to hide the tooltip label. @default false */
  hideLabel?: boolean;
  /** Whether to hide the color indicator. @default false */
  hideIndicator?: boolean;
  /** Style of the color indicator. @default "dot" */
  indicator?: "line" | "dot" | "dashed";
  /** Config key to use for the tooltip item name. */
  nameKey?: string;
  /** Config key to use for the tooltip label. */
  labelKey?: string;
}

/**
 * Styled tooltip content for use with Recharts `Tooltip`.
 *
 * @example
 * ```tsx
 * <ChartTooltip content={<ChartTooltipContent />} />
 * ```
 */
const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
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
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
      const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      if (labelFormatter) {
        return (
          <div className={cn("typography-semibold-body-sm", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        );
      }

      if (!value) {
        return null;
      }

      return <div className={cn("typography-semibold-body-sm", labelClassName)}>{value}</div>;
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== "dot";

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-neutral-200 bg-surface-page px-2.5 py-1.5 text-xs shadow-blur-floating",
          className,
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload
            .filter((item) => item.type !== "none")
            .map((item, index) => {
              const key = `${nameKey || item.name || item.dataKey || "value"}`;
              const itemConfig = getPayloadConfigFromPayload(config, item, key);
              const indicatorColor = color || item.payload?.fill || item.color;

              return (
                <div
                  key={`${item.dataKey ?? item.name ?? index}`}
                  className={cn(
                    "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-foreground-secondary",
                    indicator === "dot" && "items-center",
                  )}
                >
                  {formatter && item?.value !== undefined && item.name ? (
                    formatter(item.value, item.name, item, index, payload)
                  ) : (
                    <>
                      {itemConfig?.icon ? (
                        <itemConfig.icon />
                      ) : (
                        !hideIndicator && (
                          <div
                            className={cn(
                              "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                              {
                                "h-2.5 w-2.5": indicator === "dot",
                                "w-1": indicator === "line",
                                "w-0 border-[1.5px] border-dashed bg-transparent":
                                  indicator === "dashed",
                                "my-0.5": nestLabel && indicator === "dashed",
                              },
                            )}
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
                          <span className="text-foreground-secondary">
                            {itemConfig?.label || item.name}
                          </span>
                        </div>
                        {item.value !== undefined && (
                          <span className="font-medium font-mono text-foreground-default tabular-nums">
                            {item.value.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </>
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

/**
 * Recharts `Legend` re-export for use with {@link ChartLegendContent}.
 */
const ChartLegend = RechartsPrimitive.Legend;

type RechartLegendPayloadEntry = RechartsPrimitive.LegendPayload;

export interface ChartLegendContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether to hide the legend icon. @default false */
  hideIcon?: boolean;
  /** Config key to use for the legend item name. */
  nameKey?: string;
  /** Payload from Recharts Legend (injected by Recharts). */
  payload?: RechartLegendPayloadEntry[];
  /** Vertical alignment of the legend. @default "bottom" */
  verticalAlign?: "top" | "bottom";
}

/**
 * Styled legend content for use with Recharts `Legend`.
 *
 * @example
 * ```tsx
 * <ChartLegend content={<ChartLegendContent />} />
 * ```
 */
const ChartLegendContent = React.forwardRef<HTMLDivElement, ChartLegendContentProps>(
  ({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
    const { config } = useChart();

    if (!payload?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className,
        )}
      >
        {payload
          .filter((item) => item.type !== "none")
          .map((item) => {
            const key = `${nameKey || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);

            return (
              <div
                key={item.value}
                className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-foreground-secondary"
              >
                {itemConfig?.icon && !hideIcon ? (
                  <itemConfig.icon />
                ) : (
                  <div
                    className="h-2 w-2 shrink-0 rounded-[2px]"
                    style={{
                      backgroundColor: item.color,
                    }}
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

function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload && typeof payload.payload === "object" && payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (key in payload && typeof payload[key as keyof typeof payload] === "string") {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
