import type { ImgHTMLAttributes } from "react";
import * as React from "react";
import { cn } from "../../utils/cn";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import { AddIcon } from "../Icons/AddIcon";
import { DownloadIcon } from "../Icons/DownloadIcon";
import { StarIcon } from "../Icons/StarIcon";

export interface ItemCardProps {
  title: string;
  description: string;
  imageProps: ImgHTMLAttributes<HTMLImageElement>;
  /** Shown from the `md` breakpoint (1280px, Eden / MUI) when `true` */
  showAdd?: boolean;
  onAdd?: () => void;
  addLabel?: string;
  rating?: number;
  reviewCount?: number;
  installCount?: number;
  /** e.g. "Free plan available" */
  planLabel?: string;
  /** Uppercase category chip (Figma: messaging) */
  category?: string;
  /** Click handler for the entire card */
  onClick?: () => void;
  className?: string;
}

const cardClassName =
  "group flex w-full cursor-pointer items-start gap-5 rounded-[var(--radius-rounded-md,16px)] border border-transparent p-3 text-left transition-all hover:border-neutral-alphas-200 hover:bg-neutral-alphas-50";

/**
 * A versatile card component for displaying items with thumbnail, title, description, and metadata.
 * Useful for marketplaces, listings, profiles, content catalogs, and more.
 */
export const ItemCard = React.forwardRef<HTMLDivElement | HTMLButtonElement, ItemCardProps>(
  (
    {
      title,
      description,
      imageProps,
      showAdd = false,
      onAdd,
      addLabel = "Add",
      rating,
      reviewCount,
      installCount,
      planLabel,
      category,
      onClick,
      className,
    },
    ref,
  ) => {
    const showReviews =
      rating !== undefined && rating !== null && reviewCount !== undefined && reviewCount !== null;
    const showInstalls = installCount !== undefined && installCount !== null;

    const content = (
      <>
        <div className="relative box-border flex size-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-rounded-lg,24px)] border-2 border-transparent bg-neutral-alphas-100 transition-colors group-hover:border-brand-primary-hover">
          {imageProps.src ? (
            <img
              {...imageProps}
              alt={imageProps.alt ?? ""}
              className={cn(
                "pointer-events-none size-full max-w-none rounded-[var(--radius-rounded-lg,24px)] object-cover",
                imageProps.className,
              )}
            />
          ) : (
            <span className="typography-bold-body-lg text-content-secondary">
              {title
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex min-h-px min-w-0 flex-1 flex-col gap-1">
          <div className="flex w-full shrink-0 items-center gap-3">
            <p className="typography-semibold-body-md min-w-0 flex-1 truncate text-content-primary">
              {title}
            </p>
            {showAdd ? (
              <Button
                type="button"
                variant="secondary"
                size="32"
                leftIcon={<AddIcon className="size-3.5" aria-hidden />}
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd?.();
                }}
                disabled={!onAdd}
                className="hidden shrink-0 rounded-full px-3 md:inline-flex"
              >
                {addLabel}
              </Button>
            ) : null}
          </div>

          <p className="typography-regular-body-sm line-clamp-2 min-h-[35px] text-content-secondary">
            {description}
          </p>

          <div className="flex w-full shrink-0 flex-wrap items-center gap-2">
            {showReviews && (
              <div className="flex items-center gap-2">
                <StarIcon className="size-3.5 shrink-0 text-content-primary" aria-hidden />
                <span className="typography-regular-body-sm inline-flex gap-1 whitespace-nowrap text-center">
                  <span className="text-content-primary">{rating}</span>
                  <span className="text-content-secondary">({reviewCount})</span>
                </span>
              </div>
            )}

            <div className="flex min-w-0 flex-1 items-center gap-1">
              {showInstalls && (
                <span className="inline-flex shrink-0 items-center gap-1">
                  <DownloadIcon className="size-3.5 text-content-primary" aria-hidden />
                  <span className="typography-regular-body-sm whitespace-nowrap text-content-primary">
                    {installCount}
                  </span>
                </span>
              )}
              {planLabel ? (
                <p className="typography-regular-body-sm min-w-0 flex-1 truncate text-content-secondary">
                  {planLabel}
                </p>
              ) : null}
            </div>

            {category ? (
              <Badge
                variant="default"
                leftDot={false}
                className="typography-semibold-badge h-5 text-content-primary"
              >
                {category}
              </Badge>
            ) : null}
          </div>
        </div>
      </>
    );

    if (onClick) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={onClick}
          className={cn(cardClassName, className)}
        >
          {content}
        </button>
      );
    }

    return (
      <div ref={ref as React.Ref<HTMLDivElement>} className={cn(cardClassName, className)}>
        {content}
      </div>
    );
  },
);
ItemCard.displayName = "ItemCard";
