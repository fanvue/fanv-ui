import * as React from "react";
import { cn } from "../../utils/cn";
import { AiDisclosureBadge } from "../AiDisclosureBadge/AiDisclosureBadge";
import { Avatar, type AvatarProps } from "../Avatar/Avatar";
import { Skeleton } from "../Skeleton/Skeleton";
import { UserDisplayName } from "../UserDisplayName/UserDisplayName";

/** Layout of the embed: a creator profile card or a fan experience card. */
export type ChatEmbedVariant = "creator" | "experience";

/** Overlapping avatars and copy showing who else is taking part. */
export interface ChatEmbedSocialProof {
  /** Avatars shown in the overlapping stack, left to right. */
  avatars: AvatarProps[];
  /** Name shown in bold before the label, truncated at 120px. */
  name?: React.ReactNode;
  /** Copy shown after the name, e.g. "+2 watching". */
  label: React.ReactNode;
}

interface ChatEmbedBaseProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onClick"> {
  /** Media filling the card, typically an `img` or `video`, over a dark surface. */
  media?: React.ReactNode;
  /** Still image blurred behind `verticalMedia`, e.g. the same image or a video's poster frame. */
  mediaBackdrop?: React.ReactNode;
  /** Frame portrait media in a centred 9:16 column over `mediaBackdrop`. @default false */
  verticalMedia?: boolean;
  /** Avatar shown at the start of the profile row. */
  avatar?: AvatarProps;
  /** Primary line of the profile row: a display name or an experience title. */
  title: React.ReactNode;
  /** Secondary line under the title, e.g. a handle or "Made by @jane_doe". */
  subtitle?: React.ReactNode;
  /** Show the verified badge on the creator line. @default false */
  verified?: boolean;
  /** Show the EU AI-disclosure badge on the creator line. @default false */
  aiDisclosure?: boolean;
  /** Accessible label for the AI-disclosure badge. @default "AI creator" */
  aiDisclosureLabel?: string;
  /** Action at the end of the profile row, typically a `Button` with `variant="white"` and `size="32"`. */
  action?: React.ReactNode;
  /** Badge in the top-left corner, typically a {@link LiveStatus}. */
  badge?: React.ReactNode;
  /** Short category label shown as a tag after the badge, e.g. "Game" or "Audio". */
  category?: React.ReactNode;
  /** Short copy in a translucent pill in the top-right corner, e.g. "2 hours ago". */
  meta?: React.ReactNode;
  /** Renders the media in greyscale, e.g. once a live has ended. @default false */
  inactive?: boolean;
}

interface ChatEmbedLinkProps {
  /** Makes the whole card a link to this URL, named by the title. */
  href: string;
  /** Where to open `href`; `"_blank"` adds `rel="noopener noreferrer"`. */
  target?: React.HTMLAttributeAnchorTarget;
  /** Not available with `href`. */
  onOpen?: never;
}

interface ChatEmbedButtonProps {
  /** Not available with `onOpen`. */
  href?: never;
  /** Not available with `onOpen`. */
  target?: never;
  /** Makes the whole card a button named by the title, e.g. to open a dialog. */
  onOpen?: () => void;
}

interface ChatEmbedCreatorProps extends ChatEmbedBaseProps {
  /** Layout of the embed. @default "creator" */
  variant?: "creator";
  /** Only available on the `experience` variant. */
  socialProof?: never;
}

interface ChatEmbedExperienceProps extends ChatEmbedBaseProps {
  /** Layout of the embed. */
  variant: "experience";
  /** Social proof row shown above the profile row. */
  socialProof?: ChatEmbedSocialProof;
}

/** Props for {@link ChatEmbed}. `socialProof` is only accepted on `experience`, and `href` and `onOpen` are exclusive. */
export type ChatEmbedProps = (ChatEmbedCreatorProps | ChatEmbedExperienceProps) &
  (ChatEmbedLinkProps | ChatEmbedButtonProps);

export interface ChatEmbedSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Layout to match while the embed loads. @default "creator" */
  variant?: ChatEmbedVariant;
  /** Visually hidden text read by screen readers in place of the placeholder. @default "Loading" */
  label?: string;
}

export interface ChatEmbedUnavailableProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Layout to match the embed it replaces. @default "creator" */
  variant?: ChatEmbedVariant;
  /** Icon shown above the message. */
  icon?: React.ReactNode;
}

const FRAME =
  "relative isolate flex w-full max-w-100 flex-col overflow-hidden rounded-sm after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-[inherit] after:border after:border-neutral-alphas-100";

const HEIGHT: Record<ChatEmbedVariant, string> = {
  creator: "h-40",
  experience: "h-[239px]",
};

const SCRIM_FADE =
  "bg-linear-to-b from-transparent via-40% via-[color-mix(in_srgb,var(--color-content-always-black)_40%,transparent)] to-[color-mix(in_srgb,var(--color-content-always-black)_88%,transparent)]";

const SCRIM_SOFT =
  "bg-linear-to-b from-transparent via-40% via-[color-mix(in_srgb,var(--color-content-always-black)_24%,transparent)] to-[color-mix(in_srgb,var(--color-content-always-black)_40%,transparent)]";

const PROGRESSIVE_BLUR = [
  "backdrop-blur-[4px] [mask-image:linear-gradient(to_bottom,transparent_13%,black_42%)]",
  "backdrop-blur-[8px] [mask-image:linear-gradient(to_bottom,transparent_42%,black_71%)]",
  "backdrop-blur-[12px] [mask-image:linear-gradient(to_bottom,transparent_71%,black)]",
];

const MEDIA_FILL = "*:size-full [&>img]:object-cover [&>video]:object-cover";

const OVERLAY =
  "absolute inset-0 z-[1] cursor-pointer rounded-[inherit] focus-visible:shadow-focus-ring focus-visible:outline-none";

const DEFAULT_UNAVAILABLE: Record<ChatEmbedVariant, string> = {
  creator: "This profile is no longer available",
  experience: "This experience is no longer available",
};

function SocialProof({ avatars, name, label }: ChatEmbedSocialProof) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="flex shrink-0">
        {avatars.map((avatar, index) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: avatars can share a src and the stack never reorders
            key={index}
            className={cn(
              "flex",
              index < avatars.length - 1 && "-mr-2",
              index > 0 &&
                "[mask-image:radial-gradient(circle_at_-4px_50%,transparent_14px,black_14.5px)]",
            )}
          >
            <Avatar size={24} {...avatar} />
          </span>
        ))}
      </div>
      <p className="m-0 flex min-w-0 items-center gap-1 whitespace-nowrap text-content-always-white">
        {name && (
          <span className="typography-body-small-14px-semibold max-w-30 truncate">{name}</span>
        )}
        <span className="typography-body-small-14px-regular shrink-0">{label}</span>
      </p>
    </div>
  );
}

function Media({
  media,
  backdrop,
  vertical,
  greyscale,
}: {
  media?: React.ReactNode;
  backdrop?: React.ReactNode;
  vertical: boolean;
  greyscale: boolean;
}) {
  if (!media) return null;

  return (
    <div className="pointer-events-none absolute inset-0 select-none">
      {vertical ? (
        <>
          <div
            aria-hidden="true"
            className={cn(
              "-translate-1/2 absolute top-1/2 left-1/2 h-[709px] w-[475px] blur-[20px]",
              MEDIA_FILL,
            )}
          >
            {backdrop}
          </div>
          <div
            className={cn(
              "absolute inset-y-0 left-1/2 aspect-9/16 -translate-x-1/2 shadow-md",
              MEDIA_FILL,
            )}
          >
            {media}
          </div>
        </>
      ) : (
        <div className={cn("absolute inset-0", MEDIA_FILL)}>{media}</div>
      )}
      {greyscale && (
        <div className="absolute inset-0 bg-content-always-black mix-blend-saturation" />
      )}
    </div>
  );
}

function Scrim({ experience }: { experience: boolean }) {
  return (
    <>
      {PROGRESSIVE_BLUR.map((step) => (
        <div key={step} aria-hidden="true" className={cn("absolute inset-0", step)} />
      ))}
      <div aria-hidden="true" className={cn("absolute inset-0 mix-blend-luminosity", SCRIM_FADE)} />
      {experience && (
        <div aria-hidden="true" className={cn("absolute inset-0 mix-blend-multiply", SCRIM_SOFT)} />
      )}
    </>
  );
}

