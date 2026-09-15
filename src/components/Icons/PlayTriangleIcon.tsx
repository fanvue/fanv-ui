import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/**
 * A bare solid play triangle (16 × 16), with no surrounding circle — for play
 * controls whose button already supplies its own round chrome. Use
 * {@link PlayIcon} where the circled glyph is wanted.
 */
export const PlayTriangleIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-4", className)}
      {...props}
    >
      <path d="M4.2 4.4V11.6Q4.2 13 5.39 12.26L11.01 8.74Q12.2 8 11.01 7.26L5.39 3.74Q4.2 3 4.2 4.4Z" />
    </svg>
  ),
);

PlayTriangleIcon.displayName = "PlayTriangleIcon";
