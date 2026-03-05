import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const ChevronLeftIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={cn("size-6", className)}
        {...props}
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="1.5"
          d="m14 16-4-4 4-4"
        />
      </svg>
    );
  },
);

ChevronLeftIcon.displayName = "ChevronLeftIcon";
