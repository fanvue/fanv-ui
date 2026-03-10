import * as React from "react";
import { cn } from "../../utils/cn";

/** Shape variant of the skeleton placeholder. */
export type SkeletonVariant = "text" | "circular" | "rectangular" | "rounded";

/** Animation style of the skeleton. `false` disables animation. */
export type SkeletonAnimation = "pulse" | "wave" | false;

export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Shape variant of the skeleton.
   *
   * - `text` – a single line of text with slight vertical margin and rounded ends
   * - `circular` – a circle (width and height should match)
   * - `rectangular` – a sharp-cornered rectangle
   * - `rounded` – a rectangle with rounded corners
   *
   * @default "text"
   */
  variant?: SkeletonVariant;
  /** Animation style. Set to `false` to disable animation. @default "pulse" */
  animation?: SkeletonAnimation;
  /** Width of the skeleton. Accepts a CSS value (number is treated as `px`). */
  width?: number | string;
  /** Height of the skeleton. Accepts a CSS value (number is treated as `px`). */
  height?: number | string;
}

const VARIANT_CLASSES: Record<SkeletonVariant, string> = {
  text: "rounded my-0.5",
  circular: "rounded-full",
  rectangular: "",
  rounded: "rounded-lg",
};

/**
 * A placeholder preview of content before data is loaded, reducing perceived
 * load time. Mirrors common MUI Skeleton props for easy migration.
 *
 * When used as a loading state, wrap the skeleton region with `aria-busy="true"`
 * and provide an accessible label so screen readers can convey the loading state.
 *
 * @example
 * ```tsx
 * <Skeleton variant="text" width={200} />
 * <Skeleton variant="circular" width={40} height={40} />
 * <Skeleton variant="rectangular" width="100%" height={120} />
 * ```
 */
export const Skeleton = React.forwardRef<HTMLSpanElement, SkeletonProps>(
  (
    { className, variant = "text", animation = "pulse", width, height, style, children, ...props },
    ref,
  ) => {
    const hasChildren = React.Children.count(children) > 0;
    const sizeStyle: React.CSSProperties = {
      ...style,
      ...(width !== undefined && {
        width: typeof width === "number" ? `${width}px` : width,
      }),
      ...(height !== undefined && {
        height: typeof height === "number" ? `${height}px` : height,
      }),
    };

    return (
      <span
        ref={ref}
        aria-hidden="true"
        className={cn(
          "block bg-[color-mix(in_srgb,var(--color-foreground-default)_11%,var(--color-surface-page))]",
          VARIANT_CLASSES[variant],
          variant === "text" && !height && !hasChildren && "h-[1em]",
          animation === "pulse" && "animate-pulse",
          animation === "wave" && "fv-skeleton-wave",
          hasChildren && "relative overflow-hidden [&>*]:invisible",
          className,
        )}
        style={sizeStyle}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Skeleton.displayName = "Skeleton";
