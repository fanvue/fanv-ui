import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const FlameIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.01 22.5c-4.45 0-8.07-3.61-8.07-8.06 0-2.16.88-4.28 2.42-5.82a.75.75 0 0 1 .68-.2c.25.05.45.22.54.46.33.82 1 1.42 1.82 1.66.02-1.49.27-4.51 1.83-6.83.59-.88 1.34-1.58 2.22-2.1.23-.14.52-.14.75 0 .23.13.38.38.38.65 0 2.15 1.11 3.5 2.4 5.07 1.44 1.76 3.08 3.76 3.08 7.12 0 4.44-3.61 8.05-8.05 8.05M6.76 10.45a6.76 6.76 0 0 0-1.33 3.99C5.43 18.06 8.38 21 12 21s6.56-2.94 6.56-6.56c0-2.83-1.33-4.45-2.74-6.17-1.1-1.34-2.22-2.71-2.61-4.62-.27.26-.52.56-.74.89-1.83 2.71-1.56 6.76-1.56 6.8a.76.76 0 0 1-.2.56c-.14.15-.34.24-.55.24-1.36 0-2.6-.64-3.4-1.69"
        />
      </svg>
    );
  },
);

FlameIcon.displayName = "FlameIcon";
