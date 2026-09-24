import * as React from "react";
import { cn } from "@/utils/cn";

export interface TableMobileListProps extends React.HTMLAttributes<HTMLUListElement> {}

/**
 * Mobile rendering of a V2 Table: a `<ul>` of stacked {@link TableMobileRow}
 * blocks, each separated by a divider. Use in place of {@link Table} below the
 * `sm` breakpoint.
 *
 * @example
 * ```tsx
 * <TableMobileList aria-label="Fans">
 *   <TableMobileRow title="Jane Doe" label="@jane_doe">
 *     <TableMobileField label="Spend" value="$120" />
 *   </TableMobileRow>
 * </TableMobileList>
 * ```
 */
export const TableMobileList = React.forwardRef<HTMLUListElement, TableMobileListProps>(
  ({ className, ...props }, ref) => {
    return <ul ref={ref} className={cn("flex w-full flex-col", className)} {...props} />;
  },
);
TableMobileList.displayName = "TableMobileList";

/** Where the {@link TableMobileRowProps.label} sits relative to the title. */
export type TableMobileLabelPosition = "above" | "below";

export interface TableMobileRowProps extends Omit<React.HTMLAttributes<HTMLLIElement>, "title"> {
  /** Leading content of the optional header line, typically a {@link Pill}. */
  header?: React.ReactNode;
  /** Top-right slot (favourite, {@link IconButton}, {@link Checkbox}); on the header line if any. */
  actions?: React.ReactNode;
  /** Leading media in the primary block, e.g. an {@link Avatar} or a 40px thumbnail. */
  media?: React.ReactNode;
  /** Main content of the row. */
  title?: React.ReactNode;
  /** Supporting text shown with the title, e.g. a column name or a handle. */
  label?: React.ReactNode;
  /** `"below"`: bold title over label (Default, Avatar); `"above"`: bold label first. @default "below" */
  labelPosition?: TableMobileLabelPosition;
  /** Secondary row: {@link TableMobileField} elements laid out as equal columns. */
  children?: React.ReactNode;
}

function RowText({
  title,
  label,
  labelPosition,
}: Pick<TableMobileRowProps, "title" | "label" | "labelPosition">) {
  const below = labelPosition === "below";
  const titleNode = title != null && (
    <div
      className={cn(
        "text-content-primary",
        below ? "typography-body-default-16px-semibold" : "typography-body-default-16px-regular",
      )}
    >
      {title}
    </div>
  );
  const labelNode = label != null && (
    <div
      className={cn(
        "text-content-tertiary",
        below ? "typography-body-small-14px-regular" : "typography-body-small-14px-semibold",
      )}
    >
      {label}
    </div>
  );
  return (
    <div className="flex min-w-0 flex-col">
      {below ? titleNode : labelNode}
      {below ? labelNode : titleNode}
    </div>
  );
}

/**
 * A single row of a {@link TableMobileList}: optional header line, primary
 * block and an optional secondary row of {@link TableMobileField} columns,
 * closed by a divider. All controls are passed in as slots.
 *
 * @example
 * ```tsx
 * <TableMobileRow
 *   header={<Pill variant="green">Active</Pill>}
 *   actions={<IconButton aria-label="Open" icon={<ChevronRightIcon />} />}
 *   title="Weekend offers"
 *   label="320 members"
 * />
 * ```
 */
export const TableMobileRow = React.forwardRef<HTMLLIElement, TableMobileRowProps>(
  (
    {
      className,
      header,
      actions,
      media,
      title,
      label,
      labelPosition = "below",
      children,
      ...props
    },
    ref,
  ) => {
    const hasHeader = header != null;
    const actionsNode =
      actions != null ? (
        <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>
      ) : null;
    const hasText = title != null || label != null;

    return (
      <li
        ref={ref}
        className={cn("flex flex-col gap-4 border-border-primary border-b py-4", className)}
        {...props}
      >
        {hasHeader && (
          <div className="flex items-center gap-2">
            <div className="min-w-0">{header}</div>
            {actionsNode}
          </div>
        )}
        {(media != null || hasText || (!hasHeader && actionsNode != null)) && (
          <div className="flex items-start gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {media != null && <div className="flex shrink-0 items-center gap-1">{media}</div>}
              {hasText && <RowText title={title} label={label} labelPosition={labelPosition} />}
            </div>
            {!hasHeader && actionsNode}
          </div>
        )}
        {children != null && <dl className="flex gap-2">{children}</dl>}
      </li>
    );
  },
);
TableMobileRow.displayName = "TableMobileRow";

export interface TableMobileFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Column name, rendered as the term (`<dt>`). */
  label: React.ReactNode;
  /** Cell value, rendered as the description (`<dd>`); may be a node such as a {@link Pill}. */
  value: React.ReactNode;
}

/**
 * One column of a {@link TableMobileRow} secondary row: a tertiary label over
 * its value. Columns share the row width equally.
 *
 * @example
 * ```tsx
 * <TableMobileField label="Status" value={<Pill variant="green">Subscriber</Pill>} />
 * ```
 */
export const TableMobileField = React.forwardRef<HTMLDivElement, TableMobileFieldProps>(
  ({ className, label, value, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex min-w-0 flex-1 flex-col gap-1", className)} {...props}>
        <dt className="typography-body-small-14px-semibold text-content-tertiary">{label}</dt>
        <dd className="typography-body-default-16px-regular text-content-primary">{value}</dd>
      </div>
    );
  },
);
TableMobileField.displayName = "TableMobileField";
