import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const BoltIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={cn("size-6", className)}
        {...props}
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="1.5"
          d="m16.22 3.87-3 5.42c-.3.55-.04 1.23.55 1.43l4.12 1.4c.68.23.9 1.08.43 1.61l-6.84 7.7c-.37.42-1.05.1-.98-.45l.76-5.29a1 1 0 0 0-.65-1.08L6.1 13a.995.995 0 0 1-.55-1.4l4.42-8.66c.17-.33.51-.55.89-.55h4.5c.75-.01 1.23.81.86 1.48Z"
        />
      </svg>
    );
  },
);

BoltIcon.displayName = "BoltIcon";
