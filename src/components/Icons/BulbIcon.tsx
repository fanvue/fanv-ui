import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const BulbIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M14.03 14.778c-.19 0-.38-.07-.53-.22a.754.754 0 0 1 0-1.06 6.97 6.97 0 0 0 2.06-4.97c0-1.88-.73-3.64-2.06-4.97-2.74-2.74-7.2-2.74-9.94 0a6.97 6.97 0 0 0-2.06 4.97c0 1.88.73 3.64 2.06 4.97.29.29.29.77 0 1.06s-.77.29-1.06 0A8.47 8.47 0 0 1 0 8.528c0-2.28.89-4.42 2.5-6.03 3.33-3.33 8.74-3.33 12.06 0a8.47 8.47 0 0 1 2.5 6.03c0 2.28-.89 4.42-2.5 6.03-.15.15-.34.22-.53.22m-2.17 3.39H5.19c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h6.67c.41 0 .75.34.75.75s-.34.75-.75.75m-1.11 3.33H6.3c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h4.45c.41 0 .75.34.75.75s-.34.75-.75.75" />
    </svg>
  ),
);

BulbIcon.displayName = "BulbIcon";
