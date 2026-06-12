import * as React from "react";
import { CoinIcon } from "../Icons/CoinIcon";
import { LottieIcon } from "./LottieIcon";
import type { LottieIconProps } from "./types";

/** Props for {@link CoinLottieIcon}. See {@link LottieIconProps}. */
export type CoinLottieIconProps = LottieIconProps;

/**
 * Animated coin (dollar) icon. Plays on hover/focus of the closest
 * interactive ancestor; renders {@link CoinIcon} as the static fallback while
 * the Lottie runtime and animation JSON are fetched.
 */
export const CoinLottieIcon = React.forwardRef<HTMLSpanElement, CoinLottieIconProps>(
  (props, ref) => (
    <LottieIcon
      ref={ref}
      Fallback={CoinIcon}
      loadAnimationData={() => import("./data/dollar-square.json")}
      {...props}
    />
  ),
);
CoinLottieIcon.displayName = "CoinLottieIcon";
