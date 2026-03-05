import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const CodeCircleIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M6.75 13.5c-.19 0-.38-.07-.53-.22l-2-2a.754.754 0 0 1 0-1.06l2-2c.29-.29.77-.29 1.06 0s.29.77 0 1.06l-1.47 1.47 1.47 1.47c.29.29.29.77 0 1.06-.15.15-.34.22-.53.22m8 0c-.19 0-.38-.07-.53-.22a.754.754 0 0 1 0-1.06l1.47-1.47-1.47-1.47a.755.755 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l2 2c.29.29.29.77 0 1.06l-2 2c-.15.15-.34.22-.53.22" />
      <path d="M10.75 21.5C4.82 21.5 0 16.68 0 10.75S4.82 0 10.75 0 21.5 4.82 21.5 10.75 16.68 21.5 10.75 21.5m0-20c-5.1 0-9.25 4.15-9.25 9.25S5.65 20 10.75 20 20 15.85 20 10.75 15.85 1.5 10.75 1.5" />
      <path d="M9.75 13.83a.745.745 0 0 1-.68-1.05l2-4.67c.16-.38.6-.56.98-.39.38.16.56.6.39.99l-2 4.67c-.12.28-.4.45-.69.45" />
    </svg>
  ),
);

CodeCircleIcon.displayName = "CodeCircleIcon";
