import * as React from "react";
import { cn } from "@/utils/cn";
import { StarIcon } from "../Icons/StarIcon";

/** A single rating value paired with the number of reviews that gave it. */
export interface RatingCount {
  /** The rating value this entry represents (e.g. `5`). */
  rating: number;
  /** Number of reviews that gave this rating. */
  count: number;
}

export interface RatingSummaryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * Per-rating review counts. Order is not significant — rows always render from
   * `maxRating` down to `1`, and any rating without an entry renders as zero.
   * Entries are expected to use whole-number ratings within `1`–`maxRating`;
   * any outside that range are ignored, including in the derived total and average.
   */
  distribution: RatingCount[];
  /**
   * Average rating shown in the header. Defaults to the count-weighted mean of
   * `distribution`; provide it to display a server-computed average instead.
   */
  averageRating?: number;
  /** Highest possible rating. Sets how many histogram rows render. @default 5 */
  maxRating?: number;
  /**
   * Formats a review count into its label, without surrounding parentheses.
   * Used for the visible text and as the count portion of the default
   * accessible labels.
   * @default ``(count) => `${count.toLocaleString()} review(s)` ``
   */
  formatCount?: (count: number) => string;
  /**
   * Builds the accessible label for the header. Override to localise the
   * screen-reader text. `average` is the already-formatted average string.
   * @default ``(average, max, total) => `Average rating ${average} out of ${max}, ${formatCount(total)}` ``
   */
  formatAverageLabel?: (average: string, maxRating: number, total: number) => string;
  /**
   * Builds the accessible label for each histogram row. Override to localise the
   * screen-reader text.
   * @default ``(rating, count) => `${rating} star(s), ${formatCount(count)}` ``
   */
  formatRatingLabel?: (rating: number, count: number) => string;
}

function defaultFormatCount(count: number): string {
  return `${count.toLocaleString()} ${count === 1 ? "review" : "reviews"}`;
}

function getWeightedAverage(distribution: RatingCount[]): number {
  let total = 0;
  let weighted = 0;
  for (const { rating, count } of distribution) {
    total += count;
    weighted += rating * count;
  }
  return total === 0 ? 0 : weighted / total;
}

/**
 * An aggregated rating overview: a headline average with the total review count,
 * followed by a per-rating histogram. Bar lengths are scaled relative to the
 * most-reviewed rating, so the busiest rating always fills the track.
 *
 * The histogram is one shared grid (with subgrid rows) rather than per-row
 * flex: the label column is sized by the widest label across all rows, so a
 * width difference between labels (e.g. "1 review" vs "3 reviews") never
 * changes a row's track length — every bar's right edge stays aligned.
 *
 * The brand star is decorative; the header and each histogram row expose
 * `role="img"` with an accessible label (override via `formatAverageLabel` /
 * `formatRatingLabel`) so the single-star-plus-number reads clearly.
 *
 * @example
 * ```tsx
 * <RatingSummary
 *   distribution={[
 *     { rating: 5, count: 300 },
 *     { rating: 4, count: 20 },
 *     { rating: 3, count: 20 },
 *     { rating: 2, count: 10 },
 *     { rating: 1, count: 0 },
 *   ]}
 * />
 * ```
 */
export const RatingSummary = React.forwardRef<HTMLDivElement, RatingSummaryProps>(
  (
    {
      distribution,
      averageRating,
      maxRating = 5,
      formatCount = defaultFormatCount,
      formatAverageLabel,
      formatRatingLabel,
      className,
      ...props
    },
    ref,
  ) => {
    const countByRating = new Map<number, number>();
    for (const { rating, count } of distribution) {
      countByRating.set(rating, (countByRating.get(rating) ?? 0) + count);
    }

    const rows = Array.from({ length: maxRating }, (_, index) => {
      const rating = maxRating - index;
      return { rating, count: countByRating.get(rating) ?? 0 };
    });

    const totalCount = rows.reduce((sum, row) => sum + row.count, 0);
    const maxCount = rows.reduce((max, row) => Math.max(max, row.count), 0);
    const average = averageRating ?? getWeightedAverage(rows);
    const averageLabel = average.toFixed(1);

    const headerLabel = formatAverageLabel
      ? formatAverageLabel(averageLabel, maxRating, totalCount)
      : `Average rating ${averageLabel} out of ${maxRating}, ${formatCount(totalCount)}`;

    return (
      <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props}>
        <div className="flex items-center gap-1" role="img" aria-label={headerLabel}>
          <StarIcon size={24} filled className="shrink-0 text-brand-primary-default" />
          <span className="flex items-center gap-1.5">
            <span className="typography-body-small-14px-semibold text-content-primary">
              {averageLabel}
            </span>
            <span className="typography-body-small-14px-regular text-content-tertiary">
              ({formatCount(totalCount)})
            </span>
          </span>
        </div>

        <ul
          className="m-0 grid list-none grid-cols-[1fr_auto] gap-4 p-0"
          aria-label="Rating breakdown"
        >
          {rows.map(({ rating, count }) => (
            <li key={rating} className="col-span-2 grid grid-cols-subgrid">
              <div
                className="col-span-2 grid grid-cols-subgrid items-center"
                role="img"
                aria-label={
                  formatRatingLabel
                    ? formatRatingLabel(rating, count)
                    : `${rating} ${rating === 1 ? "star" : "stars"}, ${formatCount(count)}`
                }
              >
                <div className="relative h-4 overflow-hidden rounded-full bg-neutral-alphas-50">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-brand-primary-default transition-[width] duration-300 ease-in-out"
                    style={{ width: maxCount === 0 ? "0%" : `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="flex items-center gap-1.5">
                  <span className="typography-body-small-14px-semibold text-content-primary">
                    {rating}
                  </span>
                  <span className="typography-body-small-14px-regular text-content-tertiary">
                    ({formatCount(count)})
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  },
);

RatingSummary.displayName = "RatingSummary";
