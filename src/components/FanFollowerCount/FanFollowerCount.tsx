import * as React from "react";
import { cn } from "../../utils/cn";
import { DiamondIcon } from "../Icons/DiamondIcon";
import { HeartIcon } from "../Icons/HeartIcon";

const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function formatCount(value: number | string): string {
  return typeof value === "number" ? compactFormatter.format(value).toLowerCase() : value;
}

export interface FanFollowerCountProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Fan count. Numbers are compacted (e.g. `1200` → `"1.2k"`); strings render verbatim. @default 0 */
  fans?: number | string;
  /** Subscriber count. Numbers are compacted (e.g. `3000` → `"3k"`); strings render verbatim. @default 0 */
  subs?: number | string;
  /** Show the fan count group. @default true */
  showFans?: boolean;
  /** Show the subscriber count group. @default true */
  showSubs?: boolean;
  /** Label rendered after the fan count. @default "Fans" */
  fansLabel?: string;
  /** Label rendered after the subscriber count. @default "Subs" */
  subsLabel?: string;
}

/**
 * Displays a creator's formatted fan and subscriber counts, each paired with an
 * icon. Numeric values are compacted (`1200` → `"1.2k"`); pass a pre-formatted
 * string to bypass formatting. Either group can be hidden independently.
 *
 * @example
 * ```tsx
 * <FanFollowerCount fans={1200} subs={3000} />
 * ```
 */
export const FanFollowerCount = React.forwardRef<HTMLDivElement, FanFollowerCountProps>(
  (
    {
      className,
      fans = 0,
      subs = 0,
      showFans = true,
      showSubs = true,
      fansLabel = "Fans",
      subsLabel = "Subs",
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn("inline-flex items-center gap-3", className)} {...props}>
        {showFans && (
          <span className="inline-flex items-center gap-2">
            <HeartIcon size={16} className="text-icons-tertiary" />
            <span className="typography-body-small-14px-semibold inline-flex items-center gap-1 text-content-primary">
              <span>{formatCount(fans)}</span>
              <span>{fansLabel}</span>
            </span>
          </span>
        )}
        {showSubs && (
          <span className="inline-flex items-center gap-2">
            <DiamondIcon size={16} className="text-icons-tertiary" />
            <span className="typography-body-small-14px-semibold inline-flex items-center gap-1 text-content-primary">
              <span>{formatCount(subs)}</span>
              <span>{subsLabel}</span>
            </span>
          </span>
        )}
      </div>
    );
  },
);

FanFollowerCount.displayName = "FanFollowerCount";
