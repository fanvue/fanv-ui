import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const TickIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
          strokeWidth="1.5"
          d="m5 12 5 5 9.5-9.5"
        />
      </svg>
    );
  },
);

TickIcon.displayName = "TickIcon";
