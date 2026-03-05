import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const DiamondIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M10.755 21.19c-1.11 0-2.14-.47-2.91-1.31l-6.86-7.54c-.97-1.06-1.27-2.93-.69-4.24l2.56-5.76C3.555.77 4.725 0 6.445 0h8.59c1.72 0 2.89.76 3.59 2.33l2.56 5.76c.58 1.31.29 3.18-.68 4.24l-6.85 7.55c-.75.84-1.79 1.31-2.9 1.31m4.29-19.7h-8.59c-1.31 0-1.84.58-2.22 1.45L1.675 8.7c-.34.77-.14 2 .42 2.62l6.86 7.54c.48.53 1.12.82 1.8.82s1.32-.29 1.8-.82l6.85-7.55c.57-.63.77-1.85.42-2.62l-2.56-5.76c-.38-.86-.91-1.44-2.22-1.44" />
      <path d="M2.255 7.34c-.41 0-.75-.34-.75-.75s.34-.75.75-.75l17-.01c.41 0 .75.34.75.75s-.34.75-.75.75z" />
    </svg>
  ),
);

DiamondIcon.displayName = "DiamondIcon";
