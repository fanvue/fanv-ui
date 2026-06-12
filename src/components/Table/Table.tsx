import * as React from "react";
import { cn } from "@/utils/cn";
import { ArrowDownIcon } from "../Icons/ArrowDownIcon";
import { ArrowUpIcon } from "../Icons/ArrowUpIcon";
import { Select, SelectContent, SelectItem } from "../Select/Select";

/**
 * Row density for body cells.
 *
 * - `"md"` (default) → 64px Figma `V2 Table Cell` Default.
 * - `"condensed"` → 48px Figma `V2 Table Cell` Condensed.
 * - `"lg"` → 80px rows; no longer in Figma, kept for back-compat.
 *
 * `"default"` is the v2 numeric-token equivalent of `"md"` and is preferred
 * for new code.
 */
export type TableSize = "md" | "lg" | "condensed" | "default";

export interface TableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Row density applied to {@link TableCell} descendants. @default "md" */
  size?: TableSize;
}

const TableSizeContext = React.createContext<TableSize>("md");

function useTableSize(): TableSize {
  return React.useContext(TableSizeContext);
}

/**
 * Surface wrapper for data tables: rounded 24px container with a strong
 * outer border, inner spacing, and size context for {@link TableCell}
 * descendants. Compose with {@link TableScrollArea}, {@link Table},
 * {@link TableHeader}, {@link TableBody}, {@link TableRow},
 * {@link TableHead}, and {@link TableCell}.
 *
 * @example
 * ```tsx
 * <TableCard>
 *   <TableScrollArea>
 *     <Table>
 *       <TableHeader>
 *         <TableRow>
 *           <TableHead>Name</TableHead>
 *         </TableRow>
 *       </TableHeader>
 *       <TableBody>
 *         <TableRow>
 *           <TableCell>Jane Doe</TableCell>
 *         </TableRow>
 *       </TableBody>
 *     </Table>
 *   </TableScrollArea>
 * </TableCard>
 * ```
 */
export const TableCard = React.forwardRef<HTMLDivElement, TableCardProps>(
  ({ className, size = "md", ...props }, ref) => {
    return (
      <TableSizeContext.Provider value={size}>
        <div
          ref={ref}
          className={cn(
            "isolate flex flex-col gap-2 overflow-hidden rounded-3xl border border-border-strong px-3 py-1",
            className,
          )}
          {...props}
        />
      </TableSizeContext.Provider>
    );
  },
);
TableCard.displayName = "TableCard";

export interface TableToolbarProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Optional toolbar row above the table (e.g. bulk selection actions).
 */
export const TableToolbar = React.forwardRef<HTMLDivElement, TableToolbarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-wrap items-center gap-4 px-4 py-3", className)}
        {...props}
      />
    );
  },
);
TableToolbar.displayName = "TableToolbar";

export interface TableScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * No longer needed in v2 — {@link TableCard} handles corner rounding via
   * its own `overflow-hidden rounded-3xl`. Accepted for back-compat.
   *
   * @deprecated v2 ignores this prop; safe to remove.
   */
  roundTop?: boolean;
  /**
   * Shows a slim horizontal scrollbar beneath the table when the content
   * overflows (Figma `V2 Scroll Bar`). @default false
   */
  showScrollbar?: boolean;
}

/**
 * Horizontal scroll container for wide tables. The inner scrollport keeps
 * `border-collapse` styles intact when the table wraps.
 */
export const TableScrollArea = React.forwardRef<HTMLDivElement, TableScrollAreaProps>(
  ({ className, children, roundTop: _roundTop, showScrollbar = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative w-full min-w-0 overflow-hidden", className)}
        {...props}
      >
        <div
          className={cn(
            "overflow-x-auto",
            showScrollbar &&
              "pb-3 [scrollbar-color:var(--color-border-strong)_transparent] [scrollbar-width:thin]",
          )}
        >
          {children}
        </div>
      </div>
    );
  },
);
TableScrollArea.displayName = "TableScrollArea";

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

/**
 * Semantic `<table>` element. Place inside {@link TableScrollArea}.
 */
export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => {
    return (
      <table
        ref={ref}
        className={cn(
          "w-full caption-bottom border-separate border-spacing-0 text-left",
          className,
        )}
        {...props}
      />
    );
  },
);
Table.displayName = "Table";

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => {
    return <thead ref={ref} className={cn(className)} {...props} />;
  },
);
TableHeader.displayName = "TableHeader";

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

