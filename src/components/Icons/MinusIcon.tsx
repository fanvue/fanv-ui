import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const MinusIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        strokeWidth="1.5"
        d="M6 12h12"
      />
    </svg>
  ),
);

MinusIcon.displayName = "MinusIcon";
