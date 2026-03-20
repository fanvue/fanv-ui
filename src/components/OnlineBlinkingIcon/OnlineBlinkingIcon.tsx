import * as React from "react";
import { cn } from "../../utils/cn";

export type OnlineBlinkingIconSize = "sm" | "md";

export interface OnlineBlinkingIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "sm" */
  size?: OnlineBlinkingIconSize;
}

const sizeClasses: Record<OnlineBlinkingIconSize, string> = {
  sm: "h-2 w-2",
  md: "h-3 w-3",
};

/**
 * A small pulsing green dot indicator used to show online status.
 * Decorative only — pair with a visually-hidden label at the usage site
 * to convey status to screen readers.
 *
 * @example
 * ```tsx
 * <OnlineBlinkingIcon />
 * <OnlineBlinkingIcon size="md" />
 * ```
 */
export const OnlineBlinkingIcon = React.forwardRef<HTMLSpanElement, OnlineBlinkingIconProps>(
  ({ className, size = "sm", ...props }, ref) => (
    <span
      ref={ref}
      className={cn("relative inline-block rounded-full", sizeClasses[size], className)}
      aria-hidden="true"
      {...props}
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-success-content opacity-75" />
      <span className="absolute inset-0 rounded-full bg-success-content" />
    </span>
  ),
);

OnlineBlinkingIcon.displayName = "OnlineBlinkingIcon";
