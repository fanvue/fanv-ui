import * as React from "react";
import { formatTime } from "../../utils/audioWaveform";
import { cn } from "../../utils/cn";
import { Play2Icon } from "../Icons/Play2Icon";

export interface MediaPlayChipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Length of the video in seconds, shown as mm:ss next to the icon. */
  duration?: number;
}

/**
 * A video's length as the chip shows it (mm:ss), or `undefined` when there is
 * none. Use it to put the same length in the label of the tile the chip sits on.
 *
 * @example
 * ```ts
 * formatPlayChipDuration(42); // "00:42"
 * ```
 */
export function formatPlayChipDuration(duration?: number): string | undefined {
  return duration ? formatTime(duration).padStart(5, "0") : undefined;
}

/**
 * Marks a video tile with a play icon and its length, or a 32px circle with the
 * icon alone when the length is unknown. The chip is decorative, so the tile it
 * sits on carries the label and the action. It sets its own `dark` scope, so it
 * reads the same on any theme.
 *
 * The chip has no position of its own; the host places it, e.g. centred with
 * `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`.
 *
 * @example
 * ```tsx
 * <MediaPlayChip duration={42} />
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
          "dark pointer-events-none flex h-8 min-w-8 items-center justify-center gap-2 rounded-full bg-buttons-status-property-default text-icons-primary backdrop-blur-[20px]",
          length ? "px-3" : "w-8",
          className,
        )}
        {...props}
      >
        <Play2Icon size={16} filled />
        {length ? (
          <span className="typography-body-small-14px-semibold whitespace-nowrap text-content-primary tabular-nums">
            {length}
          </span>
        ) : null}
      </span>
    );
  },
);

MediaPlayChip.displayName = "MediaPlayChip";
