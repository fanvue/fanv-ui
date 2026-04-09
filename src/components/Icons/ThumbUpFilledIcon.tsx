import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const ThumbUpFilledIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
            <path d="M6.38989 16.2251V6.06508C6.38989 5.66508 6.50989 5.27508 6.72989 4.94508L9.4599 0.885083C9.8899 0.235083 10.9599 -0.224917 11.8699 0.115083C12.8499 0.445083 13.4999 1.54508 13.2899 2.52508L12.7699 5.79508C12.7299 6.09508 12.8099 6.36508 12.9799 6.57508C13.1499 6.76508 13.3999 6.88508 13.6699 6.88508H17.7799C18.5699 6.88508 19.2499 7.20508 19.6499 7.76507C20.0299 8.30507 20.0999 9.00507 19.8499 9.71507L17.3899 17.2051C17.0799 18.4451 15.7299 19.4551 14.3899 19.4551H10.4899C9.8199 19.4551 8.8799 19.2251 8.4499 18.7951L7.16989 17.8051C6.67989 17.4351 6.38989 16.8451 6.38989 16.2251Z" />
            <path d="M3.21 4.11523H2.18C0.63 4.11523 0 4.71523 0 6.19523V16.2553C0 17.7353 0.63 18.3353 2.18 18.3353H3.21C4.76 18.3353 5.39 17.7353 5.39 16.2553V6.19523C5.39 4.71523 4.76 4.11523 3.21 4.11523Z" />
          </g>
        </g>
      </svg>
    );
  },
);

ThumbUpFilledIcon.displayName = "ThumbUpFilledIcon";
