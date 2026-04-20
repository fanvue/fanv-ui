import * as React from "react";
import { cn } from "@/utils/cn";
import type { BaseIconProps, IconSize, IconVariants } from "./types";

const SIZE_CLASS: Record<IconSize, string> = {
  16: "size-4",
  24: "size-6",
  32: "size-8",
};

interface InternalBaseIconProps extends BaseIconProps {
  variants: IconVariants;
}

/**
 * Internal renderer for prop-based icons. Each public icon (e.g. `HeartIcon`)
 * is a thin wrapper that supplies its own `variants` table and re-exports
 * {@link BaseIconProps} as `*IconProps`. Not exported from the package.
 */
export const BaseIcon = React.forwardRef<SVGSVGElement, InternalBaseIconProps>(
  ({ variants, size = 24, filled, className, ...props }, ref) => {
    const v = variants[size];
    let paths = v?.outlined ?? [];
    if (filled) {
      if (v?.filled) {
        paths = v.filled;
      } else if (process.env.NODE_ENV !== "production" && v) {
        console.warn(
          `[fanvue/ui] Icon at size=${size} has no 'filled' variant; falling back to outlined.`,
        );
      }
    }
    return (
      <svg
        ref={ref}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        aria-hidden="true"
        className={cn(SIZE_CLASS[size], className)}
        {...props}
      >
        {paths.map((p) =>
          p.sw !== undefined ? (
            <path
              key={p.d}
              d={p.d}
              stroke="currentColor"
              strokeWidth={p.sw}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              key={p.d}
              d={p.d}
              fill="currentColor"
              fillRule={p.eo ? "evenodd" : undefined}
              clipRule={p.eo ? "evenodd" : undefined}
            />
          ),
        )}
      </svg>
    );
  },
);

BaseIcon.displayName = "BaseIcon";
