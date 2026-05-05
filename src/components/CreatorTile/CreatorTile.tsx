import * as React from "react";
import { cn } from "../../utils/cn";

/** Width-to-height ratio preset for the tile. */
export type CreatorTileAspectRatio = "tall" | "medium" | "short";

const ASPECT_RATIO_CLASSES: Record<CreatorTileAspectRatio, string> = {
  tall: "aspect-1/2",
  medium: "aspect-2/3",
  short: "aspect-4/5",
};

export interface CreatorTileProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Source URL of the creator's image. Rendered as the tile background. */
  imageSrc: string;
  /** Alt text for the creator image. Use an empty string for purely decorative imagery. */
  imageAlt?: string;
  /** Creator name shown as the prominent overlay heading. */
  name: React.ReactNode;
  /** Short tagline shown under the name in the brand accent color. */
  tagline?: React.ReactNode;
  /**
   * Width-to-height ratio preset.
   *
   * - `tall` – 1:2 narrow portrait
   * - `medium` – 2:3 classic poster (default)
   * - `short` – 4:5 closer to square
   *
   * @default "medium"
   */
  aspectRatio?: CreatorTileAspectRatio;
}

/**
 * A visual highlight tile showcasing a creator with an overlaid name and tagline.
 *
 * The tile renders a full-bleed image with a bottom gradient that ensures the
 * overlaid text remains legible regardless of the underlying photography.
 *
 * @example
 * ```tsx
 * <CreatorTile
 *   imageSrc="https://example.com/creator.jpg"
 *   imageAlt="Portrait of Jane Doe"
 *   name="JANE DOE"
 *   tagline="GLOBAL MUSIC ICON"
 * />
 * ```
 */
export const CreatorTile = React.forwardRef<HTMLDivElement, CreatorTileProps>(
  (
    { className, imageSrc, imageAlt = "", name, tagline, aspectRatio = "medium", ...props },
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
        <img
          src={imageSrc}
          alt={imageAlt}
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-64% from-transparent to-black/40" />
        <div className="flex flex-col gap-1 px-6 pb-6">
          <p className="m-0 font-black text-4xl text-white leading-none tracking-tight">{name}</p>
          {tagline ? (
            <p className="m-0 font-bold text-[9px] text-brand-primary-default uppercase leading-none">
              {tagline}
            </p>
          ) : null}
        </div>
      </div>
    );
  },
);

CreatorTile.displayName = "CreatorTile";
