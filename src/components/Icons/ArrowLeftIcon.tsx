import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const ArrowLeftIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        strokeMiterlimit="10"
        strokeWidth="1.5"
        d="M9.57 5.93 3.5 12l6.07 6.07M20.5 12H3.67"
      />
    </svg>
  ),
);

ArrowLeftIcon.displayName = "ArrowLeftIcon";
