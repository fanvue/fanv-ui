import * as React from "react";
import { GalleryIcon } from "../Icons/GalleryIcon";
import { LottieIcon } from "./LottieIcon";
import type { LottieIconProps } from "./types";

/** Props for {@link GalleryLottieIcon}. See {@link LottieIconProps}. */
export type GalleryLottieIconProps = LottieIconProps;

/**
 * Animated gallery icon. Plays on hover/focus of the closest interactive
 * ancestor; renders {@link GalleryIcon} as the static fallback while the
 * Lottie runtime and animation JSON are fetched.
 */
export const GalleryLottieIcon = React.forwardRef<HTMLSpanElement, GalleryLottieIconProps>(
  (props, ref) => (
    <LottieIcon
      ref={ref}
      Fallback={GalleryIcon}
      loadAnimationData={() => import("./data/gallery-add.json")}
      {...props}
    />
  ),
);
GalleryLottieIcon.displayName = "GalleryLottieIcon";
