import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const BankIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M22 9.42H2c-.41 0-.75-.34-.75-.75V7.1c0-.69.41-1.32 1.04-1.6l9-4c.45-.2.97-.2 1.42 0l9 4c.63.28 1.04.91 1.04 1.6v1.57c0 .41-.34.75-.75.75M2.75 7.92h18.5V7.1c0-.1-.06-.19-.15-.23l-9-4a.23.23 0 0 0-.2 0l-9 4c-.09.04-.15.13-.15.23z" />
          <path d="M3.67 18.75c-.41 0-.75-.34-.75-.75V9c0-.41.34-.75.75-.75s.75.34.75.75v9c0 .41-.34.75-.75.75M20.33 18.75c-.41 0-.75-.34-.75-.75V9c0-.41.34-.75.75-.75s.75.34.75.75v9c0 .41-.34.75-.75.75M9.22 16.64c-.41 0-.75-.34-.75-.75v-4.44c0-.41.34-.75.75-.75s.75.34.75.75v4.44c0 .41-.34.75-.75.75M14.78 16.64c-.41 0-.75-.34-.75-.75v-4.44c0-.41.34-.75.75-.75s.75.34.75.75v4.44c0 .41-.34.75-.75.75" />
          <path d="M22 22.75H2c-.41 0-.75-.34-.75-.75v-3.33c0-.41.34-.75.75-.75h20c.41 0 .75.34.75.75V22c0 .41-.34.75-.75.75m-19.25-1.5h18.5v-1.83H2.75z" />
        </g>
      </svg>
    );
  },
);

BankIcon.displayName = "BankIcon";
