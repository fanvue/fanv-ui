import * as React from "react";
import { cn } from "../../utils/cn";
import { Avatar } from "../Avatar/Avatar";
import { VerifiedIcon } from "../Icons/VerifiedIcon";
import { Pill, type PillProps } from "../Pill/Pill";

export interface CreatorCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
  /** Decorative banner media rendered at the top of the card. */
  background: React.ReactNode;
  /**
   * Props forwarded to a {@link Pill} overlaid on the top-left of the banner.
   * Pass the label as `children`. Omit to hide the pill.
   */
  pill?: PillProps;
  /** Avatar props forwarded to the inner {@link Avatar}. */
  avatar?: React.ComponentPropsWithoutRef<typeof Avatar>;
  /** Creator display name shown next to the avatar. */
  name: React.ReactNode;
  /** When `true`, renders a verified badge after the name. @default false */
  verified?: boolean;
  /** Accessible label for the verified badge. @default "Verified" */
  verifiedLabel?: string;
  /** Optional secondary line shown under the name (e.g. post count). */
  tagline?: React.ReactNode;
  /** Optional content shown under the creator details (e.g. the subscription price). */
  content?: React.ReactNode;
  /**
   * Action element rendered full-width at the bottom of the card (e.g. a
   * `Button` with `fullWidth` for subscribing to the creator).
   */
  action?: React.ReactNode;
}

/**
 * A card suggesting a creator, with a banner image, an optional {@link Pill},
 * the creator's avatar, name and tagline, free-form content such as a price,
 * and an optional action.
 *
 * The card has no fixed width or corner radius: set both through `className`
 * (e.g. `className="w-40 rounded-md"`). The banner keeps a 10:11 ratio at any
 * width.
 *
 * @example
 * ```tsx
 * <CreatorCard
 *   className="w-40 rounded-md"
 *   background={<img src="/banner.jpg" alt="" />}
 *   pill={{ variant: "contrast", children: "Popular this week" }}
 *   avatar={{ src: "/avatar.jpg", fallback: "AL" }}
 *   name="Aitana Lopez"
 *   verified
 *   tagline="412 posts"
 *   content="$9.99 / month"
 *   action={<Button variant="primary" size="32" fullWidth>Subscribe</Button>}
 * />
 * ```
 */
export const CreatorCard = React.forwardRef<HTMLDivElement, CreatorCardProps>(
  (
    {
      className,
      background,
      pill,
      avatar,
      name,
      verified = false,
      verifiedLabel = "Verified",
      tagline,
      content,
      action,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative isolate flex flex-col overflow-hidden bg-surface-primary",
          className,
        )}
        {...props}
      >
        <div className="relative aspect-10/11 w-full shrink-0 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 select-none *:h-full *:w-full [&>img]:object-cover [&>video]:object-cover">
            {background}
          </div>
          {pill ? (
            <Pill
              variant="contrast"
              {...pill}
              className={cn("absolute top-2 left-2 max-w-[calc(100%-1rem)]", pill.className)}
            />
          ) : null}
        </div>
        <div className="flex min-w-0 flex-col gap-2.5 p-3">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar
              size={32}
              src={avatar?.src}
              alt={avatar?.alt ?? (typeof name === "string" ? name : undefined)}
              fallback={avatar?.fallback}
              {...avatar}
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex min-w-0 items-center gap-1">
                <p className="typography-body-small-14px-semibold m-0 truncate text-content-primary">
                  {name}
                </p>
                {verified ? (
                  <span
                    role="img"
                    aria-label={verifiedLabel}
                    className="inline-flex shrink-0 text-content-primary"
                  >
                    <VerifiedIcon size={16} filled />
                  </span>
                ) : null}
              </div>
              {tagline ? (
                <p className="typography-body-small-14px-regular m-0 truncate text-content-secondary">
                  {tagline}
                </p>
              ) : null}
            </div>
          </div>
          {content ? (
            <div className="typography-body-small-14px-semibold min-w-0 truncate text-content-primary">
              {content}
            </div>
          ) : null}
          {action ? <div className="flex w-full">{action}</div> : null}
        </div>
      </div>
    );
  },
);

CreatorCard.displayName = "CreatorCard";
