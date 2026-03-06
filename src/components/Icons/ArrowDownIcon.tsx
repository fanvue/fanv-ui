import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const ArrowDownIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12 21.25c-.19 0-.38-.07-.53-.22L5.4 14.96a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0L12 19.44l5.54-5.54c.29-.29.77-.29 1.06 0s.29.77 0 1.06l-6.07 6.07c-.15.15-.34.22-.53.22"
        />
        <path
          fill="currentColor"
          d="M12 21.08c-.41 0-.75-.34-.75-.75V3.5c0-.41.34-.75.75-.75s.75.34.75.75v16.83c0 .41-.34.75-.75.75"
        />
      </svg>
    );
  },
);

ArrowDownIcon.displayName = "ArrowDownIcon";
