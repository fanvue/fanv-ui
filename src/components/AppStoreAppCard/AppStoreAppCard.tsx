import { AddIcon, Badge, Button, cn, DownloadIcon, StarIcon } from "@fanvue/ui";
import type { ImgHTMLAttributes } from "react";

export interface AppStoreAppCardProps {
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
  className?: string;
}

/**
 * App listing row from Fanvue Library — App card. Below `md` (1280px): narrow max width, no Add. At `md+`: wider max width and optional Add.
 */
export function AppStoreAppCard({
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
  className,
}: AppStoreAppCardProps) {
  const showReviews = rating != null && reviewCount != null;
  const showInstalls = installCount != null;

  return (
    <div
      className={cn(
        "group flex w-full max-w-[343px] cursor-pointer items-start justify-end gap-5 rounded-[var(--radius-rounded-md,16px)] transition-colors md:max-w-[400px]",
        className,
      )}
    >
      <div className="relative box-border size-[72px] shrink-0 overflow-hidden rounded-[var(--radius-rounded-lg,24px)] border-2 border-transparent transition-colors group-hover:border-brand-primary-hover">
        <img
          {...imageProps}
          alt={imageProps.alt ?? ""}
          className={cn(
            "pointer-events-none size-full max-w-none rounded-[var(--radius-rounded-lg,24px)] object-cover",
            imageProps.className,
          )}
        />
      </div>

      <div className="flex min-h-px min-w-0 flex-1 flex-col gap-1">
        <div className="flex w-full shrink-0 items-center gap-3">
          <p className="typography-semibold-body-md min-w-0 flex-1 truncate text-content-primary transition-colors group-hover:text-brand-primary-hover">
            {title}
          </p>
          {showAdd ? (
            <Button
              type="button"
              variant="secondary"
              size="32"
              leftIcon={<AddIcon className="size-3.5" aria-hidden />}
              onClick={onAdd}
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
    </div>
  );
}
