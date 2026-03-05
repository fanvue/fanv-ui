import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const ClockIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M16.5 13.42h-5.17c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h5.17c.41 0 .75.34.75.75s-.34.75-.75.75" />
          <path d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12S6.07 1.25 12 1.25 22.75 6.07 22.75 12 17.93 22.75 12 22.75m0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25S17.1 2.75 12 2.75" />
          <path d="M11.33 13.42c-.41 0-.75-.34-.75-.75V6.44c0-.41.34-.75.75-.75s.75.34.75.75v6.22c0 .41-.34.75-.75.75z" />
        </g>
      </svg>
    );
  },
);

ClockIcon.displayName = "ClockIcon";
