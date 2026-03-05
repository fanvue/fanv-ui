import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const DownloadIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M12 16.243a.725.725 0 0 1-.72-.72V4.493c0-.394.326-.72.72-.72s.72.326.72.72v11.03c0 .403-.326.72-.72.72" />
          <path d="M12 16.244a.72.72 0 0 1-.509-.212l-3.13-3.13a.724.724 0 0 1 0-1.017.724.724 0 0 1 1.018 0L12 14.506l2.62-2.62a.724.724 0 0 1 1.018 0 .724.724 0 0 1 0 1.017l-3.13 3.13a.72.72 0 0 1-.508.21" />
          <path d="M16.57 21.005H7.43c-1.583 0-3.283-1.152-3.878-2.621l-1.104-2.765a.715.715 0 0 1 .403-.931.715.715 0 0 1 .931.403l1.105 2.765c.364.912 1.555 1.718 2.534 1.718h9.14c.988 0 2.169-.806 2.534-1.718l1.104-2.765a.715.715 0 0 1 .93-.403.723.723 0 0 1 .404.93l-1.104 2.766c-.576 1.468-2.275 2.62-3.86 2.62" />
        </g>
      </svg>
    );
  },
);

DownloadIcon.displayName = "DownloadIcon";
