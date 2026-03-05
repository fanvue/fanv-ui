import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const UserSquareIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        fill="currentColor"
        d="M13.75 21.5h-6c-1.32 0-2.42-.13-3.35-.41a.77.77 0 0 1-.54-.78c.25-2.99 3.28-5.34 6.89-5.34s6.63 2.34 6.89 5.34c.03.36-.19.68-.54.78-.93.28-2.03.41-3.35.41m-8.28-1.69c.66.13 1.41.19 2.28.19h6c.87 0 1.62-.06 2.28-.19-.53-1.92-2.72-3.34-5.28-3.34S6 17.89 5.47 19.81"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M13.75.75h-6c-5 0-7 2-7 7v6c0 3.78 1.14 5.85 3.86 6.62.22-2.6 2.89-4.65 6.14-4.65s5.92 2.05 6.14 4.65c2.72-.77 3.86-2.84 3.86-6.62v-6c0-5-2-7-7-7m-3 12.17c-1.98 0-3.58-1.61-3.58-3.59s1.6-3.58 3.58-3.58 3.58 1.6 3.58 3.58-1.6 3.59-3.58 3.59"
      />
      <path
        fill="currentColor"
        d="M10.75 13.67a4.34 4.34 0 0 1-4.33-4.34C6.42 6.94 8.36 5 10.75 5s4.33 1.94 4.33 4.33a4.34 4.34 0 0 1-4.33 4.34m0-7.17a2.836 2.836 0 0 0 0 5.67 2.836 2.836 0 0 0 0-5.67"
      />
    </svg>
  ),
);

UserSquareIcon.displayName = "UserSquareIcon";
