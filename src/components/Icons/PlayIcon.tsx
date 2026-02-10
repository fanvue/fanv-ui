import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/** Play icon (filled) */
export const PlayIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M0 11.35V1C0 0.716667 0.1 0.479167 0.3 0.2875C0.5 0.0958333 0.733333 0 1 0C1.08333 0 1.17083 0.0125 1.2625 0.0375C1.35417 0.0625 1.44167 0.1 1.525 0.15L9.675 5.325C9.825 5.425 9.9375 5.55 10.0125 5.7C10.0875 5.85 10.125 6.00833 10.125 6.175C10.125 6.34167 10.0875 6.5 10.0125 6.65C9.9375 6.8 9.825 6.925 9.675 7.025L1.525 12.2C1.44167 12.25 1.35417 12.2875 1.2625 12.3125C1.17083 12.3375 1.08333 12.35 1 12.35C0.733333 12.35 0.5 12.2542 0.3 12.0625C0.1 11.8708 0 11.6333 0 11.35Z" />
    </svg>
  ),
);

PlayIcon.displayName = "PlayIcon";