/**
 * `<tbody>` wrapper. Removes the bottom border on cells in the final row to
 * match the Figma `V2 Table Final Row` treatment.
 */
export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => {
    return (
      <tbody ref={ref} className={cn("[&_tr:last-child_td]:border-b-0", className)} {...props} />
    );
  },
);
TableBody.displayName = "TableBody";

export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => {
    return <tfoot ref={ref} className={cn(className)} {...props} />;
  },
);
TableFooter.displayName = "TableFooter";

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => {
    return <tr ref={ref} className={cn(className)} {...props} />;
  },
);
TableRow.displayName = "TableRow";

/** Column layout preset for {@link TableHead}. */
export type TableHeadIntent = "default" | "checkbox" | "sort" | "leading";

const HEAD_INTENT_CLASSES: Record<TableHeadIntent, string> = {
  default: "text-left",
  checkbox: "w-12 min-w-12 max-w-12 text-center",
  sort: "text-right",
  leading: "min-w-0 w-2/5 text-left",
};

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Layout preset for common column types. @default "default" */
  intent?: TableHeadIntent;
}

/**
 * Header cell. v2: transparent background, 48px min height, tertiary text,
 * `border-border-primary` bottom rule. Uses 16px semibold type, or 14px when
 * the parent {@link TableCard} is `size="condensed"`.
 */
export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, intent = "default", scope = "col", ...props }, ref) => {
    const size = useTableSize();
    return (
      <th
        ref={ref}
        scope={scope}
        className={cn(
          size === "condensed"
            ? "typography-body-small-14px-semibold"
            : "typography-body-default-16px-semibold",
          "box-border h-12 min-h-12 border-b border-border-primary px-4 py-3 align-middle text-content-tertiary",
          HEAD_INTENT_CLASSES[intent],
          className,
        )}
        {...props}
      />
    );
  },
);
TableHead.displayName = "TableHead";

const CELL_MIN_HEIGHT: Record<TableSize, string> = {
  md: "h-16 min-h-16",
  default: "h-16 min-h-16",
  condensed: "h-12 min-h-12 py-1",
  lg: "h-20 min-h-20",
};

/** Bottom border and padding preset for body cells (Figma table cell component). */
export type TableCellVariant = "default" | "chip" | "pillProgress";

const CELL_VARIANT_CLASSES: Record<TableCellVariant, string> = {
  default: "border-b border-border-primary px-4 py-3",
  chip: "border-b border-border-primary px-4 py-3",
  pillProgress: "border-b border-border-primary px-4 py-3",
};

/** Layout / typography preset for {@link TableCell} (orthogonal to {@link TableCellVariant}). */
export type TableCellIntent = "default" | "checkbox" | "stacked" | "multiline" | "sideLabel";

const CELL_INTENT_CLASSES: Record<TableCellIntent, string> = {
  default: "",
  checkbox: "w-12 min-w-12 max-w-12 text-center",
  stacked: "align-top",
  multiline: "max-w-[240px]",
  sideLabel: "",
};

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** Padding preset for the cell. v2 uses identical padding across variants; values are kept for back-compat. @default "default" */
  cellVariant?: TableCellVariant;
  /** Alignment and typography preset for common cell types. @default "default" */
  intent?: TableCellIntent;
}

/**
 * Body cell. v2: `h-16` (or `h-20` when the parent {@link TableCard} uses
 * `size="lg"`), `px-4 py-3` padding, body-sm typography, and a single
 * `border-border-primary` rule that is zeroed by {@link TableBody} for the
 * final row.
 */
export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, cellVariant = "default", intent = "default", ...props }, ref) => {
    const size = useTableSize();
    const typo =
      intent === "sideLabel"
        ? "typography-body-small-14px-semibold"
        : "typography-body-small-14px-regular";
    return (
      <td
        ref={ref}
        className={cn(
          typo,
          "align-middle text-content-primary",
          CELL_VARIANT_CLASSES[cellVariant],
          CELL_MIN_HEIGHT[size],
          CELL_INTENT_CLASSES[intent],
          className,
        )}
        {...props}
      />
    );
  },
);
TableCell.displayName = "TableCell";

