import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const RepeatIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        d="M3.58 5.16h13.84c1.66 0 3 1.34 3 3v3.32"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        strokeWidth="1.5"
        d="M6.74 2 3.58 5.16l3.16 3.16m13.68 10.52H6.58c-1.66 0-3-1.34-3-3v-3.32"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        strokeWidth="1.5"
        d="m17.26 22 3.16-3.16-3.16-3.16"
      />
    </svg>
  ),
);

RepeatIcon.displayName = "RepeatIcon";
