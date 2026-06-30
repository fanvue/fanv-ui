import * as React from "react";
import { getInitials } from "../../utils/getInitials";
import { Avatar } from "../Avatar/Avatar";
import { BellOffIcon } from "../Icons/BellOffIcon";
import { UserDisplayNameContainer } from "../UserDisplayNameContainer/UserDisplayNameContainer";
import { UserHandleTypography } from "../UserHandleTypography/UserHandleTypography";

const AVATAR_SIZES = [16, 24, 32, 40, 48, 64, 88, 148] as const;
type AvatarSizeToken = (typeof AVATAR_SIZES)[number];

/** Snap an arbitrary pixel size to the nearest supported {@link Avatar} size token. */
const getNearestAvatarSize = (size: number): AvatarSizeToken =>
  AVATAR_SIZES.reduce((prev, curr) =>
    Math.abs(curr - size) < Math.abs(prev - size) ? curr : prev,
  );

/** Minimal user shape consumed by {@link UserItem}. */
export type UserItemUser = {
  avatarUri?: { url: string; url2x?: string };
  displayName: string;
  handle: string;
  nickname?: string;
};

export interface UserItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The user to display. */
  user: UserItemUser;
  /** Desired avatar size in px; snapped to the nearest supported token. @default 48 */
  avatarSize?: number;
  /** Show the muted indicator in the bottom-left corner. @default false */
  isMuted?: boolean;
  /** Whether the user is online (only shown when `showOnlineStatus` is also set). @default false */
  isOnline?: boolean;
  /** Render the avatar. @default true */
  showAvatar?: boolean;
  /** Render the handle line under the display name. @default true */
  showHandle?: boolean;
  /** Enable the avatar online indicator (combined with `isOnline`). */
  showOnlineStatus?: boolean;
}

/**
 * A compact user row showing an avatar, display name (or nickname) and handle,
 * with optional online and muted indicators.
 *
 * @example
 * ```tsx
 * <UserItem user={{ displayName: "Jane Doe", handle: "jane_doe" }} />
 * ```
 */
export const UserItem = React.forwardRef<HTMLDivElement, UserItemProps>(
  (
    {
      user,
      avatarSize,
      isOnline = false,
      isMuted = false,
      showOnlineStatus,
      showHandle = true,
      showAvatar = true,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className="relative flex w-full items-center justify-start px-2 py-1"
        {...props}
      >
        {isMuted && (
          <div className="absolute bottom-0 left-0 z-1 flex rounded-xs bg-surface-primary p-1">
            <BellOffIcon size={16} />
          </div>
        )}
        {showAvatar && (
          <Avatar
            size={getNearestAvatarSize(avatarSize || 48)}
            src={user.avatarUri?.url}
            alt={user.displayName}
            fallback={getInitials(user.displayName)}
            onlineIndicator={Boolean(showOnlineStatus && isOnline)}
          />
        )}
        <div className="flex-1 overflow-hidden pl-2">
          <UserDisplayNameContainer>{user.nickname || user.displayName}</UserDisplayNameContainer>
          {showHandle && <UserHandleTypography>{user.handle}</UserHandleTypography>}
        </div>
      </div>
    );
  },
);

UserItem.displayName = "UserItem";
