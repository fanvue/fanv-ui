import * as React from "react";
import { formatTime } from "./audioWaveform";

/** Seconds moved per Arrow key press while seeking. */
const SEEK_STEP_SECONDS = 1;
/** Seconds moved per Page Up/Down press while seeking. */
const SEEK_STEP_LARGE_SECONDS = 5;

/** Signed seek delta (seconds) for each stepping key. */
const STEP_BY_KEY: Record<string, number | undefined> = {
  ArrowRight: SEEK_STEP_SECONDS,
  ArrowUp: SEEK_STEP_SECONDS,
  ArrowLeft: -SEEK_STEP_SECONDS,
  ArrowDown: -SEEK_STEP_SECONDS,
  PageUp: SEEK_STEP_LARGE_SECONDS,
  PageDown: -SEEK_STEP_LARGE_SECONDS,
};

/** Options for {@link useWaveformSeek}. */
export interface UseWaveformSeekOptions {
  /** Ref to the seekable track element (its width maps pointer position → time). */
  trackRef: React.RefObject<HTMLElement | null>;
  /** Total duration in seconds, or `undefined` until known. */
  displayDuration: number | undefined;
  /** Current playback position in seconds. */
  currentTime: number;
  /** Seek to a time in seconds. */
  seekTo: (time: number) => void;
  /** Suppress position updates while a manual scrub is in progress. */
  setSeeking: (seeking: boolean) => void;
  /** Accessible name for the slider. @default "Seek" */
  label?: string;
}

/** ARIA + event props to spread onto the seekable track element. */
export interface WaveformSeekProps {
  role: "slider";
  tabIndex: 0;
  "aria-label": string;
  "aria-orientation": "horizontal";
  "aria-valuemin": 0;
  "aria-valuemax": number | undefined;
  "aria-valuenow": number;
  "aria-valuetext": string | undefined;
  onPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
}

/**
 * Turns a waveform track into a keyboard- and pointer-seekable slider. Handles
 * click/drag position math (via window listeners so drags can leave the element)
 * and Arrow/Page/Home/End stepping, and returns ARIA slider props to spread onto
 * the track. Shared by waveform players so seek behaviour isn't reimplemented.
 */
export function useWaveformSeek({
  trackRef,
  displayDuration,
  currentTime,
  seekTo,
  setSeeking,
  label = "Seek",
}: UseWaveformSeekOptions): WaveformSeekProps {
  const [isDragging, setIsDragging] = React.useState(false);

  const seekFromClientX = React.useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track || displayDuration === undefined) return;
      const rect = track.getBoundingClientRect();
      if (rect.width <= 0) return;
      const fraction = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      seekTo(fraction * displayDuration);
    },
    [trackRef, displayDuration, seekTo],
  );

  React.useEffect(() => {
    if (!isDragging) return;
    const handleMove = (event: PointerEvent) => seekFromClientX(event.clientX);
    const handleUp = () => {
      setIsDragging(false);
      setSeeking(false);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [isDragging, seekFromClientX, setSeeking]);

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    seekFromClientX(event.clientX);
    setSeeking(true);
    setIsDragging(true);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (displayDuration === undefined) return;
    const delta = STEP_BY_KEY[event.key];
    if (delta !== undefined) {
      event.preventDefault();
      seekTo(currentTime + delta);
    } else if (event.key === "Home") {
      event.preventDefault();
      seekTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      seekTo(displayDuration);
    }
  };

  return {
    role: "slider",
    tabIndex: 0,
    "aria-label": label,
    "aria-orientation": "horizontal",
    "aria-valuemin": 0,
    "aria-valuemax": displayDuration,
    "aria-valuenow": Math.round(currentTime),
    "aria-valuetext":
      displayDuration !== undefined
        ? `${formatTime(currentTime)} of ${formatTime(displayDuration)}`
        : undefined,
    onPointerDown,
    onKeyDown,
  };
}
