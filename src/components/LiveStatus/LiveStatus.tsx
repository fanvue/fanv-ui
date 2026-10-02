import * as React from "react";
import { cn } from "../../utils/cn";

/** State shown by the live status badge. */
export type LiveStatusVariant = "live" | "ended" | "game";

export interface LiveStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** State shown by the badge. @default "live" */
  variant?: LiveStatusVariant;
}

const DEFAULT_LABELS: Record<LiveStatusVariant, string> = {
  live: "LIVE",
  ended: "LIVE ended",
  game: "Game",
};

/**
 * Status badge for experience embeds. `live` uses the live gradient and glow,
 * `ended` and `game` use flat surfaces. A dot indicator is shown for `live` and
 * `ended`. The label defaults per variant; pass `children` to localise it.
 *
 * @example
 * ```tsx
 * <LiveStatus variant="live" />
 * ```
 */
export const LiveStatus = React.forwardRef<HTMLSpanElement, LiveStatusProps>(
  ({ variant = "live", className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "typography-description-12px-semibold inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-xs px-2 py-1",
          variant === "live" &&
            "bg-[linear-gradient(205deg,var(--color-live-gradient-start)_-70%,var(--color-live-gradient-end)_81%)] text-content-always-white shadow-live-glow",
          variant === "ended" && "bg-live-ended-background text-live-ended-content",
          variant === "game" && "bg-buttons-always-white-default text-content-always-black",
          className,
        )}
        {...props}
      >
        {variant !== "game" && (
          <span aria-hidden="true" className="flex pl-0.5">
            <span className="size-1 rounded-full bg-current" />
          </span>
        )}
        {children ?? DEFAULT_LABELS[variant]}
      </span>
    );
  },
);

LiveStatus.displayName = "LiveStatus";
