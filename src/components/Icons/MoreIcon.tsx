import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/** Horizontal three-dot menu icon (more options) */
export const MoreIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path
        d="M9.99998 11.6666C10.9205 11.6666 11.6666 10.9205 11.6666 9.99998C11.6666 9.07951 10.9205 8.33331 9.99998 8.33331C9.07951 8.33331 8.33331 9.07951 8.33331 9.99998C8.33331 10.9205 9.07951 11.6666 9.99998 11.6666Z"
        fill="currentColor"
      />
      <path
        d="M15.8334 11.6666C16.7538 11.6666 17.5 10.9205 17.5 9.99998C17.5 9.07951 16.7538 8.33331 15.8334 8.33331C14.9129 8.33331 14.1667 9.07951 14.1667 9.99998C14.1667 10.9205 14.9129 11.6666 15.8334 11.6666Z"
        fill="currentColor"
      />
      <path
        d="M4.16667 11.6666C5.08714 11.6666 5.83333 10.9205 5.83333 9.99998C5.83333 9.07951 5.08714 8.33331 4.16667 8.33331C3.24619 8.33331 2.5 9.07951 2.5 9.99998C2.5 10.9205 3.24619 11.6666 4.16667 11.6666Z"
        fill="currentColor"
      />
    </svg>
  ),
);

MoreIcon.displayName = "MoreIcon";
