import * as React from "react";
import { cn } from "../../utils/cn";
import { OnlineBlinkingIcon } from "../OnlineBlinkingIcon/OnlineBlinkingIcon";

export interface ProfileOnlineStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visible status label rendered next to the indicator. @default "Online" */
  label?: string;
}

/**
 * Inline online-status indicator: a pulsing dot followed by a label. Used by
 * {@link UserDisplayNameContainer} when `showOnlineStatus` is set.
 */
export const ProfileOnlineStatus = React.forwardRef<HTMLSpanElement, ProfileOnlineStatusProps>(
  ({ className, label = "Online", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "typography-description-12px-regular ml-2 inline-flex items-center gap-1 text-success-content",
        className,
      )}
      {...props}
    >
      <OnlineBlinkingIcon />
      {label}
    </span>
  ),
);

ProfileOnlineStatus.displayName = "ProfileOnlineStatus";
