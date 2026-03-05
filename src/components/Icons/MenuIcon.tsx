import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const MenuIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
        d="M3 7h18M3 12h18M3 17h18"
      />
    </svg>
  ),
);

MenuIcon.displayName = "MenuIcon";
