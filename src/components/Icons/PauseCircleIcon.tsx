import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const PauseCircleIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M10.75 21.5C4.83 21.5 0 16.68 0 10.75S4.83 0 10.75 0 21.5 4.82 21.5 10.75 16.68 21.5 10.75 21.5m0-20c-5.1 0-9.25 4.15-9.25 9.25S5.65 20 10.75 20 20 15.85 20 10.75 15.85 1.5 10.75 1.5" />
      <path d="M8.79 14.7h-1.3c-.92 0-1.46-.53-1.46-1.42V8.22c0-.89.55-1.42 1.46-1.42h1.29c.92 0 1.46.53 1.46 1.42v5.06c.01.89-.54 1.42-1.45 1.42m-1.26-1.5h1.22V8.3H7.54zm6.54 1.5h-1.29c-.92 0-1.46-.53-1.46-1.42V8.22c0-.89.55-1.42 1.46-1.42h1.29c.92 0 1.46.53 1.46 1.42v5.06c0 .89-.55 1.42-1.46 1.42m-1.26-1.5h1.22V8.3h-1.21z" />
    </svg>
  ),
);

PauseCircleIcon.displayName = "PauseCircleIcon";
