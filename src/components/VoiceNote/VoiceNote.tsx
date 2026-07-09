import * as React from "react";
import { cn } from "@/utils/cn";
import { IconButton, type IconButtonSize } from "../IconButton/IconButton";
import { CloseIcon } from "../Icons/CloseIcon";
import { PauseIcon } from "../Icons/PauseIcon";
import { PlayIcon } from "../Icons/PlayIcon";

/** Visual style of the waveform. */
export type VoiceNoteVariant = "default" | "flat";

/** Size preset for the voice note. */
export type VoiceNoteSize = "default" | "small";

/**
 * Default waveform amplitudes (0–1), taken from the Figma reference so the
 * resting state renders 1:1 when no `waveform` data is supplied.
 */
const DEFAULT_WAVEFORM = [
  0.15, 0.46, 0.85, 0.23, 1, 0.85, 0.62, 0.62, 0.62, 0.85, 0.85, 0.62, 0.62, 1, 1, 0.62, 0.62, 0.62,
  0.23, 0.23, 0.15, 0.46, 0.85, 0.23, 1, 0.46, 0.85, 0.62, 0.23, 0.23, 0.62, 0.62, 0.85, 0.85, 0.62,
  0.62, 0.85, 1, 0.85, 1, 0.62, 0.62, 0.62, 0.23, 0.23, 0.62, 0.23, 0.23, 0.23, 0.62, 0.85, 0.62,
  0.85, 1, 0.85, 0.85, 1, 0.85, 0.23, 0.23, 0.23, 0.46, 0.62, 0.23, 0.23,
];

const MIN_BAR_HEIGHT = 4;
const MAX_BAR_HEIGHT: Record<VoiceNoteSize, number> = {
  default: 26,
  small: 16,
};

const CONTROL_SIZE: Record<VoiceNoteSize, IconButtonSize> = {
  default: "48",
  small: "32",
};

function activeBarClass(negative: boolean): string {
  return negative
    ? "bg-messages-waveform-listening-negative-active"
    : "bg-messages-waveform-listening-active";
}

function inactiveBarClass(negative: boolean): string {
  return negative
    ? "bg-messages-waveform-listening-negative-inactive"
    : "bg-messages-waveform-listening-inactive";
}

function restingBarClass(negative: boolean): string {
  return negative
    ? "bg-messages-waveform-listening-negative-default"
    : "bg-messages-waveform-default";
}

export interface VoiceNoteProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onPlay" | "onPause"> {
  /** Amplitude values (0–1), one per bar. Falls back to a built-in pattern. */
  waveform?: number[];
  /** Visual style; `flat` renders a simplified dotted preview. @default "default" */
  variant?: VoiceNoteVariant;
  /** Size preset. @default "default" */
  size?: VoiceNoteSize;
  /** Dark-surface treatment for use on message bubbles. @default false */
  negative?: boolean;
  /**
   * Playback progress (0–1). When set, the waveform splits into played/unplayed
   * bars (the "Listening" state). Leave undefined for the resting waveform.
   */
  progress?: number;
  /** Whether audio is playing (controlled) — toggles the play/pause icon. */
  playing?: boolean;
  /** Initial playing state (uncontrolled). @default false */
  defaultPlaying?: boolean;
  /** Called with the next playing state when the play/pause control is pressed. */
  onPlayPause?: (playing: boolean) => void;
  /** Timestamp or duration label, e.g. "0:05". */
  time?: string;
  /** File name shown when the audio is an uploaded file rather than a voice note. */
  fileName?: string;
  /** Show the play/pause control. @default true */
  showControls?: boolean;
  /** Show the timestamp label. @default true */
  showTimestamp?: boolean;
  /** Show a remove button (calls {@link VoiceNoteProps.onRemove}). @default false */
  showRemove?: boolean;
  /** Called when the remove button is pressed. */
  onRemove?: () => void;
  /** Accessible name for the play/pause control. Defaults to "Play"/"Pause". */
  playButtonLabel?: string;
  /** Accessible name for the remove button. @default "Remove" */
  removeButtonLabel?: string;
  /** Accessible name for the whole player. @default "Voice note" */
  "aria-label"?: string;
}

