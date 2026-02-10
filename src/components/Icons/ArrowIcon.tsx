import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export interface ArrowIconProps extends IconProps {
  direction?: "right" | "up" | "down" | "left";
}

export const ArrowIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        d="M14.9147 13.6C14.7698 13.6008 14.6262 13.573 14.4921 13.5181C14.3579 13.4633 14.2359 13.3824 14.1331 13.2802L10.511 9.63064L6.87796 13.1369C6.67168 13.3423 6.39265 13.4575 6.1018 13.4575C5.81096 13.4575 5.53192 13.3423 5.32565 13.1369C5.22246 13.0344 5.14056 12.9124 5.08467 12.7781C5.02878 12.6437 5 12.4996 5 12.354C5 12.2085 5.02878 12.0644 5.08467 11.93C5.14056 11.7957 5.22246 11.6737 5.32565 11.5712L9.72935 7.31518C9.93515 7.11316 10.2118 7 10.5 7C10.7882 7 11.0649 7.11316 11.2706 7.31518L15.6743 11.7256C15.7775 11.8281 15.8594 11.95 15.9153 12.0844C15.9712 12.2187 16 12.3629 16 12.5084C16 12.654 15.9712 12.7981 15.9153 12.9324C15.8594 13.0668 15.7775 13.1888 15.6743 13.2913C15.4703 13.4883 15.1982 13.5989 14.9147 13.6Z"
        fill="currentColor"
      />
    </svg>
  ),
);

ArrowIcon.displayName = "ArrowIcon";
