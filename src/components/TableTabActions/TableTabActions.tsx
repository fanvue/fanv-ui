import * as React from "react";
import { cn } from "../../utils/cn";
import { SearchIcon } from "../Icons/SearchIcon";

export type TableTabActionPosition = "solo" | "left" | "right";

export type TableTabActionStatus = "placeholder" | "highlight" | "filled";

const POSITION_CLASSES: Record<TableTabActionPosition, string> = {
  solo: "rounded-sm",
  left: "rounded-l-sm rounded-r-none",
  right: "rounded-r-sm rounded-l-none",
};

const STATUS_CLASSES: Record<TableTabActionStatus, string> = {
  placeholder: "",
  highlight: "bg-neutral-alphas-100",
  filled: "",
};

const SURFACE_CLASSES =
  "h-8 bg-inputs-inputs-primary typography-body-small-14px-regular text-content-primary";

export interface TableTabActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Search field and trigger buttons to lay out, typically {@link TableTabActionSearch} and {@link TableTabActionButton}. */
  children: React.ReactNode;
}

/**
 * The toolbar row above a table: a search field followed by filter and sort
 * triggers, spaced 8px apart. Renders with `role="group"`, so pass
 * `aria-label` or `aria-labelledby` to describe what the row controls.
 *
 * @example
 * ```tsx
 * <TableTabActions aria-label="Table actions">
 *   <TableTabActionSearch placeholder="Search" />
 *   <DropdownMenu>
 *     <DropdownMenuTrigger asChild>
 *       <TableTabActionButton rightIcon={<SettingsIcon />}>Filter</TableTabActionButton>
 *     </DropdownMenuTrigger>
 *     <DropdownMenuContent>...</DropdownMenuContent>
 *   </DropdownMenu>
 * </TableTabActions>
 * ```
 */
export const TableTabActions = React.forwardRef<HTMLDivElement, TableTabActionsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      // biome-ignore lint/a11y/useSemanticElements: <fieldset> is for form controls and would add a border and min-width to a layout row
      <div
        ref={ref}
        role="group"
        className={cn("flex w-full items-center gap-2", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

TableTabActions.displayName = "TableTabActions";

export interface TableTabActionSearchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {}

/**
 * The search field of {@link TableTabActions}: a 32px borderless field on the
 * `inputs-primary` surface with a leading search icon. `className` applies to
 * the container; every other prop goes to the `<input>`. Use {@link SearchField}
 * instead where a bordered, labelled field is needed.
 *
 * @example
 * ```tsx
 * <TableTabActionSearch placeholder="Search" value={query} onChange={onChange} />
 * ```
 */
export const TableTabActionSearch = React.forwardRef<HTMLInputElement, TableTabActionSearchProps>(
  ({ className, placeholder = "Search", "aria-label": ariaLabel = "Search", ...props }, ref) => {
    return (
      <div
        className={cn(
          SURFACE_CLASSES,
          "relative flex min-w-0 flex-1 items-center gap-2 rounded-sm px-2 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] has-focus-visible:after:shadow-focus-ring motion-safe:transition-colors",
          className,
        )}
      >
        <SearchIcon size={16} className="shrink-0 text-content-primary" />
        <input
          ref={ref}
          type="search"
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="h-full min-w-0 flex-1 bg-transparent text-content-primary outline-none placeholder:text-content-primary [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:appearance-none"
          {...props}
        />
      </div>
    );
  },
);

TableTabActionSearch.displayName = "TableTabActionSearch";

export interface TableTabActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Corner treatment: `solo` rounds every corner, `left` and `right` round only the outer corners of an adjoining pair. @default "solo" */
  position?: TableTabActionPosition;
  /** `highlight` tints the surface to mark the trigger as active; `placeholder` and `filled` share the resting surface. @default "placeholder" */
  status?: TableTabActionStatus;
  /** Icon element displayed before the label. */
  leftIcon?: React.ReactNode;
  /** Icon element displayed after the label, e.g. a chevron or settings icon. */
  rightIcon?: React.ReactNode;
}

/**
 * A Filter or Sort By trigger for {@link TableTabActions}: a 32px button with
 * a label and optional leading and trailing icons. It forwards its ref and
 * props, so it works as the child of `DropdownMenuTrigger asChild` and picks up
 * the open state through `data-state`.
 *
 * @example
 * ```tsx
 * <TableTabActionButton rightIcon={<ChevronDownIcon />}>Sort By</TableTabActionButton>
 * ```
 */
export const TableTabActionButton = React.forwardRef<HTMLButtonElement, TableTabActionButtonProps>(
  (
    {
      className,
      position = "solo",
      status = "placeholder",
      leftIcon,
      rightIcon,
      type = "button",
      children,
      ...props
    },
    ref,
  ) => {
    const iconClass = "inline-flex size-4 shrink-0 items-center justify-center [&>svg]:size-4";

    return (
      <button
        ref={ref}
        type={type}
        data-status={status}
        className={cn(
          SURFACE_CLASSES,
          POSITION_CLASSES[position],
          STATUS_CLASSES[status],
          "inline-flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap p-2 outline-none",
          "hover:bg-neutral-alphas-100 data-[state=open]:bg-neutral-alphas-100",
          "focus-visible:shadow-focus-ring motion-safe:transition-colors",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {leftIcon && (
          <span className={iconClass} aria-hidden>
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && (
          <span className={iconClass} aria-hidden>
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

TableTabActionButton.displayName = "TableTabActionButton";
