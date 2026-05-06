import * as React from "react";
import { AppsIcon } from "../Icons/AppsIcon";
import { LottieIcon } from "./LottieIcon";
import type { LottieIconProps } from "./types";

/** Props for {@link AppsLottieIcon}. See {@link LottieIconProps}. */
export type AppsLottieIconProps = LottieIconProps;

/**
 * Animated apps grid icon. Plays on hover/focus of the closest interactive
 * ancestor; renders {@link AppsIcon} as the static fallback while the Lottie
 * runtime and animation JSON are fetched.
 */
export const AppsLottieIcon = React.forwardRef<HTMLSpanElement, AppsLottieIconProps>(
  (props, ref) => (
    <LottieIcon
      ref={ref}
      Fallback={AppsIcon}
      loadAnimationData={() => import("./data/element-plus.json")}
      {...props}
    />
  ),
);
AppsLottieIcon.displayName = "AppsLottieIcon";
