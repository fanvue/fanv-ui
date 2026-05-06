import * as React from "react";
import { MessageIcon } from "../Icons/MessageIcon";
import { LottieIcon } from "./LottieIcon";
import type { LottieIconProps } from "./types";

/** Props for {@link MessageLottieIcon}. See {@link LottieIconProps}. */
export type MessageLottieIconProps = LottieIconProps;

/**
 * Animated message icon. Plays on hover/focus of the closest interactive
 * ancestor; renders {@link MessageIcon} as the static fallback while the
 * Lottie runtime and animation JSON are fetched.
 */
export const MessageLottieIcon = React.forwardRef<HTMLSpanElement, MessageLottieIconProps>(
  (props, ref) => (
    <LottieIcon
      ref={ref}
      Fallback={MessageIcon}
      loadAnimationData={() => import("./data/message-favorite.json")}
      {...props}
    />
  ),
);
MessageLottieIcon.displayName = "MessageLottieIcon";
