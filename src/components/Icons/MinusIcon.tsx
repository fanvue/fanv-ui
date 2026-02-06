import * as React from "react";
import type { IconProps } from "./types";

/** Small minus/indeterminate icon for use in checkbox components (12x12 viewBox) */
export const MinusIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 3, className, ...props }, ref) => (
    <svg
      ref={ref}
      width={size * 4}
      height={size * 4}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M2 6h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
);

MinusIcon.displayName = "MinusIcon";
