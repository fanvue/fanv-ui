import * as React from "react";
import { cn } from "@/utils/cn";
import { ICON_SIZE_CLASS } from "./iconSizeClass";
import type { IconProps, IconSize } from "./types";

/** Props for {@link SpinnerIcon}. */
export interface SpinnerIconProps extends Omit<IconProps, "size"> {
  /** Pixel size of the spinner. Omit it to keep the original 20px box. */
  size?: IconSize;
}

/**
 * A circular loading spinner that turns on its own. Under `prefers-reduced-motion`
 * it pulses in place instead of rotating. An `animate-spin` class from older call
 * sites is harmless: it sets the same animation, so the icon never turns twice as
 * fast. For a full-area loading state use the `Loader` component.
 *
 * @example
 * ```tsx
 * <SpinnerIcon size={16} />
 * ```
 */
export const SpinnerIcon = React.forwardRef<SVGSVGElement, SpinnerIconProps>(
  ({ className, size, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn(
        size ? ICON_SIZE_CLASS[size] : "size-5",
        "motion-safe:animate-spin motion-reduce:animate-pulse",
        className,
      )}
      {...props}
    >
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeOpacity=".25" strokeWidth="2" />
      <path d="M10 2a8 8 0 0 1 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
);

SpinnerIcon.displayName = "SpinnerIcon";
