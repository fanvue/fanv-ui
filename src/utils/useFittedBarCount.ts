import * as React from "react";

/** Options for {@link useFittedBarCount}. */
export interface UseFittedBarCountOptions {
  /** Rendered width of a single bar, in pixels. */
  barWidthPx: number;
  /** Gap between bars, in pixels. */
  gapPx: number;
  /** Bar count used before the track is measured (SSR, jsdom, or zero-width layout). */
  fallback: number;
}

/**
 * Measures a waveform track and returns how many fixed-width bars fit across it,
 * updating on resize. Lets callers resample their peaks to the *visible* bar
 * count so overflow bars aren't rendered (and, crucially, aren't counted when
 * computing playback progress).
 */
export function useFittedBarCount(
  trackRef: React.RefObject<HTMLElement | null>,
  { barWidthPx, gapPx, fallback }: UseFittedBarCountOptions,
): number {
  const [barCount, setBarCount] = React.useState(fallback);

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateFromWidth = (width: number) => {
      if (width <= 0) return;
      setBarCount(Math.max(1, Math.floor((width + gapPx) / (barWidthPx + gapPx))));
    };

    updateFromWidth(track.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) updateFromWidth(entry.contentRect.width);
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, [trackRef, barWidthPx, gapPx]);

  return barCount;
}
