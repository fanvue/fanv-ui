import * as React from "react";
import { cn } from "../../utils/cn";
import { VerifiedIcon } from "../Icons/VerifiedIcon";
import { ProfileOnlineStatus } from "../ProfileOnlineStatus/ProfileOnlineStatus";

export interface UserDisplayNameProps extends React.HTMLAttributes<HTMLElement> {
  /** Render an ambassador badge after the name. */
  ambassador?: boolean;
  /** Accessible label for the ambassador badge. @default "Ambassador" */
  ambassadorLabel?: string;
  /** HTML element used for the root wrapper. @default "span" */
  component?: "span" | "h1" | "h2" | "h3" | "p" | "div";
  /** Truncate the display name on a single line. @default true */
  noWrap?: boolean;
  /** Accessible label for the online-status indicator. @default "Online" */
  onlineLabel?: string;
  /** Render the inline online-status indicator after the name. @default false */
  showOnlineStatus?: boolean;
  /** Render a verified badge after the name (ignored when `ambassador` is set). */
  verified?: boolean;
  /** Accessible label for the verified badge. @default "Verified" */
  verifiedLabel?: string;
}

/**
 * Renders a user's display name with optional ambassador/verified badges and an
 * online-status indicator. Only the name shrinks and truncates; trailing badges
 * and the online-status indicator stay visible on the same line.
 *
 * Typography is not baked in: pass a `typography-*` utility via `className` on
 * the root and the name inherits it. Use `typography-body-small-14px-semibold`
 * for the standard display-name scale.
 *
 * When both `ambassador` and `verified` are set, the ambassador badge takes
 * precedence. Its tint uses `text-success-content` (not `text-icons-brand-green`)
 * so the green darkens in light mode and lightens in dark mode, matching
 * {@link ProfileOnlineStatus}; `text-icons-brand-green` is fixed across modes.
 *
 * @example
 * ```tsx
 * <UserDisplayName className="typography-body-small-14px-semibold">Jane Doe</UserDisplayName>
 * ```
 */
export const UserDisplayName = React.forwardRef<HTMLElement, UserDisplayNameProps>(
  (
    {
      ambassador,
      ambassadorLabel = "Ambassador",
      children,
      className,
      component = "span",
      noWrap = true,
      onlineLabel = "Online",
      showOnlineStatus,
      verified,
      verifiedLabel = "Verified",
      ...props
    },
    ref,
  ) => {
    const Component = component as React.ElementType;

    const badge = ambassador
      ? { label: ambassadorLabel, tint: "text-success-content" }
      : verified
        ? { label: verifiedLabel, tint: "text-content-primary" }
        : null;

    return (
      <Component
        ref={ref}
        className={cn("inline-flex max-w-full items-center", className)}
        {...props}
      >
        <span className={cn("min-w-0", noWrap && "truncate")}>{children}</span>
        {badge && (
          <span
            role="img"
            aria-label={badge.label}
            className={cn("ml-2 inline-flex shrink-0 items-center", badge.tint)}
          >
            <VerifiedIcon size={16} />
          </span>
        )}
        {showOnlineStatus && <ProfileOnlineStatus label={onlineLabel} className="shrink-0 ml-2" />}
      </Component>
    );
  },
);

UserDisplayName.displayName = "UserDisplayName";
