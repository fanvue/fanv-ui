import * as React from "react";
import { cn } from "@/utils/cn";
import type { BaseIconProps, IconPath, IconSize, IconVariants } from "./types";

const SIZE_CLASS: Record<IconSize, string> = {
  16: "size-4",
  24: "size-6",
  32: "size-8",
};

const LAYER_TRANSITION =
  "motion-safe:transition-opacity motion-safe:duration-150 motion-safe:ease-in-out";

interface InternalBaseIconProps extends BaseIconProps {
  variants: IconVariants;
}

const renderPath = (p: IconPath) =>
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
  );

/**
 * Internal renderer for prop-based icons. Each public icon (e.g. `HeartIcon`)
 * is a thin wrapper that supplies its own `variants` table and re-exports
 * {@link BaseIconProps} as `*IconProps`. Not exported from the package.
 *
 * When a `filled` variant exists, both layers are rendered simultaneously and
 * the `filled` prop crossfades between them. The same `<svg>` and `<g>` nodes
 * persist across toggles so the transition is visible rather than an instant
 * remount.
 */
export const BaseIcon = React.forwardRef<SVGSVGElement, InternalBaseIconProps>(
  ({ variants, size = 24, filled, className, ...props }, ref) => {
    const v = variants[size];
    const outlined = v?.outlined ?? [];
    const filledPaths = v?.filled;
    const showFilled = !!(filled && filledPaths);

    if (filled && !filledPaths && v && process.env.NODE_ENV !== "production") {
      console.warn(
        `[fanvue/ui] Icon at size=${size} has no 'filled' variant; falling back to outlined.`,
      );
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
        <g className={cn(LAYER_TRANSITION, showFilled ? "opacity-0" : "opacity-100")}>
          {outlined.map(renderPath)}
        </g>
        {filledPaths && (
          <g className={cn(LAYER_TRANSITION, showFilled ? "opacity-100" : "opacity-0")}>
            {filledPaths.map(renderPath)}
          </g>
        )}
      </svg>
    );
  },
);

BaseIcon.displayName = "BaseIcon";
