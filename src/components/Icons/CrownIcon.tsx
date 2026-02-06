import * as React from "react";
import type { IconProps } from "./types";

export const CrownIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
      <path d="M10 2a1 1 0 0 1 1 1v1.323l1.45-.363a1 1 0 0 1 .55 1.92l-1.15.288.5 1.5 2.5-.625a1 1 0 0 1 .62 1.9l-3 1.5a1 1 0 0 1-.9 0l-3-1.5a1 1 0 0 1 .62-1.9l2.5.625.5-1.5-1.15-.288a1 1 0 0 1 .55-1.92l1.45.363V3a1 1 0 0 1 1-1ZM4 8h12v8H4V8Z" />
    </svg>
  ),
);

CrownIcon.displayName = "CrownIcon";
