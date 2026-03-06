import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const ForwardIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill="currentColor"
          d="M2 20.27c.28 0 .54-.16.67-.41 1.99-3.98 6.21-5.03 9.67-5.15v2.64c0 .75.42 1.4 1.11 1.7.68.3 1.45.18 2-.32l6.69-6.08c.4-.36.62-.87.61-1.41 0-.54-.25-1.04-.66-1.39L15.4 4.17c-.56-.48-1.32-.58-1.98-.27-.67.31-1.08.95-1.08 1.69v1.97c-6.47.32-11.09 4.72-11.09 10.7v1.25c0 .35.24.65.58.73.06.01.12.02.17.02zM14.21 5.24c.07 0 .15.02.23.09L21.12 11c.11.09.13.21.13.27s-.01.18-.12.27l-6.69 6.06c-.16.14-.32.09-.39.06a.36.36 0 0 1-.21-.33v-3.4c0-.41-.34-.75-.75-.75-4.53 0-8.02 1.3-10.26 3.78.62-4.72 4.67-7.91 10.26-7.91.41 0 .75-.34.75-.75V5.6c0-.21.15-.3.21-.33.03-.01.09-.03.16-.03"
        />
      </svg>
    );
  },
);

ForwardIcon.displayName = "ForwardIcon";
