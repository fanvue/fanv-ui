import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const ChartIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M17 22.75H7c-3.17 0-5.75-2.58-5.75-5.75V7c0-3.17 2.58-5.75 5.75-5.75h10c3.17 0 5.75 2.58 5.75 5.75v10c0 3.17-2.58 5.75-5.75 5.75m-10-20A4.26 4.26 0 0 0 2.75 7v10A4.26 4.26 0 0 0 7 21.25h10A4.26 4.26 0 0 0 21.25 17V7A4.26 4.26 0 0 0 17 2.75z" />
          <path d="M7 18.25c-.41 0-.75-.34-.75-.75v-11c0-.41.34-.75.75-.75s.75.34.75.75v11c0 .41-.34.75-.75.75M12 18.25c-.41 0-.75-.34-.75-.75v-7c0-.41.34-.75.75-.75s.75.34.75.75v7c0 .41-.34.75-.75.75M17 18.25c-.41 0-.75-.34-.75-.75v-4c0-.41.34-.75.75-.75s.75.34.75.75v4c0 .41-.34.75-.75.75" />
        </g>
      </svg>
    );
  },
);

ChartIcon.displayName = "ChartIcon";
