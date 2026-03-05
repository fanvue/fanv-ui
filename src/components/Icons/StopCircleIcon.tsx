import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const StopCircleIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M10.75 21.5C4.83 21.5 0 16.68 0 10.75S4.83 0 10.75 0 21.5 4.82 21.5 10.75 16.68 21.5 10.75 21.5m0-20c-5.1 0-9.25 4.15-9.25 9.25S5.65 20 10.75 20 20 15.85 20 10.75 15.85 1.5 10.75 1.5" />
      <path d="M12.05 15.73H9.51c-2.53 0-3.71-1.18-3.71-3.71V9.48c0-2.53 1.18-3.71 3.71-3.71h2.54c2.53 0 3.71 1.18 3.71 3.71v2.54c0 2.53-1.18 3.71-3.71 3.71M9.51 7.27c-1.69 0-2.21.52-2.21 2.21v2.54c0 1.69.52 2.21 2.21 2.21h2.54c1.69 0 2.21-.52 2.21-2.21V9.48c0-1.69-.52-2.21-2.21-2.21z" />
    </svg>
  ),
);

StopCircleIcon.displayName = "StopCircleIcon";
