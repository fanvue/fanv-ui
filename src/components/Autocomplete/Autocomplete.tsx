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
  value: string;
  label?: string;
  disabled?: boolean;
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
  "48": "typography-regular-body-lg",
  "40": "typography-regular-body-lg",
  "32": "typography-regular-body-md",
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
            className="typography-semibold-body-sm px-1 pt-1 pb-2 text-content-primary"
          >
            {label}
          </label>
        )}

        <Popover.Anchor asChild>
          {/* biome-ignore lint/a11y/noStaticElementInteractions: Container delegates click to the inner input */}
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: Keyboard interaction is handled by the inner combobox input */}
          <div
            className={cn(
              "flex flex-wrap items-center overflow-hidden rounded-sm border bg-neutral-alphas-100 has-focus-visible:outline-none motion-safe:transition-colors",
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
              "w-max min-w-(--radix-popper-anchor-width) max-w-(--radix-popover-content-available-width) overflow-hidden rounded-sm border border-neutral-alphas-200 bg-bg-primary text-content-primary shadow-[0_4px_16px_rgba(0,0,0,0.10)]",
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
                listboxId={ac.listboxId}
                activeIndex={ac.activeIndex}
                isMulti={ac.isMulti}
                selectedMultiValues={ac.selectedMultiValues}
                selectedValue={ac.selectedValue}
                onSelect={ac.handleSelect}
                onMouseEnter={ac.setActiveIndex}
                renderOption={renderOption}
              />
            </div>
          </Popover.Content>
        </Popover.Portal>

        {bottomText && (
          <p
            id={ac.helperTextId}
            className={cn(
              "typography-regular-body-sm px-2 pt-1 pb-0.5",
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
