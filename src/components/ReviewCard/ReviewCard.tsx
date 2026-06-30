import * as React from "react";
import { cn } from "@/utils/cn";
import { StarIcon } from "../Icons/StarIcon";

export interface ReviewCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Star rating the reviewer gave, shown beside the star icon. */
  rating: number;
  /** Highest possible rating, used only in the accessible label (e.g. "4 out of 5"). @default 5 */
  maxRating?: number;
  /** Reviewer name or handle, rendered after "by". Omitted when not provided. */
  author?: React.ReactNode;
  /** Short headline for the review. */
  title?: React.ReactNode;
  /** Review body text. */
  children?: React.ReactNode;
}

/**
 * A single written review: a star rating with an optional author byline, a
 * title, and the review body. Stack several with a {@link Divider} between them
 * to build a review list.
 *
 * @example
 * ```tsx
 * <ReviewCard rating={4} author="@jane_doe" title="A great app to start!">
 *   Easily plan and organize your content. Streamline your scheduling so you can
 *   focus on what you do best.
 * </ReviewCard>
 * ```
 */
export const ReviewCard = React.forwardRef<HTMLDivElement, ReviewCardProps>(
  ({ rating, maxRating = 5, author, title, children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
        <div className="flex items-center gap-1">
          <StarIcon size={24} filled className="shrink-0 text-brand-primary-default" />
          <span
            className="typography-body-small-14px-semibold text-content-primary"
            role="img"
            aria-label={`Rated ${rating} out of ${maxRating}`}
          >
            {rating}
          </span>
          {author != null && (
            <span className="typography-body-small-14px-regular text-content-tertiary">
              by {author}
            </span>
          )}
        </div>
        {title != null && (
          <p className="typography-body-default-16px-semibold text-content-primary">{title}</p>
        )}
        {children != null && (
          <p className="typography-body-small-14px-regular text-content-secondary">{children}</p>
        )}
      </div>
    );
  },
);

ReviewCard.displayName = "ReviewCard";
