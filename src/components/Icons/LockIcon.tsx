import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const LockIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        d="M6 10V8c0-3.31 1-6 6-6s6 2.69 6 6v2m-1 12H7c-4 0-5-1-5-5v-2c0-4 1-5 5-5h10c4 0 5 1 5 5v2c0 4-1 5-5 5"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15.996 16h.01m-4.011 0h.01m-4.01 0h.008"
      />
    </svg>
  ),
);

LockIcon.displayName = "LockIcon";
