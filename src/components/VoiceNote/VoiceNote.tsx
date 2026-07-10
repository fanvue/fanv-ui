import * as React from "react";
import { formatTime, resamplePeaks } from "@/utils/audioWaveform";
import { cn } from "@/utils/cn";
import { useAudioPlayback } from "@/utils/useAudioPlayback";
import { useFittedBarCount } from "@/utils/useFittedBarCount";
import { useWaveformPeaks } from "@/utils/useWaveformPeaks";
import { useWaveformSeek } from "@/utils/useWaveformSeek";
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
 * resting state renders 1:1 when no `waveform` data (or `src`) is supplied.
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

/** Rendered width of a single waveform bar, in pixels (`w-1`). */
const BAR_WIDTH_PX = 4;
/** Gap between waveform bars, in pixels (`gap-1`). */
const BAR_GAP_PX = 4;
/** Bar count before the track is measured (SSR, jsdom, or zero-width layout). */
const DEFAULT_BAR_COUNT = 40;

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

interface WaveformBarsProps {
  bars: number[];
  variant: VoiceNoteVariant;
  size: VoiceNoteSize;
  negative: boolean;
  progress: number | undefined;
}

function WaveformBars({ bars, variant, size, negative, progress }: WaveformBarsProps) {
  const hasProgress = progress !== undefined;
  const activeCount = hasProgress ? Math.round(progress * bars.length) : 0;
  const maxBarHeight = MAX_BAR_HEIGHT[size];

  return (
    <>
      {bars.map((amplitude, index) => {
        const height =
          variant === "flat"
            ? MIN_BAR_HEIGHT
            : Math.max(MIN_BAR_HEIGHT, Math.round(amplitude * maxBarHeight));
        const colorClass = !hasProgress
          ? restingBarClass(negative)
          : index < activeCount
            ? activeBarClass(negative)
            : inactiveBarClass(negative);

        return (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: bars are a fixed positional sequence
            key={index}
            className={cn("w-1 shrink-0 rounded-[2px]", colorClass)}
            style={{ height }}
          />
        );
      })}
    </>
  );
}

interface WaveformMetaProps {
  time: string | undefined;
  fileName: string | undefined;
  textColor: string;
}

function WaveformMeta({ time, fileName, textColor }: WaveformMetaProps) {
  return (
    <>
      {time && (
        <span className={cn("typography-body-small-14px-regular shrink-0", textColor)}>{time}</span>
      )}
      {fileName && (
        <span
          className={cn(
            "typography-body-small-14px-regular min-w-0 max-w-[50%] truncate",
            textColor,
          )}
        >
          {fileName}
        </span>
      )}
    </>
  );
}

export interface VoiceNoteProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onPlay" | "onPause"> {
  /**
   * URL of the audio to play. When set, the component manages a real `<audio>`
   * element: it decodes the waveform, plays/pauses, tracks live progress and is
   * seekable — `waveform`/`progress` are derived automatically. Leave unset for
   * a presentational, fully-controlled voice note.
   */
  src?: string;
  /** Fallback total duration (seconds), used until the media's metadata loads. */
  duration?: number;
  /** Amplitude values (0–1), one per bar. Ignored when `src` is set. Falls back to a built-in pattern. */
  waveform?: number[];
  /** Visual style; `flat` renders a simplified dotted preview. @default "default" */
  variant?: VoiceNoteVariant;
  /** Size preset. @default "default" */
  size?: VoiceNoteSize;
  /** Dark-surface treatment for use on message bubbles. @default false */
  negative?: boolean;
  /**
   * Playback progress (0–1) for the presentational mode. When set, the waveform
   * splits into played/unplayed bars (the "Listening" state). Ignored when `src`
   * is set (progress comes from the media element).
   */
  progress?: number;
  /** Whether audio is playing (controlled) — toggles the play/pause icon. */
  playing?: boolean;
  /** Initial playing state (uncontrolled). @default false */
  defaultPlaying?: boolean;
  /** Called with the next playing state when the play/pause control is pressed. */
  onPlayPause?: (playing: boolean) => void;
  /** Called when audio playback reaches the end (only in `src` mode). */
  onEnded?: () => void;
  /** Timestamp or duration label, e.g. "0:05". Ignored when `src` is set (derived from the media). */
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
 * Two modes: pass `src` for a self-contained player that decodes the waveform,
 * plays real audio, tracks live progress and is seekable; or omit `src` and
 * drive it with `playing`/`progress` + `onPlayPause` for a presentational,
 * fully-controlled voice note. `flat` renders a compact dotted preview and
 * `negative` adapts it to dark message bubbles.
 *
 * @example
 * ```tsx
 * <VoiceNote src="https://example.com/note.mp3" duration={5} />
 * <VoiceNote time="0:05" progress={0.4} playing onPlayPause={toggle} />
 * ```
 */
