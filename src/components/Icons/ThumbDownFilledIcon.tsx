import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const ThumbDownFilledIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
          <g transform="translate(2 2)">
            <path d="M6.38989 3.23001V13.39C6.38989 13.79 6.50989 14.18 6.72989 14.51L9.4599 18.57C9.8899 19.22 10.9599 19.68 11.8699 19.34C12.8499 19.01 13.4999 17.91 13.2899 16.93L12.7699 13.66C12.7299 13.36 12.8099 13.09 12.9799 12.88C13.1499 12.69 13.3999 12.57 13.6699 12.57H17.7799C18.5699 12.57 19.2499 12.25 19.6499 11.69C20.0299 11.15 20.0999 10.45 19.8499 9.74001L17.3899 2.25001C17.0799 1.01001 15.7299 5.72205e-06 14.3899 5.72205e-06H10.4899C9.8199 5.72205e-06 8.8799 0.230005 8.4499 0.660006L7.16989 1.65001C6.67989 2.02001 6.38989 2.61 6.38989 3.23001Z" />
            <path d="M3.21 15.3398H2.18C0.63 15.3398 0 14.7398 0 13.2598V3.1998C0 1.7198 0.63 1.1198 2.18 1.1198H3.21C4.76 1.1198 5.39 1.7198 5.39 3.1998V13.2598C5.39 14.7398 4.76 15.3398 3.21 15.3398Z" />
          </g>
        </g>
      </svg>
    );
  },
);

ThumbDownFilledIcon.displayName = "ThumbDownFilledIcon";
