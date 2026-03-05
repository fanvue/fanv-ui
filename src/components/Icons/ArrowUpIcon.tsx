import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const ArrowUpIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        strokeMiterlimit="10"
        strokeWidth="1.5"
        d="M18.07 9.57 12 3.5 5.93 9.57M12 20.5V3.67"
      />
    </svg>
  ),
);

ArrowUpIcon.displayName = "ArrowUpIcon";
