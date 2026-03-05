import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const ExpandIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M21 9V3h-6M3 15v6h6M21 3l-7.5 7.5m-3 3L3 21"
      />
    </svg>
  ),
);

ExpandIcon.displayName = "ExpandIcon";
