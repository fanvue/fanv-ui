import * as React from "react";
import { cn } from "../../utils/cn";
import { Avatar } from "../Avatar/Avatar";
import { DoubleTickIcon } from "../Icons/DoubleTickIcon";
import { TrashIcon } from "../Icons/TrashIcon";

/** Who sent the message. */
export type ChatMessageUser = "sender" | "receiver";

/** The kind of content the message carries. */
export type ChatMessageVariant = "text" | "typing" | "audio" | "deleted";

/** Delivery status shown alongside sender messages. */
export type ChatMessageStatus = "delivered" | "read";

export interface ChatMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Who sent the message. `"sender"` is the current user (right-aligned, green
   * bubble, delivery tick). `"receiver"` is the other party (left-aligned, grey
   * bubble, with avatar). @default "receiver"
   */
  user?: ChatMessageUser;
  /** The kind of content the message carries. @default "text" */
  variant?: ChatMessageVariant;
  /** Message body for the `"text"` variant. Keep it to inline content. */
  message?: React.ReactNode;
  /** Timestamp shown with the message, e.g. `"16:00"`. */
  time?: string;
  /**
   * Delivery status shown on sender messages (a double tick). Ignored for
   * receiver messages. `"read"` renders the tick in the read colour. @default "delivered"
   */
  status?: ChatMessageStatus;
  /** Duration label for the `"audio"` variant, e.g. `"0:05"`. @default "0:00" */
  audioDuration?: string;
  /**
   * Relative bar heights (values `0`–`1`) for the `"audio"` waveform. Defaults
   * to a flat row of dots matching the unplayed design state.
   */
  waveform?: number[];
  /** Whether the audio is playing (controlled). Pairs with {@link onPlayingChange}. */
  playing?: boolean;
  /** Initial playing state when uncontrolled. @default false */
  defaultPlaying?: boolean;
  /** Fired when the audio play/pause button is pressed, with the next playing state. */
  onPlayingChange?: (playing: boolean) => void;
  /** Render the receiver avatar. Reserves the avatar space when `false` so grouped bubbles stay aligned. @default true */
  showAvatar?: boolean;
  /** Avatar image URL for receiver messages. */
  avatarSrc?: string;
  /** Avatar alt text. @default "Avatar" */
  avatarAlt?: string;
  /** Avatar fallback (initials or icon) shown before the image loads. */
  avatarFallback?: React.ReactNode;
  /** Show the online indicator on the receiver avatar. @default false */
  online?: boolean;
  /** Accessible label for the typing indicator. @default "Typing" */
  typingLabel?: string;
  /** Text shown for the `"deleted"` variant. @default "Message deleted" */
  deletedLabel?: string;
  /** Accessible label for the audio play button. @default "Play" */
  playLabel?: string;
  /** Accessible label for the audio pause button. @default "Pause" */
  pauseLabel?: string;
}

const DEFAULT_WAVEFORM = Array.from({ length: 64 }, () => 0);
const WAVEFORM_MIN_HEIGHT = 4;
const WAVEFORM_MAX_HEIGHT = 24;

const bubbleColors: Record<ChatMessageUser, string> = {
  sender: "bg-messages-background-sender border-messages-background-sender-stroke",
  receiver: "bg-messages-background-receiver border-messages-background-receiver-2",
};

/** The timestamp and, for sender messages, the delivery tick. */
function ChatMessageMeta({
  time,
  showTick,
  status,
  className,
}: {
  time?: string;
  showTick: boolean;
  status: ChatMessageStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "typography-description-12px-regular inline-flex items-center gap-1 whitespace-nowrap text-content-secondary leading-none",
        className,
      )}
    >
      {time ? <time>{time}</time> : null}
      {showTick ? (
        // The 24px geometry (stroked) scaled to 16px — the icon's 16px variant
        // is filled and renders as a blob at this size.
        <DoubleTickIcon
          size={24}
          aria-hidden={false}
          role="img"
          aria-label={status === "read" ? "Read" : "Delivered"}
          className={cn(
            "size-4 shrink-0",
            status === "read" ? "text-messages-read" : "text-icons-disabled",
          )}
        />
      ) : null}
    </span>
  );
}

/** Three dots hinting that the other party is composing a message. */
function TypingIndicator({ label }: { label: string }) {
  const dot = "size-2 shrink-0 rounded-full motion-safe:animate-bounce";
  return (
    // biome-ignore lint/a11y/useSemanticElements: <output> is not appropriate for a typing indicator; role="status" is the correct live-region pattern
    <span role="status" aria-label={label} className="flex items-center gap-2 px-0.5 py-1">
      <span className={cn(dot, "bg-content-primary")} />
      <span className={cn(dot, "bg-neutral-alphas-700 [animation-delay:150ms]")} />
      <span className={cn(dot, "bg-neutral-alphas-400 [animation-delay:300ms]")} />
    </span>
  );
}

/** A static bar-graph waveform for voice messages. */
function Waveform({ bars }: { bars: number[] }) {
  return (
    <span className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden" aria-hidden>
      {bars.map((amplitude, index) => {
        const clamped = Math.min(1, Math.max(0, amplitude));
        const height = WAVEFORM_MIN_HEIGHT + clamped * (WAVEFORM_MAX_HEIGHT - WAVEFORM_MIN_HEIGHT);
        return (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: bars are positional and have no stable id
            key={index}
            className="w-1 shrink-0 rounded-3xs bg-messages-waveform-default"
            style={{ height }}
          />
        );
      })}
    </span>
  );
}

/** Bare play triangle glyph (the enclosing circle comes from the button). */
function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-6">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.28-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

