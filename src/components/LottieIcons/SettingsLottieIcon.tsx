import * as React from "react";
import { SettingsIcon } from "../Icons/SettingsIcon";
import { LottieIcon } from "./LottieIcon";
import type { LottieIconProps } from "./types";

/** Props for {@link SettingsLottieIcon}. See {@link LottieIconProps}. */
export type SettingsLottieIconProps = LottieIconProps;

/**
 * Animated settings (gear) icon. Plays on hover/focus of the closest
 * interactive ancestor; renders {@link SettingsIcon} as the static fallback
 * while the Lottie runtime and animation JSON are fetched.
 */
export const SettingsLottieIcon = React.forwardRef<HTMLSpanElement, SettingsLottieIconProps>(
  (props, ref) => (
    <LottieIcon
      ref={ref}
      Fallback={SettingsIcon}
      loadAnimationData={() => import("./data/setting-4.json")}
      {...props}
    />
  ),
);
SettingsLottieIcon.displayName = "SettingsLottieIcon";
