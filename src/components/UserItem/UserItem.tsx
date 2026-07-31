import * as React from "react";
import { cn } from "../../utils/cn";
import { getInitials } from "../../utils/getInitials";
import { Avatar } from "../Avatar/Avatar";
import { BellOffIcon } from "../Icons/BellOffIcon";
import { UserDisplayName } from "../UserDisplayName/UserDisplayName";
import { UserHandle } from "../UserHandle/UserHandle";

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
  /** Render an AI-disclosure badge after the display name. @default false */
  aiDisclosure?: boolean;
  /** Accessible label for the AI-disclosure badge. @default "AI creator" */
  aiDisclosureLabel?: string;
  /** Render a verified badge after the display name. @default false */
  verified?: boolean;
  /** Accessible label for the verified badge. @default "Verified" */
  verifiedLabel?: string;
  /**
   * Content pinned to the end of the row — a value, count, timestamp or action.
   * It keeps its intrinsic width while the name block absorbs the remaining
   * space, so trailing content stays aligned down the rows of a list.
   *
   * Prefer {@link UserItemTrailing} over composing the lines yourself.
   */
  trailing?: React.ReactNode;
  /**
   * Replace the display-name line with arbitrary content, for rows that read as
   * a sentence about the user rather than their name — an activity feed entry,
   * for instance. Badges do not apply to custom content.
   */
  primary?: React.ReactNode;
  /**
   * A supporting line under the name, mirroring {@link UserItemTrailing}'s `meta`.
   * Both are block lines on the same 18px advance, so a row using `secondary` on
   * the left and `meta` on the right reads as two aligned tiers. Prefer it over
   * letting a long primary wrap, which mixes line heights and drifts out of step.
   */
  secondary?: React.ReactNode;
}

/**
 * A compact user row showing an avatar, display name (or nickname) and handle,
 * with optional verified and AI-disclosure badges and online and muted indicators.
 *
 * Pass {@link UserItemProps.trailing} to pin a value to the end of the row, the
 * shape most list rows need — top spenders, most active fans, a recent-activity
 * feed.
 *
 * @example
 * ```tsx
 * <UserItem user={{ displayName: "Jane Doe", handle: "jane_doe" }} />
 * ```
 *
 * @example A list row with a trailing value
 * ```tsx
 * <UserItem
 *   user={user}
 *   avatarSize={32}
 *   showHandle={false}
 *   trailing={<span className="typography-body-small-14px-semibold">$14,523.59</span>}
 * />
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
      aiDisclosure = false,
      aiDisclosureLabel,
      verified = false,
      verifiedLabel,
      trailing,
      primary,
      secondary,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn("relative flex w-full items-center justify-start px-2 py-1", className)}
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
          {primary ?? (
            <UserDisplayName
              aiDisclosure={aiDisclosure}
              aiDisclosureLabel={aiDisclosureLabel}
              verified={verified}
              verifiedLabel={verifiedLabel}
              className="typography-body-small-14px-semibold"
            >
              {user.nickname || user.displayName}
            </UserDisplayName>
          )}
          {secondary && (
            <p className="typography-description-12px-regular truncate text-content-secondary">
              {secondary}
            </p>
          )}
          {showHandle && <UserHandle>{user.handle}</UserHandle>}
        </div>
        {trailing && <div className="shrink-0 pl-2">{trailing}</div>}
      </div>
    );
  },
);

UserItem.displayName = "UserItem";
