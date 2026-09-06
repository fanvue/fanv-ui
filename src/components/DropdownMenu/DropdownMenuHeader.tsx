import * as React from "react";
import { cn } from "../../utils/cn";
import { IconButton } from "../IconButton/IconButton";
import { ArrowLeftIcon } from "../Icons/ArrowLeftIcon";
import { CloseIcon } from "../Icons/CloseIcon";
import { SearchIcon } from "../Icons/SearchIcon";
import { DropdownMenuVariantContext, ToggleOpenContext } from "./context";
import { DropdownMenuSeparator } from "./DropdownMenuItem";

// Keys that the menu must keep handling even when focus is inside a child
// input — arrows move the highlight into the list, Tab leaves the menu, and
// Enter / Escape close it.
const NAVIGATION_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "ArrowLeft",
  "ArrowRight",
  "Escape",
  "Tab",
  "Enter",
]);

/** Header type. `"default"` shows a title; `"search"` shows a search input. */
export type DropdownMenuHeaderType = "default" | "search";

/** Header height preset. Matches the menu item sizing scale. */
export type DropdownMenuHeaderSize = "40" | "32";

/** Search-input configuration for {@link DropdownMenuHeader} when `type="search"`. */
export interface DropdownMenuHeaderSearchProps {
  /** Controlled value of the search input. */
  value?: string;
  /** Uncontrolled default value. */
  defaultValue?: string;
  /** Fires when the input value changes. */
  onChange?: (value: string) => void;
  /** Placeholder text shown when the input is empty. @default "Search…" */
  placeholder?: string;
  /** Accessible label for the search input. @default "Search" */
  "aria-label"?: string;
  /**
   * Focus the input as soon as the menu opens, so typing filters immediately.
   * Radix parks initial focus on the content element (which is what drives its
   * typeahead), so without this the first keystrokes never reach the input.
   */
  autoFocus?: boolean;
}

export interface DropdownMenuHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual type. `"default"` shows a title; `"search"` shows a search input. @default "default" */
  type?: DropdownMenuHeaderType;
  /** Height preset for the header row. @default "40" */
  size?: DropdownMenuHeaderSize;
  /** Title text shown when `type="default"`. Ignored if `children` is provided. */
  title?: string;
  /** Configuration for the embedded search input when `type="search"`. */
  searchProps?: DropdownMenuHeaderSearchProps;
  /**
   * Action elements rendered at the end of the header row, before the close
   * button — e.g. icon buttons for search/add, or a primary "Done" button that
   * commits a {@link DropdownMenuReorderGroup} reorder. An action that should
   * close the menu needs the menu's `open` state controlled (only the built-in
   * close button can dismiss an uncontrolled menu).
   */
  actions?: React.ReactNode;
  /** Whether to render the close icon button on the right. @default true */
  showClose?: boolean;
  /** Fires when the close icon button is activated. */
  onClose?: () => void;
  /** Accessible label for the close button. @default "Close menu" */
  closeLabel?: string;
  /**
   * Fires when the back icon button at the start of the row is activated.
   * Rendering it lets a menu step back from a sub-view — a `type="search"`
   * header returning to its title, for instance — without closing the menu.
   */
  onBack?: () => void;
  /** Whether to render the back icon button. @default `onBack !== undefined` */
  showBack?: boolean;
  /** Accessible label for the back button. @default "Back" */
  backLabel?: string;
}

/**
 * Optional header rendered at the top of a {@link DropdownMenuContent}. Use
 * `type="default"` to title the menu, or `type="search"` to embed a search
 * input for filtering long lists.
 *
 * Renders an inset separator beneath the row so it slots cleanly above the
 * first group of items.
 *
 * @example
 * ```tsx
 * <DropdownMenuContent>
 *   <DropdownMenuHeader title="Sort by" onClose={() => setOpen(false)} />
 *   <DropdownMenuItem>Newest</DropdownMenuItem>
 *   <DropdownMenuItem>Oldest</DropdownMenuItem>
 * </DropdownMenuContent>
 * ```
 */
