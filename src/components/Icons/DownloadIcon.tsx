import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

export const DownloadIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M9.602 12.47a.725.725 0 0 1-.72-.72V.72c0-.394.327-.72.72-.72.394 0 .72.326.72.72v11.03c0 .404-.326.72-.72.72" />
      <path d="M9.602 12.471a.72.72 0 0 1-.509-.21l-3.13-3.13a.724.724 0 0 1 0-1.018.724.724 0 0 1 1.019 0l2.62 2.62 2.621-2.62a.724.724 0 0 1 1.018 0 .724.724 0 0 1 0 1.017l-3.13 3.13a.72.72 0 0 1-.509.211" />
      <path d="M14.172 17.232h-9.14c-1.583 0-3.282-1.152-3.878-2.62L.051 11.845a.715.715 0 0 1 .403-.93.715.715 0 0 1 .93.402l1.105 2.765c.365.912 1.555 1.719 2.534 1.719h9.14c.988 0 2.17-.807 2.534-1.719l1.104-2.765a.715.715 0 0 1 .931-.403.723.723 0 0 1 .403.931l-1.104 2.765c-.576 1.469-2.275 2.621-3.859 2.621" />
    </svg>
  ),
);

DownloadIcon.displayName = "DownloadIcon";
