import * as React from "react";
import { cn } from "../../utils/cn";
import { ChevronLeftIcon } from "../Icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../Icons/ChevronRightIcon";

export interface PageSelectorProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** Total number of pages. */
  totalPages: number;
  /** Current active page (1-indexed). */
  currentPage: number;
  /** Callback fired when the active page changes. Receives the new 1-indexed page number. */
  onPageChange?: (page: number) => void;
  /** Whether reaching either end wraps around to the other. @default false */
  loop?: boolean;
  /** Whether the control is disabled. @default false */
  disabled?: boolean;
  /** Accessible label for the `<nav>` landmark. @default "Page selector" */
  ariaLabel?: string;
  /** Accessible label for the previous-page button. @default "Previous page" */
  previousLabel?: string;
  /** Accessible label for the next-page button. @default "Next page" */
  nextLabel?: string;
  /** Formats the indicator between the arrows. @default (current, total) => \`${current} of ${total}\` */
  formatLabel?: (currentPage: number, totalPages: number) => string;
}

const arrowClasses = cn(
  "flex shrink-0 cursor-pointer items-center justify-center rounded-xs p-1 text-content-primary [&>svg]:size-4",
  "hover:bg-brand-primary-muted disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent",
  "focus-visible:shadow-focus-ring focus-visible:outline-none motion-safe:transition-colors motion-safe:duration-150",
);

/**
 * A compact control for stepping through a small, known set of pages one at a
 * time, showing the position as "current of total" between a back and forward
 * arrow. Use when the total is small and the exact page number matters less
 * than moving between them, such as flicking through generated variants or a
 * short carousel. Reach for `Pagination` instead when consumers need to jump
 * to a specific numbered page.
 *
 * @example
 * ```tsx
 * <PageSelector totalPages={3} currentPage={page} onPageChange={setPage} />
 * ```
 */
export const PageSelector = React.forwardRef<HTMLElement, PageSelectorProps>(
  (
    {
      className,
      totalPages,
      currentPage,
      onPageChange,
      loop = false,
      disabled = false,
      ariaLabel = "Page selector",
      previousLabel = "Previous page",
      nextLabel = "Next page",
      formatLabel = (current, total) => `${current} of ${total}`,
      ...props
    },
    ref,
  ) => {
    const atStart = currentPage <= 1;
    const atEnd = currentPage >= totalPages;
    const prevDisabled = disabled || (atStart && !loop);
    const nextDisabled = disabled || (atEnd && !loop);

    const goTo = (page: number) => {
      const wrapped = loop ? ((page - 1 + totalPages) % totalPages) + 1 : page;
      if (wrapped < 1 || wrapped > totalPages || wrapped === currentPage) return;
      onPageChange?.(wrapped);
    };

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center gap-1 rounded-sm border border-border-primary bg-surface-secondary p-1",
          className,
        )}
        {...props}
      >
        <button
          type="button"
          aria-label={previousLabel}
          disabled={prevDisabled}
          onClick={() => goTo(currentPage - 1)}
          className={arrowClasses}
        >
          <ChevronLeftIcon />
        </button>

        <span
          aria-live="polite"
          className="typography-description-12px-semibold px-2 py-1 text-center text-content-primary tabular-nums"
        >
          {formatLabel(currentPage, totalPages)}
        </span>

        <button
          type="button"
          aria-label={nextLabel}
          disabled={nextDisabled}
          onClick={() => goTo(currentPage + 1)}
          className={arrowClasses}
        >
          <ChevronRightIcon />
        </button>
      </nav>
    );
  },
);

PageSelector.displayName = "PageSelector";
