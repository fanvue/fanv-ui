import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const MoneyIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M15.75 18.5h-10C2.1 18.5 0 16.4 0 12.75v-7C0 2.1 2.1 0 5.75 0h10c3.65 0 5.75 2.1 5.75 5.75v7c0 3.65-2.1 5.75-5.75 5.75m-10-17C2.89 1.5 1.5 2.89 1.5 5.75v7C1.5 15.61 2.89 17 5.75 17h10c2.86 0 4.25-1.39 4.25-4.25v-7c0-2.86-1.39-4.25-4.25-4.25z" />
      <path d="M10.75 13C8.68 13 7 11.32 7 9.25S8.68 5.5 10.75 5.5s3.75 1.68 3.75 3.75S12.82 13 10.75 13m0-6C9.51 7 8.5 8.01 8.5 9.25s1.01 2.25 2.25 2.25S13 10.49 13 9.25 11.99 7 10.75 7m7-2h-3c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h3c.41 0 .75.34.75.75s-.34.75-.75.75m-11 10h-3c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h3c.41 0 .75.34.75.75s-.34.75-.75.75" />
    </svg>
  ),
);

MoneyIcon.displayName = "MoneyIcon";
