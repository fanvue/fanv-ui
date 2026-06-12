import * as React from "react";
import { MenuOpenIcon } from "../Icons/MenuOpenIcon";
import { LottieIcon } from "./LottieIcon";
import type { LottieIconProps } from "./types";

/** Props for {@link SidebarLeftLottieIcon}. See {@link LottieIconProps}. */
export type SidebarLeftLottieIconProps = LottieIconProps;

/**
 * Animated sidebar-left (expand) icon. Plays on hover/focus of the closest
 * interactive ancestor; renders {@link MenuOpenIcon} as the static fallback
 * while the Lottie runtime and animation JSON are fetched.
 */
export const SidebarLeftLottieIcon = React.forwardRef<HTMLSpanElement, SidebarLeftLottieIconProps>(
  (props, ref) => (
    <LottieIcon
      ref={ref}
      Fallback={MenuOpenIcon}
      loadAnimationData={() => import("./data/sidebar-left.json")}
      {...props}
    />
  ),
);
SidebarLeftLottieIcon.displayName = "SidebarLeftLottieIcon";
