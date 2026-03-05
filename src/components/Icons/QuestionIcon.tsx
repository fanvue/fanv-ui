import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const QuestionIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M10.75 12.29a.753.753 0 0 1-.37-1.41l1.47-.82c.5-.28.81-.8.81-1.37-.06-.94-.93-1.7-1.9-1.64-.98-.04-1.76.57-1.96 1.43-.09.4-.5.65-.9.56s-.65-.5-.56-.9c.36-1.57 1.82-2.65 3.41-2.59 1.72-.09 3.29 1.29 3.41 3.09 0 1.16-.6 2.19-1.58 2.73l-1.47.82q-.18.09-.36.09z" />
      <path d="M10.75 21.5C4.82 21.5 0 16.68 0 10.75S4.82 0 10.75 0 21.5 4.82 21.5 10.75 16.68 21.5 10.75 21.5m0-20c-5.1 0-9.25 4.15-9.25 9.25S5.65 20 10.75 20 20 15.85 20 10.75 15.85 1.5 10.75 1.5" />
      <path d="M10.75 15.94c-.435 0-.86-.414-.86-.86s.415-.86.86-.86c.447 0 .86.414.86.86s-.413.86-.86.86" />
    </svg>
  ),
);

QuestionIcon.displayName = "QuestionIcon";
