import * as React from "react";
import { getRecordingMimeType } from "./audioUtils";
import { DEFAULT_MAX_RECORDING_DURATION, DEFAULT_MIN_RECORDING_DURATION } from "./constants";

export interface UseAudioRecorderOptions {
  /** Maximum recording duration in seconds. @default 30 */
  maxDuration?: number;
  /** Minimum recording duration in seconds. @default 5 */
  minDuration?: number;
  /** Called when recording completes successfully (meets minimum duration) */
  onComplete?: (blob: Blob, durationMs: number) => void;
  /** Called when recording is stopped but does not meet minimum duration */
  onTooShort?: (durationMs: number, minDurationMs: number) => void;
  /** Called when microphone permission is denied or unavailable */
  onPermissionError?: (error: Error) => void;
  /** Called on any recording error */
  onError?: (error: Error) => void;
}

export interface UseAudioRecorderReturn {
  /** Whether audio is currently being recorded */
  isRecording: boolean;
  /** Elapsed recording time in milliseconds */
  elapsedMs: number;
  /** Start recording. Requests mic permission if needed. */
  startRecording: () => Promise<void>;
  /** Stop recording. Triggers onComplete or onTooShort callback. */
  stopRecording: () => void;
  /** AnalyserNode for waveform visualization (null when not recording) */
  analyserNode: AnalyserNode | null;
  /** Whether the browser supports audio recording */
  isSupported: boolean;
}

function stopMediaTracks(stream: MediaStream | null) {
  if (!stream) return;
  for (const track of stream.getTracks()) {
    track.stop();
  }
}

function closeAudioContext(ctx: AudioContext | null) {
  if (ctx?.state !== "closed") {
    ctx?.close();
  }
}

function classifyMediaError(error: unknown): { handler: "permission" | "error"; error: Error } {
  const err = error instanceof Error ? error : new Error(String(error));
  // Read name from the original error — DOMException may not extend Error in all environments
  const name = (error as { name?: string })?.name ?? err.name;
  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    return { handler: "permission", error: err };
  }
  if (name === "NotFoundError") {
    return { handler: "permission", error: new Error("No microphone found on this device") };
  }
  return { handler: "error", error: err };
}

/**
 * Hook for audio recording with MediaRecorder API.
 * Provides recording controls, timer, and an AnalyserNode for waveform visualization.
 */
export function useAudioRecorder(options: UseAudioRecorderOptions = {}): UseAudioRecorderReturn {
  const {
    maxDuration = DEFAULT_MAX_RECORDING_DURATION,
    minDuration = DEFAULT_MIN_RECORDING_DURATION,
    onComplete,
    onTooShort,
    onPermissionError,
    onError,
  } = options;

  const [isRecording, setIsRecording] = React.useState(false);
  const [elapsedMs, setElapsedMs] = React.useState(0);
  const [analyserNode, setAnalyserNode] = React.useState<AnalyserNode | null>(null);

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const streamRef = React.useRef<MediaStream | null>(null);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const sourceNodeRef = React.useRef<MediaStreamAudioSourceNode | null>(null);
  const startTimeRef = React.useRef<number>(0);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Store latest callbacks in refs to avoid re-creating startRecording/stopRecording
  const onCompleteRef = React.useRef(onComplete);
  const onTooShortRef = React.useRef(onTooShort);
  const onPermissionErrorRef = React.useRef(onPermissionError);
  const onErrorRef = React.useRef(onError);
  onCompleteRef.current = onComplete;
  onTooShortRef.current = onTooShort;
  onPermissionErrorRef.current = onPermissionError;
  onErrorRef.current = onError;

  const maxDurationMs = maxDuration * 1000;
  const minDurationMs = minDuration * 1000;

  const isSupported = React.useMemo(
    () =>
      typeof window !== "undefined" &&
      typeof navigator !== "undefined" &&
      typeof navigator.mediaDevices?.getUserMedia === "function" &&
      typeof MediaRecorder !== "undefined",
    [],
  );

  const resetState = React.useCallback(() => {
    sourceNodeRef.current?.disconnect();
    sourceNodeRef.current = null;
    stopMediaTracks(streamRef.current);
    streamRef.current = null;
    closeAudioContext(audioContextRef.current);
    audioContextRef.current = null;
    setAnalyserNode(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    intervalRef.current = null;
    timeoutRef.current = null;
    setIsRecording(false);
    setElapsedMs(0);
  }, []);

  const cleanup = React.useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    resetState();
  }, [resetState]);

  const handleRecordingStop = React.useCallback(
    (mimeType: string) => {
      const elapsed = Date.now() - startTimeRef.current;
      const chunks = audioChunksRef.current;

      resetState();
      mediaRecorderRef.current = null;
      audioChunksRef.current = [];

      if (chunks.length === 0) return;

      const blob = new Blob(chunks, { type: mimeType });

      if (elapsed < minDurationMs) {
        onTooShortRef.current?.(elapsed, minDurationMs);
      } else {
        onCompleteRef.current?.(blob, elapsed);
      }
    },
    [minDurationMs, resetState],
  );

  const startRecording = React.useCallback(async () => {
    if (!isSupported) {
      onErrorRef.current?.(new Error("Audio recording is not supported in this browser"));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      sourceNodeRef.current = source;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      setAnalyserNode(analyser);

      const mimeType = getRecordingMimeType();
      const recorderOptions = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, recorderOptions);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = () => handleRecordingStop(mediaRecorder.mimeType);
      mediaRecorder.onerror = () => {
        onErrorRef.current?.(new Error("Recording failed"));
        cleanup();
      };

      mediaRecorder.start();
      startTimeRef.current = Date.now();
      setIsRecording(true);
      setElapsedMs(0);
      intervalRef.current = setInterval(() => {
        setElapsedMs(Date.now() - startTimeRef.current);
      }, 200);
      timeoutRef.current = setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      }, maxDurationMs);
    } catch (error) {
      cleanup();
      const classified = classifyMediaError(error);
      if (classified.handler === "permission") {
        onPermissionErrorRef.current?.(classified.error);
      } else {
        onErrorRef.current?.(classified.error);
      }
    }
  }, [isSupported, maxDurationMs, handleRecordingStop, cleanup]);

  const stopRecording = React.useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  React.useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    isRecording,
    elapsedMs,
    startRecording,
    stopRecording,
    analyserNode,
    isSupported,
  };
}
