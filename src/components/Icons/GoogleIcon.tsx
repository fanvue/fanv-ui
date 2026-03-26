import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const GoogleIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        className={cn("size-6", className)}
        {...props}
      >
        <path
          fill="currentColor"
          d="M13.9998 7.1514C13.9998 6.67404 13.946 6.19668 13.8922 5.71932H7.1355V8.42834H10.9654C10.803 9.27726 10.3174 10.073 9.56208 10.5504V12.3096H11.8811C13.2295 11.1036 13.9998 9.29864 13.9998 7.1514Z"
        />
        <path
          fill="currentColor"
          d="M7.13543 14.0001C9.07918 14.0001 10.6985 13.3637 11.8811 12.3095L9.56201 10.5503C8.91402 10.9745 8.10405 11.2399 7.13543 11.2399C5.30037 11.2399 3.6811 10.0194 3.14181 8.32117H0.769226V10.1272C1.97847 12.5186 4.40679 14.0001 7.13543 14.0001Z"
        />
        <path
          fill="currentColor"
          d="M3.14189 8.32119C2.81917 7.47226 2.81917 6.51704 3.14189 5.61497V3.80896H0.769305C-0.256002 5.77374 -0.256002 8.10928 0.769305 10.1272L3.14189 8.32119Z"
        />
        <path
          fill="currentColor"
          d="M7.13548 2.76042C8.1579 2.76042 9.12652 3.13291 9.88188 3.82475L11.9349 1.80997C10.6447 0.640284 8.91407 -0.0492764 7.18927 0.00386894C4.46063 0.00386894 1.97852 1.48536 0.822762 3.87678L3.19535 5.68279C3.68085 3.98459 5.30012 2.76042 7.13548 2.76042Z"
        />
      </svg>
    );
  },
);

GoogleIcon.displayName = "GoogleIcon";
