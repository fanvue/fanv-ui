import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/** Small minus/indeterminate icon for use in checkbox components (12x12 viewBox) */
export const MinusIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={cn("size-3", className)}
      {...props}
    >
      <path d="M2 6h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
);

MinusIcon.displayName = "MinusIcon";
