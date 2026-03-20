import * as React from "react";
import { cn } from "@/utils/cn";
import { Select, SelectContent, SelectItem } from "../Select/Select";

/** Row density for body cells — `md` (60px min height) or `lg` (80px). */
export type TableSize = "md" | "lg";

export interface TableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Row density applied to {@link TableCell} descendants. @default "md" */
  size?: TableSize;
}

const TableSizeContext = React.createContext<TableSize>("md");

function useTableSize(): TableSize {
  return React.useContext(TableSizeContext);
}

/**
 * Surface wrapper for data tables: rounded container, spacing, and size
 * context for {@link TableCell} descendants. Compose with {@link TableScrollArea},
 * {@link Table}, {@link TableHeader}, {@link TableBody}, {@link TableRow},
 * {@link TableHead}, and {@link TableCell}.
 *
 * @example
 * ```tsx
 * <TableCard size="md">
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
            "isolate flex flex-col gap-4 overflow-hidden rounded-md bg-bg-primary pb-4",
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
        className={cn(
          "flex flex-wrap items-center gap-4 rounded-t-md bg-bg-primary px-6",
          className,
        )}
        {...props}
      />
    );
  },
);
TableToolbar.displayName = "TableToolbar";

export interface TableScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rounds the top of the table block to match {@link TableCard}. Set `false` when {@link TableToolbar} is above this scroll area. @default true */
  roundTop?: boolean;
}

/**
 * Horizontal scroll container for wide tables. Uses an inner scrollport so the
 * table respects the card radius (plain `overflow-x-auto` on the table
 * wrapper often loses rounded corners with `border-collapse`).
 */
export const TableScrollArea = React.forwardRef<HTMLDivElement, TableScrollAreaProps>(
  ({ className, roundTop = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full min-w-0 overflow-hidden",
          roundTop && "rounded-t-md",
          className,
        )}
        {...props}
      >
        <div className="overflow-x-auto">{children}</div>
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
    return (
      <thead
        ref={ref}
        className={cn(
          "[&_tr:first-child_th:first-child]:rounded-tl-md [&_tr:first-child_th:last-child]:rounded-tr-md",
          className,
        )}
        {...props}
      />
    );
  },
);
TableHeader.displayName = "TableHeader";

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => {
    return <tbody ref={ref} className={cn(className)} {...props} />;
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
  checkbox: "w-8 min-w-8 max-w-8 text-center",
  sort: "text-right",
  leading: "min-w-0 w-2/5 text-left",
};

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Layout preset for common column types. @default "default" */
  intent?: TableHeadIntent;
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, intent = "default", scope = "col", ...props }, ref) => {
    return (
      <th
        ref={ref}
        scope={scope}
        className={cn(
          "typography-semibold-body-sm box-border h-8 min-h-8 bg-surface-secondary px-2 py-2 align-middle text-content-primary",
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
  md: "min-h-[60px]",
  lg: "min-h-[80px]",
};

/** Bottom border and padding preset for body cells (Figma table cell component). */
export type TableCellVariant = "default" | "chip" | "pillProgress";

const CELL_VARIANT_CLASSES: Record<TableCellVariant, string> = {
  default: "border-border-primary border-b px-2 py-2",
  chip: "border-border-primary border-b px-2 py-2",
  pillProgress: "border-border-primary border-b px-4 py-2",
};

/** Layout / typography preset for {@link TableCell} (orthogonal to {@link TableCellVariant}). */
export type TableCellIntent = "default" | "checkbox" | "stacked" | "multiline" | "sideLabel";

const CELL_INTENT_CLASSES: Record<TableCellIntent, string> = {
  default: "",
  checkbox: "text-center",
  stacked: "align-top",
  multiline: "max-w-[240px]",
  sideLabel: "",
};

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** `pillProgress` uses wider horizontal padding; row dividers match the default weight for visibility. @default "default" */
  cellVariant?: TableCellVariant;
  /** Alignment and typography preset for common cell types. @default "default" */
  intent?: TableCellIntent;
}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, cellVariant = "default", intent = "default", ...props }, ref) => {
    const size = useTableSize();
    const typo =
      intent === "sideLabel" ? "typography-semibold-body-md" : "typography-regular-body-md";
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
 * Horizontal group for icons, chips, and metadata inside a {@link TableCell} (Figma `gap-[10px]`).
 */
export const TableCellGroup = React.forwardRef<HTMLDivElement, TableCellGroupProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex items-center gap-2.5", className)} {...props} />;
  },
);
TableCellGroup.displayName = "TableCellGroup";

export interface TableMediaThumbnailProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Image URL. */
  src: string;
  /** Alt text for the image. @default "" */
  alt?: string;
  /** Applies the table’s blurred-media treatment. @default false */
  blurred?: boolean;
  /** `center` uses the fixed media column width from the lg spec. @default "start" */
  align?: "start" | "center";
}

/**
 * Rounded thumbnail sized from {@link TableCard} `size` (`md` vs `lg`).
 */
export const TableMediaThumbnail = React.forwardRef<HTMLDivElement, TableMediaThumbnailProps>(
  ({ className, src, alt = "", blurred, align = "start", ...props }, ref) => {
    const tableSize = useTableSize();
    const frame =
      tableSize === "lg"
        ? "h-[62px] w-11 overflow-hidden rounded-xs bg-neutral-alphas-200"
        : "h-10 w-[29px] overflow-hidden rounded-xs bg-neutral-alphas-200";
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
          className="absolute top-0 left-0 h-1 rounded-full bg-buttons-primary"
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
      className={cn("flex min-w-[120px] flex-col items-center gap-3", className)}
      {...props}
    />
  );
});
TablePillProgressLayout.displayName = "TablePillProgressLayout";

export interface TableSortLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

/**
 * Sortable column label with caption typography and a sort affordance.
 */
export const TableSortLabel = React.forwardRef<HTMLSpanElement, TableSortLabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span ref={ref} className={cn("inline-flex items-center gap-2.5", className)} {...props}>
        <span className="typography-semibold-body-sm">{children}</span>
        <span className="text-content-secondary" aria-hidden>
          ↕
        </span>
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
 * Two-line primary + secondary text block for “cell + info” patterns.
 */
export function TableStackedText({ title, subtitle }: TableStackedTextProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="typography-semibold-body-md">{title}</span>
      <span className="typography-regular-body-sm text-content-secondary">{subtitle}</span>
    </div>
  );
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
 * Rows-per-page {@link Select} styled for {@link TablePagination} (Figma field).
 */
export function TableRowsPerPageSelect(props: TableRowsPerPageSelectProps) {
  const { id, "aria-label": ariaLabel = "Rows per page" } = props;
  return (
    <Select
      defaultValue="10"
      size="32"
      aria-label={ariaLabel}
      className="w-[154px] [&_button]:rounded-xs [&_button]:border-transparent [&_button]:bg-transparent"
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
