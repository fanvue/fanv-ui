import * as React from "react";
import { usePrefersReducedMotion } from "../../utils/usePrefersReducedMotion";

const SLIDE_OFFSET_PX = 18;
const EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

export interface CyclingMotionOptions {
  /** True while the outgoing item is sliding out and the incoming one is sliding in. */
  transitioning: boolean;
  /** True once the incoming item has been moved to its resting position. */
  incomingEntered: boolean;
  /** Direction the outgoing item slides. */
  direction: "up" | "down";
  /** Slide and cross-fade duration in milliseconds. */
  transitionMs: number;
}

export interface CyclingMotion {
  outgoingStyle: React.CSSProperties;
  incomingStyle: React.CSSProperties;
}

/**
 * Inline styles driving the slide and cross-fade between two cycling items.
 *
 * Kept as inline styles rather than utility classes because `transitionMs` is a
 * runtime prop. Reduced motion collapses the duration to zero, which leaves the
 * end states intact so items still swap, just without the movement; the cycle
 * itself is advanced by the fallback timer in `useCyclingCycle`, not by
 * `transitionend`, so it keeps running when no transition fires.
 */
export function useCyclingMotion({
  transitioning,
  incomingEntered,
  direction,
  transitionMs,
}: CyclingMotionOptions): CyclingMotion {
  const reducedMotion = usePrefersReducedMotion();
  const durMs = reducedMotion ? 0 : transitionMs;

  const outgoingStyle = React.useMemo((): React.CSSProperties => {
    const yExit = direction === "up" ? -SLIDE_OFFSET_PX : SLIDE_OFFSET_PX;
    return {
      opacity: transitioning ? 0 : 1,
      transform: transitioning ? `translate3d(0, ${yExit}px, 0)` : "translate3d(0, 0, 0)",
      // Only while exiting: returning to idle should snap, not animate back.
      transition:
        transitioning && durMs > 0
          ? `opacity ${durMs}ms ${EASING}, transform ${durMs}ms ${EASING}`
          : "none",
    };
  }, [transitioning, direction, durMs]);

  const incomingStyle = React.useMemo((): React.CSSProperties => {
    const yEnter = direction === "up" ? SLIDE_OFFSET_PX : -SLIDE_OFFSET_PX;
    return {
      opacity: incomingEntered ? 1 : 0,
      transform: incomingEntered ? "translate3d(0, 0, 0)" : `translate3d(0, ${yEnter}px, 0)`,
      transition:
        durMs > 0 ? `opacity ${durMs}ms ${EASING}, transform ${durMs}ms ${EASING}` : "none",
    };
  }, [incomingEntered, direction, durMs]);

  return { outgoingStyle, incomingStyle };
}
