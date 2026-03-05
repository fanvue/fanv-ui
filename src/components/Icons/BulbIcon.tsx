import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const BulbIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M17.5 16.03c-.19 0-.38-.07-.53-.22a.754.754 0 0 1 0-1.06 6.97 6.97 0 0 0 2.06-4.97c0-1.88-.73-3.64-2.06-4.97-2.74-2.74-7.2-2.74-9.94 0a6.97 6.97 0 0 0-2.06 4.97c0 1.88.73 3.64 2.06 4.97.29.29.29.77 0 1.06s-.77.29-1.06 0a8.47 8.47 0 0 1-2.5-6.03c0-2.28.89-4.42 2.5-6.03C9.3.42 14.71.42 18.03 3.75a8.47 8.47 0 0 1 2.5 6.03c0 2.28-.89 4.42-2.5 6.03-.15.15-.34.22-.53.22M15.33 19.42H8.66c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h6.67c.41 0 .75.34.75.75s-.34.75-.75.75M14.22 22.75H9.77c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h4.45c.41 0 .75.34.75.75s-.34.75-.75.75" />
        </g>
      </svg>
    );
  },
);

BulbIcon.displayName = "BulbIcon";
