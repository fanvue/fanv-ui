import { useAnimation } from "motion/react";
import * as React from "react";
import type { AnimatedIconHandle } from "./types";

interface UseIconAnimationOptions {
  controlRef?: React.Ref<AnimatedIconHandle>;
  onMouseEnter?: React.MouseEventHandler<SVGSVGElement>;
  onMouseLeave?: React.MouseEventHandler<SVGSVGElement>;
}

/**
 * Animation plumbing shared by every generated animated icon: a Motion controller
 * plus hover handlers that step aside when the caller supplies a `controlRef`.
 *
 * Mirrors the upstream lucide-animated behaviour — hover plays the animation until
 * a ref is attached, at which point the caller owns playback. Internal.
 */
export function useIconAnimation({
  controlRef,
  onMouseEnter,
  onMouseLeave,
}: UseIconAnimationOptions) {
  const controls = useAnimation();
  // Set from the imperative handle's factory, which React only runs when a ref is
  // actually attached — so an icon with no `controlRef` keeps its hover trigger.
  const isControlledRef = React.useRef(false);

  React.useImperativeHandle(controlRef, () => {
    isControlledRef.current = true;

    return {
      startAnimation: () => controls.start("animate"),
      stopAnimation: () => controls.start("normal"),
    };
  });

  const handleMouseEnter = React.useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      if (isControlledRef.current) {
        onMouseEnter?.(event);
      } else {
        controls.start("animate");
        onMouseEnter?.(event);
      }
    },
    [controls, onMouseEnter],
  );

  const handleMouseLeave = React.useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      if (isControlledRef.current) {
        onMouseLeave?.(event);
      } else {
        controls.start("normal");
        onMouseLeave?.(event);
      }
    },
    [controls, onMouseLeave],
  );

  return { controls, handleMouseEnter, handleMouseLeave };
}