/**
 * A voice-note audio player: a play/pause control, an amplitude waveform, and a
 * timestamp — for voice messages and audio attachments in a conversation.
 *
 * Presentational and controlled: supply `playing`/`progress` and handle
 * `onPlayPause` to wire it to real audio (for media-thumbnail playback use
 * {@link AudioPlayer} instead). `flat` renders a compact dotted preview and
 * `negative` adapts it to dark message bubbles.
 *
 * @example
 * ```tsx
 * <VoiceNote time="0:05" progress={0.4} playing onPlayPause={toggle} />
 * ```
 */
export const VoiceNote = React.forwardRef<HTMLDivElement, VoiceNoteProps>(
  (
    {
      className,
      waveform = DEFAULT_WAVEFORM,
      variant = "default",
      size = "default",
      negative = false,
      progress,
      playing,
      defaultPlaying = false,
      onPlayPause,
      time,
      fileName,
      showControls = true,
      showTimestamp = true,
      showRemove = false,
      onRemove,
      playButtonLabel,
      removeButtonLabel = "Remove",
      "aria-label": ariaLabel = "Voice note",
      ...props
    },
    ref,
  ) => {
    const isControlled = playing !== undefined;
    const [internalPlaying, setInternalPlaying] = React.useState(defaultPlaying);
    const isPlaying = isControlled ? playing : internalPlaying;

    const handlePlayPause = () => {
      const next = !isPlaying;
      if (!isControlled) setInternalPlaying(next);
      onPlayPause?.(next);
    };

    const hasProgress = progress !== undefined;
    const activeCount = hasProgress ? Math.round(progress * waveform.length) : 0;
    const maxBarHeight = MAX_BAR_HEIGHT[size];
    const textColor = negative ? "text-content-primary-inverted" : "text-content-primary";

    return (
      // biome-ignore lint/a11y/useSemanticElements: <fieldset> would break the public HTMLDivElement ref/props API
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        className={cn("flex items-center gap-3", size === "small" ? "h-8" : "h-12", className)}
        {...props}
      >
        {showControls && (
          <IconButton
            variant="secondary"
            size={CONTROL_SIZE[size]}
            negative={negative}
            icon={isPlaying ? <PauseIcon /> : <PlayIcon />}
            aria-label={playButtonLabel ?? (isPlaying ? "Pause" : "Play")}
            onClick={handlePlayPause}
          />
        )}

        <div
          data-testid="voice-note-waveform"
          className="flex h-full min-w-0 flex-1 items-center gap-1 overflow-hidden"
          aria-hidden="true"
        >
          {waveform.map((amplitude, index) => {
            const height =
              variant === "flat"
                ? MIN_BAR_HEIGHT
                : Math.max(MIN_BAR_HEIGHT, Math.round(amplitude * maxBarHeight));
            const colorClass = hasProgress
              ? index < activeCount
                ? activeBarClass(negative)
                : inactiveBarClass(negative)
              : restingBarClass(negative);

            return (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: bars are a fixed positional sequence
                key={index}
                className={cn("w-1 shrink-0 rounded-[2px]", colorClass)}
                style={{ height }}
              />
            );
          })}
        </div>

        {showTimestamp && time && (
          <span className={cn("typography-body-small-14px-regular shrink-0", textColor)}>
            {time}
          </span>
        )}

        {fileName && (
          <span className={cn("typography-body-small-14px-regular shrink-0 truncate", textColor)}>
            {fileName}
          </span>
        )}

        {showRemove && (
          <IconButton
            variant="tertiary"
            size={CONTROL_SIZE[size]}
            negative={negative}
            icon={<CloseIcon />}
            aria-label={removeButtonLabel}
            onClick={onRemove}
          />
        )}
      </div>
    );
  },
);

VoiceNote.displayName = "VoiceNote";
