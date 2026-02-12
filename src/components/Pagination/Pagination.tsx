import * as React from "react";
import { cn } from "@/utils/cn";
import { IconButton } from "../IconButton/IconButton";
import { ChevronLeftIcon } from "../Icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../Icons/ChevronRightIcon";

export type PaginationVariant = "default" | "dots";

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** Visual style variant */
  variant?: PaginationVariant;
  /** Total number of pages */
  totalPages: number;
  /** Current active page (1-indexed) */
  currentPage: number;
  /** Called when the page changes */
  onPageChange?: (page: number) => void;
  /** Label for the nav landmark. @default "Pagination" */
  ariaLabel?: string;
  /** Label for the previous button. @default "Previous page" */
  previousLabel?: string;
  /** Label for the next button. @default "Next page" */
  nextLabel?: string;
  /** Generates the aria-label for each page button. @default (page) => \`Page ${page}\` */
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
                    "flex size-4 cursor-pointer items-center justify-center rounded-full text-xs motion-safe:transition-colors motion-safe:duration-150 focus-visible:shadow-focus-ring focus-visible:outline-none",
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
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                aria-label={getPageLabel(page)}
                aria-current={page === currentPage ? "page" : undefined}
                onClick={() => onPageChange?.(page)}
                className={cn(
                  "cursor-pointer rounded-full motion-safe:transition-all motion-safe:duration-150 focus-visible:shadow-focus-ring focus-visible:outline-none",
                  page === currentPage
                    ? "size-2 bg-neutral-400"
                    : "size-1.5 bg-neutral-200 hover:bg-neutral-250",
                )}
              />
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
