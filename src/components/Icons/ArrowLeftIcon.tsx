import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const ArrowLeftIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M9.57 18.82c-.19 0-.38-.07-.53-.22l-6.07-6.07a.754.754 0 0 1 0-1.06L9.04 5.4c.29-.29.77-.29 1.06 0s.29.77 0 1.06L4.56 12l5.54 5.54c.29.29.29.77 0 1.06-.14.15-.34.22-.53.22"
        />
        <path
          fill="currentColor"
          d="M20.5 12.75H3.67c-.41 0-.75-.34-.75-.75s.34-.75.75-.75H20.5c.41 0 .75.34.75.75s-.34.75-.75.75"
        />
      </svg>
    );
  },
);

ArrowLeftIcon.displayName = "ArrowLeftIcon";
