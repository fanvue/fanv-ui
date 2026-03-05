import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const BankIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M20.75 8.07h-20c-.41 0-.75-.34-.75-.75V5.75c0-.69.41-1.32 1.04-1.6l9-4c.45-.2.97-.2 1.42 0l9 4c.63.28 1.04.91 1.04 1.6v1.57c0 .41-.34.75-.75.75M1.5 6.57H20v-.82c0-.1-.06-.19-.15-.23l-9-4a.23.23 0 0 0-.2 0l-9 4c-.09.04-.15.13-.15.23z" />
      <path d="M2.42 17.4c-.41 0-.75-.34-.75-.75v-9c0-.41.34-.75.75-.75s.75.34.75.75v9c0 .41-.34.75-.75.75m16.66 0c-.41 0-.75-.34-.75-.75v-9c0-.41.34-.75.75-.75s.75.34.75.75v9c0 .41-.34.75-.75.75M7.97 15.29c-.41 0-.75-.34-.75-.75V10.1c0-.41.34-.75.75-.75s.75.34.75.75v4.44c0 .41-.34.75-.75.75m5.56 0c-.41 0-.75-.34-.75-.75V10.1c0-.41.34-.75.75-.75s.75.34.75.75v4.44c0 .41-.34.75-.75.75" />
      <path d="M20.75 21.4h-20c-.41 0-.75-.34-.75-.75v-3.33c0-.41.34-.75.75-.75h20c.41 0 .75.34.75.75v3.33c0 .41-.34.75-.75.75M1.5 19.9H20v-1.83H1.5z" />
    </svg>
  ),
);

BankIcon.displayName = "BankIcon";
