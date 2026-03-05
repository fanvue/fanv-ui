import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const GalleryIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M13.75 21.5h-6C2.32 21.5 0 19.18 0 13.75v-6C0 2.32 2.32 0 7.75 0h6c5.43 0 7.75 2.32 7.75 7.75v6c0 5.43-2.32 7.75-7.75 7.75m-6-20C3.14 1.5 1.5 3.14 1.5 7.75v6C1.5 18.36 3.14 20 7.75 20h6c4.61 0 6.25-1.64 6.25-6.25v-6c0-4.61-1.64-6.25-6.25-6.25z" />
      <path d="M7.75 9.5C6.23 9.5 5 8.27 5 6.75S6.23 4 7.75 4s2.75 1.23 2.75 2.75S9.27 9.5 7.75 9.5m0-4a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5M1.42 18.45a.746.746 0 0 1-.41-1.37l4.93-3.31c1.08-.73 2.57-.64 3.55.19l.33.29c.5.43 1.35.43 1.84 0l4.16-3.57c1.06-.91 2.73-.91 3.8 0l1.63 1.4c.31.27.35.74.08 1.06-.27.31-.74.35-1.06.08l-1.63-1.4c-.5-.43-1.35-.43-1.85 0l-4.16 3.57c-1.06.91-2.73.91-3.8 0l-.33-.29c-.46-.39-1.22-.43-1.73-.08l-4.93 3.31c-.13.08-.28.12-.42.12" />
    </svg>
  ),
);

GalleryIcon.displayName = "GalleryIcon";
