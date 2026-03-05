import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const ShareIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M16.96 6.17c2 1.39 3.38 3.6 3.66 6.15m-17.13.05a8.6 8.6 0 0 1 3.6-6.15m1.1 14.72c1.16.59 2.48.92 3.87.92 1.34 0 2.6-.3 3.73-.85M12.06 7.7a2.78 2.78 0 1 0 0-5.56 2.78 2.78 0 0 0 0 5.56M4.83 19.92a2.78 2.78 0 1 0 0-5.56 2.78 2.78 0 0 0 0 5.56m14.34 0a2.78 2.78 0 1 0 0-5.56 2.78 2.78 0 0 0 0 5.56"
      />
    </svg>
  ),
);

ShareIcon.displayName = "ShareIcon";
