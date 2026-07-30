import * as React from "react";
import { cn } from "../../utils/cn";
import { Loader } from "../Loader/Loader";
import { ChartSkeleton, type ChartSkeletonVariant } from "./ChartSkeleton";

/** Props for {@link ChartLoadingOverlay}. */
export interface ChartLoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether to show the loading overlay. @default false */
  loading?: boolean;
  /**
   * Shape of the wave-animated {@link ChartSkeleton} shown while loading. Set it
   * to match the chart underneath — `circular` for pie/radial, `bar` for bar
   * charts. Pass `false` to fall back to the legacy centred spinner.
   * @default "area"
   */
  variant?: ChartSkeletonVariant | false;
  /** Chart content to render underneath the overlay. */
  children: React.ReactNode;
}

/**
 * A positioned overlay shown on top of chart content while it loads. The children
 * are always rendered to maintain layout dimensions.
 *
 * By default the overlay is opaque and shows a wave-animated
 * {@link ChartSkeleton} shaped like the chart. At `variant={false}` it falls back
 * to a semi-transparent wash with a centred spinner.
 *
 * @example
 * ```tsx
 * <ChartLoadingOverlay loading={isFetching} variant="area">
 *   <ChartContainer config={config} className="min-h-48">
 *     <LineChart data={data}>...</LineChart>
 *   </ChartContainer>
 * </ChartLoadingOverlay>
 * ```
 */
export const ChartLoadingOverlay = React.forwardRef<HTMLDivElement, ChartLoadingOverlayProps>(
  ({ loading = false, variant = "area", children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        {children}
        {loading && (
          <div
            className={cn(
              "absolute inset-0 z-10 flex items-center justify-center",
              variant ? "bg-background-primary" : "bg-surface-primary/60",
            )}
          >
            {variant ? <ChartSkeleton variant={variant} /> : <Loader show center />}
          </div>
        )}
      </div>
    );
  },
);

ChartLoadingOverlay.displayName = "ChartLoadingOverlay";
