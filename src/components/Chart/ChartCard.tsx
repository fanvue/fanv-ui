import * as React from "react";
import { cn } from "../../utils/cn";
import { Card, type CardHierarchy } from "../Card/Card";
import { IconButton } from "../IconButton/IconButton";
import { ArrowUpRightIcon } from "../Icons/ArrowUpRightIcon";
import { InfoIcon } from "../Icons/InfoIcon";
import { Skeleton } from "../Skeleton/Skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../Tooltip/Tooltip";

/** Props for {@link ChartCard}. */
export interface ChartCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * Surface treatment. `primary` follows the V2 Insight Card spec (white fill,
   * strong border, 12px radius); `secondary` uses the {@link Card} secondary
   * surface. @default "primary"
   */
  hierarchy?: CardHierarchy;
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
  /**
   * Trend indicator config. Rendered as a coloured directional arrow and label
   * beside the subtitle, so it is only shown when {@link subtitle} is provided.
   */
  trendChip?: {
    /** Display label (e.g. "12.5% vs prev"). */
    label: React.ReactNode;
    /** Whether the trend is positive (green, arrow up) or negative (red, arrow down). */
    trend: "positive" | "negative";
  };
  /** Show loading skeleton instead of content. @default false */
  loading?: boolean;
  /** Chart content rendered below the header. */
  children?: React.ReactNode;
}

const TREND_CLASSES: Record<"positive" | "negative", string> = {
  positive: "text-success-content",
  negative: "text-error-content",
};

const SURFACE_CLASSES: Partial<Record<CardHierarchy, string>> = {
  primary: "rounded-sm border-border-strong bg-background-primary",
};

/**
 * Wraps any chart with a structured header containing title, subtitle,
 * optional trend indicator, date range label, info tooltip, and a loading
 * skeleton state.
 *
 * At `hierarchy="primary"` this implements the V2 Insight Card surface, which
 * differs from {@link Card}'s own primary hierarchy: a white fill, the strong
 * border, and a 12px radius.
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
      hierarchy = "primary",
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
      <Card
        ref={ref}
        hierarchy={hierarchy}
        noPadding
        className={cn(SURFACE_CLASSES[hierarchy], className)}
        {...props}
      >
        <div className="flex flex-col gap-2 p-4">
          {loading ? (
            <>
              <Skeleton animation="wave" variant="rounded" className="h-4 w-32" />
              <Skeleton animation="wave" variant="rounded" className="h-7 w-44" />
              <Skeleton animation="wave" variant="rounded" className="h-3 w-24" />
            </>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <span className="typography-body-small-14px-regular text-content-secondary">
                  {title}
                </span>
                {tooltip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <IconButton
                          variant="tertiary"
                          size="32"
                          aria-label={tooltipAriaLabel}
                          className="text-icons-primary hover:text-content-primary focus-visible:text-content-primary active:text-content-primary"
                          icon={<InfoIcon size={16} />}
                        />
                      </TooltipTrigger>
                      <TooltipContent>{tooltip}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              {subtitle && (
                <div className="flex flex-wrap items-end gap-2">
                  <span className="typography-header-heading-sm text-content-primary">
                    {subtitle}
                  </span>
                  {trendChip && (
                    <span
                      className={cn(
                        "flex items-center gap-1 pb-px",
                        TREND_CLASSES[trendChip.trend],
                      )}
                    >
                      <ArrowUpRightIcon
                        className={cn(
                          "size-4 shrink-0",
                          trendChip.trend === "negative" && "rotate-90",
                        )}
                      />
                      <span className="typography-body-small-14px-regular whitespace-nowrap">
                        {trendChip.label}
                      </span>
                    </span>
                  )}
                </div>
              )}
              {dateInfo && (
                <span className="typography-description-12px-regular text-content-tertiary">
                  {dateInfo}
                </span>
              )}
            </>
          )}
          {children && <div className="mt-auto">{children}</div>}
        </div>
      </Card>
    );
  },
);
ChartCard.displayName = "ChartCard";
