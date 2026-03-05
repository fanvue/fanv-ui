import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const HelpIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M12 13.54a.753.753 0 0 1-.37-1.41l1.47-.82c.5-.28.81-.8.81-1.37-.06-.94-.93-1.7-1.9-1.64-.98-.04-1.76.57-1.96 1.43-.09.4-.5.65-.9.56s-.65-.5-.56-.9C8.95 7.82 10.41 6.74 12 6.8c1.72-.09 3.29 1.29 3.41 3.09 0 1.16-.6 2.19-1.58 2.73l-1.47.82q-.18.09-.36.09z" />
          <path d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12S6.07 1.25 12 1.25 22.75 6.07 22.75 12 17.93 22.75 12 22.75m0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25S17.1 2.75 12 2.75" />
          <path d="M12 17.19c-.435 0-.86-.414-.86-.86s.415-.86.86-.86c.447 0 .86.414.86.86s-.413.86-.86.86" />
        </g>
      </svg>
    );
  },
);

HelpIcon.displayName = "HelpIcon";
