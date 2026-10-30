import * as React from "react";
import { cn } from "@/utils/cn";
import { Button, type ButtonProps } from "../Button/Button";
import { CloseIcon } from "../Icons/CloseIcon";
import { SearchIcon } from "../Icons/SearchIcon";
import { TranscationArrowIcon } from "../Icons/TranscationArrowIcon";

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
 * Surface wrapper for data tables: 12px-radius container with a 0.5px
 * hairline border and no inner padding, so the header, rows and
 * {@link TableCardPagination} footer run edge to edge. Provides the size
 * context for {@link TableCell} descendants. Compose with {@link TableScrollArea}, {@link Table},
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
            "isolate flex flex-col overflow-hidden rounded-sm border-[0.5px] border-border-primary",
            className,
          )}
          {...props}
        />
      </TableSizeContext.Provider>
    );
  },
);
TableCard.displayName = "TableCard";

export interface TableToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Left slot, usually a {@link TableToolbarSearch}. */
  search?: React.ReactNode;
}

/**
 * 40px action bar above a {@link TableCard}: search on the left, every other
 * control (menus, toggles, buttons) on the right, 24px apart. On phones
 * {@link TableToolbarAction} controls go icon-only so the bar fits.
 *
 * @example
 * ```tsx
 * <TableToolbar search={<TableToolbarSearch value={q} onValueChange={setQ} placeholder="Search" clearLabel="Clear search" />}>
 *   <TableToolbarAction icon={<SettingsIcon />}>Filters</TableToolbarAction>
 *   <TableToolbarButton>Create</TableToolbarButton>
 * </TableToolbar>
 * ```
 */
export const TableToolbar = React.forwardRef<HTMLDivElement, TableToolbarProps>(
  ({ className, search, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-10 w-full min-w-0 items-center gap-4 rounded-sm border-[0.5px] border-border-strong bg-surface-table-row pr-2 pl-4",
          className,
        )}
        {...props}
      >
        <div className="flex min-w-24 flex-1 items-center">{search}</div>
        {children != null && (
          <div className="flex min-w-0 items-center gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {children}
          </div>
        )}
      </div>
    );
  },
);
TableToolbar.displayName = "TableToolbar";

export interface TableToolbarSearchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  /** Current query. */
  value: string;
  /** Called with the new query, and with `""` when cleared. */
  onValueChange: (value: string) => void;
  /** Accessible name of the clear button. */
  clearLabel: string;
}

/**
 * Borderless search field for the left slot of {@link TableToolbar}:
 * 16px search icon, 12px text and a clear button once there is a query.
 */
export const TableToolbarSearch = React.forwardRef<HTMLInputElement, TableToolbarSearchProps>(
  ({ className, value, onValueChange, clearLabel, placeholder, ...props }, ref) => {
    return (
      <label className={cn("flex h-6 w-full min-w-0 cursor-text items-center gap-2", className)}>
        <SearchIcon size={16} className="shrink-0 text-icons-secondary" aria-hidden />
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={placeholder}
          aria-label={props["aria-label"] ?? placeholder}
          className="typography-description-12px-regular min-w-0 flex-1 border-none bg-transparent p-0 text-content-primary outline-none placeholder:text-content-secondary [&::-webkit-search-cancel-button]:hidden"
          {...props}
        />
        {value !== "" && (
          <button
            type="button"
            aria-label={clearLabel}
            onClick={() => onValueChange("")}
            className="inline-flex size-4 shrink-0 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-icons-secondary hover:text-icons-primary"
          >
            <CloseIcon size={16} />
          </button>
        )}
      </label>
    );
  },
);
TableToolbarSearch.displayName = "TableToolbarSearch";

export interface TableToolbarActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 16px icon after the label. @default up/down arrows, for a menu trigger showing its current value */
  icon?: React.ReactNode;
  /** Tints the icon with the brand colour while a toggle or filter is on. @default false */
  active?: boolean;
}

/**
 * Labelled control for {@link TableToolbar}: 12px label followed by a 16px
 * icon. Below the `md` breakpoint only the icon shows, and the label stays as
 * the accessible name, so a full bar still fits a phone. Works as a plain
 * button or as a `DropdownMenuTrigger` child.
 */
