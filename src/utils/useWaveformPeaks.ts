import * as React from "react";
import { decodeAudioPeaks, generateFallbackPeaks, RAW_PEAK_COUNT } from "./audioWaveform";

/**
 * Decodes `src` into waveform peak amplitudes (0–1). Seeds a deterministic
 * fallback immediately (stable across renders/SSR) and swaps in the real
 * decoded peaks once WebAudio resolves, falling back again on any failure.
 * Returns an empty array when `src` is absent.
 */
export function useWaveformPeaks(
  src: string | undefined,
  count: number = RAW_PEAK_COUNT,
): number[] {
  const [peaks, setPeaks] = React.useState<number[]>(() =>
    src ? generateFallbackPeaks(src, count) : [],
  );

  React.useEffect(() => {
    if (!src) {
      setPeaks([]);
      return;
    }

    setPeaks(generateFallbackPeaks(src, count));

    let cancelled = false;
    const abortController = new AbortController();
    decodeAudioPeaks(src, abortController.signal)
      .then((decoded) => {
        if (!cancelled) setPeaks(decoded);
      })
      .catch(() => {
        if (!cancelled) setPeaks(generateFallbackPeaks(src, count));
      });

    return () => {
      cancelled = true;
      abortController.abort();
    };
  }, [src, count]);

  return peaks;
}
