import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/** Eye off icon for password visibility toggle (20x20 viewBox) */
export const EyeOffIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        d="M8.233 8.233A2.5 2.5 0 1 0 11.767 11.767M8.233 8.233 2.5 2.5M8.233 8.233 11.767 11.767M11.767 11.767 17.5 17.5M14.95 14.95c1.55-1.217 2.55-2.95 2.55-4.95 0-1.667-3.333-5.833-7.5-5.833-1.333 0-2.617.5-3.717 1.217M5.05 5.05C3.5 6.267 2.5 8 2.5 10c0 1.667 3.333 5.833 7.5 5.833 1.333 0 2.617-.5 3.717-1.217"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
);

EyeOffIcon.displayName = "EyeOffIcon";
