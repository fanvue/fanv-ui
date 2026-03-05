import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const TaskIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M21 20.25H11c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h10c.41 0 .75.34.75.75s-.34.75-.75.75M21 13.25H11c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h10c.41 0 .75.34.75.75s-.34.75-.75.75M21 6.25H11c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h10c.41 0 .75.34.75.75s-.34.75-.75.75M4 7.25c-.19 0-.38-.07-.53-.22l-1-1a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l.47.47 2.47-2.47c.29-.29.77-.29 1.06 0s.29.77 0 1.06l-3 3c-.15.15-.34.22-.53.22M4 14.25c-.19 0-.38-.07-.53-.22l-1-1a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l.47.47 2.47-2.47c.29-.29.77-.29 1.06 0s.29.77 0 1.06l-3 3c-.15.15-.34.22-.53.22M4 21.25c-.19 0-.38-.07-.53-.22l-1-1a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l.47.47 2.47-2.47c.29-.29.77-.29 1.06 0s.29.77 0 1.06l-3 3c-.15.15-.34.22-.53.22" />
        </g>
      </svg>
    );
  },
);

TaskIcon.displayName = "TaskIcon";
