import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const CompassIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M15.75 21.5h-10C2.58 21.5 0 18.92 0 15.75v-10C0 2.58 2.58 0 5.75 0h10c3.17 0 5.75 2.58 5.75 5.75v10c0 3.17-2.58 5.75-5.75 5.75m-10-20A4.26 4.26 0 0 0 1.5 5.75v10A4.26 4.26 0 0 0 5.75 20h10A4.26 4.26 0 0 0 20 15.75v-10a4.26 4.26 0 0 0-4.25-4.25z" />
      <path d="M8 15.31c-.47 0-.93-.19-1.28-.53-.46-.45-.63-1.1-.48-1.72l1.08-4.4a1.8 1.8 0 0 1 1.33-1.33l4.4-1.08c.63-.16 1.27.03 1.72.48.45.46.63 1.1.48 1.72l-1.08 4.4a1.8 1.8 0 0 1-1.33 1.33l-4.4 1.08c-.14.04-.29.05-.44.05m5.5-7.62c-.03 0-.05 0-.08.01l-4.4 1.08a.3.3 0 0 0-.23.23l-1.08 4.4c-.04.15.04.26.08.3.05.05.15.13.3.08l4.4-1.08a.3.3 0 0 0 .23-.23l1.08-4.4a.31.31 0 0 0-.08-.3.3.3 0 0 0-.22-.09" />
    </svg>
  ),
);

CompassIcon.displayName = "CompassIcon";
