import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const CompassIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={cn("size-6", className)}
        {...props}
      >
        <g fill="currentColor">
          <path d="M17 22.75H7c-3.17 0-5.75-2.58-5.75-5.75V7c0-3.17 2.58-5.75 5.75-5.75h10c3.17 0 5.75 2.58 5.75 5.75v10c0 3.17-2.58 5.75-5.75 5.75m-10-20A4.26 4.26 0 0 0 2.75 7v10A4.26 4.26 0 0 0 7 21.25h10A4.26 4.26 0 0 0 21.25 17V7A4.26 4.26 0 0 0 17 2.75z" />
          <path d="M9.25 16.56c-.47 0-.93-.19-1.28-.53-.46-.45-.63-1.1-.48-1.72l1.08-4.4A1.8 1.8 0 0 1 9.9 8.58l4.4-1.08c.63-.16 1.27.03 1.72.48.45.46.63 1.1.48 1.72l-1.08 4.4a1.8 1.8 0 0 1-1.33 1.33l-4.4 1.08c-.14.04-.29.05-.44.05m5.5-7.62c-.03 0-.05 0-.08.01l-4.4 1.08a.3.3 0 0 0-.23.23l-1.08 4.4c-.04.15.04.26.08.3.05.05.15.13.3.08l4.4-1.08a.3.3 0 0 0 .23-.23l1.08-4.4a.31.31 0 0 0-.08-.3.3.3 0 0 0-.22-.09" />
        </g>
      </svg>
    );
  },
);

CompassIcon.displayName = "CompassIcon";
