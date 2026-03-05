import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const ArrowRightIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        d="M14.43 5.93 20.5 12l-6.07 6.07M3.5 12h16.83"
      />
    </svg>
  ),
);

ArrowRightIcon.displayName = "ArrowRightIcon";
