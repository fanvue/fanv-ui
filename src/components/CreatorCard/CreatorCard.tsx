import * as React from "react";
import { cn } from "../../utils/cn";
import { Avatar } from "../Avatar/Avatar";

export interface CreatorCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** URL of the background media (image or video poster). */
  imageSrc: string;
  /** Alt text for the background image. @default "" */
  imageAlt?: string;
  /** Creator display name shown as the heading. */
  name: string;
  /** Optional secondary line shown below the name (e.g. role or tagline). */
  description?: string;
  /** Avatar props forwarded to the inner {@link Avatar}. */
  avatar?: React.ComponentPropsWithoutRef<typeof Avatar>;
  /**
   * Action buttons rendered at the bottom of the card. Pass zero, one, or two
   * `Button` elements to render variants with no, one, or two CTAs.
   */
  actions?: React.ReactNode;
}

/**
 * A portrait media card highlighting a creator with avatar, name, optional
 * tagline, and up to two stacked action buttons over a background image.
 *
 * Pass zero, one, or two {@link Button} elements via `actions` to render the
 * no-button, single-button, or two-button variants.
 *
 * @example
 * ```tsx
 * <CreatorCard
 *   imageSrc="/creator.jpg"
 *   name="Jane Doe"
 *   description="MODEL & PODCASTER"
 *   avatar={{ src: "/avatar.jpg", alt: "Jane Doe", fallback: "JD" }}
 *   actions={
 *     <>
 *       <Button variant="brand" fullWidth>Join for free for 3 days</Button>
 *       <Button variant="primary" fullWidth>Follow for Free</Button>
 *     </>
 *   }
 * />
 * ```
 */
export const CreatorCard = React.forwardRef<HTMLDivElement, CreatorCardProps>(
  ({ className, imageSrc, imageAlt = "", name, description, avatar, actions, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative isolate flex aspect-290/450 w-full max-w-full flex-col justify-end overflow-hidden bg-bg-primary",
          className,
        )}
        {...props}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-bg-primary via-bg-primary/90 to-transparent",
            actions ? "h-3/5" : "h-1/3",
          )}
        />
        <div className="relative flex flex-col gap-4 p-4">
          <div className="flex items-center gap-4">
            <Avatar
              size={48}
              src={avatar?.src}
              alt={avatar?.alt ?? name}
              fallback={avatar?.fallback}
              {...avatar}
            />
            <div className="min-w-0 flex-1">
              <p className="typography-bold-heading-sm truncate text-content-primary">{name}</p>
              {description && (
                <p className="typography-semibold-body-sm truncate text-content-secondary dark:text-brand-primary-default">
                  {description}
                </p>
              )}
            </div>
          </div>
          {actions && <div className="flex flex-col gap-2">{actions}</div>}
        </div>
      </div>
    );
  },
);

CreatorCard.displayName = "CreatorCard";
