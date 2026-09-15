import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/**
 * Two bare solid pause bars (16 × 16), with no surrounding circle — the pause
 * counterpart to {@link PlayTriangleIcon}, for controls whose button already
 * supplies its own round chrome.
 */
export const PauseBarsIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-4", className)}
      {...props}
    >
      <rect x="4.2" y="3" width="2.6" height="10" rx="0.8" />
      <rect x="9.2" y="3" width="2.6" height="10" rx="0.8" />
    </svg>
  ),
);

PauseBarsIcon.displayName = "PauseBarsIcon";
