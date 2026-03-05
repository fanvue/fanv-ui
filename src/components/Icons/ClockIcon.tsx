import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const ClockIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M15.25 12.17h-5.17c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h5.17c.41 0 .75.34.75.75s-.34.75-.75.75" />
      <path d="M10.75 21.5C4.82 21.5 0 16.68 0 10.75S4.82 0 10.75 0 21.5 4.82 21.5 10.75 16.68 21.5 10.75 21.5m0-20c-5.1 0-9.25 4.15-9.25 9.25S5.65 20 10.75 20 20 15.85 20 10.75 15.85 1.5 10.75 1.5" />
      <path d="M10.08 12.17c-.41 0-.75-.34-.75-.75V5.19c0-.41.34-.75.75-.75s.75.34.75.75v6.22c0 .41-.34.75-.75.75z" />
    </svg>
  ),
);

ClockIcon.displayName = "ClockIcon";
