import * as React from "react";

/**
 * Observes the measured label node and stores its width so the wrapper can animate width
 * without layout thrash when fonts load or the parent resizes.
 */
export function useCyclingTextTrackWidth() {
  const sizingLabelRef = React.useRef<HTMLSpanElement | null>(null);
  const [trackWidth, setTrackWidth] = React.useState<number | null>(null);
  const widthFrameRef = React.useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  React.useEffect(() => {
    const node = sizingLabelRef.current;
    if (!node) return;

    const measure = () => {
      const next = Math.ceil(node.getBoundingClientRect().width);
      if (!next) return;
      if (widthFrameRef.current !== null) {
        cancelAnimationFrame(widthFrameRef.current);
      }
      widthFrameRef.current = requestAnimationFrame(() => {
        setTrackWidth(next);
        widthFrameRef.current = null;
      });
    };

    measure();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (widthFrameRef.current !== null) {
        cancelAnimationFrame(widthFrameRef.current);
        widthFrameRef.current = null;
      }
    };
  }, []);

  return { sizingLabelRef, trackWidth };
}
