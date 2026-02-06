import * as React from "react";
import type { IconProps } from "./types";

export const ArrowUpRightIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 5, className, ...props }, ref) => (
    <svg
      ref={ref}
      width={size * 4}
      height={size * 4}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z"
        clipRule="evenodd"
      />
    </svg>
  ),
);

ArrowUpRightIcon.displayName = "ArrowUpRightIcon";
