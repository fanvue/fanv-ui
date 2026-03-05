import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/** Small checkmark icon for use in checkbox/toggle components (12x12 viewBox) */
export const CheckOutlineIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        fill="currentColor"
        d="M10.315 2a8.315 8.315 0 1 0 0 16.63 8.315 8.315 0 0 0 0-16.63m0 14.967a6.651 6.651 0 1 1 0-13.303 6.651 6.651 0 0 1 0 13.303"
      />
      <path
        fill="currentColor"
        d="m12.56 7.313-3.143 4.158-1.355-1.755a.832.832 0 1 0-1.314 1.023l2.02 2.586a.832.832 0 0 0 1.314-.008l3.8-4.99a.837.837 0 0 0-1.33-1.014z"
      />
    </svg>
  ),
);

CheckOutlineIcon.displayName = "CheckOutlineIcon";
