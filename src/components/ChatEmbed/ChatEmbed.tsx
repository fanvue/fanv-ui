import * as React from "react";
import { cn } from "../../utils/cn";
import { AiDisclosureBadge } from "../AiDisclosureBadge/AiDisclosureBadge";
import { Avatar, type AvatarProps } from "../Avatar/Avatar";
import { LiveStatus, type LiveStatusVariant } from "../LiveStatus/LiveStatus";
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

export interface ChatEmbedProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Layout of the embed. @default "creator" */
  variant?: ChatEmbedVariant;
  /** Media filling the card, typically an `img` or `video`. */
  media: React.ReactNode;
  /** Avatar shown at the start of the profile row. */
  avatar?: AvatarProps;
  /** Primary line of the profile row: a display name or an experience title. */
  title: React.ReactNode;
  /** Secondary line under the title, e.g. a handle. */
  subtitle?: React.ReactNode;
  /** Show the verified badge after the title. @default false */
  verified?: boolean;
  /** Show the EU AI-disclosure badge after the title. @default false */
  aiDisclosure?: boolean;
  /** Accessible label for the AI-disclosure badge. @default "AI creator" */
  aiDisclosureLabel?: string;
  /** Action at the end of the profile row, typically a `Button` with `variant="white"` and `size="32"`. */
  action?: React.ReactNode;
  /** Live status badge shown in the top-left corner. Renders the media in greyscale when `"ended"`. */
  status?: LiveStatusVariant;
  /** Short copy in a translucent pill in the top-right corner, e.g. "842 watching". */
  meta?: React.ReactNode;
  /** Social proof row shown above the profile row. */
  socialProof?: ChatEmbedSocialProof;
  /** Frame portrait media in a centred 9:16 column over a blurred copy of itself. @default false */
  verticalMedia?: boolean;
}

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

function SocialProof({ avatars, name, label }: ChatEmbedSocialProof) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="flex shrink-0">
        {avatars.map((avatar, index) => (
          <span
            key={avatar.src ?? index}
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
  vertical,
  greyscale,
}: {
  media: React.ReactNode;
  vertical: boolean;
  greyscale: boolean;
}) {
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
            {media}
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

/**
 * A card embedded in a chat thread that links out to a creator profile or a fan
 * experience such as a live stream or game. Media fills the card and the profile
 * row sits on a blurred scrim along the bottom edge.
 *
 * The `creator` variant is 160px tall. The `experience` variant is 239px tall
 * and adds an optional {@link LiveStatus} badge, meta pill and social proof row.
 * The card fills its container up to 400px wide.
 *
 * Give `media` meaningful alt text when it conveys content, or `alt=""` when the
 * title already describes it.
 *
 * @example
 * ```tsx
 * <ChatEmbed
 *   variant="experience"
 *   status="live"
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
      avatar,
      title,
      subtitle,
      verified = false,
      aiDisclosure = false,
      aiDisclosureLabel = "AI creator",
      action,
      status,
      meta,
      socialProof,
      verticalMedia = false,
      className,
      ...props
    },
    ref,
  ) => {
    const isExperience = variant === "experience";
    const hasTopRow = status !== undefined || meta !== undefined;

    return (
      <div
        ref={ref}
        className={cn(
          "relative isolate flex w-full max-w-100 flex-col justify-end overflow-hidden rounded-sm after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-[inherit] after:border after:border-neutral-alphas-100",
          isExperience ? "h-[239px]" : "h-40",
          hasTopRow && "justify-between",
          className,
        )}
        {...props}
      >
        <Media media={media} vertical={verticalMedia} greyscale={status === "ended"} />

        {hasTopRow && (
          <div className="relative flex items-center justify-between gap-2 px-3 pt-3">
            {status ? <LiveStatus variant={status} /> : <span />}
            {meta !== undefined && (
              <span className="typography-description-12px-semibold whitespace-nowrap rounded-full bg-background-overlay-default px-2 py-1 text-center text-content-always-white backdrop-blur-[10px]">
                {meta}
              </span>
            )}
          </div>
        )}

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
                <div className="flex min-w-0 items-center gap-1">
                  <UserDisplayName
                    component="p"
                    verified={verified}
                    className="typography-body-default-16px-semibold m-0 [&>[role=img]]:ml-1"
                  >
                    {title}
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
                {subtitle && (
                  <p className="typography-body-small-14px-regular m-0 truncate">{subtitle}</p>
                )}
              </div>
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        </div>
      </div>
    );
  },
);

ChatEmbed.displayName = "ChatEmbed";
