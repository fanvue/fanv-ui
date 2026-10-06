import * as React from "react";
import { cn } from "@/utils/cn";
import { IconButton } from "../IconButton/IconButton";
import { StarIcon } from "../Icons/StarIcon";
import { TableCell, type TableCellProps } from "./Table";

export interface TableFavouriteCellProps
  extends Omit<TableCellProps, "children" | "onToggle" | "intent"> {
  /** Whether the row is currently a favourite. Renders a filled star when `true`, an outlined star otherwise. */
  favourite: boolean;
  /** Called with the next state when the star is activated by click, Enter or Space. */
  onToggle: (nextFavourite: boolean) => void;
  /** Accessible name of the toggle, e.g. "Favourite VIP fans". Not a visible label, so translate it. */
  label: string;
  /** Disables the toggle. @default false */
  disabled?: boolean;
}

/**
 * Favourite toggle cell, the Figma `V2 Table Cell` Favourite type: a 48px
 * column holding a 16px star. Outlined while off; filled with the
 * `Buttons/Favourite` gradient while on. Renders a native toggle button
 * (`aria-pressed`) so it is keyboard operable without extra wiring.
 *
 * @example
 * ```tsx
 * <TableFavouriteCell
 *   favourite={isFavourite}
 *   onToggle={setIsFavourite}
 *   label={`Favourite ${name}`}
 * />
 * ```
 */
export const TableFavouriteCell = React.forwardRef<HTMLTableCellElement, TableFavouriteCellProps>(
  ({ className, favourite, onToggle, label, disabled = false, ...props }, ref) => {
    const gradientId = `table-favourite-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

    return (
      <TableCell
        ref={ref}
        className={cn("w-12 min-w-12 max-w-12 text-center", className)}
        {...props}
      >
        <IconButton
          variant="tertiary"
          size="24"
          className={cn(
            "-m-1 align-middle",
            favourite && "[&_svg>g:last-child_path]:[fill:var(--table-favourite-fill)]",
          )}
          style={{ "--table-favourite-fill": `url(#${gradientId})` } as React.CSSProperties}
          aria-label={label}
          aria-pressed={favourite}
          disabled={disabled}
          onClick={() => onToggle(!favourite)}
          icon={
            <>
              <svg aria-hidden="true" focusable="false" className="absolute size-0">
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-buttons-favourite-start)" />
                    <stop offset="100%" stopColor="var(--color-buttons-favourite-end)" />
                  </linearGradient>
                </defs>
              </svg>
              <StarIcon size={16} filled={favourite} />
            </>
          }
        />
      </TableCell>
    );
  },
);
TableFavouriteCell.displayName = "TableFavouriteCell";
