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
      <path d="M10 11.6667C10.9205 11.6667 11.6667 10.9205 11.6667 10C11.6667 9.07953 10.9205 8.33333 10 8.33333C9.07953 8.33333 8.33333 9.07953 8.33333 10C8.33333 10.9205 9.07953 11.6667 10 11.6667Z" />
      <path d="M15.8333 11.6667C16.7538 11.6667 17.5 10.9205 17.5 10C17.5 9.07953 16.7538 8.33333 15.8333 8.33333C14.9129 8.33333 14.1667 9.07953 14.1667 10C14.1667 10.9205 14.9129 11.6667 15.8333 11.6667Z" />
      <path d="M4.16667 11.6667C5.08714 11.6667 5.83333 10.9205 5.83333 10C5.83333 9.07953 5.08714 8.33333 4.16667 8.33333C3.24619 8.33333 2.5 9.07953 2.5 10C2.5 10.9205 3.24619 11.6667 4.16667 11.6667Z" />
    </svg>
  ),
);

MoreIcon.displayName = "MoreIcon";
