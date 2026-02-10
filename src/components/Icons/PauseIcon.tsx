import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/** Pause icon (filled) */
export const PauseIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M8.5 10.5C8.0875 10.5 7.73438 10.3531 7.44063 10.0594C7.14688 9.76563 7 9.4125 7 9V1.5C7 1.0875 7.14688 0.734376 7.44063 0.440626C7.73438 0.146876 8.0875 0 8.5 0H9C9.4125 0 9.76562 0.146876 10.0594 0.440626C10.3531 0.734376 10.5 1.0875 10.5 1.5V9C10.5 9.4125 10.3531 9.76563 10.0594 10.0594C9.76562 10.3531 9.4125 10.5 9 10.5H8.5ZM1.5 10.5C1.0875 10.5 0.734375 10.3531 0.440625 10.0594C0.146875 9.76563 0 9.4125 0 9V1.5C0 1.0875 0.146875 0.734376 0.440625 0.440626C0.734375 0.146876 1.0875 0 1.5 0H2C2.4125 0 2.76563 0.146876 3.05938 0.440626C3.35313 0.734376 3.5 1.0875 3.5 1.5V9C3.5 9.4125 3.35313 9.76563 3.05938 10.0594C2.76563 10.3531 2.4125 10.5 2 10.5H1.5Z" />
    </svg>
  ),
);

PauseIcon.displayName = "PauseIcon";
