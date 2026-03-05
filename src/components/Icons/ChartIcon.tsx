import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const ChartIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
      <path d="M5.75 17c-.41 0-.75-.34-.75-.75v-11c0-.41.34-.75.75-.75s.75.34.75.75v11c0 .41-.34.75-.75.75m5 0c-.41 0-.75-.34-.75-.75v-7c0-.41.34-.75.75-.75s.75.34.75.75v7c0 .41-.34.75-.75.75m5 0c-.41 0-.75-.34-.75-.75v-4c0-.41.34-.75.75-.75s.75.34.75.75v4c0 .41-.34.75-.75.75" />
    </svg>
  ),
);

ChartIcon.displayName = "ChartIcon";
