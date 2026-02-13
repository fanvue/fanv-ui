import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/** An eye icon for visibility/show actions (20 × 20). */
export const EyeIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path
        d="M1 10s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="10"
        cy="10"
        r="3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
);

EyeIcon.displayName = "EyeIcon";
