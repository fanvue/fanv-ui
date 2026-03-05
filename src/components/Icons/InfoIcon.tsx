import React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/** An info icon with exclamation-style "i" in a circle (20 × 20). */
export const InfoIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M10.315 2a8.315 8.315 0 1 0 0 16.63 8.315 8.315 0 0 0 0-16.63m0 5.82a.832.832 0 1 0 0-1.663.832.832 0 0 0 0 1.664m-.588 1.075a.832.832 0 0 1 1.42.588v4.158a.831.831 0 1 1-1.664 0V9.483c0-.22.088-.432.244-.588"
        clipRule="evenodd"
      />
    </svg>
  ),
);

InfoIcon.displayName = "InfoIcon";
