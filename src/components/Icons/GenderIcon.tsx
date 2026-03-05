import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const GenderIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M8.5 20.5C3.81 20.5 0 16.69 0 12s3.81-8.5 8.5-8.5S17 7.31 17 12s-3.81 8.5-8.5 8.5M8.5 5c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7" />
      <path d="M14.25 7c-.19 0-.38-.07-.53-.22a.754.754 0 0 1 0-1.06l5.5-5.5c.29-.29.77-.29 1.06 0s.29.77 0 1.06l-5.5 5.5c-.15.15-.34.22-.53.22" />
      <path d="M19.75 8c-.41 0-.75-.34-.75-.75V1.5h-5.75c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h6.5c.41 0 .75.34.75.75v6.5c0 .41-.34.75-.75.75" />
    </svg>
  ),
);

GenderIcon.displayName = "GenderIcon";
