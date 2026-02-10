import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

/** Heart icon (filled variant) */
export const HeartFilledIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M8.315 14.5512C8.20558 14.5519 8.09712 14.5303 7.99582 14.4877C7.89453 14.4451 7.8024 14.3823 7.72471 14.303L1.26482 7.64349C0.454519 6.8005 0 5.66238 0 4.47637C0 3.29035 0.454519 2.15223 1.26482 1.30924C2.08146 0.470822 3.18768 0 4.34096 0C5.49424 0 6.60046 0.470822 7.4171 1.30924L8.315 2.2337L9.2129 1.30924C10.0295 0.470822 11.1358 0 12.289 0C13.4423 0 14.5485 0.470822 15.3652 1.30924C16.1755 2.15223 16.63 3.29035 16.63 4.47637C16.63 5.66238 16.1755 6.8005 15.3652 7.64349L8.90529 14.303C8.8276 14.3823 8.73547 14.4451 8.63418 14.4877C8.53288 14.5303 8.42442 14.5519 8.315 14.5512Z" />
    </svg>
  ),
);

HeartFilledIcon.displayName = "HeartFilledIcon";
