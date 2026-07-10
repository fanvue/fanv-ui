import * as React from "react";

/** Options for {@link useAudioPlayback}. */
export interface UseAudioPlaybackOptions {
  /** URL of the audio to play. When absent, the hook stays idle (no media element attached). */
  src?: string;
  /** Fallback total duration (seconds) used until the media's own metadata loads. */
  duration?: number;
  /** Whether playback is active (controlled). */
  playing?: boolean;
  /** Initial playing state (uncontrolled). @default false */
  defaultPlaying?: boolean;
  /** Called when playback starts (via the toggle). */
  onPlay?: () => void;
  /** Called when playback pauses (via the toggle, a failed play(), or a src swap). */
  onPause?: () => void;
  /** Called when playback reaches the end of the media. */
  onEnded?: () => void;
}

/** Handlers to spread onto the backing `<audio>` element. */
export interface AudioElementHandlers {
  onLoadedMetadata: (event: React.SyntheticEvent<HTMLAudioElement>) => void;
  onTimeUpdate: (event: React.SyntheticEvent<HTMLAudioElement>) => void;
  onEnded: () => void;
}

/** Result of {@link useAudioPlayback}. */
export interface UseAudioPlaybackResult {
  /** Attach to the backing `<audio>` element. */
  audioRef: React.RefObject<HTMLAudioElement | null>;
  /** Current play/pause state (respects controlled `playing`). */
  isPlaying: boolean;
  /** Toggle play/pause, firing `onPlay`/`onPause`. */
  toggle: () => void;
  /** Current playback position in seconds. */
  currentTime: number;
  /** Media duration once known, else the `duration` fallback. */
  displayDuration: number | undefined;
  /** Playback progress, 0–1. */
  progress: number;
  /** Whether playback has begun (playing or scrubbed past 0). */
  hasStarted: boolean;
  /** Seek to a time in seconds (clamped to the duration). */
  seekTo: (time: number) => void;
  /** Suppress `timeupdate`-driven position updates while a manual scrub is in progress. */
  setSeeking: (seeking: boolean) => void;
  /** Handlers to spread onto the `<audio>` element. */
  audioHandlers: AudioElementHandlers;
}

/**
 * Drives a single `<audio>` element: controlled/uncontrolled play/pause, live
 * position + duration, seeking, and src-swap resets. Extracted from
 * {@link AudioPlayer} so waveform players (e.g. {@link VoiceNote}) can share the
 * same playback engine without duplicating the effect wiring.
 */
export function useAudioPlayback({
  src,
  duration,
  playing: controlledPlaying,
  defaultPlaying = false,
  onPlay,
  onPause,
  onEnded,
}: UseAudioPlaybackOptions): UseAudioPlaybackResult {
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const [internalPlaying, setInternalPlaying] = React.useState(defaultPlaying);
  const isControlled = controlledPlaying !== undefined;
  const isPlaying = isControlled ? controlledPlaying : internalPlaying;

  const [currentTime, setCurrentTime] = React.useState(0);
  const [mediaDuration, setMediaDuration] = React.useState<number | undefined>(undefined);
  const seekingRef = React.useRef(false);

  const displayDuration = mediaDuration ?? duration;
  const hasStarted = isPlaying || currentTime > 0;

  // Latest-value refs so the src-change effect can react to a src swap without
  // re-running whenever playing/isControlled/onPause change.
  const playingRef = React.useRef(isPlaying);
  playingRef.current = isPlaying;
  const isControlledRef = React.useRef(isControlled);
  isControlledRef.current = isControlled;
  const onPauseRef = React.useRef(onPause);
  onPauseRef.current = onPause;

  // Reset transient playback state on source change; skip the initial mount and,
  // if playback was active, stop it (the browser drops playback on a src swap).
  const isFirstSrcRenderRef = React.useRef(true);
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally keyed on src to reset transient state on a source swap
  React.useEffect(() => {
    if (isFirstSrcRenderRef.current) {
      isFirstSrcRenderRef.current = false;
      return;
    }
    setCurrentTime(0);
    setMediaDuration(undefined);
    if (playingRef.current) {
      if (!isControlledRef.current) setInternalPlaying(false);
      onPauseRef.current?.();
    }
  }, [src]);

  // Sync the controlled/uncontrolled playing state to the media element.
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {
        if (!isControlled) setInternalPlaying(false);
        onPauseRef.current?.();
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, isControlled]);

  const toggle = React.useCallback(() => {
    const next = !playingRef.current;
    if (!isControlledRef.current) setInternalPlaying(next);
    if (next) onPlay?.();
    else onPause?.();
  }, [onPlay, onPause]);

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

  const setSeeking = React.useCallback((seeking: boolean) => {
    seekingRef.current = seeking;
  }, []);

  const progress =
    displayDuration && displayDuration > 0
      ? Math.min(Math.max(currentTime / displayDuration, 0), 1)
      : 0;

  const audioHandlers = React.useMemo<AudioElementHandlers>(
    () => ({
      onLoadedMetadata: (event) => {
        const nativeDuration = event.currentTarget.duration;
        setMediaDuration(Number.isFinite(nativeDuration) ? nativeDuration : undefined);
      },
      onTimeUpdate: (event) => {
        if (seekingRef.current) return;
        setCurrentTime(event.currentTarget.currentTime);
      },
      onEnded: () => {
        setCurrentTime(0);
        if (!isControlledRef.current) setInternalPlaying(false);
        onEnded?.();
      },
    }),
    [onEnded],
  );

  return {
    audioRef,
    isPlaying,
    toggle,
    currentTime,
    displayDuration,
    progress,
    hasStarted,
    seekTo,
    setSeeking,
    audioHandlers,
  };
}
