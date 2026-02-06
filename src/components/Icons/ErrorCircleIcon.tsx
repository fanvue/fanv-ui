import * as React from "react";
import type { IconProps } from "./types";

export const ErrorCircleIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
        clipRule="evenodd"
      />
    </svg>
  ),
);

ErrorCircleIcon.displayName = "ErrorCircleIcon";
