import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const DonateIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M10.5 13h-1c-1.1 0-2-.9-2-2V9.76C7.5 8.79 8.29 8 9.26 8h.01c.46 0 .85.37.85.83s-.38.84-.84.84-.83.37-.83.83V12c0 .28.22.5.5.5h1c.28 0 .5-.22.5-.5V9.76c0-.97.79-1.76 1.76-1.76h.01c.46 0 .85.37.85.83s-.38.84-.84.84a.33.33 0 0 0-.33.33v1c0 1.1-.9 2-2 2Zm8.47-3h-2.94C14.91 10 14 9.09 14 7.97V5.03C14 3.91 14.91 3 16.03 3h2.94C20.09 3 21 3.91 21 5.03v2.94c0 1.12-.91 2.03-2.03 2.03"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m16.5 7.25.56.56 1.19-1.12M2 12.87V12c0-2.96.79-4.33 3-5.54m17 6.41V12c0-2.96-.79-4.33-3-5.54M12 22c-3.87 0-7-3.13-7-7v-2.38c0-.73.6-1.33 1.33-1.33s1.33.6 1.33 1.33V15c0 2.39 1.94 4.33 4.34 4.33s4.33-1.94 4.33-4.33v-2.38a1.336 1.336 0 0 1 2.67 0V15c0 3.87-3.13 7-7 7"
      />
    </svg>
  ),
);

DonateIcon.displayName = "DonateIcon";
