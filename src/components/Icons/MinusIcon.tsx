import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/** Small minus/indeterminate icon for use in checkbox components (12x12 viewBox) */
export const MinusIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <g clip-path="url(#clip0_1341_773)">
        <path
          d="M17.5906 11.0787H3.03937C2.76372 11.0787 2.49935 10.9692 2.30443 10.7743C2.10951 10.5794 2 10.315 2 10.0394C2 9.76372 2.10951 9.49935 2.30443 9.30443C2.49935 9.10951 2.76372 9 3.03937 9H17.5906C17.8663 9 18.1307 9.10951 18.3256 9.30443C18.5205 9.49935 18.63 9.76372 18.63 10.0394C18.63 10.315 18.5205 10.5794 18.3256 10.7743C18.1307 10.9692 17.8663 11.0787 17.5906 11.0787Z"
          fill="currentColor"
        />
      </g>
    </svg>
  ),
);

MinusIcon.displayName = "MinusIcon";
