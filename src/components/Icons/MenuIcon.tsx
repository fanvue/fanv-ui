import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/** Hamburger menu icon (three horizontal lines) */
export const MenuIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M2 5.75C2 5.33579 2.33579 5 2.75 5H17.25C17.6642 5 18 5.33579 18 5.75V6C18 6.41421 17.6642 6.75 17.25 6.75H2.75C2.33579 6.75 2 6.41421 2 6V5.75Z" />
      <path d="M2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25V13.5C18 13.9142 17.6642 14.25 17.25 14.25H2.75C2.33579 14.25 2 13.9142 2 13.5V13.25Z" />
      <path d="M2.75 10C2.33579 10 2 9.66421 2 9.25V9C2 8.58579 2.33579 8.25 2.75 8.25H17.25C17.6642 8.25 18 8.58579 18 9V9.25C18 9.66421 17.6642 10 17.25 10H2.75Z" />
    </svg>
  ),
);

MenuIcon.displayName = "MenuIcon";
