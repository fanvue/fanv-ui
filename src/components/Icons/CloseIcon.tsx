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
          <path d="m8.466 8.468 7.071 7.071M15.537 8.46l-7.071 7.072" />
        </g>
      </svg>
    );
  },
);

CloseIcon.displayName = "CloseIcon";