/** Bare pause glyph. */
function PauseGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-6">
      <rect x="7" y="5" width="3.5" height="14" rx="1" />
      <rect x="13.5" y="5" width="3.5" height="14" rx="1" />
    </svg>
  );
}

/**
 * A single chat message rendered as a bubble. Sender messages sit on the right
 * with a green bubble and a delivery tick; receiver messages sit on the left
 * with a grey bubble and an avatar. Supports plain text, a typing indicator, a
 * voice message with waveform, and a deleted-message placeholder.
 *
 * Text bubbles place the timestamp inline after short messages and drop it to
 * the bottom-right corner once the text wraps, so no variant switch is needed
 * for short versus long content.
 *
 * @example
 * ```tsx
 * <ChatMessage user="sender" message="On my way!" time="16:00" status="read" />
 * <ChatMessage user="receiver" message="See you soon" time="16:01" avatarSrc="/jane.jpg" online />
 * <ChatMessage user="receiver" variant="typing" avatarSrc="/jane.jpg" />
 * ```
 */
export const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  (
    {
      className,
      user = "receiver",
      variant = "text",
      message,
      time,
      status = "delivered",
      audioDuration = "0:00",
      waveform,
      playing,
      defaultPlaying = false,
      onPlayingChange,
      showAvatar = true,
      avatarSrc,
      avatarAlt,
      avatarFallback,
      online = false,
      typingLabel = "Typing",
      deletedLabel = "Message deleted",
      playLabel = "Play",
      pauseLabel = "Pause",
      ...props
    },
    ref,
  ) => {
    const isSender = user === "sender";
    const showTick = isSender;

    const [internalPlaying, setInternalPlaying] = React.useState(defaultPlaying);
    const isPlaying = playing ?? internalPlaying;
    const togglePlaying = () => {
      const next = !isPlaying;
      if (playing === undefined) setInternalPlaying(next);
      onPlayingChange?.(next);
    };

    const bubbleBase = cn(
      "w-fit min-w-0 max-w-full rounded-md border border-solid",
      bubbleColors[user],
    );
    const hasMeta = Boolean(time) || showTick;

    let bubble: React.ReactNode;

    if (variant === "typing") {
      bubble = (
        <div className={cn(bubbleBase, "px-3 py-2")}>
          <TypingIndicator label={typingLabel} />
        </div>
      );
    } else if (variant === "deleted") {
      bubble = (
        <div className={cn(bubbleBase, "flex items-baseline gap-6 px-3 py-2 opacity-60")}>
          <span className="flex items-center gap-2">
            <TrashIcon size={16} className="shrink-0 text-content-primary" />
            <span className="typography-body-default-16px-regular whitespace-nowrap text-content-primary">
              {deletedLabel}
            </span>
          </span>
          {hasMeta ? <ChatMessageMeta time={time} showTick={showTick} status={status} /> : null}
        </div>
      );
    } else if (variant === "audio") {
      bubble = (
        <div className={cn(bubbleBase, "flex w-full flex-col p-2")}>
          <div className="flex w-full flex-col items-start gap-2 px-1">
            <div className="flex w-full items-center gap-3 pt-1">
              <button
                type="button"
                onClick={togglePlaying}
                aria-pressed={isPlaying}
                aria-label={isPlaying ? pauseLabel : playLabel}
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-full bg-buttons-secondary-default text-icons-primary",
                  "focus-visible:shadow-focus-ring focus-visible:outline-none motion-safe:transition-colors motion-safe:duration-150",
                )}
              >
                {isPlaying ? <PauseGlyph /> : <PlayGlyph />}
              </button>
              <Waveform bars={waveform ?? DEFAULT_WAVEFORM} />
              <span className="typography-body-small-14px-regular whitespace-nowrap text-content-primary">
                {audioDuration}
              </span>
            </div>
            {hasMeta ? (
              <ChatMessageMeta
                time={time}
                showTick={showTick}
                status={status}
                className="self-end"
              />
            ) : null}
          </div>
        </div>
      );
    } else {
      // "text": the message and timestamp share a wrapping row. A brief message
      // keeps the time inline (24px gap = the design's Short treatment); once the
      // text wraps, the time drops to its own line bottom-right (the Default
      // treatment). No length prop needed — the layout adapts to the content.
      bubble = (
        <div className={cn(bubbleBase, "px-3 py-2")}>
          <div className="flex flex-wrap items-baseline justify-end gap-x-6 gap-y-2">
            <p className="typography-body-default-16px-regular m-0 min-w-0 break-words text-content-primary">
              {message}
            </p>
            {hasMeta ? (
              <ChatMessageMeta
                time={time}
                showTick={showTick}
                status={status}
                className="shrink-0"
              />
            ) : null}
          </div>
        </div>
      );
    }

    const alignItems = variant === "typing" || variant === "deleted" ? "items-center" : "items-end";

    return (
      <div
        ref={ref}
        className={cn(
          "flex min-h-10 w-full gap-2",
          alignItems,
          isSender ? "justify-end" : "justify-start",
          className,
        )}
        {...props}
      >
        {!isSender &&
          (showAvatar ? (
            <div className="relative flex shrink-0">
              <Avatar size={40} src={avatarSrc} alt={avatarAlt} fallback={avatarFallback} />
              {online ? (
                <span
                  aria-hidden="true"
                  className="absolute right-0 bottom-0 size-2.5 rounded-full border border-border-background bg-messages-status-active"
                />
              ) : null}
            </div>
          ) : (
            <div aria-hidden="true" className="w-10 shrink-0" />
          ))}
        {bubble}
      </div>
    );
  },
);

ChatMessage.displayName = "ChatMessage";
