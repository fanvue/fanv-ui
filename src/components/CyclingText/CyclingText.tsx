import * as React from "react";
import { cn } from "../../utils/cn";

const DEFAULT_INTERVAL_MS = 2100;
const DEFAULT_TRANSITION_MS = 380;

/** How the wrapper should be sized to accommodate variable-length items. */
export type CyclingTextSizing = "longest" | "current";

export interface CyclingTextProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Strings to cycle through, in order. Cycles back to the first after the last. */
  items: readonly string[];
  /** Time each item is fully visible before the next transition starts. @default 2100 */
  intervalMs?: number;
  /** Slide animation duration. @default 380 */
  transitionMs?: number;
  /** Direction the outgoing item slides. @default "up" */
  direction?: "up" | "down";
  /** When true, freezes on the current item — no further cycling until cleared. @default false */
  paused?: boolean;
  /**
   * How the wrapper sizes itself horizontally.
   * - `longest` reserves space for the longest item — no width jitter as items cycle.
   * - `current` shrinks/grows with each item, animating width between cycles.
   * @default "longest"
   */
  sizing?: CyclingTextSizing;
  /**
   * Class applied to each visible label span (current + incoming). Use this for
   * effects that have to sit on the text element itself, e.g. `background-clip: text`.
   */
  labelClassName?: string;
}

const useReducedMotion = () => {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
};

const useDocumentVisible = () => {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return visible;
};

/**
 * Cycles through a list of strings with a slide-in/slide-out animation. Lives
 * inline so it can sit inside divs, spans, buttons, or as a fake placeholder
 * overlay.
 *
 * @example
 * ```tsx
 * <CyclingText items={["Thinking", "Reading messages", "Drafting reply"]} />
 * ```
 */
