import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const LogoutIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        strokeMiterlimit="10"
        strokeWidth="1.5"
        d="M17.44 14.62 20 12.06 17.44 9.5m-7.68 2.56h10.17M11.76 20c-4.42 0-8-3-8-8s3.58-8 8-8"
      />
    </svg>
  ),
);

LogoutIcon.displayName = "LogoutIcon";
