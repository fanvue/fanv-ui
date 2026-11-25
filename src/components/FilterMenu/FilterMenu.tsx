import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  type DropdownMenuContentProps,
  DropdownMenuTrigger,
} from "../DropdownMenu/DropdownMenu";

/** One choice in a {@link FilterMenu}. */
export interface FilterMenuOption<V extends string = string> {
  /** Value reported through `onValueChange`. */
  value: V;
  /** Visible label. */
  label: string;
  /** 16px icon displayed before the label. */
  icon?: React.ReactNode;
}

export interface FilterMenuProps<V extends string = string> {
  /** The trigger element, e.g. a `TableToolbarAction`. It must forward its ref and spread props. */
  children: React.ReactElement;
  /** The choices, in display order. */
  options: readonly FilterMenuOption<V>[];
  /** The ticked values. */
  value: readonly V[];
  /** Called with the new ticked values each time an option is ticked or unticked. */
  onValueChange: (value: V[]) => void;
  /** Props for the menu content, such as `align` or `aria-label`. @default { align: "start" } */
  contentProps?: Omit<DropdownMenuContentProps, "children">;
}

function FilterMenuInner<V extends string>(
  { children, options, value, onValueChange, contentProps }: FilterMenuProps<V>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent ref={ref} align="start" {...contentProps}>
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={value.includes(option.value)}
            onSelect={(event) => event.preventDefault()}
            onCheckedChange={(checked) =>
              onValueChange(
                checked ? [...value, option.value] : value.filter((item) => item !== option.value),
              )
            }
          >
            <span className="flex items-center gap-2">
              {option.icon && (
                <span
                  aria-hidden
                  className="inline-flex size-4 shrink-0 items-center justify-center [&>svg]:size-4"
                >
                  {option.icon}
                </span>
              )}
              {option.label}
            </span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * A menu of options under a trigger you supply, where several can be ticked. Each tick calls
 * `onValueChange` at once and the menu stays open, so several can be ticked in one go. It holds no
 * state: pass `value` back in. The ref goes to the menu content.
 *
 * Keyboard support comes from the menu: arrow keys move, Space or Enter ticks, typing jumps to a
 * label, Escape closes.
 *
 * @example
 * ```tsx
 * <FilterMenu options={platforms} value={selected} onValueChange={setSelected}>
 *   <TableToolbarAction icon={<ChevronDownIcon size={16} />} active={selected.length > 0}>
 *     Platform
 *   </TableToolbarAction>
 * </FilterMenu>
 * ```
 */
export const FilterMenu = React.forwardRef(FilterMenuInner) as (<V extends string>(
  props: FilterMenuProps<V> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null) & { displayName?: string };

FilterMenu.displayName = "FilterMenu";
