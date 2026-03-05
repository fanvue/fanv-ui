import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const PlayCircleIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
      <path d="M9.34 15.74c-.44 0-.86-.11-1.23-.32-.86-.5-1.34-1.48-1.34-2.76V9.31c0-1.28.47-2.26 1.33-2.76s1.95-.42 3.06.22l2.9 1.67c1.11.64 1.72 1.54 1.72 2.54 0 .99-.61 1.9-1.72 2.54l-2.9 1.67c-.62.37-1.25.55-1.82.55m0-8.02c-.18 0-.35.04-.48.12-.38.22-.59.75-.59 1.47v3.35c0 .71.21 1.25.59 1.46.37.22.94.13 1.56-.22l2.9-1.67c.62-.36.97-.81.97-1.24s-.36-.88-.97-1.24l-2.9-1.67c-.4-.24-.77-.36-1.08-.36" />
    </svg>
  ),
);

PlayCircleIcon.displayName = "PlayCircleIcon";
