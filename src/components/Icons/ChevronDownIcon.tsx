import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/** A downward-pointing chevron icon (20 × 20). */
export const ChevronDownIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
);

ChevronDownIcon.displayName = "ChevronDownIcon";