function CreatorName({
  verified,
  aiDisclosure,
  aiDisclosureLabel,
  nameId,
  className,
  children,
}: {
  verified: boolean;
  aiDisclosure: boolean;
  aiDisclosureLabel: string;
  nameId?: string;
  className: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center gap-1">
      <UserDisplayName
        component="p"
        verified={verified}
        className={cn("m-0 [&>[role=img]]:ml-1 [&>span:empty+[role=img]]:ml-0", className)}
      >
        {children && <span id={nameId}>{children}</span>}
      </UserDisplayName>
      {aiDisclosure && (
        <AiDisclosureBadge
          tone="light"
          role="img"
          aria-hidden={false}
          aria-label={aiDisclosureLabel}
          className="shrink-0"
        />
      )}
    </div>
  );
}

function TopRow({
  badge,
  category,
  meta,
}: Pick<ChatEmbedBaseProps, "badge" | "category" | "meta">) {
  return (
    <div className="relative flex items-center justify-between gap-2 px-3 pt-3">
      <div className="flex min-w-0 items-center gap-1">
        {badge}
        {category && (
          <span className="typography-description-12px-semibold whitespace-nowrap rounded-xs bg-buttons-always-white-default px-2 py-1 text-content-always-black">
            {category}
          </span>
        )}
      </div>
      {meta && (
        <span className="typography-description-12px-semibold whitespace-nowrap rounded-full bg-background-overlay-default px-2 py-1 text-center text-content-always-white backdrop-blur-[10px]">
          {meta}
        </span>
      )}
    </div>
  );
}

function OpenOverlay({
  href,
  target,
  onOpen,
  labelledBy,
}: {
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  onOpen?: () => void;
  labelledBy: string;
}) {
  if (href) {
    return (
      // biome-ignore lint/a11y/useAnchorContent: Named by the visible title via aria-labelledby
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        aria-labelledby={labelledBy}
        className={OVERLAY}
      />
    );
  }
  if (!onOpen) return null;
  return <button type="button" onClick={onOpen} aria-labelledby={labelledBy} className={OVERLAY} />;
}

/**
 * A card embedded in a chat thread that links out to a creator profile or a fan
 * experience such as a live stream or game. Media fills the card and the profile
 * row sits on a blurred scrim along the bottom edge.
 *
 * The `creator` variant is 160px tall and the `experience` variant 239px; both
 * fill their container up to 400px wide. Pass `href` (or `onOpen`) to make the
 * whole card clickable; the `action` stays separately clickable above it. Use
 * {@link ChatEmbedSkeleton} while the embed's data loads and
 * {@link ChatEmbedUnavailable} when the shared item no longer exists.
 *
 * Give `media` meaningful alt text when it conveys content, or `alt=""` when the
 * title already describes it. When `media` is a video with `verticalMedia`, pass
 * its poster frame as `mediaBackdrop` so the video is not decoded twice.
 * `socialProof` is shown to everyone in the chat, so prefer a count over naming
 * other fans.
 *
 * @example
 * ```tsx
 * <ChatEmbed
 *   variant="experience"
 *   href="https://www.fanvue.com"
 *   badge={<LiveStatus variant="live" />}
 *   category="Audio"
 *   media={<img src="/stream.jpg" alt="" />}
 *   avatar={{ src: "/avatar.jpg", fallback: "JD" }}
 *   title="Friday night Q&A"
 *   subtitle="@jane_doe"
 *   action={<Button variant="white" size="32">Join</Button>}
 * />
 * ```
 */
