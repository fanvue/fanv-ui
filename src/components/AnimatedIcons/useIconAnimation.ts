import { useAnimation } from "motion/react";
import * as React from "react";
import { usePrefersReducedMotion } from "@/utils/usePrefersReducedMotion";
import type { AnimatedIconHandle } from "./types";

type IconAnimationControls = ReturnType<typeof useAnimation>;

/**
 * Variant labels an icon plays when the pointer arrives and when it leaves.
 *
 * Most upstream icons name them `animate`/`normal`, but not all — some use
 * `fadeOut`/`fadeIn`, some `initial`/`active` — and Motion resolves a label it
 * cannot find to nothing at all, silently. So the labels travel with the icon
 * instead of being assumed here, and `import-animated-icons.mjs` reads them out
 * of the upstream component and checks them against the variant tables it emits.
 */
const DEFAULT_ENTER = ["animate"];
const DEFAULT_LEAVE = ["normal"];

interface IconAnimationOptions {
  /**
   * Ref for driving the animation from a parent. When set, the icon's own hover
   * trigger stands down and `onMouseEnter`/`onMouseLeave` are forwarded untouched.
   */
  controlRef?: React.Ref<AnimatedIconHandle>;
  onMouseEnter?: React.MouseEventHandler<SVGSVGElement>;
  onMouseLeave?: React.MouseEventHandler<SVGSVGElement>;
  /** Variant labels to play on pointer enter, in order. @default ["animate"] */
  enter?: readonly string[];
  /** Variant labels to play on pointer leave, in order. @default ["normal"] */
  leave?: readonly string[];
}

interface UseIconAnimationHandlersOptions extends IconAnimationOptions {
  /** Every controller the icon drives. Labels are played across all of them. */
  controls: readonly IconAnimationControls[];
}

/**
 * Play `labels` in order across every controller, awaiting each step.
 *
 * A label a controller has no variant for is a no-op for that controller, which
 * is what lets one sequence drive several controllers animating different parts.
 */
async function play(controls: readonly IconAnimationControls[], labels: readonly string[]) {
  for (const label of labels) {
    await Promise.all(controls.map((c) => c.start(label)));
  }
}

/**
 * Hover handlers and imperative handle for an icon that drives several Motion
 * controllers at once. Single-controller icons use {@link useIconAnimation}.
 *
 * Internal.
 */
export function useIconAnimationHandlers({
  controls,
  controlRef,
  onMouseEnter,
  onMouseLeave,
  enter = DEFAULT_ENTER,
  leave = DEFAULT_LEAVE,
}: UseIconAnimationHandlersOptions) {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Derived during render, not latched in an effect: an icon whose `controlRef`
  // is conditional (`controlRef={isDesktop ? ref : undefined}`) gets its hover
  // trigger back the moment the ref goes away.
  const isControlled = controlRef != null;

  // The imperative handle is a layout effect, so a fresh object every render
  // would null and rebuild `controlRef.current` on every parent re-render. The
  // handle stays identity-stable and reads the current values through this ref.
  const latest = React.useRef({ controls, enter, leave, prefersReducedMotion });
  React.useEffect(() => {
    latest.current = { controls, enter, leave, prefersReducedMotion };
  });

  const startAnimation = React.useCallback(() => {
    const current = latest.current;
    if (current.prefersReducedMotion) return;
    play(current.controls, current.enter).catch(() => {});
  }, []);

  const stopAnimation = React.useCallback(() => {
    const current = latest.current;
    if (current.prefersReducedMotion) return;
    play(current.controls, current.leave).catch(() => {});
  }, []);

  React.useImperativeHandle(controlRef, () => ({ startAnimation, stopAnimation }), [
    startAnimation,
    stopAnimation,
  ]);

  const handleMouseEnter = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!isControlled && !prefersReducedMotion) {
      play(controls, enter).catch(() => {});
    }
    onMouseEnter?.(event);
  };

  const handleMouseLeave = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!isControlled && !prefersReducedMotion) {
      play(controls, leave).catch(() => {});
    }
    onMouseLeave?.(event);
  };

  return { handleMouseEnter, handleMouseLeave };
}

/**
 * Animation plumbing shared by every generated animated icon that drives a single
 * Motion controller: the controller, plus hover handlers that step aside when the
 * caller supplies a `controlRef`.
 *
 * Nothing animates when the user has asked for reduced motion — including through
 * `controlRef`, since the caller is driving the same artwork. `SpinnerIcon` is not
 * part of this set precisely because a loading indicator must keep moving.
 *
 * Internal.
 */
export function useIconAnimation(options: IconAnimationOptions = {}) {
  const controls = useAnimation();
  const { handleMouseEnter, handleMouseLeave } = useIconAnimationHandlers({
    ...options,
    controls: [controls],
  });

  return { controls, handleMouseEnter, handleMouseLeave };
}
