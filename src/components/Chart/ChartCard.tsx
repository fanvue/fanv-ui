import * as React from "react";
import { cn } from "../../utils/cn";
import { Card } from "../Card/Card";
import { IconButton } from "../IconButton/IconButton";
import { InfoCircleIcon } from "../Icons/InfoCircleIcon";
import { Skeleton } from "../Skeleton/Skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../Tooltip/Tooltip";

/** Props for {@link ChartCard}. */
export interface ChartCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Card title text. Pass translated string for i18n. */
  title: React.ReactNode;
  /** Large subtitle value (e.g. formatted price or count). */
  subtitle?: React.ReactNode;
  /** Tooltip text shown next to the title. Pass translated string for i18n. */
  tooltip?: React.ReactNode;
  /** Accessible label for the info tooltip trigger. Override for i18n. @default "More info" */
  tooltipAriaLabel?: string;
  /** Date range or period label shown below the subtitle. */
  dateInfo?: React.ReactNode;
  /** Trend indicator chip config. */
  trendChip?: {
    /** Display label (e.g. "12.5%"). */
    label: React.ReactNode;
    /** Whether the trend is positive (green) or negative (red). */
    trend: "positive" | "negative";
  };
  /** Show loading skeleton instead of content. @default false */
  loading?: boolean;
  /** Chart content rendered below the header. */
  children?: React.ReactNode;
}

const TREND_CLASSES: Record<"positive" | "negative", string> = {
  positive: "bg-success-surface text-success-content",
  negative: "bg-error-surface text-error-content",
};

/**
 * Wraps any chart with a structured header containing title, subtitle,
 * optional trend chip, date range label, info tooltip, and a loading
 * skeleton state.
 *
 * @example
 * ```tsx
 * <ChartCard
 *   title="Revenue"
 *   subtitle="$4,523"
 *   trendChip={{ label: "+12.5%", trend: "positive" }}
 *   dateInfo="Jan 1 – Mar 17"
 *   tooltip="Total revenue for the selected period."
 * >
 *   <MyLineChart />
 * </ChartCard>
 * ```
 */
export const ChartCard = React.forwardRef<HTMLDivElement, ChartCardProps>(
  (
    {
      className,
      title,
      subtitle,
      tooltip,
      tooltipAriaLabel = "More info",
      dateInfo,
      trendChip,
      loading = false,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Card ref={ref} variant="outlined" noPadding className={className} {...props}>
        <div className="flex flex-col gap-2 p-4">
          {loading ? (
            <>
              <Skeleton animation="wave" variant="rounded" className="h-4 w-32" />
              <Skeleton animation="wave" variant="rounded" className="h-7 w-44" />
              <Skeleton animation="wave" variant="rounded" className="h-3 w-24" />
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <span className="typography-semibold-body-md text-content-primary">{title}</span>
                {tooltip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <IconButton
                          variant="tertiary"
                          size="24"
                          aria-label={tooltipAriaLabel}
                          icon={<InfoCircleIcon className="size-4 text-content-tertiary" />}
                        />
                      </TooltipTrigger>
                      <TooltipContent>{tooltip}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              {subtitle && (
                <div className="flex items-center gap-2">
                  <span className="typography-bold-heading-sm text-content-primary">
                    {subtitle}
                  </span>
                  {trendChip && (
                    <span
                      className={cn(
                        "typography-semibold-body-sm rounded-full px-2 py-0.5",
                        TREND_CLASSES[trendChip.trend],
                      )}
                    >
                      {trendChip.label}
                    </span>
                  )}
                </div>
              )}
              {dateInfo && (
                <span className="typography-regular-body-sm text-content-tertiary">{dateInfo}</span>
              )}
            </>
          )}
          <div className="mt-auto">{children}</div>
        </div>
      </Card>
    );
  },
);
ChartCard.displayName = "ChartCard";
