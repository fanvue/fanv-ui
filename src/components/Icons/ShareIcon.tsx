import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const ShareIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g fill="currentColor">
          <path d="M6.41 15.91a3.91 3.91 0 1 1 0-7.82 3.91 3.91 0 1 1 0 7.82m0-6.32a2.411 2.411 0 0 0 0 4.82c1.33 0 2.41-1.08 2.41-2.41S7.74 9.59 6.41 9.59M17.59 9.07a3.91 3.91 0 1 1 0-7.82 3.91 3.91 0 1 1 0 7.82m0-6.32c-1.33 0-2.41 1.08-2.41 2.41s1.08 2.41 2.41 2.41S20 6.49 20 5.16s-1.08-2.41-2.41-2.41M17.59 22.75a3.91 3.91 0 1 1 0-7.82 3.91 3.91 0 1 1 0 7.82m0-6.32c-1.33 0-2.41 1.08-2.41 2.41s1.08 2.41 2.41 2.41S20 20.17 20 18.84s-1.08-2.41-2.41-2.41" />
          <path d="M9.1 11.09a.75.75 0 0 1-.39-1.39l5.79-3.54a.75.75 0 0 1 .78 1.28l-5.79 3.54c-.12.07-.26.11-.39.11M14.89 17.95c-.13 0-.27-.04-.39-.11L8.71 14.3a.76.76 0 0 1-.25-1.03c.21-.35.67-.47 1.03-.25l5.79 3.54c.35.22.46.68.25 1.03-.14.24-.39.36-.64.36" />
        </g>
      </svg>
    );
  },
);

ShareIcon.displayName = "ShareIcon";
