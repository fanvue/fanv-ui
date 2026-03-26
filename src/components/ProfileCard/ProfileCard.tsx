import * as React from "react";
import { cn } from "../../utils/cn";
import { Avatar } from "../Avatar/Avatar";
import { Button } from "../Button/Button";

export interface ProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Creator display name. */
  name: string;
  /** Creator username with or without `@` prefix. */
  username: string;
  /** Banner image URL. */
  bannerSrc: string;
  /** Avatar image URL. */
  avatarSrc: string;
  /** Avatar alt text. Defaults to the profile name. */
  avatarAlt?: string;
  /** Follow button label. @default "Follow" */
  followLabel?: string;
  /** Follow button click handler. */
  onFollowClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * Visual profile summary card with banner, avatar, identity text, and follow action.
 * Based on Fanvue exploration design frame.
 */
export const ProfileCard = React.forwardRef<HTMLDivElement, ProfileCardProps>(
  (
    {
      className,
      name,
      username,
      bannerSrc,
      avatarSrc,
      avatarAlt,
      followLabel = "Follow",
      onFollowClick,
      ...props
    },
    ref,
  ) => {
    const normalizedUsername = username.startsWith("@") ? username : `@${username}`;

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-3xl bg-surface-primary",
          "max-w-[361px]",
          className,
        )}
        data-testid="profile-card"
        {...props}
      >
        <img
          src={bannerSrc}
          alt=""
          aria-hidden="true"
          className="h-[200px] w-full object-cover"
          loading="lazy"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[90px] bg-black/20 backdrop-blur-xl"
        />

        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar src={avatarSrc} alt={avatarAlt ?? name} size={40} />
            <div className="min-w-0">
              <p className="typography-semibold-body-lg truncate text-content-white">{name}</p>
              <p className="typography-semibold-body-md truncate text-content-white">
                {normalizedUsername}
              </p>
            </div>
          </div>

          <Button
            variant="white"
            size="40"
            className="shrink-0"
            onClick={onFollowClick}
            aria-label={`Follow ${name}`}
          >
            {followLabel}
          </Button>
        </div>
      </div>
    );
  },
);

ProfileCard.displayName = "ProfileCard";
