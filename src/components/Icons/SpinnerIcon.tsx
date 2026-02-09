import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const SpinnerIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeOpacity=".25" strokeWidth="2" />
      <path d="M10 2a8 8 0 0 1 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
);

SpinnerIcon.displayName = "SpinnerIcon";