export const VoiceNote = React.forwardRef<HTMLDivElement, VoiceNoteProps>(
  (
    {
      className,
      src,
      duration,
      waveform = DEFAULT_WAVEFORM,
      variant = "default",
      size = "default",
      negative = false,
      progress,
      playing,
      defaultPlaying = false,
      onPlayPause,
      onEnded,
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
    const isPlayer = src !== undefined;

    const playback = useAudioPlayback({
      src,
      duration,
      playing,
      defaultPlaying,
      onEnded,
      onPlay: React.useCallback(() => onPlayPause?.(true), [onPlayPause]),
      onPause: React.useCallback(() => onPlayPause?.(false), [onPlayPause]),
    });
    const decodedPeaks = useWaveformPeaks(src);

    const [internalPlaying, setInternalPlaying] = React.useState(defaultPlaying);
    const isControlled = playing !== undefined;

    const trackRef = React.useRef<HTMLDivElement>(null);
    const fittedBarCount = useFittedBarCount(trackRef, {
      barWidthPx: BAR_WIDTH_PX,
      gapPx: BAR_GAP_PX,
      fallback: DEFAULT_BAR_COUNT,
    });
    const seekProps = useWaveformSeek({
      trackRef,
      displayDuration: playback.displayDuration,
      currentTime: playback.currentTime,
      seekTo: playback.seekTo,
      setSeeking: playback.setSeeking,
    });

    const isPlaying = isPlayer ? playback.isPlaying : (playing ?? internalPlaying);

    const handlePlayPause = () => {
      if (isPlayer) {
        playback.toggle();
        return;
      }
      const next = !isPlaying;
      if (!isControlled) setInternalPlaying(next);
      onPlayPause?.(next);
    };

    const bars = resamplePeaks(isPlayer ? decodedPeaks : waveform, fittedBarCount);
    const progressValue = isPlayer ? playback.progress : progress;
    const textColor = negative ? "text-content-primary-inverted" : "text-content-primary";

    const playerTime = playback.hasStarted ? playback.currentTime : playback.displayDuration;
    const displayTime = isPlayer ? formatTime(playerTime) : time;
    const controlLabel = playButtonLabel ?? (isPlaying ? "Pause" : "Play");
    const trackAria = isPlayer ? seekProps : ({ "aria-hidden": true } as const);

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
            aria-label={controlLabel}
            onClick={handlePlayPause}
          />
        )}

        <div
          ref={trackRef}
          data-testid="voice-note-waveform"
          className={cn(
            "flex h-full min-w-0 flex-1 items-center gap-1 overflow-hidden",
            isPlayer &&
              "cursor-pointer touch-none select-none focus-visible:shadow-focus-ring focus-visible:outline-none",
          )}
          {...trackAria}
        >
          <WaveformBars
            bars={bars}
            variant={variant}
            size={size}
            negative={negative}
            progress={progressValue}
          />
        </div>

        <WaveformMeta
          time={showTimestamp ? displayTime : undefined}
          fileName={fileName}
          textColor={textColor}
        />

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

        {isPlayer && (
          // biome-ignore lint/a11y/useMediaCaption: a UI voice note / short recording, not narrated content needing captions
          <audio
            ref={playback.audioRef}
            src={src}
            preload="metadata"
            className="hidden"
            onLoadedMetadata={playback.audioHandlers.onLoadedMetadata}
            onTimeUpdate={playback.audioHandlers.onTimeUpdate}
            onEnded={playback.audioHandlers.onEnded}
          />
        )}
      </div>
    );
  },
);

VoiceNote.displayName = "VoiceNote";
