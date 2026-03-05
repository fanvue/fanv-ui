import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const PlusIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        d="M6 12h12m-6 6V6"
      />
    </svg>
  ),
);

PlusIcon.displayName = "PlusIcon";
