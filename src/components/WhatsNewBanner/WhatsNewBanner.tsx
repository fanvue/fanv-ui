import * as React from "react";
import { cn } from "@/utils/cn";
import { Button } from "../Button/Button";
import { ArrowRightIcon } from "../Icons/ArrowRightIcon";

/** Layout variant controlling orientation and image size of the banner. */
export type WhatsNewBannerVariant = "portrait" | "landscape" | "landscape-small";

export interface WhatsNewBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Layout variant controlling orientation and image size. @default "portrait" */
  variant?: WhatsNewBannerVariant;
  /** Heading text displayed in the banner. */
  title: string;
  /** Supporting description displayed below the title. */
  description: string;
  /** Label text for the call-to-action. When empty, the CTA is hidden. @default "See how it works" */
  ctaLabel?: string;
  /** URL the CTA navigates to. When omitted, the CTA renders as a `<button>`. */
  ctaHref?: string;
  /** Callback fired when the CTA is clicked. */
  onCtaClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** URL of the preview image shown in the banner. */
  imageSrc: string;
  /** Accessible description of the preview image. @default "" */
  imageAlt?: string;
}

/**
 * A promotional banner used to highlight new features, displayed in three
 * layout variants: `portrait` (stacked), `landscape` (side-by-side), and
 * `landscape-small` (side-by-side with a smaller image).
 *
 * @example
 * ```tsx
 * <WhatsNewBanner
 *   variant="landscape"
 *   title="Perfectly proportioned"
 *   description="Aspect ratio selection is here!"
 *   ctaLabel="See how it works"
 *   ctaHref="/features/aspect-ratio"
 *   imageSrc="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=264&h=264&fit=crop"
 *   imageAlt="Feature preview"
 * />
 * ```
 */
export const WhatsNewBanner = React.forwardRef<HTMLDivElement, WhatsNewBannerProps>(
  (
    {
      variant = "portrait",
      title,
      description,
      ctaLabel = "See how it works",
      ctaHref,
      onCtaClick,
      imageSrc,
      imageAlt = "",
      className,
      ...props
    },
    ref,
  ) => {
    const isPortrait = variant === "portrait";
    const isLandscapeSmall = variant === "landscape-small";

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-4 rounded-2xl p-4",
          isPortrait
            ? "flex-col border border-neutral-50 bg-background-white-solid-constant"
            : cn("flex-row bg-brand-purple-50", isLandscapeSmall ? "items-start" : "items-center"),
          className,
        )}
        {...props}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className={cn(
            "shrink-0 rounded-lg object-cover",
            isLandscapeSmall ? "size-20" : "size-[132px]",
          )}
        />

        <div className={cn("flex flex-col gap-2", !isPortrait && "min-w-0 flex-1")}>
          <p
            className={cn(
              "text-body-300",
              isPortrait ? "typography-body-1-semibold" : "typography-subtitle",
            )}
          >
            {title}
          </p>

          <p className="typography-body-2-regular text-body-300">{description}</p>

          {ctaLabel && (
            <Button
              variant="text"
              size="32"
              rightIcon={<ArrowRightIcon className="size-3" aria-hidden="true" />}
              onClick={onCtaClick}
              asChild={!!ctaHref}
              className="w-fit"
            >
              {ctaHref ? <a href={ctaHref}>{ctaLabel}</a> : ctaLabel}
            </Button>
          )}
        </div>
      </div>
    );
  },
);

WhatsNewBanner.displayName = "WhatsNewBanner";
