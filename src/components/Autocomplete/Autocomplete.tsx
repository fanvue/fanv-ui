import * as Popover from "@radix-ui/react-popover";
import * as React from "react";
import { cn } from "@/utils/cn";
import { FLOATING_CONTENT_COLLISION_PADDING } from "@/utils/floatingContentCollisionPadding";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";
import { CloseIcon } from "../Icons/CloseIcon";
import { SpinnerIcon } from "../Icons/SpinnerIcon";
import { AutocompleteDropdownContent } from "./AutocompleteDropdownContent";
import { AutocompleteTag } from "./AutocompleteTag";
import { useAutocomplete } from "./useAutocomplete";

export type AutocompleteSize = "48" | "40" | "32";

export interface AutocompleteOption {
  /** Unique value identifying the option. Returned via `onChange`. */
  value: string;
  /** Visible label. Falls back to `value` when omitted. */
  label?: string;
  /** When `true`, the option renders but cannot be selected. @default false */
  disabled?: boolean;
  /**
   * ID of the group this option belongs to. Must match an entry in the
   * component's `groups` prop. Options without a `groupId` render in an
   * implicit "ungrouped" bucket above the first declared group.
   */
  groupId?: string;
  /**
   * Pinned options bypass the search filter and stay visible at the top of
   * the list regardless of the current query. Useful for "+ Create new"
   * affordances. Pinned options ignore `groupId` and render before any
   * grouped or ungrouped content. @default false
   */
  pinned?: boolean;
}

/**
 * Describes a single group rendered above its matching options.
 * Indentation of nested rows (e.g. price under product) is not built in —
 * consumers control it via `renderOption` styling.
 */
export interface AutocompleteGroup {
  /** Stable identifier referenced by `option.groupId`. */
  id: string;
  /**
   * Group heading text. Used as the group's accessible name and matched
   * against the search query: when the query matches a group's `label`,
   * every option under that group is kept regardless of whether it
   * individually matches the per-option filter. This supports the common
   * "heading is the searchable label, items are sub-rows" shape (e.g.
   * heading = product name, items = prices).
   */
  label: string;
}

interface AutocompleteBaseProps {
  label?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  helperText?: string;
  /** @default "48" */
  size?: AutocompleteSize;
  /** @default false */
  error?: boolean;
  errorMessage?: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  /** @default false */
  fullWidth?: boolean;
  /** @default false */
  disabled?: boolean;
  /** @default false */
  clearable?: boolean;
  clearAriaLabel?: string;
  id?: string;
  className?: string;
  options: AutocompleteOption[];
  inputValue?: string;
  onInputChange?: (value: string) => void;
  filterFn?: (option: AutocompleteOption, query: string) => boolean;
  /** @default false */
  creatable?: boolean;
  creatableLabel?: (inputValue: string) => string;
  onCreate?: (inputValue: string) => void;
  /** @default false */
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;
  renderOption?: (
    option: AutocompleteOption,
    state: { selected: boolean; active: boolean },
  ) => React.ReactNode;
  renderTag?: (option: AutocompleteOption, onRemove: () => void) => React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Ordered list of groups. When provided, options whose `groupId` matches
   * an entry render under the corresponding heading. Groups with no visible
   * (post-filter) options collapse silently. Pinned options render above
   * everything; ungrouped options render between pinned and the first group.
   * Only one level of grouping is supported.
   */
  groups?: AutocompleteGroup[];
  /**
   * Custom renderer for group headings. The returned node is wrapped by the
   * component in an element carrying the `id` referenced by the surrounding
   * `role="group"` wrapper's `aria-labelledby`, so consumers only need to
   * return visual content.
   */
  renderGroupHeading?: (group: AutocompleteGroup) => React.ReactNode;
}

interface AutocompleteSingleProps extends AutocompleteBaseProps {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
}

interface AutocompleteMultiProps extends AutocompleteBaseProps {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
}

export type AutocompleteProps = AutocompleteSingleProps | AutocompleteMultiProps;

const CONTAINER_HEIGHT: Record<AutocompleteSize, string> = {
  "48": "min-h-12",
  "40": "min-h-10",
  "32": "min-h-8",
};

