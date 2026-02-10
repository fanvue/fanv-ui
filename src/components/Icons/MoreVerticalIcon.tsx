import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/** Vertical three-dot menu icon (more options) */
export const MoreVerticalIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
      <path d="M10 5.83333C10.9205 5.83333 11.6667 5.08714 11.6667 4.16667C11.6667 3.24619 10.9205 2.5 10 2.5C9.07953 2.5 8.33333 3.24619 8.33333 4.16667C8.33333 5.08714 9.07953 5.83333 10 5.83333Z" />
      <path d="M10 17.5C10.9205 17.5 11.6667 16.7538 11.6667 15.8333C11.6667 14.9129 10.9205 14.1667 10 14.1667C9.07953 14.1667 8.33333 14.9129 8.33333 15.8333C8.33333 16.7538 9.07953 17.5 10 17.5Z" />
    </svg>
  ),
);

MoreVerticalIcon.displayName = "MoreVerticalIcon";
