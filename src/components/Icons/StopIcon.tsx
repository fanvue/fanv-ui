import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const StopIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      className={cn("size-5", className)}
      aria-hidden="true"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11 25.9975V13.9883C11 13.1628 11.294 12.4583 11.8821 11.875C12.4699 11.2917 13.1767 11 14.0025 11H26.0117C26.8372 11 27.5417 11.294 28.125 11.8821C28.7083 12.4699 29 13.1767 29 14.0025V26.0117C29 26.8372 28.706 27.5417 28.1179 28.125C27.5301 28.7083 26.8233 29 25.9975 29H13.9883C13.1628 29 12.4583 28.706 11.875 28.1179C11.2917 27.5301 11 26.8233 11 25.9975Z"
        fill="currentColor"
      />
    </svg>
  ),
);

StopIcon.displayName = "StopIcon";