export const CyclingText = React.forwardRef<HTMLSpanElement, CyclingTextProps>(
  (
    {
      items,
      intervalMs = DEFAULT_INTERVAL_MS,
      transitionMs = DEFAULT_TRANSITION_MS,
      direction = "up",
      paused = false,
      sizing = "longest",
      className,
      labelClassName,
      ...rest
    },
    ref,
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: coordinates timers, resize observation, and motion layers
  ) => {
    const reducedMotion = useReducedMotion();
    const docVisible = useDocumentVisible();

    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [incomingIndex, setIncomingIndex] = React.useState<number | null>(null);
    const [incomingEntered, setIncomingEntered] = React.useState(false);
    const [transitioning, setTransitioning] = React.useState(false);

    const currentIndexRef = React.useRef(0);
    const intervalIdRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
    const swapTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const enterFrameRef = React.useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
    const widthFrameRef = React.useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

    const sizingLabelRef = React.useRef<HTMLSpanElement | null>(null);
    const [trackWidth, setTrackWidth] = React.useState<number | null>(null);

    const itemCount = items.length;
    const safeCurrentIndex = itemCount === 0 ? 0 : currentIndex % itemCount;
    const safeIncomingIndex =
      incomingIndex === null || itemCount === 0 ? null : incomingIndex % itemCount;

    const currentLabel = itemCount === 0 ? "" : (items[safeCurrentIndex] ?? "");
    const incomingLabel = safeIncomingIndex === null ? null : (items[safeIncomingIndex] ?? "");

    // For sizing="longest", the sizing label is whichever string is longest by length.
    // For sizing="current", track the visible/incoming item to animate width.
    const longestItem = React.useMemo(() => {
      if (itemCount === 0) return "";
      let longest = items[0] ?? "";
      for (const item of items) {
        if (item.length > longest.length) longest = item;
      }
      return longest;
    }, [items, itemCount]);

    const sizingLabel =
      sizing === "longest"
        ? longestItem
        : incomingLabel && incomingLabel.length > currentLabel.length
          ? incomingLabel
          : currentLabel;

    // Reset to a valid index if items shrink underneath us.
    React.useEffect(() => {
      if (itemCount === 0) return;
      if (currentIndexRef.current >= itemCount) {
        currentIndexRef.current = 0;
        setCurrentIndex(0);
        setIncomingIndex(null);
        setIncomingEntered(false);
        setTransitioning(false);
      }
    }, [itemCount]);

    const clearTimers = React.useCallback(() => {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      if (swapTimeoutRef.current !== null) {
        clearTimeout(swapTimeoutRef.current);
        swapTimeoutRef.current = null;
      }
      if (enterFrameRef.current !== null) {
        cancelAnimationFrame(enterFrameRef.current);
        enterFrameRef.current = null;
      }
    }, []);

    const shouldCycle = !paused && docVisible && itemCount > 1;

    React.useEffect(() => {
      if (!shouldCycle) {
        return;
      }

      intervalIdRef.current = setInterval(() => {
        const next = (currentIndexRef.current + 1) % itemCount;
        setIncomingIndex(next);
        setIncomingEntered(false);
        setTransitioning(true);

        if (reducedMotion) {
          // Hard swap — no slide.
          currentIndexRef.current = next;
          setCurrentIndex(next);
          setTransitioning(false);
          setIncomingIndex(null);
          setIncomingEntered(false);
          return;
        }

        if (enterFrameRef.current !== null) {
          cancelAnimationFrame(enterFrameRef.current);
        }
        enterFrameRef.current = requestAnimationFrame(() => {
          setIncomingEntered(true);
          enterFrameRef.current = null;
        });

        if (swapTimeoutRef.current !== null) {
          clearTimeout(swapTimeoutRef.current);
        }
        swapTimeoutRef.current = setTimeout(() => {
          currentIndexRef.current = next;
          setCurrentIndex(next);
          setTransitioning(false);
          setIncomingEntered(false);
          setIncomingIndex(null);
          swapTimeoutRef.current = null;
        }, transitionMs);
      }, intervalMs);

      return clearTimers;
    }, [shouldCycle, itemCount, intervalMs, transitionMs, reducedMotion, clearTimers]);

    // Cancel any in-flight transition when paused mid-animation.
    React.useEffect(() => {
      if (paused) {
        clearTimers();
        setIncomingIndex(null);
        setIncomingEntered(false);
        setTransitioning(false);
      }
    }, [paused, clearTimers]);

    React.useEffect(() => clearTimers, [clearTimers]);

    // Width tracking via ResizeObserver — handles font load + parent resize.
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

    if (itemCount === 0) {
      return null;
    }

    const outgoingTranslate = direction === "up" ? "-translate-y-[105%]" : "translate-y-[105%]";
    const incomingStartTranslate =
      direction === "up" ? "translate-y-[105%]" : "-translate-y-[105%]";

    // Static Tailwind classes only — duration is applied via inline style so
    // arbitrary transitionMs values don't have to be pre-emitted by the JIT.
    const motionClasses = reducedMotion
      ? ""
      : "transition-transform ease-[cubic-bezier(0.22,1,0.36,1)]";

    const labelStyle: React.CSSProperties = reducedMotion
      ? {}
      : { transitionDuration: transitioning ? `${transitionMs}ms` : "0ms" };

    const incomingStyle: React.CSSProperties = reducedMotion
      ? {}
      : { transitionDuration: `${transitionMs}ms` };

    const wrapperStyle: React.CSSProperties =
      trackWidth !== null ? { width: `${trackWidth}px` } : {};

    return (
      <span
        ref={ref}
        data-testid="cycling-text"
        data-paused={paused ? "true" : undefined}
        className={cn(
          "relative inline-block overflow-hidden transition-[width] duration-300 ease-out",
          className,
        )}
        style={wrapperStyle}
        {...rest}
      >
        {/* Sizing layer — invisible, sets natural width of the wrapper. */}
        <span
          ref={sizingLabelRef}
          aria-hidden="true"
          className="pointer-events-none invisible inline-block select-none whitespace-nowrap"
        >
          {sizingLabel}
        </span>

        {/* Current (visible) item — slides out when transitioning. */}
        <span
          aria-live="polite"
          aria-atomic="true"
          className={cn(
            "absolute inset-0 whitespace-nowrap",
            motionClasses,
            transitioning && !reducedMotion ? outgoingTranslate : "translate-y-0",
            labelClassName,
          )}
          style={labelStyle}
        >
          {currentLabel}
        </span>

        {/* Incoming item — only mounted during the transition. */}
        {incomingLabel !== null && !reducedMotion && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-0 whitespace-nowrap",
              motionClasses,
              incomingEntered ? "translate-y-0" : incomingStartTranslate,
              labelClassName,
            )}
            style={incomingStyle}
          >
            {incomingLabel}
          </span>
        )}
      </span>
    );
  },
);

CyclingText.displayName = "CyclingText";
