import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/** Small checkmark icon for use in checkbox/toggle components (12x12 viewBox) */
export const CheckIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={cn("size-3", className)}
      {...props}
    >
      <path
        d="M10 3 4.5 8.5 2 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
);

CheckIcon.displayName = "CheckIcon";
