import * as React from "react";
import { cn } from "../../utils/cn";
import { Skeleton } from "../Skeleton/Skeleton";

/**
 * Shape the skeleton should imitate while data loads. `area` and `line` render
 * the same filled band — a continuous series reads better as a band than as
 * discrete bars. `table` and `rows` stand in for the two list bodies an insight
 * card can hold rather than a chart: a ranked table, and a breakdown of labelled
 * bars.
 */
export type ChartSkeletonVariant = "area" | "line" | "bar" | "circular" | "table" | "rows";

/** Props for {@link ChartSkeleton}. */
export interface ChartSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Which shape to imitate. @default "area" */
  variant?: ChartSkeletonVariant;
  /**
   * How many rows to draw, for the `table` and `rows` variants. Match the row
   * count the loaded card will show, so the card does not resize once the real
   * content arrives. @default 5
   */
  rows?: number;
}

const BAR_HEIGHTS = ["45%", "70%", "55%", "85%", "60%", "95%", "75%"];

/** Varying label widths, so the rows do not read as a single solid block. */
const LABEL_WIDTHS = ["w-24", "w-32", "w-20", "w-28", "w-24"];

const labelWidth = (index: number) => LABEL_WIDTHS[index % LABEL_WIDTHS.length];

const Bar = ({ className }: { className?: string }) => (
  <Skeleton animation="wave" variant="rounded" className={className} />
);

/**
 * A ranked table: the header, then one 48px row per entry holding a rank, an
 * avatar and handle, and a value at the end — the columns {@link ChartCard}'s
 * table bodies use.
 */
const TableSkeleton = ({ rows }: { rows: number }) => (
  <div className="flex w-full flex-col">
    <div className="flex h-8 items-center gap-3">
      <Bar className="h-3 w-4" />
      <Bar className="h-3 w-16" />
      <Bar className="ml-auto h-3 w-12" />
    </div>
    {Array.from({ length: rows }, (_, index) => (
      <div key={`table-row-${index}`} className="flex h-12 items-center gap-3">
        <Bar className="h-4 w-4" />
        <Skeleton animation="wave" variant="circular" className="size-6 shrink-0" />
        <Bar className={cn("h-4", labelWidth(index))} />
        <Bar className="ml-auto h-4 w-16" />
      </div>
    ))}
  </div>
);

/**
 * A breakdown list: per row a leading glyph and label with its share at the far
 * end, then the bar underneath. Mirrors `Demographics`, down to its 8px inner gap
 * and 8px `medium` bar, so the swap to real rows is invisible.
 */
const RowsSkeleton = ({ rows }: { rows: number }) => (
  <div className="flex w-full flex-col gap-4">
    {Array.from({ length: rows }, (_, index) => (
      <div key={`row-${index}`} className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <Skeleton animation="wave" variant="circular" className="size-5 shrink-0" />
            <Bar className={cn("h-4", labelWidth(index))} />
          </span>
          <Bar className="h-4 w-10 shrink-0" />
        </div>
        <Skeleton animation="wave" variant="rounded" className="h-2 w-full rounded-full" />
      </div>
    ))}
  </div>
);

/**
 * A wave-animated placeholder shaped like the content it stands in for — a chart
 * series, a ranked table, or a breakdown of labelled bars. Use it while data
 * loads instead of a generic spinner, so the layout does not visibly shift once
 * the real content renders.
 *
 * For a chart body, pass it to {@link ChartLoadingOverlay} via its `variant` prop
 * rather than rendering it directly. For a card body, pass it to `ChartCard`'s
 * `skeleton` prop.
 *
 * @example
 * ```tsx
 * <ChartSkeleton variant="bar" className="h-48" />
 * <ChartSkeleton variant="table" rows={5} />
 * ```
 */
export const ChartSkeleton = React.forwardRef<HTMLDivElement, ChartSkeletonProps>(
  ({ variant = "area", rows = 5, className, ...props }, ref) => {
    if (variant === "table" || variant === "rows") {
      return (
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {variant === "table" ? <TableSkeleton rows={rows} /> : <RowsSkeleton rows={rows} />}
        </div>
      );
    }

    if (variant === "circular") {
      return (
        <div
          ref={ref}
          className={cn("flex size-full items-center justify-center", className)}
          {...props}
        >
          <div className="relative aspect-square h-full">
            <Skeleton animation="wave" variant="circular" className="size-full" />
            <div className="absolute inset-[27%] rounded-full bg-background-primary" />
          </div>
        </div>
      );
    }

    if (variant === "bar") {
      return (
        <div ref={ref} className={cn("flex size-full items-end gap-2", className)} {...props}>
          {BAR_HEIGHTS.map((height, index) => (
            <Skeleton
              key={`bar-${index}`}
              animation="wave"
              variant="rounded"
              className="flex-1"
              height={height}
            />
          ))}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("size-full", className)} {...props}>
        <Skeleton animation="wave" variant="rounded" className="size-full" />
      </div>
    );
  },
);

ChartSkeleton.displayName = "ChartSkeleton";
