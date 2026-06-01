import * as React from "react";
import { cn } from "../../utils/cn";
import { Avatar } from "../Avatar/Avatar";

/** Width-to-height ratio preset for the tile. */
export type CreatorTileAspectRatio = "tall" | "medium" | "short";

const ASPECT_RATIO_CLASSES: Record<CreatorTileAspectRatio, string> = {
  tall: "aspect-5/4",
  medium: "aspect-3/2",
  short: "aspect-9/5",
};

export interface CreatorTileProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Decorative background media rendered behind the creator content. */
  background: React.ReactNode;
  /** Creator display name shown as the prominent heading. */
  name: React.ReactNode;
  /** Optional secondary line shown under the name (e.g. handle or tagline). */
  tagline?: React.ReactNode;
  /** Avatar props forwarded to the inner {@link Avatar}. */
  avatar?: React.ComponentPropsWithoutRef<typeof Avatar>;
  /**
   * Action element rendered on the right of the profile row (e.g. a `Button`
   * for following the creator).
   */
  action?: React.ReactNode;
  /**
   * Width-to-height ratio preset.
   *
   * - `tall` – 1:2 narrow portrait
   * - `medium` – 361:200 landscape banner (default)
   * - `short` – 4:5 closer to square
   *
   * @default "medium"
   */
  aspectRatio?: CreatorTileAspectRatio;
}

/**
 * A visual highlight tile showcasing a creator with a full-bleed background
 * media and an overlaid profile row containing an avatar, name, optional
 * tagline and an action element.
 *
 * @example
 * ```tsx
 * <CreatorTile
 *   background={<img src="/creator.jpg" alt="" />}
 *   avatar={{ src: "/avatar.jpg", alt: "Aitana Lopez", fallback: "AL" }}
 *   name="Aitana Lopez"
 *   tagline="@fit_aitana"
 *   action={<Button variant="primary">Follow</Button>}
 * />
 * ```
 */
export const CreatorTile = React.forwardRef<HTMLDivElement, CreatorTileProps>(
  (
    { className, background, name, tagline, avatar, action, aspectRatio = "medium", ...props },
    ref,
  ) => {
    const aspectClass = ASPECT_RATIO_CLASSES[aspectRatio];

    return (
      <div
        ref={ref}
        className={cn(
          "relative isolate flex w-full flex-col justify-end overflow-hidden",
          aspectClass,
          className,
        )}
        {...props}
      >
        <div className="pointer-events-none absolute inset-0 select-none *:h-full *:w-full [&>img]:object-cover [&>video]:object-cover">
          {background}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 rounded-b-[inherit] bg-linear-to-t from-black/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 overflow-hidden rounded-b-[inherit] backdrop-blur-md [-webkit-mask-image:linear-gradient(to_top,black,transparent)] [mask-image:linear-gradient(to_top,black,transparent)]" />
        <div className="relative flex items-center justify-between gap-4 p-4">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar
              size={40}
              src={avatar?.src}
              alt={avatar?.alt ?? (typeof name === "string" ? name : undefined)}
              fallback={avatar?.fallback}
              {...avatar}
            />
            <div className="flex min-w-0 flex-col">
              <p className="typography-body-default-16px-semibold m-0 truncate text-white">
                {name}
              </p>
              {tagline ? (
                <p className="typography-body-small-14px-semibold m-0 truncate text-white/50">
                  {tagline}
                </p>
              ) : null}
            </div>
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </div>
    );
  },
);

CreatorTile.displayName = "CreatorTile";
