import * as React from "react";
import { HomeIcon } from "../Icons/HomeIcon";
import { LottieIcon } from "./LottieIcon";
import type { LottieIconProps } from "./types";

/** Props for {@link HomeLottieIcon}. See {@link LottieIconProps}. */
export type HomeLottieIconProps = LottieIconProps;

/**
 * Animated home icon. Plays on hover/focus of the closest interactive
 * ancestor; renders {@link HomeIcon} as the static fallback while the Lottie
 * runtime and animation JSON are fetched.
 */
export const HomeLottieIcon = React.forwardRef<HTMLSpanElement, HomeLottieIconProps>(
  (props, ref) => (
    <LottieIcon
      ref={ref}
      Fallback={HomeIcon}
      loadAnimationData={() => import("./data/home-2.json")}
      {...props}
    />
  ),
);
HomeLottieIcon.displayName = "HomeLottieIcon";
