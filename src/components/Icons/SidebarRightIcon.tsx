import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const SidebarRightIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M13.75 21.5h-6C2.32 21.5 0 19.18 0 13.75v-6C0 2.32 2.32 0 7.75 0h6c5.43 0 7.75 2.32 7.75 7.75v6c0 5.43-2.31 7.75-7.75 7.75m-6-20C3.14 1.5 1.5 3.14 1.5 7.75v6C1.5 18.36 3.14 20 7.75 20h6c4.61 0 6.25-1.64 6.25-6.25v-6c0-4.61-1.64-6.25-6.25-6.25z" />
      <path d="M13.75 21.5c-.41 0-.75-.34-.75-.75v-20c0-.41.34-.75.75-.75s.75.34.75.75v20c0 .41-.33.75-.75.75m-7-7.44c-.19 0-.38-.07-.53-.22a.754.754 0 0 1 0-1.06l2.03-2.03-2.03-2.03a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l2.56 2.56c.29.29.29.77 0 1.06l-2.56 2.56a.7.7 0 0 1-.53.22" />
    </svg>
  ),
);

SidebarRightIcon.displayName = "SidebarRightIcon";
