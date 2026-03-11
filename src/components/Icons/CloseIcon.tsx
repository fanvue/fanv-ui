import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const CloseIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g stroke="currentColor" strokeLinecap="round" strokeWidth="1.5">
          <path d="M7.003 7.006 17 17.003M17 6.996l-9.997 9.998" />
        </g>
      </svg>
    );
  },
);

CloseIcon.displayName = "CloseIcon";
