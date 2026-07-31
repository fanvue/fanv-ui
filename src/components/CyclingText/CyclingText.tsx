import * as React from "react";
import { cn } from "../../utils/cn";
import { useCyclingCycle } from "./useCyclingCycle";
import { useCyclingMotion } from "./useCyclingMotion";
import { useCyclingTextTrackWidth } from "./useCyclingTextTrackWidth";
import { usePageVisibility } from "./usePageVisibility";

const DEFAULT_INTERVAL_MS = 2100;
const DEFAULT_TRANSITION_MS = 200;

/** How the wrapper should be sized to accommodate variable-length items. */
export type CyclingTextSizing = "longest" | "current";

export interface CyclingTextProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Strings to cycle through, in order. Cycles back to the first after the last. */
  items: readonly string[];
  /**
   * Milliseconds to wait after the previous transition finishes before starting the next one.
   * @default 2100
   */
  intervalMs?: number;
  /** Slide and cross-fade duration in milliseconds. @default 200 */
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
   * When `true`, updates are exposed to assistive technologies via `aria-live="polite"`.
   * Leave `false` for decorative or frequently changing copy so screen readers are not interrupted on every cycle.
   * @default false
   */
  announceChanges?: boolean;
  /**
   * Class applied to each visible label span (current + incoming). Use this for
   * effects that have to sit on the text element itself, e.g. `background-clip: text`.
   */
  labelClassName?: string;
  /**
   * Called with the index of the settled, fully-visible item — once on mount and
   * again whenever it changes (after each transition completes). Lets a parent
   * stay in lockstep with what is on screen (e.g. to act on the item the user is
   * currently looking at) without running a second, drifting timer of its own.
   */
  onActiveIndexChange?: (index: number) => void;
}

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
      announceChanges = false,
      onActiveIndexChange,
      ...rest
    },
    ref,
  ) => {
    const docVisible = usePageVisibility();
    const { sizingLabelRef, trackWidth } = useCyclingTextTrackWidth();
    const {
      cycle,
      currentIndex,
      currentLabel,
      incomingLabel,
      sizingLabel,
      onOutgoingTransitionEnd,
    } = useCyclingCycle(items, sizing, intervalMs, paused, docVisible, transitionMs);

    const itemCount = items.length;

    // Notify the parent of the settled active index without re-subscribing when
    // an inline callback identity changes each render — the latest is always
    // read from the ref.
    const onActiveIndexChangeRef = React.useRef(onActiveIndexChange);
    React.useEffect(() => {
      onActiveIndexChangeRef.current = onActiveIndexChange;
    }, [onActiveIndexChange]);
    React.useEffect(() => {
      onActiveIndexChangeRef.current?.(currentIndex);
    }, [currentIndex]);

    const { outgoingStyle, incomingStyle } = useCyclingMotion({
      transitioning: cycle.transitioning,
      incomingEntered: cycle.incomingEntered,
      direction,
      transitionMs,
    });

    if (itemCount === 0) {
      return null;
    }

    const wrapperStyle = {
      ...(trackWidth !== null ? { width: `${trackWidth}px` } : {}),
    } as React.CSSProperties;

    const showIncoming = incomingLabel !== null && cycle.transitioning;

    return (
      <span
        ref={ref}
        data-testid="cycling-text"
        data-paused={paused ? "true" : undefined}
        className={cn(
          "relative inline-flex items-center overflow-hidden align-middle leading-[inherit]",
          "motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-out",
          className,
        )}
        style={wrapperStyle}
        {...rest}
      >
        <span
          ref={sizingLabelRef}
          aria-hidden="true"
          className={cn(
            "pointer-events-none invisible inline-block select-none whitespace-nowrap leading-[inherit]",
            labelClassName,
          )}
        >
          {sizingLabel}
        </span>

        <span
          data-layer="current"
          aria-live={announceChanges ? "polite" : undefined}
          aria-atomic={announceChanges ? true : undefined}
          data-state={cycle.transitioning ? "exit" : "idle"}
          onTransitionEnd={onOutgoingTransitionEnd}
          className={cn(
            "absolute inset-0 flex items-center whitespace-nowrap leading-[inherit]",
            labelClassName,
          )}
          style={outgoingStyle}
        >
          {currentLabel}
        </span>

        {showIncoming ? (
          <span
            aria-hidden="true"
            data-layer="incoming"
            data-state={cycle.incomingEntered ? "idle" : "enter"}
            className={cn(
              "absolute inset-0 flex items-center whitespace-nowrap leading-[inherit]",
              labelClassName,
            )}
            style={incomingStyle}
          >
            {incomingLabel}
          </span>
        ) : null}
      </span>
    );
  },
);

CyclingText.displayName = "CyclingText";
