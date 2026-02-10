import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const ChevronRightIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        d="M7.5 15L12.5 10L7.5 5"
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
);

ChevronRightIcon.displayName = "ChevronRightIcon";
