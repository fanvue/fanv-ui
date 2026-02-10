import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/** An upload-to-cloud icon with an upward arrow (20 × 20). */
export const UploadCloudIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path
        d="M6.667 13.333 10 10m0 0 3.333 3.333M10 10v7.5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.992 14.825a4.167 4.167 0 0 0-2.159-7.158 5.835 5.835 0 0 0-10.75 2.916A3.333 3.333 0 0 0 5 17.5h11.167a4.167 4.167 0 0 0 .825-2.675Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
);

UploadCloudIcon.displayName = "UploadCloudIcon";
