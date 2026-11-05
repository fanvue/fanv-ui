import * as React from "react";
import { cn } from "../../utils/cn";
import { PILL_TRACK_CLASS } from "./TabsList";

/** Props for the {@link TabsListSkeleton} component. */
export type TabsListSkeletonProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Loading placeholder for a pill {@link TabsList}. Renders the same track, so
 * the row does not jump when the real tabs replace it. Pass placeholder items
 * (for example {@link Skeleton} pills) as children.
 *
 * The track is hidden from assistive technology; announce the loading state on
 * the surrounding region with `aria-busy`.
 *
 * @example
 * ```tsx
 * <TabsListSkeleton>
 *   <Skeleton variant="rounded" width={64} height={32} className="rounded-full" />
 *   <Skeleton variant="rounded" width={80} height={32} className="rounded-full" />
 * </TabsListSkeleton>
 * ```
 */
export const TabsListSkeleton = React.forwardRef<HTMLDivElement, TabsListSkeletonProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} aria-hidden="true" className={cn(PILL_TRACK_CLASS, className)} {...props}>
      {children}
    </div>
  ),
);

TabsListSkeleton.displayName = "TabsListSkeleton";
