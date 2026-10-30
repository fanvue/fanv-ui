import * as React from "react";
import { cn } from "@/utils/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../DropdownMenu/DropdownMenu";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";
import { ChevronLeftIcon } from "../Icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../Icons/ChevronRightIcon";

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
 * Footer bar for data tables: rows-per-page control, page navigation, and
 * range summary. Pair `paginationSlot` with {@link Pagination} for numbered
 * controls.
 *
 * v2 sits flush inside {@link TableCard} (`px-3` matches the card's inner
 * gutter); the chip styling now lives on the {@link TableRowsPerPageSelect}
 * trigger itself.
 *
 * @example
 * ```tsx
 * <TablePagination
 *   leadingSlot={<TableRowsPerPageSelect />}
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
          className={cn("flex w-full max-w-full flex-col gap-4 px-3 py-3", className)}
          {...props}
        >
          <div className="flex w-full items-center gap-2">
            {leadingSlot != null ? (
              <div className="flex min-w-0 shrink-0 items-center">{leadingSlot}</div>
            ) : null}
            <div
              className={cn(
                "typography-description-12px-regular min-w-0 flex-1 text-content-secondary",
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
        className={cn("flex w-full flex-wrap items-center gap-3 px-3 py-3", className)}
        {...props}
      >
        <div className="flex min-h-0 min-w-0 flex-1 items-center">{leadingSlot}</div>
        {paginationSlot != null ? (
          <div className="flex shrink-0 items-center justify-center">{paginationSlot}</div>
        ) : null}
        <div className="typography-description-12px-regular min-w-0 flex-1 text-right text-content-secondary">
          {summary}
        </div>
      </div>
    );
  },
);
TablePagination.displayName = "TablePagination";

export interface TableCardPaginationProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Current page, 1-based. */
  page: number;
  /** Total number of pages. */
  pageCount: number;
  /** Called with the 1-based page to show. */
  onPageChange: (page: number) => void;
  /** Rows per page currently shown. */
  pageSize: number;
  /** Choices offered in the rows-per-page menu. */
  pageSizeOptions: readonly number[];
  /** Called with the new rows-per-page choice. */
  onPageSizeChange: (pageSize: number) => void;
  /** Formats the page indicator. @default (page, pageCount) => `${page} of ${pageCount}` */
  formatPage?: (page: number, pageCount: number) => string;
  /** Formats a rows-per-page choice. @default (pageSize) => `${pageSize} rows` */
  formatPageSize?: (pageSize: number) => string;
  /** Accessible name of the page navigation. @default "Pagination" */
  navigationLabel?: string;
  /** Accessible name of the previous-page button. @default "Previous page" */
  previousLabel?: string;
  /** Accessible name of the next-page button. @default "Next page" */
  nextLabel?: string;
  /** Accessible name of the rows-per-page menu trigger, followed by the current choice (e.g. "Rows per page, 10 rows"). @default "Rows per page" */
  pageSizeLabel?: string;
}

/**
 * 32px footer that closes a {@link TableCard}: previous, "1 of N", next, then
 * a rows-per-page menu, on `surface-table-row`. Place it after
 * {@link TableScrollArea} inside the card.
 *
 * @example
 * ```tsx
 * <TableCard>
 *   <TableScrollArea>…</TableScrollArea>
 *   <TableCardPagination
 *     page={page}
 *     pageCount={12}
 *     onPageChange={setPage}
 *     pageSize={10}
 *     pageSizeOptions={[10, 25, 50]}
 *     onPageSizeChange={setPageSize}
 *   />
 * </TableCard>
 * ```
 */
export const TableCardPagination = React.forwardRef<HTMLDivElement, TableCardPaginationProps>(
  (
    {
      className,
      page,
      pageCount,
      onPageChange,
      pageSize,
      pageSizeOptions,
      onPageSizeChange,
      formatPage = (current, total) => `${current} of ${total}`,
      formatPageSize = (size) => `${size} rows`,
      navigationLabel = "Pagination",
      previousLabel = "Previous page",
      nextLabel = "Next page",
      pageSizeLabel = "Rows per page",
      ...props
    },
    ref,
  ) => {
    const total = Math.max(pageCount, 1);
    const stepButton =
      "inline-flex size-4 shrink-0 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-icons-primary disabled:cursor-default disabled:opacity-40";
    return (
      <div
        ref={ref}
        className={cn(
          "typography-description-12px-regular flex h-8 shrink-0 items-center gap-6 border-border-primary border-t-[0.5px] bg-surface-table-row px-4 text-content-primary",
          className,
        )}
        {...props}
      >
        <nav aria-label={navigationLabel} className="flex items-center gap-2">
          <button
            type="button"
            aria-label={previousLabel}
            className={stepButton}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeftIcon size={16} />
          </button>
          <span className="whitespace-nowrap">{formatPage(page, total)}</span>
          <button
            type="button"
            aria-label={nextLabel}
            className={stepButton}
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRightIcon size={16} />
          </button>
        </nav>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`${pageSizeLabel}, ${formatPageSize(pageSize)}`}
              className="typography-description-12px-regular inline-flex cursor-pointer items-center gap-2 whitespace-nowrap border-none bg-transparent p-0 text-content-primary"
            >
              {formatPageSize(pageSize)}
              <ChevronDownIcon size={16} className="text-icons-primary" aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {pageSizeOptions.map((option) => (
              <DropdownMenuItem
                key={option}
                selected={option === pageSize}
                onSelect={() => onPageSizeChange(option)}
              >
                {formatPageSize(option)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  },
);
TableCardPagination.displayName = "TableCardPagination";
