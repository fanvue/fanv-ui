import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const BellOffIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12 22.75c-1.1 0-2.16-.53-2.82-1.41a.75.75 0 0 1 1.2-.9c.38.51.99.81 1.62.81s1.24-.3 1.62-.81a.75.75 0 0 1 1.2.9c-.66.88-1.72 1.41-2.82 1.41M18.51 18.86H5.65c-1.1 0-2.1-.47-2.68-1.27-.9-1.24-.79-2.96.26-4.01l.95-.95c.23-.23.36-.54.37-.87l.03-3.1c0-4.08 3.33-7.41 7.42-7.41 3.68 0 6.71 2.6 7.37 6.32l.05.57v3.57c0 .33.13.65.36.89l.83.83c.77.77 1.14 1.81 1 2.78a3.11 3.11 0 0 1-3.09 2.66zM12 2.75c-3.26 0-5.92 2.65-5.92 5.92l-.03 3.11c0 .72-.29 1.4-.8 1.91l-.95.95c-.53.53-.58 1.42-.1 2.06.3.41.85.65 1.47.65h12.86c.81 0 1.48-.58 1.61-1.39.08-.5-.14-1.06-.57-1.49l-.83-.83c-.52-.52-.81-1.21-.81-1.95V8.18l-.03-.44c-.52-2.92-2.94-5.01-5.88-5.01z"
        />
        <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M2 22 22 2" />
      </svg>
    );
  },
);

BellOffIcon.displayName = "BellOffIcon";
