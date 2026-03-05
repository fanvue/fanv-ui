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
          fill="currentColor"
          d="M10.58 15.58a.75.75 0 0 1-.53-.22l-2.83-2.83a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l2.3 2.3 5.14-5.14c.29-.29.77-.29 1.06 0s.29.77 0 1.06l-5.67 5.67a.75.75 0 0 1-.53.22"
        />
      </svg>
    );
  },
);

TickIcon.displayName = "TickIcon";
