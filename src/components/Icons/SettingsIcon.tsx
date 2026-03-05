import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const SettingsIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M20.75 5h-6c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h6c.41 0 .75.34.75.75s-.34.75-.75.75m-16 0h-4C.34 5 0 4.66 0 4.25s.34-.75.75-.75h4c.41 0 .75.34.75.75S5.16 5 4.75 5" />
      <path d="M8.75 8.5A4.26 4.26 0 0 1 4.5 4.25 4.26 4.26 0 0 1 8.75 0 4.26 4.26 0 0 1 13 4.25 4.26 4.26 0 0 1 8.75 8.5m0-7C7.23 1.5 6 2.73 6 4.25S7.23 7 8.75 7s2.75-1.23 2.75-2.75S10.27 1.5 8.75 1.5m12 14.5h-4c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h4c.41 0 .75.34.75.75s-.34.75-.75.75m-14 0h-6c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h6c.41 0 .75.34.75.75s-.34.75-.75.75" />
      <path d="M12.75 19.5a4.26 4.26 0 0 1-4.25-4.25A4.26 4.26 0 0 1 12.75 11 4.26 4.26 0 0 1 17 15.25a4.26 4.26 0 0 1-4.25 4.25m0-7c-1.52 0-2.75 1.23-2.75 2.75S11.23 18 12.75 18s2.75-1.23 2.75-2.75-1.23-2.75-2.75-2.75" />
    </svg>
  ),
);

SettingsIcon.displayName = "SettingsIcon";
