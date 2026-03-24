import { Button, CheckIcon, cn } from "@fanvue/ui";

/** Classic 5-point star (solid); Fanvue `StarIcon` path reads as an outline ring in this size. */
const STAR_POLYGON_POINTS =
  "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2";

function ReviewStarFilled({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      role="presentation"
      className={cn("size-4 shrink-0", className)}
    >
      <polygon fill="currentColor" points={STAR_POLYGON_POINTS} />
    </svg>
  );
}

function ReviewStarOutline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      role="presentation"
      className={cn("size-4 shrink-0", className)}
    >
      <polygon
        fill="none"
        points={STAR_POLYGON_POINTS}
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
    </svg>
  );
}

export interface AppStoreReviewProps {
  /** Reviewer display name */
  reviewerName: string;
  /** Two-letter (or short) initials inside the avatar circle */
  avatarInitials: string;
  /** Whole stars only, 0–5 */
  rating: number;
  /** Pre-formatted date string (caller handles locale) */
  reviewDate: string;
  body: string;
  /** Count shown in helpful action, e.g. 15 → "Helpful (15)" */
  helpfulCount?: number;
  helpfulLabel?: string;
  onHelpfulPress?: () => void;
  showMoreLabel?: string;
  onShowMorePress?: () => void;
  className?: string;
}

function StarRow({ rating }: { rating: number }) {
  const clamped = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <div role="img" aria-label={`${clamped} out of 5 stars`} className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((starIndex) =>
        starIndex <= clamped ? (
          <ReviewStarFilled key={starIndex} className="text-special-chart-orange" />
        ) : (
          <ReviewStarOutline key={starIndex} className="text-content-secondary opacity-35" />
        ),
      )}
    </div>
  );
}

/**
 * App review block from Fanvue Library — desktop header row vs stacked header below `md`.
 */
export function AppStoreReview({
  reviewerName,
  avatarInitials,
  rating,
  reviewDate,
  body,
  helpfulCount,
  helpfulLabel,
  onHelpfulPress,
  showMoreLabel = "Show more",
  onShowMorePress,
  className,
}: AppStoreReviewProps) {
  const helpfulText =
    helpfulLabel ?? (helpfulCount != null ? `Helpful (${helpfulCount})` : "Helpful");

  return (
    <article
      className={cn(
        "w-full max-w-[343px] rounded-[var(--radius-rounded-lg,24px)] md:max-w-[888px]",
        className,
      )}
    >
      <div className="flex gap-3">
        <div
          className="typography-semibold-body-lg flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-primary text-content-primary"
          aria-hidden
        >
          {avatarInitials.slice(0, 2)}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex min-w-0 flex-col gap-0.5 md:flex-row md:items-center md:gap-3">
            <p className="typography-semibold-body-lg shrink-0 text-content-primary">
              {reviewerName}
            </p>
            <div className="flex w-full items-center justify-between gap-3 md:w-auto md:justify-start">
              <StarRow rating={rating} />
              <p className="typography-regular-body-md shrink-0 whitespace-nowrap text-content-secondary">
                {reviewDate}
              </p>
            </div>
          </div>

          <p className="typography-regular-body-lg text-content-primary">{body}</p>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              type="button"
              variant="text"
              size="24"
              leftIcon={<CheckIcon className="size-3" aria-hidden />}
              onClick={onHelpfulPress}
              disabled={!onHelpfulPress}
              className="h-auto min-h-0 cursor-pointer gap-2 py-0.5 pr-0 pl-0"
            >
              {helpfulText}
            </Button>
            <Button
              type="button"
              variant="text"
              size="24"
              onClick={onShowMorePress}
              disabled={!onShowMorePress}
              className="h-auto min-h-0 cursor-pointer py-0.5 pr-0 pl-0"
            >
              {showMoreLabel}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
