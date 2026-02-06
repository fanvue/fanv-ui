import * as React from "react";
import type { IconProps } from "./types";

export const PlusIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
      <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
    </svg>
  ),
);

PlusIcon.displayName = "PlusIcon";
