import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const CheckboxOffIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
);

CheckboxOffIcon.displayName = "CheckboxOffIcon";
