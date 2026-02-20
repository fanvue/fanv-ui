import * as React from "react";
import { cn } from "../../utils/cn";
import { SpinnerIcon } from "../Icons/SpinnerIcon";

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the loader is visible. When `false`, renders nothing. @default true */
  show?: boolean;
  /** Accessible label for the loading indicator. @default "loading" */
  ariaLabel?: string;
  /** Minimum height of the container. Numbers are treated as pixels. @default "100%" */
  minHeight?: number | string;
  /** Center the spinner horizontally. @default false */
  center?: boolean;
  /** Center the spinner horizontally. @default false */
  centerX?: boolean;
  /** Center the spinner vertically. @default false */
  centerY?: boolean;
}

/**
 * A layout-aware loading indicator that renders a centered `SpinnerIcon` inside
 * a relatively-positioned container. Drop-in replacement for the Olympus `Loader`.
 *
 * @example
 * ```tsx
 * <Loader show center />
 * <Loader show centerX minHeight={200} />
 * ```
 */
export const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  (
    { show = true, ariaLabel, minHeight = "100%", center, centerX, centerY, className, ...props },
    ref,
  ) => {
    if (!show) {
      return null;
    }

    const shouldCenterX = center || centerX;
    const shouldCenterY = center || centerY;

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        style={{
          minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
        }}
        {...props}
      >
        <output
          className={cn(
            "absolute flex size-[60px] items-center justify-center",
            shouldCenterX && "left-1/2 -translate-x-1/2",
            shouldCenterY && "top-1/2 -translate-y-1/2",
          )}
          aria-label={ariaLabel ?? "loading"}
        >
          <SpinnerIcon className="size-9 animate-spin text-body-200" />
        </output>
      </div>
    );
  },
);

Loader.displayName = "Loader";
