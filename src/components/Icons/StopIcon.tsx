import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/** A filled-square stop icon for media/recording controls (40 × 40). */
export const StopIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M11 25.998v-12.01q0-1.238.882-2.113a2.9 2.9 0 0 1 2.12-.875h12.01q1.238 0 2.113.882t.875 2.12v12.01q0 1.238-.882 2.113a2.9 2.9 0 0 1-2.12.875h-12.01q-1.238 0-2.113-.882a2.9 2.9 0 0 1-.875-2.12"
      />
    </svg>
  ),
);

StopIcon.displayName = "StopIcon";