export const TableToolbarAction = React.forwardRef<HTMLButtonElement, TableToolbarActionProps>(
  ({ className, children, icon, active = false, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "typography-description-12px-regular inline-flex h-6 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-xs border-none bg-transparent p-0 text-content-secondary outline-none",
          "hover:text-content-primary focus-visible:shadow-focus-ring disabled:cursor-default disabled:opacity-40",
          className,
        )}
        {...props}
      >
        <span className="max-md:sr-only">{children}</span>
        <span
          aria-hidden
          className={cn(
            "inline-flex size-4 shrink-0 items-center justify-center [&>svg]:size-4",
            active ? "text-brand-primary-default" : "text-icons-secondary",
          )}
        >
          {icon ?? <TranscationArrowIcon size={16} />}
        </span>
      </button>
    );
  },
);
TableToolbarAction.displayName = "TableToolbarAction";

export interface TableToolbarButtonProps extends Omit<ButtonProps, "size"> {}

/**
 * Call to action for {@link TableToolbar} (e.g. "Create New"): a 24px
 * {@link Button} squared to the toolbar's 8px radius with 12px semibold type,
 * so it sits 8px from the bar's edges. Elsewhere use {@link Button}.
 */
export const TableToolbarButton = React.forwardRef<HTMLButtonElement, TableToolbarButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size="24"
        className={cn("typography-description-12px-semibold rounded-xs", className)}
        {...props}
      />
    );
  },
);
TableToolbarButton.displayName = "TableToolbarButton";

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

/**
 * Table row. A body row holding a {@link TableMediaThumbnail} or
 * {@link TableMediaTile} grows from 40px to 56px to keep 8px around it.
 */
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => {
    return (
      <tr ref={ref} className={cn("[&:has([data-table-media])>td]:h-14", className)} {...props} />
    );
  },
);
TableRow.displayName = "TableRow";

/** Column layout preset for {@link TableHead}. */
export type TableHeadIntent = "default" | "checkbox" | "sort" | "leading";

const HEAD_INTENT_CLASSES: Record<TableHeadIntent, string> = {
  default: "text-left",
  checkbox: "w-px pr-0 text-left",
  sort: "text-right",
  leading: "min-w-0 w-2/5 text-left",
};

const CELL_GUTTERS = "px-5 first:pl-4 last:pr-4";

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Layout preset for common column types. @default "default" */
  intent?: TableHeadIntent;
}

/**
 * Header cell: 32px tall on `surface-table-row`, 12px secondary text and a
 * 0.5px bottom rule. Columns sit at least 40px apart, with 16px against the
 * card edges.
 */
