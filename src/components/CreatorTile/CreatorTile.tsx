import * as React from "react";
import { cn } from "../../utils/cn";
import { Avatar } from "../Avatar/Avatar";

/** Width-to-height ratio preset for the tile. */
export type CreatorTileAspectRatio = "tall" | "medium" | "short" | "banner";

const ASPECT_RATIO_CLASSES: Record<CreatorTileAspectRatio, string> = {
  tall: "aspect-5/4",
  medium: "aspect-3/2",
  short: "aspect-9/5",
  banner: "aspect-5/2",
};

/**
 * Progressive blur over the scrim, ramping 0 to 32px across the bottom 60% of the tile.
 *
 * `backdrop-filter` applies one uniform radius and `mask-image` then varies the alpha of the
 * already-blurred result, so a single masked layer cross-fades a uniformly blurred copy rather
 * than ramping the radius. Sibling layers do ramp it: an element with `backdrop-filter` is a
 * backdrop root for its descendants, so nesting samples nothing, while each later sibling samples
 * everything painted before it inside the root's `isolate`. Radii therefore compound, in
 * quadrature, and the one-step overlap between adjacent masks keeps the effective radius
 * continuous instead of banding.
 *
 * Complete literal strings rather than interpolated radii, because Tailwind scans raw file text.
 * Arbitrary `[mask-image:…]` rather than the `mask-b-from-*` utilities, which need Tailwind 4.1
 * while the peer range is `^4.0.0` — on 4.0.x they emit nothing and every layer would blur the
 * whole tile at full radius.
 */
const SCRIM_BLUR_LAYER_CLASSES = [
  "pointer-events-none absolute inset-0 rounded-[inherit] backdrop-blur-[2px] [-webkit-mask-image:linear-gradient(to_bottom,transparent_40%,black_50%,black_60%,transparent_70%)] [mask-image:linear-gradient(to_bottom,transparent_40%,black_50%,black_60%,transparent_70%)]",
  "pointer-events-none absolute inset-0 rounded-[inherit] backdrop-blur-[4px] [-webkit-mask-image:linear-gradient(to_bottom,transparent_50%,black_60%,black_70%,transparent_80%)] [mask-image:linear-gradient(to_bottom,transparent_50%,black_60%,black_70%,transparent_80%)]",
  "pointer-events-none absolute inset-0 rounded-[inherit] backdrop-blur-[8px] [-webkit-mask-image:linear-gradient(to_bottom,transparent_60%,black_70%,black_80%,transparent_90%)] [mask-image:linear-gradient(to_bottom,transparent_60%,black_70%,black_80%,transparent_90%)]",
  "pointer-events-none absolute inset-0 rounded-[inherit] backdrop-blur-[16px] [-webkit-mask-image:linear-gradient(to_bottom,transparent_70%,black_80%,black_90%,transparent_100%)] [mask-image:linear-gradient(to_bottom,transparent_70%,black_80%,black_90%,transparent_100%)]",
  "pointer-events-none absolute inset-0 rounded-[inherit] backdrop-blur-[32px] [-webkit-mask-image:linear-gradient(to_bottom,transparent_80%,black_90%)] [mask-image:linear-gradient(to_bottom,transparent_80%,black_90%)]",
];

/**
 * Transparent to 88%-opaque `#151515`, starting at 40% of the height. The primitive carries the
 * colour because the `blackalpha` ramp has no 88% step (800/900/950 only) and no gradient token
 * matches; `theme.css` is generated from a Figma export, so the step cannot be added by hand.
 */
const SCRIM_GRADIENT_CLASS =
  "pointer-events-none absolute inset-0 rounded-[inherit] bg-linear-to-b from-transparent from-40% to-[var(--primitives-color-gray-black)]/88";

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
   * - `tall` – 5:4, closest to square
   * - `medium` – 3:2 landscape
   * - `short` – 9:5 landscape
   * - `banner` – 5:2, the slimmest preset
   *
   * The profile row is a fixed ~74px tall, so `banner` needs at least 185px of
   * width before the ratio makes the tile shorter than its own row and the top
   * of the row is clipped. The taller presets reach that floor at widths too
   * narrow to be practical.
   *
   * Separately, the scrim starts at 40% of the height, so below roughly 308px of
   * width a `banner` tile's row rises above it and its top edge sits on unscrimmed
   * media. `medium` reaches that at 185px, the other presets narrower still.
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
        <div className={SCRIM_GRADIENT_CLASS} />
        {SCRIM_BLUR_LAYER_CLASSES.map((layerClassName) => (
          <div key={layerClassName} className={layerClassName} />
        ))}
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
