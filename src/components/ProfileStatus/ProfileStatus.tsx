import * as React from "react";
import { cn } from "../../utils/cn";

/** Size preset of the {@link ProfileStatus} indicator. */
export type ProfileStatusSize = "sm" | "md";

export interface ProfileStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Whether the profile is currently active. Active renders a pulsing green dot; inactive renders a static grey dot. @default true */
  active?: boolean;
  /** Size preset of the indicator. @default "sm" */
  size?: ProfileStatusSize;
}

const sizeClasses: Record<ProfileStatusSize, string> = {
  sm: "size-2",
  md: "size-3",
};

/**
 * Presence indicator showing whether a creator or fan is currently active.
 * The active state pulses to signal real-time presence; the inactive state is a
 * static, muted dot for lists, tables, and content views where presence is less
 * relevant.
 *
 * Decorative by default (`aria-hidden`) — pair it with a visible or visually
 * hidden label at the usage site. Pass `aria-label` to expose it as a
 * standalone image to assistive technology.
 *
 * Supersedes the V1 `OnlineBlinkingIcon`: `<ProfileStatus />` is a drop-in
 * replacement for `<OnlineBlinkingIcon />`, adding the distinct inactive state.
 *
 * @example
 * ```tsx
 * <ProfileStatus active />
 * <ProfileStatus active={false} size="md" />
 * <ProfileStatus active aria-label="Online" />
 * ```
 */
export const ProfileStatus = React.forwardRef<HTMLSpanElement, ProfileStatusProps>(
  ({ className, active = true, size = "sm", ...props }, ref) => {
    const hasAccessibleLabel = props["aria-label"] != null || props["aria-labelledby"] != null;

    return (
      <span
        ref={ref}
        role={hasAccessibleLabel ? "img" : undefined}
        aria-hidden={hasAccessibleLabel ? undefined : true}
        className={cn(
          "relative inline-block rounded-full border border-border-background",
          sizeClasses[size],
          active ? "bg-messages-status-active" : "bg-messages-status-inactive",
          className,
        )}
        {...props}
      >
        {active && (
          <span className="absolute inset-0 animate-ping rounded-full bg-messages-status-active opacity-75" />
        )}
      </span>
    );
  },
);

ProfileStatus.displayName = "ProfileStatus";
