import * as React from "react";
import { ChartIcon } from "../Icons/ChartIcon";
import { LottieIcon } from "./LottieIcon";
import type { LottieIconProps } from "./types";

/** Props for {@link ChartLottieIcon}. See {@link LottieIconProps}. */
export type ChartLottieIconProps = LottieIconProps;

/**
 * Animated chart icon. Plays on hover/focus of the closest interactive
 * ancestor; renders {@link ChartIcon} as the static fallback while the Lottie
 * runtime and animation JSON are fetched.
 */
export const ChartLottieIcon = React.forwardRef<HTMLSpanElement, ChartLottieIconProps>(
  (props, ref) => (
    <LottieIcon
      ref={ref}
      Fallback={ChartIcon}
      loadAnimationData={() => import("./data/chart-2.json")}
      {...props}
    />
  ),
);
ChartLottieIcon.displayName = "ChartLottieIcon";
