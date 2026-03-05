import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const MoreVerticalIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g fill="currentColor">
          <circle cx="12" cy="5" r="1.5" transform="rotate(-90 12 5)" />
          <circle cx="12" cy="12" r="1.5" transform="rotate(-90 12 12)" />
          <circle cx="12" cy="19" r="1.5" transform="rotate(-90 12 19)" />
        </g>
      </svg>
    );
  },
);

MoreVerticalIcon.displayName = "MoreVerticalIcon";