export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, intent = "default", scope = "col", ...props }, ref) => {
    return (
      <th
        ref={ref}
        scope={scope}
        className={cn(
          "typography-description-12px-regular box-border h-8 whitespace-nowrap border-border-primary border-b-[0.5px] bg-surface-table-row py-0 align-middle font-normal text-content-secondary",
          CELL_GUTTERS,
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
  md: "h-10",
  default: "h-10",
  condensed: "h-10",
  lg: "h-14",
};

/** Bottom border and padding preset for body cells (Figma table cell component). */
export type TableCellVariant = "default" | "chip" | "pillProgress";

const CELL_VARIANT_CLASSES: Record<TableCellVariant, string> = {
  default: "border-b-[0.5px] border-border-primary py-0",
  chip: "border-b-[0.5px] border-border-primary py-0",
  pillProgress: "border-b-[0.5px] border-border-primary py-1",
};

/** Layout / typography preset for {@link TableCell} (orthogonal to {@link TableCellVariant}). */
export type TableCellIntent = "default" | "checkbox" | "stacked" | "multiline" | "sideLabel";

const CELL_INTENT_CLASSES: Record<TableCellIntent, string> = {
  default: "",
  checkbox: "w-px pr-0 text-left",
  stacked: "align-top py-2",
  multiline: "max-w-[240px]",
  sideLabel: "",
};

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** Padding preset for the cell. v2 uses identical padding across variants; values are kept for back-compat. @default "default" */
  cellVariant?: TableCellVariant;
  /** Alignment and typography preset for common cell types. @default "default" */
  intent?: TableCellIntent;
  /** Keeps the content on one line, for short values (dates, amounts, statuses). @default false */
  nowrap?: boolean;
}

/**
 * Body cell: 40px rows (56px when the parent {@link TableCard} uses
 * `size="lg"` or the row holds media), 12px type, transparent background and
 * a 0.5px rule that {@link TableBody} drops on the final row. Long text wraps
 * and the row grows; set `nowrap` on short columns to keep them on one line.
 */
export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, cellVariant = "default", intent = "default", nowrap = false, ...props }, ref) => {
    const size = useTableSize();
    const typo =
      intent === "sideLabel"
        ? "typography-description-12px-semibold"
        : "typography-description-12px-regular";
    return (
      <td
        ref={ref}
        className={cn(
          typo,
          "align-middle text-content-primary",
          nowrap && "whitespace-nowrap",
          CELL_GUTTERS,
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
 * Two-line content slot matching Figma `V2 Table Content` — 12px primary line
 * (semibold) over an optional 12px secondary line (regular, muted), so both
 * fit a 40px row. Use inside {@link TableCell} for the common stacked-text pattern.
 */
export function TableCellContent({
  primary,
  secondary,
  primaryAdornment,
  secondaryAdornment,
  className,
}: TableCellContentProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center gap-1">
        <span className="typography-description-12px-semibold text-content-primary">{primary}</span>
        {primaryAdornment}
      </div>
      {(secondary != null || secondaryAdornment != null) && (
        <div className="flex items-center gap-1">
          {secondary != null && (
            <span className="typography-description-12px-regular text-content-secondary">
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
export type TableMediaThumbnailSize = "48" | "40" | "32";

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
  /** Pixel size of the square thumbnail. At 40 or 48 its row grows to 56px; 32 fits a 40px row. @default "40" */
  size?: TableMediaThumbnailSize;
}

/**
 * Square photo that fills its frame, used inside {@link TableCell} for media
 * columns. At the 40px and 48px sizes its row grows to 56px; the 32px size
 * fits a regular 40px row.
 */
export const TableMediaThumbnail = React.forwardRef<HTMLDivElement, TableMediaThumbnailProps>(
  ({ className, src, alt = "", blurred, align = "start", size = "40", ...props }, ref) => {
    const frame = cn(
      "overflow-hidden bg-neutral-alphas-200",
      size === "48" && "size-12 rounded-sm",
      size === "40" && "size-10 rounded-xs",
      size === "32" && "size-8 rounded-xs",
    );
    return (
      <div
        ref={ref}
        data-table-media={size === "32" ? undefined : ""}
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

export interface TableMediaTileProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Logo or icon centred on the tile, or edge-to-edge media when `fill` is set. */
  children: React.ReactNode;
  /** Lets the child fill the tile edge to edge (e.g. a video preview) with no border or fill. @default false */
  fill?: boolean;
}

/**
 * 40px tile for a {@link TableCell}: a logo or icon (e.g. a social platform)
 * centred on `surface-table-row` with a 0.5px border, or, with `fill`, custom
 * media that fills it. Its row grows to 56px. For a plain image URL use
 * {@link TableMediaThumbnail}.
 */
export const TableMediaTile = React.forwardRef<HTMLSpanElement, TableMediaTileProps>(
  ({ className, fill = false, ...props }, ref) => {
    return (
      <span
        ref={ref}
        data-table-media=""
        className={cn(
          "inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xs",
          fill
            ? "[&>*]:size-full"
            : "border-[0.5px] border-border-primary bg-surface-table-row text-icons-secondary",
          className,
        )}
        {...props}
      />
    );
  },
);
TableMediaTile.displayName = "TableMediaTile";

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
   * `"desc"`, the label turns primary and the Arrow Sort Up / Down chevrons
   * appear next to it, the active direction highlighted. @default null
   */
  direction?: TableSortDirection;
}

function SortArrows({ direction }: { direction: "asc" | "desc" }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M5 6L8 3L11 6"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={direction === "asc" ? "stroke-current" : "stroke-icons-tertiary"}
      />
      <path
        d="M11 10L8 13L5 10"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={direction === "desc" ? "stroke-current" : "stroke-icons-tertiary"}
      />
    </svg>
  );
}

/**
 * Sortable column label. A sorted column reads primary with the Arrow Sort
 * Up / Down chevrons; an unsorted one keeps the header colour.
 */
export const TableSortLabel = React.forwardRef<HTMLSpanElement, TableSortLabelProps>(
  ({ className, children, direction = null, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1",
          direction != null && "text-content-primary",
          className,
        )}
        {...props}
      >
        {children}
        {direction != null && <SortArrows direction={direction} />}
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
