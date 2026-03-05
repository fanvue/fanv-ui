import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const SupportIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        d="M6 18h-.5A3.5 3.5 0 0 1 2 14.5v-2A3.5 3.5 0 0 1 5.5 9H6m12 9h.5a3.5 3.5 0 0 0 3.5-3.5v-2A3.5 3.5 0 0 0 18.5 9H18M6 18V9a6 6 0 0 1 12 0v9M6 18v1a2 2 0 0 0 2 2h2"
      />
    </svg>
  ),
);

SupportIcon.displayName = "SupportIcon";
