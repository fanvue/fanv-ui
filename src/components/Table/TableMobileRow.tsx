import * as React from "react";
import { cn } from "../../utils/cn";

export interface TableMobileRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Status or type label above the title, typically a {@link Pill}. */
  badge?: React.ReactNode;
  /** Primary line (semibold body). */
  title: React.ReactNode;
  /** Secondary line beneath the title (muted). */
  description?: React.ReactNode;
  /** Trailing controls on the badge line, such as a favourite toggle and a navigation {@link IconButton}. */
  actions?: React.ReactNode;
}

/**
 * Stacked row that stands in for a table row on narrow screens (Figma `V2 Table Mobile`):
 * a badge and actions line, then a title with a description, closed by a divider.
 *
 * @example
 * ```tsx
 * <TableMobileRow
 *   badge={<Pill variant="green">Dynamic</Pill>}
 *   title="Top Spenders"
 *   description="320 members"
 *   actions={<IconButton aria-label="Open list" icon={<ChevronRightIcon />} />}
 * />
 * ```
 */
export const TableMobileRow = React.forwardRef<HTMLDivElement, TableMobileRowProps>(
  ({ className, badge, title, description, actions, ...props }, ref) => {
    const hasHeader = Boolean(badge || actions);

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full flex-col gap-4 pb-4 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-border-primary",
          // Without the badge line the title is the first thing in the row, so it gets the same 16px above as below.
          !hasHeader && "pt-4",
          className,
        )}
        {...props}
      >
        {hasHeader && (
          <div className="flex min-h-6 items-center justify-between gap-2">
            <div className="flex min-w-0 items-center">{badge}</div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
          </div>
        )}
        <div className="flex min-w-0 flex-col">
          <p className="typography-body-default-16px-semibold truncate text-content-primary">
            {title}
          </p>
          {description && (
            <p className="typography-body-small-14px-regular truncate text-content-tertiary">
              {description}
            </p>
          )}
        </div>
      </div>
    );
  },
);
TableMobileRow.displayName = "TableMobileRow";
