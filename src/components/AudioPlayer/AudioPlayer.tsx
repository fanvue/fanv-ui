import * as React from "react";
import {
  decodeAudioPeaks,
  formatTime,
  generateFallbackPeaks,
  RAW_PEAK_COUNT,
  resamplePeaks,
} from "../../utils/audioWaveform";
import { cn } from "../../utils/cn";
import { PauseIcon } from "../Icons/PauseIcon";
import { PlayIcon } from "../Icons/PlayIcon";

/** Width of a single waveform bar, in pixels. */
const BAR_WIDTH_PX = 4;
/** Gap between waveform bars, in pixels. */
const BAR_GAP_PX = 4;
/** Shortest a waveform bar can render, in pixels. */
const MIN_BAR_HEIGHT_PX = 4;
/** Tallest a waveform bar can render, in pixels — matches the 40px row height. */
const MAX_BAR_HEIGHT_PX = 26;
/** Bar count used before the container has been measured (e.g. during SSR or in jsdom, where layout is unavailable). */
const DEFAULT_BAR_COUNT = 24;
/** Seconds moved per Arrow key press while seeking. */
const SEEK_STEP_SECONDS = 1;
/** Seconds moved per Page Up/Down press while seeking. */
const SEEK_STEP_LARGE_SECONDS = 5;

/** Height of the audio player row, in pixels. Matches both the Vault card overlay and the "Generated Audio" modal row in Figma — both use an identical 32px play button and 40px row. */
export type AudioPlayerSize = "40";

export interface AudioPlayerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onPlay" | "onPause" | "onEnded"> {
  /** URL of the audio file to play. */
  src: string;
  /**
   * Total duration in seconds, used to render the timestamp before the
   * media's own metadata has loaded (and as a fallback if it never does).
   */
  duration?: number;
  /**
   * Whether playback is active (controlled). Note: once `onEnded` fires, the
   * browser has already stopped native playback. To loop or replay under
   * controlled usage, toggle this prop `false` then `true` (rather than
   * leaving it `true`) — the sync effect only calls `play()` again when this
   * value actually changes.
   */
  playing?: boolean;
  /** Initial playback state (uncontrolled). @default false */
  defaultPlaying?: boolean;
  /** Called when playback starts. */
  onPlay?: () => void;
  /** Called when playback is paused. */
  onPause?: () => void;
  /** Called when playback reaches the end of the media. */
  onEnded?: () => void;
  /** Height of the player row, in pixels. @default "40" */
  size?: AudioPlayerSize;
}

/**
 * A compact playback control for a single audio clip: a play/pause toggle, a
 * static amplitude waveform that doubles as a seek scrubber, and elapsed/total
 * timestamps. Designed to sit as an overlay on media thumbnails (Vault cards)
 * as well as inline rows (the AI Voice Message "Generated Audio" row).
 *
 * The waveform is seeded from the decoded audio when possible, falling back
 * to a deterministic (not random) placeholder derived from `src` so the
 * result is stable across renders, SSR, and Chromatic snapshots.
 *
 * @example
 * ```tsx
 * <AudioPlayer src="https://example.com/clip.mp3" duration={5} />
 * ```
 */
