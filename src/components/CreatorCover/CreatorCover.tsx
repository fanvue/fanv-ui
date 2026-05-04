import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../Button/Button";

/** Slot that accepts a string (rendered as default styling) or a node for full control. */
export type CreatorCoverSlot = string | React.ReactNode;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

export interface CreatorCoverProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** URL of the creator image displayed in the centre card. Also used as the blurred backdrop unless `backgroundSrc` is provided. */
  imageSrc: string;
  /** Alt text for the centre cover image. @default "" */
  imageAlt?: string;
  /** Override URL used for the blurred background image. @default `imageSrc` */
  backgroundSrc?: string;
  /** Creator's name, rendered as the heading. */
  name: string;
  /** Smaller subtitle below the name (e.g. "GLOBAL POPSTAR"). Rendered uppercase in the brand colour. */
  tagline?: string;
  /**
   * Status label rendered as a pill overlapping the bottom of the cover image (e.g. "New Joiner").
   * Strings render with default green pill styling; pass a node for custom markup.
   */
  tag?: CreatorCoverSlot;
  /**
   * Primary call to action displayed below the title.
   * A string renders a full-width white {@link Button} with that label; pass a node for links, loading, etc.
   */
  action?: CreatorCoverSlot;
  /** When `true`, removes the `rounded-xl` border radius from the container. @default false */
  square?: boolean;
  /** When `true`, fades the bottom of the component to transparent and increases bottom padding to 64px. @default false */
  fadeBottom?: boolean;
}

/**
 * A creator profile hero with a stylised blurred backdrop, central cover image,
 * status pill, name, tagline, and primary call to action.
 *
 * @example
 * ```tsx
 * <CreatorCover
 *   imageSrc="/creator.jpg"
 *   imageAlt="Jane Doe"
 *   name="JANE DOE"
 *   tagline="GLOBAL POPSTAR"
 *   tag="New Joiner"
 *   action="Join for free for 7 days"
 * />
 * ```
 */
export const CreatorCover = React.forwardRef<HTMLElement, CreatorCoverProps>(
  (
    {
      className,
      imageSrc,
      imageAlt = "",
      backgroundSrc,
      name,
      tagline,
      tag,
      action,
      square = false,
      fadeBottom = false,
      ...props
    },
    ref,
  ) => {
    const headingId = React.useId();

    const renderedTag = isNonEmptyString(tag) ? (
      <span className="typography-semibold-body-sm inline-flex items-center justify-center whitespace-nowrap rounded-full bg-brand-primary-default px-3 py-2 text-content-on-brand">
        {tag}
      </span>
    ) : (
      tag
    );

    const renderedAction = isNonEmptyString(action) ? (
      <Button variant="white" size="48" fullWidth>
        {action}
      </Button>
    ) : (
      action
    );

    return (
      <section
        ref={ref}
        aria-labelledby={headingId}
        data-testid="creator-cover"
        className={cn(
          "relative isolate w-full overflow-hidden bg-white dark:bg-bg-primary",
          !square && "rounded-xl",
          className,
        )}
        {...props}
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <img
            src={backgroundSrc ?? imageSrc}
            alt=""
            decoding="async"
            className="size-full scale-110 object-cover blur-3xl"
          />
          <div className="absolute inset-0 bg-linear-to-b from-white/30 dark:from-bg-primary/30 to-white/15 dark:to-bg-primary/15" />
          {fadeBottom && (
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent to-white dark:to-bg-primary" />
          )}
        </div>
        <div
          className={cn(
            "mx-auto flex max-w-90 flex-col items-center gap-4 px-4 pt-17",
            fadeBottom ? "pb-16" : "pb-4",
          )}
        >
          <div className="relative">
            <img
              src={imageSrc}
              alt={imageAlt}
              decoding="async"
              className="block h-55 w-37.5 rounded-lg object-cover"
            />
            {renderedTag ? (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                {renderedTag}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col items-center gap-1 pt-4 text-center">
            <h2 id={headingId} className="typography-bold-heading-md m-0 text-white">
              {name}
            </h2>
            {tagline ? (
              <p className="typography-semibold-badge m-0 text-brand-primary-default uppercase">
                {tagline}
              </p>
            ) : null}
          </div>
          {renderedAction ? <div className="w-full pt-2">{renderedAction}</div> : null}
        </div>
      </section>
    );
  },
);

CreatorCover.displayName = "CreatorCover";
