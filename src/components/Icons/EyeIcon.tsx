import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/** Eye icon for password visibility toggle (20x20 viewBox) */
export const EyeIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        d="M10 4.167c-4.167 0-7.5 4.166-7.5 5.833s3.333 5.833 7.5 5.833 7.5-4.166 7.5-5.833-3.333-5.833-7.5-5.833Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
);

EyeIcon.displayName = "EyeIcon";
