import * as React from "react";
import { cn } from "@/utils/cn";

/** Layout preset for the pagination bar — desktop (range on the right) or stacked mobile. */
export type TablePaginationLayout = "desktop" | "mobile";

export interface TablePaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Layout preset. @default "desktop" */
  layout?: TablePaginationLayout;
  /** Left (desktop) or top row (mobile) content, e.g. rows-per-page {@link Select}. */
  leadingSlot?: React.ReactNode;
  /** Center (desktop) or bottom row (mobile) content, e.g. {@link Pagination}. */
  paginationSlot?: React.ReactNode;
  /** Summary text or node (e.g. current range and total). */
  summary: React.ReactNode;
}

/**
 * Footer bar for data tables: rows-per-page control, page navigation, and range
 * summary. Pair `paginationSlot` with {@link Pagination} for numbered controls.
 *
 * @example
 * ```tsx
 * <TablePagination
 *   leadingSlot={<Select size="32" aria-label="Rows per page">…</Select>}
 *   paginationSlot={<Pagination totalPages={5} currentPage={2} onPageChange={setPage} />}
 *   summary="20–30 of 100 rows"
 * />
 * ```
 */
export const TablePagination = React.forwardRef<HTMLDivElement, TablePaginationProps>(
  ({ className, layout = "desktop", leadingSlot, paginationSlot, summary, ...props }, ref) => {
    if (layout === "mobile") {
      return (
        <div
          ref={ref}
          className={cn("flex w-full max-w-full flex-col gap-3 px-4", className)}
          {...props}
        >
          <div className="flex w-full items-center gap-2.5">
            {leadingSlot != null ? (
              <div className="flex min-w-0 shrink-0 items-center rounded-lg bg-surface-behindpage">
                {leadingSlot}
              </div>
            ) : null}
            <div
              className={cn(
                "typography-regular-body-md min-w-0 flex-1 text-foreground-secondary",
                leadingSlot == null && "text-left",
                leadingSlot != null && "text-right",
              )}
            >
              {summary}
            </div>
          </div>
          {paginationSlot != null ? (
            <div className="flex justify-center">{paginationSlot}</div>
          ) : null}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("flex w-full flex-wrap items-center gap-3 px-4", className)}
        {...props}
      >
        <div className="flex min-h-0 min-w-0 flex-1 flex-col items-start justify-center">
          {leadingSlot != null ? (
            <div className="inline-flex min-w-0 rounded-lg bg-surface-behindpage">
              {leadingSlot}
            </div>
          ) : null}
        </div>
        {paginationSlot != null ? (
          <div className="flex shrink-0 items-center justify-center">{paginationSlot}</div>
        ) : null}
        <div className="typography-regular-body-md min-w-0 flex-1 text-right text-foreground-secondary">
          {summary}
        </div>
      </div>
    );
  },
);
TablePagination.displayName = "TablePagination";