export const ChatEmbed = React.forwardRef<HTMLDivElement, ChatEmbedProps>(
  (
    {
      variant = "creator",
      media,
      mediaBackdrop,
      verticalMedia = false,
      avatar,
      title,
      subtitle,
      verified = false,
      aiDisclosure = false,
      aiDisclosureLabel = "AI creator",
      action,
      badge,
      category,
      meta,
      inactive = false,
      href,
      target,
      onOpen,
      socialProof,
      className,
      ...props
    },
    ref,
  ) => {
    const titleId = React.useId();
    const isExperience = variant === "experience";
    const hasTopRow = Boolean(badge || category || meta);
    const badges = { verified, aiDisclosure, aiDisclosureLabel };

    return (
      <div
        ref={ref}
        className={cn(
          FRAME,
          HEIGHT[variant],
          "bg-content-always-black",
          hasTopRow ? "justify-between" : "justify-end",
          className,
        )}
        {...props}
      >
        <Media
          media={media}
          backdrop={mediaBackdrop}
          vertical={verticalMedia}
          greyscale={inactive}
        />
        <OpenOverlay href={href} target={target} onOpen={onOpen} labelledBy={titleId} />

        {hasTopRow && <TopRow badge={badge} category={category} meta={meta} />}

        <div
          className={cn("relative flex flex-col gap-2 px-3 pb-3", isExperience ? "pt-6" : "pt-3")}
        >
          <Scrim experience={isExperience} />

          {isExperience && socialProof && (
            <div className="relative">
              <SocialProof {...socialProof} />
            </div>
          )}

          <div className={cn("relative flex items-center", isExperience ? "gap-6" : "gap-2")}>
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {avatar && <Avatar size={40} {...avatar} />}
              <div className="flex min-w-0 flex-col justify-center text-content-always-white">
                {isExperience ? (
                  <>
                    <p id={titleId} className="typography-body-default-16px-semibold m-0 truncate">
                      {title}
                    </p>
                    {(subtitle || verified || aiDisclosure) && (
                      <CreatorName {...badges} className="typography-body-small-14px-regular">
                        {subtitle}
                      </CreatorName>
                    )}
                  </>
                ) : (
                  <>
                    <CreatorName
                      {...badges}
                      nameId={titleId}
                      className="typography-body-default-16px-semibold"
                    >
                      {title}
                    </CreatorName>
                    {subtitle && (
                      <p className="typography-body-small-14px-regular m-0 truncate">{subtitle}</p>
                    )}
                  </>
                )}
              </div>
            </div>
            {action && <div className="relative z-[2] shrink-0">{action}</div>}
          </div>
        </div>
      </div>
    );
  },
);

ChatEmbed.displayName = "ChatEmbed";

/**
 * Loading placeholder sized to match a {@link ChatEmbed}, shown while the data
 * for a shared link is being fetched.
 *
 * @example
 * ```tsx
 * <ChatEmbedSkeleton variant="experience" />
 * ```
 */
export const ChatEmbedSkeleton = React.forwardRef<HTMLDivElement, ChatEmbedSkeletonProps>(
  ({ variant = "creator", label = "Loading", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-busy="true"
        className={cn(FRAME, HEIGHT[variant], "justify-end bg-surface-secondary", className)}
        {...props}
      >
        <span className="sr-only">{label}</span>
        <div className="relative flex items-center gap-3 p-3">
          <Skeleton variant="circular" width={40} height={40} className="shrink-0" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Skeleton width="50%" height={16} />
            <Skeleton width="30%" height={14} />
          </div>
        </div>
      </div>
    );
  },
);

ChatEmbedSkeleton.displayName = "ChatEmbedSkeleton";

/**
 * Placeholder sized to match a {@link ChatEmbed}, shown in place of the card when
 * the shared profile or experience has been removed, hidden or unpublished.
 * Pass `children` to localise the message.
 *
 * @example
 * ```tsx
 * <ChatEmbedUnavailable variant="experience" />
 * ```
 */
export const ChatEmbedUnavailable = React.forwardRef<HTMLDivElement, ChatEmbedUnavailableProps>(
  ({ variant = "creator", icon, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          FRAME,
          HEIGHT[variant],
          "items-center justify-center gap-2 bg-surface-secondary px-6 text-center text-content-secondary",
          className,
        )}
        {...props}
      >
        {icon && (
          <span aria-hidden="true" className="flex">
            {icon}
          </span>
        )}
        <p className="typography-body-small-14px-regular m-0">
          {children ?? DEFAULT_UNAVAILABLE[variant]}
        </p>
      </div>
    );
  },
);

ChatEmbedUnavailable.displayName = "ChatEmbedUnavailable";
