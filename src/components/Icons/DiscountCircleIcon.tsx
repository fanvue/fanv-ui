import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const DiscountCircleIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M10.75 21.5C4.82 21.5 0 16.68 0 10.75S4.82 0 10.75 0 21.5 4.82 21.5 10.75 16.68 21.5 10.75 21.5m0-20c-5.1 0-9.25 4.15-9.25 9.25S5.65 20 10.75 20 20 15.85 20 10.75 15.85 1.5 10.75 1.5" />
      <path d="M13.75 14.75c-.56 0-1.01-.45-1.01-1s.45-1 1-1 1 .45 1 1-.44 1-.99 1m-5.99-6c-.56 0-1.01-.45-1.01-1s.45-1 1-1 1 .45 1 1-.44 1-.99 1m-.01 5.75c-.19 0-.38-.07-.53-.22a.754.754 0 0 1 0-1.06l6-6c.29-.29.77-.29 1.06 0s.29.77 0 1.06l-6 6c-.15.15-.34.22-.53.22" />
    </svg>
  ),
);

DiscountCircleIcon.displayName = "DiscountCircleIcon";
