import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export interface ArrowIconProps extends IconProps {
  direction?: "right" | "up" | "down" | "left";
}

export const ArrowAltIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, direction = "right", ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={cn(
        "size-5",
        direction === "up"
          ? "rotate-0"
          : direction === "right"
            ? "rotate-90"
            : direction === "down"
              ? "rotate-270"
              : direction === "left"
                ? "rotate-180"
                : "rotate-0",
        className,
      )}
      {...props}
    >
      <path
        d="M9.16667 15V7.33335L6.16667 10.3334L5 9.16669L10 4.16669L15 9.16669L13.8333 10.3334L10.8333 7.33335V15H9.16667Z"
        fill="currentColor"
      />
    </svg>
  ),
);

ArrowAltIcon.displayName = "ArrowAltIcon";