export interface TableCellGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Horizontal group for icons, chips, and metadata inside a {@link TableCell}
 * (Figma `gap-[4px]`).
 */
export const TableCellGroup = React.forwardRef<HTMLDivElement, TableCellGroupProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex items-center gap-1", className)} {...props} />;
  },
);
TableCellGroup.displayName = "TableCellGroup";

export interface TableCellContentProps {
  /** Primary line (semibold body-sm). */
  primary: React.ReactNode;
  /** Optional secondary line (regular body-sm, secondary color). */
  secondary?: React.ReactNode;
  /** Inline node rendered next to the primary line (icon, chip). */
  primaryAdornment?: React.ReactNode;
  /** Inline node rendered next to the secondary line. */
  secondaryAdornment?: React.ReactNode;
  /** Class for the outer wrapper. */
  className?: string;
}

/**
 * Two-line content slot matching Figma `V2 Table Content` — primary line
 * (semibold) over an optional secondary line (regular, muted) with a 2px
 * gap. Use inside {@link TableCell} for the common stacked-text pattern.
 */
export function TableCellContent({
  primary,
  secondary,
  primaryAdornment,
  secondaryAdornment,
  className,
}: TableCellContentProps) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <div className="flex items-center gap-1">
        <span className="typography-body-small-14px-semibold text-content-primary">{primary}</span>
        {primaryAdornment}
      </div>
      {(secondary != null || secondaryAdornment != null) && (
        <div className="flex items-center gap-1">
          {secondary != null && (
            <span className="typography-body-small-14px-regular text-content-secondary">
              {secondary}
            </span>
          )}
          {secondaryAdornment}
        </div>
      )}
    </div>
  );
}
TableCellContent.displayName = "TableCellContent";

/** Pixel size of the square {@link TableMediaThumbnail}. */
export type TableMediaThumbnailSize = "48" | "32";

export interface TableMediaThumbnailProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Image URL. */
  src: string;
  /** Alt text for the image. @default "" */
  alt?: string;
  /** Applies the table's blurred-media treatment. @default false */
  blurred?: boolean;
  /** `center` uses the fixed media column width from the lg spec. @default "start" */
  align?: "start" | "center";
  /** Pixel size of the square thumbnail; `"32"` matches the current Figma `V2 Media Thumbnail Item`. @default "48" */
  size?: TableMediaThumbnailSize;
}

/**
 * Square thumbnail used inside {@link TableCell} for media columns
 * (Figma `V2 Media Thumbnail Item`).
 */
export const TableMediaThumbnail = React.forwardRef<HTMLDivElement, TableMediaThumbnailProps>(
  ({ className, src, alt = "", blurred, align = "start", size = "48", ...props }, ref) => {
    const frame = cn(
      "overflow-hidden bg-neutral-alphas-200",
      size === "48" && "size-12 rounded-sm",
      size === "32" && "size-8 rounded-xs",
    );
    return (
      <div
        ref={ref}
        className={cn(
          align === "center" && "flex w-16 shrink-0 justify-center",
          align === "start" && "inline-flex shrink-0",
        )}
      >
        <div className={cn(frame, blurred && "blur-[2px]", className)} {...props}>
          <img alt={alt} className="size-full object-cover" src={src} />
        </div>
      </div>
    );
  },
);
TableMediaThumbnail.displayName = "TableMediaThumbnail";

export interface TableStatusDotProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Small status indicator dot for table cells (Figma status column).
 */
export const TableStatusDot = React.forwardRef<HTMLDivElement, TableStatusDotProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("size-2 shrink-0 rounded-full bg-info-content", className)}
        {...props}
      />
    );
  },
);
TableStatusDot.displayName = "TableStatusDot";

export interface TableProgressTrackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Fill width from 0–100. @default 0 */
  value?: number;
}

/**
 * Thin progress track used with badges in table cells (Figma pill + progress).
 * Renders with `role="progressbar"` and a default `aria-label` of `"Progress"`.
 */