const INPUT_SIZE_CLASSES: Record<AutocompleteSize, string> = {
  "48": "typography-body-default-16px-regular",
  "40": "typography-body-default-16px-regular",
  "32": "typography-body-small-14px-regular",
};

const PADDING_CLASSES: Record<AutocompleteSize, string> = {
  "48": "px-4 py-1.5 gap-3",
  "40": "px-4 py-1 gap-3",
  "32": "px-3 py-1 gap-2",
};

function warnMissingAccessibleName(label?: string, ariaLabel?: string, ariaLabelledBy?: string) {
  if (process.env.NODE_ENV !== "production") {
    if (!label && !ariaLabel && !ariaLabelledBy) {
      console.warn(
        "Autocomplete: no accessible name provided. Pass a `label`, `aria-label`, or `aria-labelledby` prop.",
      );
    }
  }
}

/**
 * A combobox input with single- or multi-select, optional async loading, and
 * native support for grouped + pinned options.
 *
 * - Pass `groups` plus an `options` array whose entries reference each group
 *   via `groupId` to render hierarchical lists with proper `role="group"` +
 *   `aria-labelledby` semantics. Options without a `groupId` render above
 *   the first group; options marked `pinned` render above everything and
 *   bypass the search filter.
 * - Indentation of nested rows (e.g. price under product) is controlled by
 *   the consumer via `renderOption` styling — there is no built-in indent.
 *
 * @example
 * ```tsx
 * <Autocomplete
 *   aria-label="Choose a product"
 *   options={[
 *     { value: "__new__", label: "+ Create new product", pinned: true },
 *     { value: "product:abc", label: "Demo Product", groupId: "recent" },
 *   ]}
 *   groups={[{ id: "recent", label: "Recent products" }]}
 *   onChange={handleSelect}
 * />
 * ```
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Conditional JSX branches in the render template
export const Autocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>((props, ref) => {
  const {
    label,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    helperText,
    size = "48",
    error = false,
    errorMessage,
    placeholder,
    leftIcon,
    fullWidth = false,
    disabled = false,
    clearable = false,
    clearAriaLabel = "Clear",
    className,
    loading = false,
    loadingText,
    emptyText = "No results",
    renderOption,
    renderTag,
    renderGroupHeading,
  } = props;

  const ac = useAutocomplete(props);

  React.useImperativeHandle(ref, () => ac.inputRef.current as HTMLInputElement);

  warnMissingAccessibleName(label, ariaLabel, ariaLabelledby);

  const bottomText = error && errorMessage ? errorMessage : helperText;

  return (
    <Popover.Root open={ac.isOpen && !disabled} onOpenChange={ac.handleOpenChange}>
      <div
        className={cn("flex flex-col", fullWidth && "w-full", className)}
        data-autocomplete-root=""
        data-disabled={disabled ? "" : undefined}
        data-error={error ? "" : undefined}
      >
        {label && (
          <label
            htmlFor={ac.inputId}
            className="typography-description-12px-semibold px-1 pt-1 pb-2 text-content-primary"
          >
            {label}
          </label>
        )}

        <Popover.Anchor asChild>
          {/* biome-ignore lint/a11y/noStaticElementInteractions: Container delegates click to the inner input */}
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: Keyboard interaction is handled by the inner combobox input */}
          <div
            className={cn(
              "flex flex-wrap items-center overflow-hidden rounded-sm border bg-neutral-alphas-100 has-focus-visible:shadow-focus-ring has-focus-visible:outline-none motion-safe:transition-colors",
              error ? "border-error-content" : "border-transparent",
              !disabled && !error && "hover:border-neutral-alphas-400",
              ac.isOpen && !error && !disabled && "border-neutral-alphas-400",
              CONTAINER_HEIGHT[size],
              PADDING_CLASSES[size],
              disabled && "opacity-50",
            )}
            onClick={ac.handleContainerClick}
          >
            {leftIcon && (
              <div className="flex size-5 shrink-0 items-center justify-center text-content-secondary">
                {leftIcon}
              </div>
            )}

            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
              {ac.isMulti &&
                ac.selectedMultiOptions.map((opt) => (
                  <AutocompleteTag
                    key={opt.value}
                    option={opt}
                    disabled={disabled}
                    onRemove={() => ac.toggleMulti(opt.value)}
                    renderTag={renderTag}
                  />
                ))}

              <input
                ref={ac.inputRef}
                id={ac.inputId}
                role="combobox"
                type="text"
                disabled={disabled}
                aria-expanded={ac.isOpen}
                aria-controls={ac.isOpen ? ac.listboxId : undefined}
                aria-activedescendant={ac.activeDescendantId}
                aria-autocomplete="list"
                aria-describedby={bottomText ? ac.helperTextId : undefined}
                aria-invalid={error || undefined}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledby}
                autoComplete="off"
                placeholder={
                  ac.isMulti && ac.selectedMultiValues.length > 0 ? undefined : placeholder
                }
                value={ac.displayInputValue}
                onChange={ac.handleInputChange}
                onKeyDown={ac.handleKeyDown}
                onFocus={ac.handleFocus}
                onBlur={ac.handleBlur}
                className={cn(
                  "min-w-[40px] flex-1 truncate bg-transparent text-content-primary no-underline placeholder:text-content-secondary placeholder:opacity-40 focus:outline-none disabled:cursor-not-allowed",
                  INPUT_SIZE_CLASSES[size],
                )}
              />
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {loading && <SpinnerIcon className="size-4 animate-spin text-content-secondary" />}
              {clearable && ac.hasClearableValue && !disabled && (
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={clearAriaLabel}
                  className="flex size-5 shrink-0 cursor-pointer items-center justify-center text-content-secondary hover:text-content-primary active:scale-95"
                  onClick={ac.handleClear}
                >
                  <CloseIcon className="size-4" />
                </button>
              )}
              <div className="flex size-5 shrink-0 items-center justify-center text-content-secondary">
                <ChevronDownIcon
                  className={cn("size-5 transition-transform", ac.isOpen && "rotate-180")}
                />
              </div>
            </div>
          </div>
        </Popover.Anchor>

        <Popover.Portal>
          <Popover.Content
            sideOffset={4}
            collisionPadding={FLOATING_CONTENT_COLLISION_PADDING}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            style={{ zIndex: "var(--fanvue-ui-portal-z-index, 50)" }}
            className={cn(
              "w-max min-w-(--radix-popper-anchor-width) max-w-(--radix-popover-content-available-width) overflow-hidden rounded-sm border border-neutral-alphas-200 bg-background-primary text-content-primary shadow-[0_4px_16px_rgba(0,0,0,0.10)]",
              "data-[state=closed]:animate-out data-[state=open]:animate-in",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
            )}
          >
            <div
              ref={ac.listRef}
              id={ac.listboxId}
              role="listbox"
              aria-label={label ?? ariaLabel ?? "Options"}
              aria-multiselectable={ac.isMulti || undefined}
              className="max-h-60 overflow-y-auto p-1"
            >
              <AutocompleteDropdownContent
                loading={loading}
                loadingText={loadingText}
                emptyText={emptyText}
                visibleOptions={ac.visibleOptions}
                visibleSections={ac.visibleSections}
                createOption={ac.createOption}
                listboxId={ac.listboxId}
                activeIndex={ac.activeIndex}
                isMulti={ac.isMulti}
                selectedMultiValues={ac.selectedMultiValues}
                selectedValue={ac.selectedValue}
                onSelect={ac.handleSelect}
                onMouseEnter={ac.setActiveIndex}
                renderOption={renderOption}
                renderGroupHeading={renderGroupHeading}
              />
            </div>
          </Popover.Content>
        </Popover.Portal>

        {bottomText && (
          <p
            id={ac.helperTextId}
            className={cn(
              "typography-description-12px-regular px-2 pt-1 pb-0.5",
              error ? "text-error-content" : "text-content-secondary",
            )}
          >
            {bottomText}
          </p>
        )}
      </div>
    </Popover.Root>
  );
});

Autocomplete.displayName = "Autocomplete";
