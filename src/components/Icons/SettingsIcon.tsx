import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const SettingsIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M22 7.25h-6c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h6c.41 0 .75.34.75.75s-.34.75-.75.75M6 7.25H2c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h4c.41 0 .75.34.75.75s-.34.75-.75.75" />
          <path d="M10 10.75A4.26 4.26 0 0 1 5.75 6.5 4.26 4.26 0 0 1 10 2.25a4.26 4.26 0 0 1 4.25 4.25A4.26 4.26 0 0 1 10 10.75m0-7c-1.52 0-2.75 1.23-2.75 2.75S8.48 9.25 10 9.25s2.75-1.23 2.75-2.75S11.52 3.75 10 3.75M22 18.25h-4c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h4c.41 0 .75.34.75.75s-.34.75-.75.75M8 18.25H2c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h6c.41 0 .75.34.75.75s-.34.75-.75.75" />
          <path d="M14 21.75a4.26 4.26 0 0 1-4.25-4.25A4.26 4.26 0 0 1 14 13.25a4.26 4.26 0 0 1 4.25 4.25A4.26 4.26 0 0 1 14 21.75m0-7c-1.52 0-2.75 1.23-2.75 2.75s1.23 2.75 2.75 2.75 2.75-1.23 2.75-2.75-1.23-2.75-2.75-2.75" />
        </g>
      </svg>
    );
  },
);

SettingsIcon.displayName = "SettingsIcon";
