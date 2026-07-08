import * as React from "react";
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
/** Number of amplitude samples kept internally, resampled to the rendered bar count. */
const RAW_PEAK_COUNT = 128;
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
  /** Whether playback is active (controlled). */
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

function formatTime(seconds: number | undefined): string {
  if (seconds === undefined || !Number.isFinite(seconds)) return "--:--";
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

/** Deterministic 32-bit string hash (FNV-1a), used to seed the fallback waveform. */
function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Seeded PRNG (mulberry32) — deterministic across runs, unlike `Math.random`. */
function createSeededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic placeholder amplitudes used when audio can't be decoded (network/CORS/format failure). */
function generateFallbackPeaks(src: string, count: number): number[] {
  const random = createSeededRandom(hashString(src));
  return Array.from({ length: count }, () => 0.2 + random() * 0.8);
}

/** Downsamples decoded PCM data to `count` peak (max-abs) amplitudes. */
function computePeaksFromChannelData(channelData: Float32Array, count: number): number[] {
  const blockSize = Math.max(1, Math.floor(channelData.length / count));
  const peaks: number[] = [];
  for (let i = 0; i < count; i++) {
    const start = i * blockSize;
    let max = 0;
    for (let j = 0; j < blockSize && start + j < channelData.length; j++) {
      max = Math.max(max, Math.abs(channelData[start + j] ?? 0));
    }
    peaks.push(max);
  }
  return peaks;
}

/** Resamples a peaks array to the number of bars that currently fit the container. */
function resamplePeaks(peaks: number[], barCount: number): number[] {
  if (peaks.length === 0 || barCount <= 0) return [];
  const step = peaks.length / barCount;
  return Array.from(
    { length: barCount },
    (_, i) => peaks[Math.min(peaks.length - 1, Math.floor(i * step))] ?? 0,
  );
}

/** Decodes `src` via WebAudio and returns downsampled peak amplitudes. Throws on any failure. */
async function decodeAudioPeaks(src: string, signal: AbortSignal): Promise<number[]> {
  const AudioContextCtor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) throw new Error("WebAudio unsupported");

  const response = await fetch(src, { signal });
  const arrayBuffer = await response.arrayBuffer();
  const audioContext = new AudioContextCtor();
  try {
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return computePeaksFromChannelData(audioBuffer.getChannelData(0), RAW_PEAK_COUNT);
  } finally {
    if (audioContext.state !== "closed") audioContext.close().catch(() => {});
  }
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

    // Reset transient playback state when the source changes.
    // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally re-runs only when `src` changes
    React.useEffect(() => {
      setCurrentTime(0);
      setMediaDuration(undefined);
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
            aria-valuemax={displayDuration ?? 0}
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