export const TableProgressTrack = React.forwardRef<HTMLDivElement, TableProgressTrackProps>(
  ({ className, value = 0, "aria-label": ariaLabel = "Progress", ...props }, ref) => {
    const width = Math.min(100, Math.max(0, value));
    const rounded = Math.round(width);
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={rounded}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
        className={cn(
          "relative h-1 w-full overflow-hidden rounded-full bg-neutral-alphas-200",
          className,
        )}
        {...props}
      >
        <div
          className="absolute top-0 left-0 h-1 rounded-full bg-buttons-primary-default"
          style={{ width: `${width}%` }}
          aria-hidden
        />
      </div>
    );
  },
);
TableProgressTrack.displayName = "TableProgressTrack";

export interface TablePillProgressLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Vertical layout for pill label + {@link TableProgressTrack} in a cell.
 */
export const TablePillProgressLayout = React.forwardRef<
  HTMLDivElement,
  TablePillProgressLayoutProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex min-w-[120px] flex-col items-start gap-2", className)}
      {...props}
    />
  );
});
TablePillProgressLayout.displayName = "TablePillProgressLayout";

/** Current sort direction of a {@link TableSortLabel}. `null` means unsorted. */
export type TableSortDirection = "asc" | "desc" | null;

export interface TableSortLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  /**
   * Visual indicator of the column's sort state. When set to `"asc"` or
   * `"desc"`, a 1px underline accent appears beneath the label and a small
   * directional arrow is shown next to it. @default null
   */
  direction?: TableSortDirection;
}

/**
 * Sortable column label. v2 expresses the sort state with a 1px underline
 * beneath the label plus a directional arrow when sorted.
 */
export const TableSortLabel = React.forwardRef<HTMLSpanElement, TableSortLabelProps>(
  ({ className, children, direction = null, ...props }, ref) => {
    const Icon = direction === "desc" ? ArrowDownIcon : ArrowUpIcon;
    return (
      <span
        ref={ref}
        className={cn("inline-flex items-center gap-1 text-content-primary", className)}
        {...props}
      >
        <span className={cn(direction != null && "border-b border-content-primary pb-px")}>
          {children}
        </span>
        {direction != null && <Icon className="size-4 shrink-0" aria-hidden />}
      </span>
    );
  },
);
TableSortLabel.displayName = "TableSortLabel";

export interface TableStackedTextProps {
  /** Primary line (semibold body). */
  title: React.ReactNode;
  /** Secondary line (caption, muted). */
  subtitle: React.ReactNode;
}

/**
 * Two-line primary + secondary text block for "cell + info" patterns.
 *
 * @deprecated Prefer {@link TableCellContent} which supports adornments and
 * matches the Figma `V2 Table Content` slot.
 */
export function TableStackedText({ title, subtitle }: TableStackedTextProps) {
  return <TableCellContent primary={title} secondary={subtitle} />;
}

TableStackedText.displayName = "TableStackedText";

export interface TableLineClampProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of lines before ellipsis. @default 2 */
  lines?: 1 | 2 | 3;
}

/**
 * Clamps child text to a fixed number of lines inside a {@link TableCell}.
 */
export const TableLineClamp = React.forwardRef<HTMLDivElement, TableLineClampProps>(
  ({ className, lines = 2, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          lines === 1 && "line-clamp-1",
          lines === 2 && "line-clamp-2",
          lines === 3 && "line-clamp-3",
          className,
        )}
        {...props}
      />
    );
  },
);
TableLineClamp.displayName = "TableLineClamp";

export interface TableRowsPerPageSelectProps {
  /** Passed to the trigger for forms and labels. */
  id?: string;
  /** Accessible name for the trigger when no visible label. @default "Rows per page" */
  "aria-label"?: string;
}

/**
 * Rows-per-page {@link Select} styled for {@link TablePagination}. v2 uses a
 * subtle pill trigger with the table's secondary-surface background.
 */
export function TableRowsPerPageSelect(props: TableRowsPerPageSelectProps) {
  const { id, "aria-label": ariaLabel = "Rows per page" } = props;
  return (
    <Select
      defaultValue="10"
      size="32"
      aria-label={ariaLabel}
      className="w-[154px] [&_button]:rounded-sm [&_button]:border-transparent [&_button]:bg-inputs-inputs-primary"
      id={id}
    >
      <SelectContent>
        <SelectItem value="10">10 rows per page</SelectItem>
        <SelectItem value="25">25 rows per page</SelectItem>
        <SelectItem value="50">50 rows per page</SelectItem>
      </SelectContent>
    </Select>
  );
}
