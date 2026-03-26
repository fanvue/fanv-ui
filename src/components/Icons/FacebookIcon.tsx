import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const FacebookIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M5.30892 13.8448V9.17272H3.86575V7.02576H5.30892V6.1007C5.30892 3.70902 6.38692 2.6007 8.72608 2.6007C8.96 2.6007 9.28317 2.62529 9.58242 2.66101C9.80656 2.68416 10.0289 2.7223 10.248 2.77518V4.7219C10.1213 4.71004 9.99428 4.70301 9.86708 4.70082C9.72459 4.69711 9.58204 4.69535 9.4395 4.69555C9.02708 4.69555 8.70508 4.75176 8.46242 4.87646C8.29928 4.95861 8.16214 5.08471 8.06633 5.24063C7.91583 5.48653 7.84817 5.82318 7.84817 6.26639V7.02576H10.1342L9.90908 8.25703L9.74167 9.17272H7.84817V14C11.3143 13.5796 14 10.6177 14 7.02576C14 3.14578 10.8657 0 7 0C3.13425 0 0 3.14578 0 7.02576C0 10.3208 2.25983 13.0855 5.30892 13.8448Z"
        />
      </svg>
    );
  },
);

FacebookIcon.displayName = "FacebookIcon";
