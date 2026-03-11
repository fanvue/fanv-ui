import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const DoubleTickIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
          <path d="m8 11.5 5 5L22.5 7M2 11.5l5 5L8.5 15m8-8-4.75 4.75" />
        </g>
      </svg>
    );
  },
);

DoubleTickIcon.displayName = "DoubleTickIcon";
