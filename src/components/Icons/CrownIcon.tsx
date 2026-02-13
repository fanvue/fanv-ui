import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/** A crown icon used for premium/VIP indicators (20 × 20). */
export const CrownIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M3.848 13.913 2 3.91l5.081 4.548L10.315 3l3.234 5.457 5.081-4.548-1.848 10.004H3.848Zm12.934 2.729c0 .546-.37.91-.924.91H4.772c-.555 0-.924-.364-.924-.91v-.91h12.934v.91Z" />
    </svg>
  ),
);

CrownIcon.displayName = "CrownIcon";