export const DropdownMenuHeader = React.forwardRef<HTMLDivElement, DropdownMenuHeaderProps>(
  (
    {
      type = "default",
      size = "40",
      title,
      searchProps,
      actions,
      showClose = true,
      onClose,
      closeLabel = "Close menu",
      onBack,
      showBack = onBack !== undefined,
      backLabel = "Back",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    // Regular, not semibold: `V2 Menu Header` titles the menu at
    // `Body Default 16px/Regular`. The weight belongs to the rows' own titles,
    // which is where the two-line layout puts a semibold.
    const titleTypography =
      size === "32" ? "typography-body-small-14px-regular" : "typography-body-default-16px-regular";
    const toggleOpen = React.useContext(ToggleOpenContext);
    const variant = React.useContext(DropdownMenuVariantContext);

    const handleClose = () => {
      onClose?.();
      // Also dismiss the Radix menu when used in uncontrolled mode — otherwise
      // the close button would look broken to consumers that don't wire up
      // `open` / `onOpenChange` themselves.
      toggleOpen?.(() => false);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "mb-1 flex flex-col px-1 pt-1",
          // Search needs an 8px gap between the input and the divider; the
          // default (title) variant uses 4px because the title baseline sits
          // closer to the divider naturally.
          type === "search" ? "gap-2" : "gap-1",
          // With action buttons the design draws a roomier header: 12px above
          // the 32px actions row (the panel's own 4px padding makes up the
          // difference), 8px between it and the divider, and 8px between the
          // divider and the first row.
          actions != null && "mb-2 gap-2 pt-2",
          // The sheet is a taller, roomier surface than a trigger-anchored panel:
          // the design sets 16px between the rule and the first row, which this
          // margin plus the panel's own 4px gap adds up to.
          variant === "sheet" && "mb-3",
          className,
        )}
        {...props}
      >
        {/*
         * The title is inset a further 8px so it clears the panel's rounded
         * corner; the search input is not, because the design runs it to the
         * header's own padding (`V2 Menu Dropdown` node `7393:62008`: the search
         * row is `flex gap-16 w-full` with no inset, so the field sits 8px from
         * the panel edge on both sides). Insetting it left-only left the field
         * 16px in on the left and 8px on the right.
         */}
        <div
          className={cn(
            "flex items-center gap-4",
            // With action buttons the title sits a further 4px in (20px from
            // the panel edge) than the close-only header's 16px. A back button
            // supplies its own inset.
            type === "default" && !showBack && (actions != null ? "pl-3" : "pl-2"),
          )}
        >
          {showBack && (
            <div data-dropdown-menu-tab-stops="" className="flex shrink-0 items-center">
              <IconButton
                variant="tertiary"
                size="32"
                icon={<ArrowLeftIcon />}
                onClick={onBack}
                aria-label={backLabel}
              />
            </div>
          )}
          {type === "default" ? (
            <div className={cn("min-w-0 flex-1 truncate text-content-primary", titleTypography)}>
              {children ?? title}
            </div>
          ) : (
            <SearchInput {...searchProps} />
          )}
          {(actions != null || showClose) && (
            // The extra right margin only applies with action buttons: filled
            // actions like a "Done" pill sit 12px off the panel edge, while the
            // bare tertiary close icon keeps the header's own 8px inset.
            <div
              data-dropdown-menu-tab-stops=""
              className={cn("flex shrink-0 items-center gap-1", actions != null && "mr-1")}
            >
              {actions}
              {showClose && (
                <IconButton
                  variant="tertiary"
                  size="32"
                  icon={<CloseIcon />}
                  onClick={handleClose}
                  aria-label={closeLabel}
                />
              )}
            </div>
          )}
        </div>
        {/*
         * Full-bleed, as the design draws it: the rule runs the panel's whole
         * width rather than stopping at the text. `-mx-2` cancels both insets it
         * sits inside — this header's own `px-1` and the content panel's `p-1`.
         *
         * `border-strong` is the colour the design gives this rule. The separator's
         * own default is `neutral-alphas-200`, which in the dark theme is a 20%
         * *white* alpha — as a hairline running the full width it reads as a white
         * line rather than a divider. Group separators between items keep the
         * alpha; this is the header's rule only.
         */}
        <DropdownMenuSeparator className="-mx-2 my-0 bg-border-strong" />
      </div>
    );
  },
);
DropdownMenuHeader.displayName = "DropdownMenuHeader";

function SearchInput({
  value,
  defaultValue,
  onChange,
  placeholder = "Search\u2026",
  "aria-label": ariaLabel = "Search",
  autoFocus,
}: DropdownMenuHeaderSearchProps = {}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus after mount rather than via the `autoFocus` attribute, so the focus
  // move is explicit and only happens when the consumer asked for it.
  React.useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <label
      data-dropdown-menu-tab-stops=""
      className={cn(
        "flex min-w-0 flex-1 items-center gap-2 rounded-xs border border-border-primary",
        "bg-inputs-inputs-primary px-3 py-1 text-content-primary",
        "focus-within:shadow-focus-ring focus-within:outline-none",
      )}
    >
      <SearchIcon className="size-4 shrink-0 text-content-primary" aria-hidden="true" />
      <input
        type="search"
        className={cn(
          "typography-body-default-16px-regular min-w-0 flex-1 bg-transparent outline-none",
          "placeholder:text-content-tertiary",
        )}
        ref={inputRef}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(event) => onChange?.(event.target.value)}
        // Radix DropdownMenu listens for keystrokes on Content for its
        // typeahead (typing letters jumps focus to a matching item). That
        // listener steals focus from the input after the first letter, so we
        // stop character keys from bubbling. Navigation keys (arrows / Tab /
        // Escape / Enter) are still allowed through so the user can leave the
        // input for the list or close the menu. Pointer events are stopped so
        // clicking back into the input doesn't fight the menu's focus
        // management either.
        onKeyDown={(event) => {
          if (!NAVIGATION_KEYS.has(event.key)) event.stopPropagation();
        }}
        onPointerDown={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      />
    </label>
  );
}
