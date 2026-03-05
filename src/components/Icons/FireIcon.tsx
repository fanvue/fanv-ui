import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/** A flame/fire icon for trending or popular content (20 × 20). */
export const FireIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M13.5 4.938a7 7 0 1 1-9.006 1.737c.202-.257.59-.218.793.039q.418.53.943.954c.332.269.786-.049.773-.476a6 6 0 0 1 .572-2.759 6.03 6.03 0 0 1 2.486-2.665c.247-.14.55-.016.677.238A6.97 6.97 0 0 0 13.5 4.938M14 12a4 4 0 0 1-4 4c-1.913 0-3.52-1.398-3.91-3.182-.093-.429.44-.643.814-.413a4 4 0 0 0 1.601.564c.303.038.531-.24.51-.544a5.98 5.98 0 0 1 1.315-4.192.45.45 0 0 1 .431-.16A4 4 0 0 1 14 12"
        clipRule="evenodd"
      />
    </svg>
  ),
);

FireIcon.displayName = "FireIcon";
