import * as React from "react";
import { cn } from "../../utils/cn";
import { Play2Icon } from "../Icons/Play2Icon";

export interface MediaPlayChipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /**
   * Length of the video in seconds, shown next to the icon as mm:ss, or
   * hh:mm:ss from an hour. Lengths under a second are not shown.
   */
  duration?: number;
}

/**
 * A video's length as the chip shows it: `mm:ss`, or `hh:mm:ss` from an hour.
 * Returns `undefined` for a missing, non-finite or sub-second length. Use it to
 * put the same length in the label of the tile the chip sits on.
 *
 * @example
 * ```ts
 * formatPlayChipDuration(42); // "00:42"
 * formatPlayChipDuration(3725); // "01:02:05"
 * ```
 */
export function formatPlayChipDuration(duration?: number): string | undefined {
  if (duration === undefined || !Number.isFinite(duration) || duration < 1) return undefined;
  const total = Math.floor(duration);
  const parts = [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60];
  return (parts[0] ? parts : parts.slice(1)).map((part) => String(part).padStart(2, "0")).join(":");
}

/**
 * Marks a video tile with a play icon and its length, or a 32px circle with the
 * icon alone when the length is unknown. The chip is decorative, so the tile it
 * sits on carries the label and the action. It is white on a translucent white
 * fill on every theme, as it sits over media rather than the page.
 *
 * The chip has no position of its own; the host places it, e.g. centred with
 * `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`.
 *
 * @example
 * ```tsx
 * <button
 *   type="button"
 *   aria-label={[alt, formatPlayChipDuration(duration)].filter(Boolean).join(", ")}
 *   className="relative"
 * >
 *   <img src={poster} alt="" />
 *   <MediaPlayChip
 *     duration={duration}
 *     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
 *   />
 * </button>
 * ```
 */
export const MediaPlayChip = React.forwardRef<HTMLSpanElement, MediaPlayChipProps>(
  ({ duration, className, ...props }, ref) => {
    const length = formatPlayChipDuration(duration);

    return (
      <span
        ref={ref}
        aria-hidden
        className={cn(
          "pointer-events-none inline-flex h-8 min-w-8 items-center justify-center gap-2 rounded-full bg-[var(--primitives-color-whitealpha-100)] text-icons-always-white backdrop-blur-[20px]",
          length ? "px-3" : "w-8",
          className,
        )}
        {...props}
      >
        <Play2Icon size={16} filled />
        {length ? (
          <span className="typography-body-small-14px-semibold whitespace-nowrap tabular-nums">
            {length}
          </span>
        ) : null}
      </span>
    );
  },
);

MediaPlayChip.displayName = "MediaPlayChip";
