import * as React from "react";
import { cn } from "../../utils/cn";
import { Loader } from "../Loader/Loader";

/** Props for {@link ChartLoadingOverlay}. */
export interface ChartLoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether to show the loading overlay. @default false */
  loading?: boolean;
  /** Chart content to render underneath the overlay. */
  children: React.ReactNode;
}

/**
 * A positioned overlay that displays a loading spinner on top of chart content.
 * The children are always rendered to maintain layout dimensions; the overlay
 * covers them with a semi-transparent background and a centered spinner.
 *
 * @example
 * ```tsx
 * <ChartLoadingOverlay loading={isFetching}>
 *   <ChartContainer config={config} className="min-h-48">
 *     <LineChart data={data}>...</LineChart>
 *   </ChartContainer>
 * </ChartLoadingOverlay>
 * ```
 */
export const ChartLoadingOverlay = React.forwardRef<HTMLDivElement, ChartLoadingOverlayProps>(
  ({ loading = false, children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        {children}
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-container/60">
            <Loader show center />
          </div>
        )}
      </div>
    );
  },
);

ChartLoadingOverlay.displayName = "ChartLoadingOverlay";
