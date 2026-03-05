import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/** A closed eye icon for visibility/show actions (20 × 20). */
export const EyeClosedIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8.233 8.233a2.5 2.5 0 1 0 3.534 3.534M8.233 8.233 2.5 2.5m5.733 5.733 3.534 3.534m0 0L17.5 17.5m-2.55-2.55C16.5 13.733 17.5 12 17.5 10c0-1.667-3.333-5.833-7.5-5.833-1.333 0-2.617.5-3.717 1.217M5.05 5.05C3.5 6.267 2.5 8 2.5 10c0 1.667 3.333 5.833 7.5 5.833 1.333 0 2.617-.5 3.717-1.217"
      />
    </svg>
  ),
);

EyeClosedIcon.displayName = "EyeClosedIcon";
