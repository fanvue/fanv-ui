import * as React from "react";
import { cn } from "@/utils/cn";
import { ICON_SIZE_CLASS } from "./iconSizeClass";
import { ICON_SPIN_CLASS } from "./iconSpinClass";
import type { BaseIconProps, IconProps, IconSize } from "./types";

/** Props for {@link SpinnerIcon}. */
export interface SpinnerIconProps extends Omit<IconProps, "size">, Pick<BaseIconProps, "spin"> {
  /** Pixel size of the spinner. Omit it to keep the original 20px box. */
  size?: IconSize;
}

/**
 * A circular spinner glyph for loading states. It is a plain icon: pass `spin`
 * to turn it, as with any other icon. The older `animate-spin` class still works
 * and never doubles the speed when combined with `spin`. For a full-area loading
 * state use the `Loader` component.
 *
 * @example
 * ```tsx
 * <SpinnerIcon size={16} spin />
 * ```
 */
export const SpinnerIcon = React.forwardRef<SVGSVGElement, SpinnerIconProps>(
  ({ className, size, spin = false, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn(size ? ICON_SIZE_CLASS[size] : "size-5", spin && ICON_SPIN_CLASS, className)}
      {...props}
    >
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeOpacity=".25" strokeWidth="2" />
      <path d="M10 2a8 8 0 0 1 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
);

SpinnerIcon.displayName = "SpinnerIcon";
