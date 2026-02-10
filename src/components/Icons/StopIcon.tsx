import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/** Stop icon (filled) */
export const StopIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 9 9"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M0 7.49875V1.49417C0 1.08139 0.147014 0.729167 0.441042 0.4375C0.734931 0.145833 1.08833 0 1.50125 0H7.50583C7.91861 0 8.27083 0.147014 8.5625 0.441041C8.85417 0.73493 9 1.08833 9 1.50125V7.50583C9 7.91861 8.85299 8.27083 8.55896 8.5625C8.26507 8.85417 7.91167 9 7.49875 9H1.49417C1.08139 9 0.729167 8.85299 0.4375 8.55896C0.145833 8.26507 0 7.91167 0 7.49875Z" />
    </svg>
  ),
);

StopIcon.displayName = "StopIcon";