export const AudioPlayer = React.forwardRef<HTMLDivElement, AudioPlayerProps>(
  (
    {
      className,
      src,
      duration,
      playing: controlledPlaying,
      defaultPlaying = false,
      onPlay,
      onPause,
      onEnded,
      size = "40",
      ...props
    },
    ref,
  ) => {
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const trackRef = React.useRef<HTMLDivElement>(null);

    const [internalPlaying, setInternalPlaying] = React.useState(defaultPlaying);
    const isControlled = controlledPlaying !== undefined;
    const playing = isControlled ? controlledPlaying : internalPlaying;

    const [currentTime, setCurrentTime] = React.useState(0);
    const [mediaDuration, setMediaDuration] = React.useState<number | undefined>(undefined);
    const [barCount, setBarCount] = React.useState(DEFAULT_BAR_COUNT);
    const [peaks, setPeaks] = React.useState<number[]>(() =>
      generateFallbackPeaks(src, RAW_PEAK_COUNT),
    );
    const [isDragging, setIsDragging] = React.useState(false);

    const displayDuration = mediaDuration ?? duration;
    const hasStarted = playing || currentTime > 0;

    // Latest-value refs so the src-change effect below can react to a src swap
    // without re-running whenever `playing`/`isControlled`/`onPause` change.
    const playingRef = React.useRef(playing);
    playingRef.current = playing;
    const isControlledRef = React.useRef(isControlled);
    isControlledRef.current = isControlled;
    const onPauseRef = React.useRef(onPause);
    onPauseRef.current = onPause;

    // Reset transient playback state when the source changes. Skips the
    // initial mount (there's nothing to reset yet) and, if playback was
    // active, stops it — the browser silently drops playback on a source
    // swap, so the UI (and any controlled parent) must be told via onPause.
    const isFirstSrcRenderRef = React.useRef(true);
    React.useEffect(() => {
      if (isFirstSrcRenderRef.current) {
        isFirstSrcRenderRef.current = false;
        return;
      }
      setCurrentTime(0);
      setMediaDuration(undefined);
      setPeaks(generateFallbackPeaks(src, RAW_PEAK_COUNT));
      if (playingRef.current) {
        if (!isControlledRef.current) setInternalPlaying(false);
        onPauseRef.current?.();
      }
    }, [src]);

    // Decode the audio to derive real waveform amplitudes, falling back to a
    // deterministic placeholder on any failure (network, CORS, unsupported format).
    React.useEffect(() => {
      let cancelled = false;
      const abortController = new AbortController();

      decodeAudioPeaks(src, abortController.signal)
        .then((decodedPeaks) => {
          if (!cancelled) setPeaks(decodedPeaks);
        })
        .catch(() => {
          if (!cancelled) setPeaks(generateFallbackPeaks(src, RAW_PEAK_COUNT));
        });

      return () => {
        cancelled = true;
        abortController.abort();
      };
    }, [src]);

    // Measure the track to decide how many bars fit; falls back to DEFAULT_BAR_COUNT
    // when layout is unavailable (SSR, jsdom).
    React.useEffect(() => {
      const track = trackRef.current;
      if (!track) return;

      const updateFromWidth = (width: number) => {
        if (width <= 0) return;
        setBarCount(Math.max(1, Math.floor((width + BAR_GAP_PX) / (BAR_WIDTH_PX + BAR_GAP_PX))));
      };

      updateFromWidth(track.getBoundingClientRect().width);

      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) updateFromWidth(entry.contentRect.width);
      });
      observer.observe(track);
      return () => observer.disconnect();
    }, []);

    // Sync the controlled/uncontrolled `playing` state to the media element.
    React.useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
      if (playing) {
        audio.play().catch(() => {
          if (!isControlled) setInternalPlaying(false);
          onPauseRef.current?.();
        });
      } else {
        audio.pause();
      }
    }, [playing, isControlled]);

    const handleToggle = () => {
      const next = !playing;
      if (!isControlled) setInternalPlaying(next);
      if (next) onPlay?.();
      else onPause?.();
    };

    const seekTo = React.useCallback(
      (time: number) => {
        if (displayDuration === undefined) return;
        const clamped = Math.min(Math.max(time, 0), displayDuration);
        setCurrentTime(clamped);
        const audio = audioRef.current;
        if (audio) audio.currentTime = clamped;
      },
      [displayDuration],
    );

    const seekFromClientX = React.useCallback(
      (clientX: number) => {
        const track = trackRef.current;
        if (!track || displayDuration === undefined) return;
        const rect = track.getBoundingClientRect();
        if (rect.width <= 0) return;
        const fraction = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
        seekTo(fraction * displayDuration);
      },
      [displayDuration, seekTo],
    );

    // Track drag outside the element via window listeners rather than pointer
    // capture, which some environments (and jsdom) don't fully implement.
    React.useEffect(() => {
      if (!isDragging) return;
      const handleWindowPointerMove = (event: PointerEvent) => seekFromClientX(event.clientX);
      const handleWindowPointerUp = () => setIsDragging(false);
      window.addEventListener("pointermove", handleWindowPointerMove);
      window.addEventListener("pointerup", handleWindowPointerUp);
      return () => {
        window.removeEventListener("pointermove", handleWindowPointerMove);
        window.removeEventListener("pointerup", handleWindowPointerUp);
      };
    }, [isDragging, seekFromClientX]);

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      seekFromClientX(event.clientX);
      setIsDragging(true);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (displayDuration === undefined) return;
      switch (event.key) {
        case "ArrowRight":
        case "ArrowUp":
          event.preventDefault();
          seekTo(currentTime + SEEK_STEP_SECONDS);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          event.preventDefault();
          seekTo(currentTime - SEEK_STEP_SECONDS);
          break;
        case "PageUp":
          event.preventDefault();
          seekTo(currentTime + SEEK_STEP_LARGE_SECONDS);
          break;
        case "PageDown":
          event.preventDefault();
          seekTo(currentTime - SEEK_STEP_LARGE_SECONDS);
          break;
        case "Home":
          event.preventDefault();
          seekTo(0);
          break;
        case "End":
          event.preventDefault();
          seekTo(displayDuration);
          break;
        default:
          break;
      }
    };

    const bars = resamplePeaks(peaks, barCount);
    const progressFraction =
      displayDuration && displayDuration > 0
        ? Math.min(Math.max(currentTime / displayDuration, 0), 1)
        : 0;
    const playedBarCount = hasStarted ? Math.round(progressFraction * bars.length) : bars.length;
    const barData = bars.map((amplitude, index) => {
      const isPlayed = index < playedBarCount;
      return {
        heightPx: MIN_BAR_HEIGHT_PX + amplitude * (MAX_BAR_HEIGHT_PX - MIN_BAR_HEIGHT_PX),
        className: cn(
          "w-1 shrink-0 rounded-3xs bg-messages-waveform-default",
          "motion-safe:transition-opacity motion-safe:duration-150 motion-safe:ease-in-out",
          isPlayed ? "opacity-100" : "opacity-50",
        ),
      };
    });

    return (
      <div
        ref={ref}
        data-size={size}
        className={cn("flex w-full items-center gap-3", className)}
        {...props}
      >
        <button
          type="button"
          onClick={handleToggle}
          aria-label={playing ? "Pause" : "Play"}
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full",
            "bg-buttons-secondary-default text-icons-primary backdrop-blur-[40px]",
            "motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-in-out",
            "hover:bg-buttons-secondary-hover",
            "focus-visible:shadow-focus-ring focus-visible:outline-none",
          )}
        >
          {playing ? <PauseIcon size={16} filled /> : <PlayIcon size={16} filled />}
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div
            ref={trackRef}
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-orientation="horizontal"
            aria-valuemin={0}
            aria-valuemax={displayDuration}
            aria-valuenow={Math.round(currentTime)}
            aria-valuetext={
              displayDuration !== undefined
                ? `${formatTime(currentTime)} of ${formatTime(displayDuration)}`
                : formatTime(currentTime)
            }
            onPointerDown={handlePointerDown}
            onKeyDown={handleKeyDown}
            className={cn(
              "flex h-10 min-w-0 flex-1 cursor-pointer touch-none select-none items-center gap-1 overflow-hidden",
              "focus-visible:shadow-focus-ring focus-visible:outline-none",
            )}
          >
            {barData.map((bar, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: bars are a fixed-count, non-reorderable list
              <span key={index} className={bar.className} style={{ height: bar.heightPx }} />
            ))}
          </div>

          <span className="typography-body-small-14px-semibold flex shrink-0 items-center gap-0.5 whitespace-nowrap">
            {hasStarted ? (
              <>
                <span className="text-content-primary">{formatTime(currentTime)}</span>
                <span className="text-content-secondary">/{formatTime(displayDuration)}</span>
              </>
            ) : (
              <span className="text-content-primary">{formatTime(displayDuration)}</span>
            )}
          </span>
        </div>

        {/* biome-ignore lint/a11y/useMediaCaption: this is a UI sound clip (voice note / short recording), not spoken/narrated content requiring captions. */}
        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
          className="hidden"
          onLoadedMetadata={(event) => {
            const { duration: nativeDuration } = event.currentTarget;
            setMediaDuration(Number.isFinite(nativeDuration) ? nativeDuration : undefined);
          }}
          onTimeUpdate={(event) => {
            if (isDragging) return;
            setCurrentTime(event.currentTarget.currentTime);
          }}
          onEnded={() => {
            setCurrentTime(0);
            if (!isControlled) setInternalPlaying(false);
            onEnded?.();
          }}
        />
      </div>
    );
  },
);

AudioPlayer.displayName = "AudioPlayer";
