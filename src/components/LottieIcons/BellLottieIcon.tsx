import * as React from "react";
import { BellIcon } from "../Icons/BellIcon";
import { LottieIcon } from "./LottieIcon";
import type { LottieIconProps } from "./types";

/** Props for {@link BellLottieIcon}. See {@link LottieIconProps}. */
export type BellLottieIconProps = LottieIconProps;

/**
 * Animated bell (notification) icon. Plays on hover/focus of the closest
 * interactive ancestor; renders {@link BellIcon} as the static fallback while
 * the Lottie runtime and animation JSON are fetched.
 */
export const BellLottieIcon = React.forwardRef<HTMLSpanElement, BellLottieIconProps>(
  (props, ref) => (
    <LottieIcon
      ref={ref}
      Fallback={BellIcon}
      loadAnimationData={() => import("./data/notification.json")}
      {...props}
    />
  ),
);
BellLottieIcon.displayName = "BellLottieIcon";
