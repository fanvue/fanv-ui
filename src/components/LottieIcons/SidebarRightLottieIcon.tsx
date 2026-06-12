import * as React from "react";
import { MenuCloseIcon } from "../Icons/MenuCloseIcon";
import { LottieIcon } from "./LottieIcon";
import type { LottieIconProps } from "./types";

/** Props for {@link SidebarRightLottieIcon}. See {@link LottieIconProps}. */
export type SidebarRightLottieIconProps = LottieIconProps;

/**
 * Animated sidebar-right (collapse) icon. Plays on hover/focus of the closest
 * interactive ancestor; renders {@link MenuCloseIcon} as the static fallback
 * while the Lottie runtime and animation JSON are fetched.
 */
export const SidebarRightLottieIcon = React.forwardRef<
  HTMLSpanElement,
  SidebarRightLottieIconProps
>((props, ref) => (
  <LottieIcon
    ref={ref}
    Fallback={MenuCloseIcon}
    loadAnimationData={() => import("./data/sidebar-right.json")}
    {...props}
  />
));
SidebarRightLottieIcon.displayName = "SidebarRightLottieIcon";
