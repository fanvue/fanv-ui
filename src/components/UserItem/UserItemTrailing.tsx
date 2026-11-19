import * as React from "react";
import { cn } from "../../utils/cn";

/** Props for {@link UserItemTrailing}. */
export interface UserItemTrailingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The headline figure — an amount, a count, a percentage. */
  value: React.ReactNode;
  /** Optional supporting line under the value, such as a timestamp. */
  meta?: React.ReactNode;
}

/**
 * The end-of-row block for a {@link UserItem}: a value with an optional
 * supporting line beneath it, both aligned to the right edge so figures line up
 * down a list.
 *
 * Pass it to {@link UserItem}'s `trailing` slot rather than composing the two
 * lines at each call site, so value and meta typography stay consistent
 * wherever a list row carries a figure.
 *
 * @example
 * ```tsx
 * <UserItem
 *   user={user}
 *   showHandle={false}
 *   trailing={<UserItemTrailing value="$421.32" meta="7 hours ago" />}
 * />
 * ```
 */
export const UserItemTrailing = React.forwardRef<HTMLDivElement, UserItemTrailingProps>(
  ({ value, meta, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col items-end", className)} {...props}>
        <span className="typography-body-small-14px-semibold text-content-primary">{value}</span>
        {meta && (
          <span className="typography-description-12px-regular text-content-secondary">{meta}</span>
        )}
      </div>
    );
  },
);

UserItemTrailing.displayName = "UserItemTrailing";
