import * as React from "react";
import { cn } from "@/utils/cn";
import { IconButton } from "../IconButton/IconButton";
import { ChevronLeftIcon } from "../Icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../Icons/ChevronRightIcon";

/** Pagination display style — numbered buttons or minimal dots. */
export type PaginationVariant = "default" | "dots";

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** Display style — numbered page buttons or minimal dots. @default "default" */
  variant?: PaginationVariant;
  /** Total number of pages. */
  totalPages: number;
  /** Current active page (1-indexed). */
  currentPage: number;
  /** Callback fired when the active page changes. Receives the new 1-indexed page number. */
  onPageChange?: (page: number) => void;
  /** Accessible label for the `<nav>` landmark. @default "Pagination" */
  ariaLabel?: string;
  /** Accessible label for the previous-page button. @default "Previous page" */
  previousLabel?: string;
  /** Accessible label for the next-page button. @default "Next page" */
  nextLabel?: string;
  /** Function that returns an accessible label for each page button. @default (page) => \`Page ${page}\` */
  getPageLabel?: (page: number) => string;
}

type PageItem = number | "ellipsis-start" | "ellipsis-end";

function getVisiblePages(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: PageItem[] = [1];

  if (currentPage <= 4) {
    pages.push(2, 3, 4, 5, "ellipsis-end");
  } else if (currentPage >= totalPages - 3) {
    pages.push("ellipsis-start", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1);
  } else {
    pages.push("ellipsis-start", currentPage - 1, currentPage, currentPage + 1, "ellipsis-end");
  }

  pages.push(totalPages);
  return pages;
}

/**
 * Page navigation control with previous/next buttons and numbered page
 * indicators. Supports a numbered-buttons layout (`"default"`) and a compact
 * dots layout (`"dots"`).
 *
 * @example
 * ```tsx
 * <Pagination totalPages={10} currentPage={page} onPageChange={setPage} />
 * ```
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      variant = "default",
      totalPages,
      currentPage,
      onPageChange,
      ariaLabel = "Pagination",
      previousLabel = "Previous page",
      nextLabel = "Next page",
      getPageLabel = (page: number) => `Page ${page}`,
      className,
      ...props
    },
    ref,
  ) => {
    const isFirstPage = currentPage <= 1;
    const isLastPage = currentPage >= totalPages;

    const handlePrevious = () => {
      if (!isFirstPage) onPageChange?.(currentPage - 1);
    };

    const handleNext = () => {
      if (!isLastPage) onPageChange?.(currentPage + 1);
    };

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center",
          variant === "default" && "gap-3",
          variant === "dots" && "gap-4",
          className,
        )}
        {...props}
      >
        <IconButton
          variant="tertiary"
          size="32"
          icon={<ChevronLeftIcon />}
          aria-label={previousLabel}
          disabled={isFirstPage}
          onClick={handlePrevious}
        />

        {variant === "default" && (
          <div className="flex items-center gap-3">
            {getVisiblePages(currentPage, totalPages).map((page) =>
              typeof page === "string" ? (
                <span
                  key={page}
                  className="flex size-4 items-center justify-center text-body-200 text-xs"
                  aria-hidden="true"
                >
                  &hellip;
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  aria-label={getPageLabel(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  onClick={() => onPageChange?.(page)}
                  className={cn(
                    "flex size-4 cursor-pointer items-center justify-center rounded-full text-xs focus-visible:shadow-focus-ring focus-visible:outline-none motion-safe:transition-colors motion-safe:duration-150",
                    page === currentPage
                      ? "bg-neutral-400 text-body-300"
                      : "bg-neutral-100 text-body-100 hover:bg-neutral-200",
                  )}
                >
                  {page}
                </button>
              ),
            )}
          </div>
        )}

        {variant === "dots" && (
          <div className="flex items-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                aria-label={getPageLabel(page)}
                aria-current={page === currentPage ? "page" : undefined}
                onClick={() => onPageChange?.(page)}
                className="flex size-6 cursor-pointer items-center justify-center rounded-full focus-visible:shadow-focus-ring focus-visible:outline-none"
              >
                <span
                  className={cn(
                    "block rounded-full motion-safe:transition-all motion-safe:duration-150",
                    page === currentPage
                      ? "size-2 bg-neutral-400"
                      : "size-1.5 bg-neutral-200 hover:bg-neutral-250",
                  )}
                />
              </button>
            ))}
          </div>
        )}

        <IconButton
          variant="tertiary"
          size="32"
          icon={<ChevronRightIcon />}
          aria-label={nextLabel}
          disabled={isLastPage}
          onClick={handleNext}
        />
      </nav>
    );
  },
);

Pagination.displayName = "Pagination";
