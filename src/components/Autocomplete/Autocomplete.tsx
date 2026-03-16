import * as Popover from "@radix-ui/react-popover";
import * as React from "react";
import { cn } from "@/utils/cn";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";
import { CloseIcon } from "../Icons/CloseIcon";
import { SpinnerIcon } from "../Icons/SpinnerIcon";
import { AutocompleteDropdownContent } from "./AutocompleteDropdownContent";
import { AutocompleteHelperText } from "./AutocompleteHelperText";
import { AutocompleteTag } from "./AutocompleteTag";
import {
  CONTAINER_HEIGHT,
  CREATE_PREFIX,
  defaultFilter,
  getLabel,
  ICON_SPACING,
  INPUT_SIZE_CLASSES,
  PADDING_HORIZONTAL,
} from "./constants";

export type AutocompleteSize = "48" | "40" | "32";

export interface AutocompleteOption {
  value: string;
  label?: string;
  disabled?: boolean;
}

export interface AutocompleteProps {
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
  value?: string | null;
  defaultValue?: string | null;
  multiValue?: string[];
  defaultMultiValue?: string[];
  onChange?: (value: string | null) => void;
  onMultiChange?: (values: string[]) => void;
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

function warnMissingAccessibleName(label?: string, ariaLabel?: string, ariaLabelledBy?: string) {
  if (process.env.NODE_ENV !== "production") {
    if (!label && !ariaLabel && !ariaLabelledBy) {
      console.warn(
        "Autocomplete: no accessible name provided. Pass a `label`, `aria-label`, or `aria-labelledby` prop.",
      );
    }
  }
}

export const Autocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
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
      id,
      className,
      options,
      value: valueProp,
      defaultValue,
      multiValue: multiValueProp,
      defaultMultiValue,
      onChange,
      onMultiChange,
      inputValue: inputValueProp,
      onInputChange,
      filterFn,
      creatable = false,
      creatableLabel,
      onCreate,
      loading = false,
      loadingText,
      emptyText = "No results",
      renderOption,
      renderTag,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
    },
    ref,
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Composable combobox with many interconnected state branches
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const helperTextId = `${inputId}-helper`;
    const listboxId = `${inputId}-listbox`;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const listRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const isMulti = multiValueProp !== undefined || defaultMultiValue !== undefined;

    const [internalValue, setInternalValue] = React.useState<string | null>(defaultValue ?? null);
    const selectedValue = valueProp !== undefined ? valueProp : internalValue;

    const [internalMultiValue, setInternalMultiValue] = React.useState<string[]>(
      defaultMultiValue ?? [],
    );
    const selectedMultiValues = multiValueProp !== undefined ? multiValueProp : internalMultiValue;

    const [internalInputValue, setInternalInputValue] = React.useState("");
    const searchText = inputValueProp !== undefined ? inputValueProp : internalInputValue;

    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isOpen = openProp !== undefined ? openProp : internalOpen;

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (openProp === undefined) setInternalOpen(next);
        onOpenChange?.(next);
      },
      [openProp, onOpenChange],
    );

    const [activeIndex, setActiveIndex] = React.useState(-1);

    const filter = filterFn ?? defaultFilter;

    const filteredOptions = React.useMemo(() => {
      if (!searchText) return options;
      return options.filter((o) => filter(o, searchText));
    }, [options, searchText, filter]);

    const showCreate =
      creatable &&
      searchText.length > 0 &&
      !options.some((o) => (o.label ?? o.value).toLowerCase() === searchText.toLowerCase());

    const visibleOptions = React.useMemo(() => {
      if (!showCreate) return filteredOptions;
      const createOption: AutocompleteOption = {
        value: `${CREATE_PREFIX}${searchText}`,
        label: creatableLabel ? creatableLabel(searchText) : searchText,
      };
      return [...filteredOptions, createOption];
    }, [filteredOptions, showCreate, searchText, creatableLabel]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reset when search text or option count changes
    React.useEffect(() => {
      setActiveIndex(-1);
    }, [searchText, visibleOptions.length]);

    const clearInputText = React.useCallback(() => {
      if (inputValueProp === undefined) setInternalInputValue("");
      onInputChange?.("");
    }, [inputValueProp, onInputChange]);

    const selectSingle = React.useCallback(
      (val: string | null) => {
        if (valueProp === undefined) setInternalValue(val);
        onChange?.(val);
      },
      [valueProp, onChange],
    );

    const toggleMulti = React.useCallback(
      (val: string) => {
        const next = selectedMultiValues.includes(val)
          ? selectedMultiValues.filter((v) => v !== val)
          : [...selectedMultiValues, val];
        if (multiValueProp === undefined) setInternalMultiValue(next);
        onMultiChange?.(next);
      },
      [selectedMultiValues, multiValueProp, onMultiChange],
    );

    const handleSelect = React.useCallback(
      (option: AutocompleteOption) => {
        if (option.value.startsWith(CREATE_PREFIX)) {
          const raw = option.value.slice(CREATE_PREFIX.length);
          onCreate?.(raw);
          if (isMulti) {
            toggleMulti(raw);
          } else {
            selectSingle(raw);
            setOpen(false);
          }
          clearInputText();
          return;
        }

        if (isMulti) {
          toggleMulti(option.value);
          clearInputText();
        } else {
          selectSingle(option.value);
          clearInputText();
          setOpen(false);
        }
      },
      [isMulti, toggleMulti, selectSingle, setOpen, clearInputText, onCreate],
    );

    const handleInputChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (inputValueProp === undefined) setInternalInputValue(val);
        onInputChange?.(val);
        if (!isOpen) setOpen(true);
      },
      [inputValueProp, onInputChange, isOpen, setOpen],
    );

    const findNextEnabled = React.useCallback(
      (start: number, direction: 1 | -1) => {
        let idx = start;
        while (idx >= 0 && idx < visibleOptions.length && visibleOptions[idx]?.disabled) {
          idx += direction;
        }
        return idx >= 0 && idx < visibleOptions.length ? idx : null;
      },
      [visibleOptions],
    );

    const handleKeyDown = React.useCallback(
      // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: flat switch is clearer than splitting into separate handler functions
      (e: React.KeyboardEvent) => {
        if (disabled) return;

        switch (e.key) {
          case "ArrowDown": {
            e.preventDefault();
            if (!isOpen) {
              setOpen(true);
              return;
            }
            setActiveIndex((prev) => findNextEnabled(prev + 1, 1) ?? prev);
            break;
          }
          case "ArrowUp": {
            e.preventDefault();
            if (!isOpen) {
              setOpen(true);
              return;
            }
            setActiveIndex((prev) => findNextEnabled(prev - 1, -1) ?? prev);
            break;
          }
          case "Enter": {
            if (isOpen && activeIndex >= 0 && activeIndex < visibleOptions.length) {
              e.preventDefault();
              const opt = visibleOptions[activeIndex];
              if (opt && !opt.disabled) handleSelect(opt);
            }
            break;
          }
          case "Escape": {
            e.preventDefault();
            if (isOpen) setOpen(false);
            break;
          }
          case "Backspace": {
            if (isMulti && searchText === "" && selectedMultiValues.length > 0) {
              const lastVal = selectedMultiValues[selectedMultiValues.length - 1];
              if (lastVal !== undefined) toggleMulti(lastVal);
            }
            break;
          }
          case "Home": {
            if (isOpen) {
              e.preventDefault();
              const idx = findNextEnabled(0, 1);
              if (idx !== null) setActiveIndex(idx);
            }
            break;
          }
          case "End": {
            if (isOpen) {
              e.preventDefault();
              const idx = findNextEnabled(visibleOptions.length - 1, -1);
              if (idx !== null) setActiveIndex(idx);
            }
            break;
          }
        }
      },
      [
        disabled,
        isOpen,
        setOpen,
        activeIndex,
        visibleOptions,
        handleSelect,
        isMulti,
        searchText,
        selectedMultiValues,
        toggleMulti,
        findNextEnabled,
      ],
    );

    React.useEffect(() => {
      if (activeIndex < 0 || !listRef.current) return;
      const el = listRef.current.querySelector(`[data-option-index="${activeIndex}"]`);
      if (typeof el?.scrollIntoView === "function") {
        el.scrollIntoView({ block: "nearest" });
      }
    }, [activeIndex]);

    const handleClear = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isMulti) {
          if (multiValueProp === undefined) setInternalMultiValue([]);
          onMultiChange?.([]);
        } else {
          selectSingle(null);
        }
        clearInputText();
        inputRef.current?.focus();
      },
      [isMulti, multiValueProp, onMultiChange, selectSingle, clearInputText],
    );

    const selectedOption = React.useMemo(
      () => options.find((o) => o.value === selectedValue),
      [options, selectedValue],
    );

    const selectedMultiOptions = React.useMemo(
      () =>
        selectedMultiValues
          .map((v) => options.find((o) => o.value === v))
          .filter(Boolean) as AutocompleteOption[],
      [options, selectedMultiValues],
    );

    const hasClearableValue = isMulti ? selectedMultiValues.length > 0 : selectedValue != null;
    const bottomText = error && errorMessage ? errorMessage : helperText;

    const displayInputValue = React.useMemo(() => {
      if (searchText) return searchText;
      if (isMulti || isOpen) return "";
      return selectedOption ? getLabel(selectedOption) : "";
    }, [searchText, isMulti, isOpen, selectedOption]);

    warnMissingAccessibleName(label, ariaLabel, ariaLabelledby);

    if (process.env.NODE_ENV !== "production") {
      if (
        (valueProp !== undefined || onChange !== undefined) &&
        (multiValueProp !== undefined || onMultiChange !== undefined)
      ) {
        console.warn(
          "Autocomplete: both single-select (value/onChange) and multi-select (multiValue/onMultiChange) props were provided. Use one or the other.",
        );
      }
    }

    const activeDescendantId = activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;

    return (
      <Popover.Root
        open={isOpen && !disabled}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            clearInputText();
            setActiveIndex(-1);
          }
        }}
      >
        <div
          className={cn("flex flex-col", fullWidth && "w-full", className)}
          data-autocomplete-root=""
          data-disabled={disabled ? "" : undefined}
          data-error={error ? "" : undefined}
        >
          {label && (
            <label
              htmlFor={inputId}
              className="typography-semibold-body-sm px-1 pt-1 pb-2 text-foreground-default"
            >
              {label}
            </label>
          )}

          <Popover.Anchor asChild>
            {/* biome-ignore lint/a11y/noStaticElementInteractions: Container delegates click to the inner input */}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: Keyboard interaction is handled by the inner combobox input */}
            <div
              className={cn(
                "flex flex-wrap items-center overflow-hidden rounded-xl border bg-neutral-100 has-focus-visible:outline-none motion-safe:transition-colors",
                error ? "border-error-default" : "border-transparent",
                !disabled && !error && "hover:border-neutral-400",
                isOpen && !error && !disabled && "border-neutral-400",
                CONTAINER_HEIGHT[size],
                PADDING_HORIZONTAL[size],
                ICON_SPACING[size],
                disabled && "opacity-50",
              )}
              onClick={() => {
                if (!disabled) {
                  inputRef.current?.focus();
                  if (!isOpen) setOpen(true);
                }
              }}
            >
              {leftIcon && (
                <div className="flex size-5 shrink-0 items-center justify-center text-foreground-secondary">
                  {leftIcon}
                </div>
              )}

              {isMulti &&
                selectedMultiOptions.map((opt) => (
                  <AutocompleteTag
                    key={opt.value}
                    option={opt}
                    disabled={disabled}
                    onRemove={() => toggleMulti(opt.value)}
                    renderTag={renderTag}
                  />
                ))}

              <input
                ref={inputRef}
                id={inputId}
                role="combobox"
                type="text"
                disabled={disabled}
                aria-expanded={isOpen}
                aria-controls={isOpen ? listboxId : undefined}
                aria-activedescendant={activeDescendantId}
                aria-autocomplete="list"
                aria-describedby={bottomText ? helperTextId : undefined}
                aria-invalid={error || undefined}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledby}
                autoComplete="off"
                placeholder={isMulti && selectedMultiValues.length > 0 ? undefined : placeholder}
                value={displayInputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (!disabled && !isOpen) setOpen(true);
                }}
                onBlur={(e) => {
                  const container = e.currentTarget.closest("[data-autocomplete-root]");
                  if (
                    container &&
                    e.relatedTarget instanceof Node &&
                    container.contains(e.relatedTarget)
                  ) {
                    return;
                  }
                  if (
                    e.relatedTarget instanceof Node &&
                    (e.relatedTarget as Element).closest?.("[data-radix-popper-content-wrapper]")
                  ) {
                    return;
                  }
                  if (isOpen) setOpen(false);
                }}
                className={cn(
                  "h-full min-w-[40px] flex-1 truncate rounded-xl bg-transparent text-foreground-default no-underline placeholder:text-foreground-secondary placeholder:opacity-40 focus:outline-none disabled:cursor-not-allowed",
                  INPUT_SIZE_CLASSES[size],
                )}
              />

              <div className="flex shrink-0 items-center gap-1">
                {loading && (
                  <SpinnerIcon className="size-4 animate-spin text-foreground-secondary" />
                )}
                {clearable && hasClearableValue && !disabled && (
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label={clearAriaLabel}
                    className="flex size-5 shrink-0 items-center justify-center text-foreground-secondary hover:text-foreground-default"
                    onClick={handleClear}
                  >
                    <CloseIcon className="size-4" />
                  </button>
                )}
                <div className="flex size-5 shrink-0 items-center justify-center text-foreground-secondary">
                  <ChevronDownIcon
                    className={cn("size-5 transition-transform", isOpen && "rotate-180")}
                  />
                </div>
              </div>
            </div>
          </Popover.Anchor>

          <Popover.Portal>
            <Popover.Content
              sideOffset={4}
              collisionPadding={8}
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
              style={{ zIndex: "var(--fanvue-ui-portal-z-index, 50)" }}
              className={cn(
                "min-w-(--radix-popper-anchor-width) w-(--radix-popover-trigger-width) overflow-hidden rounded-xl border border-neutral-200 bg-surface-page text-foreground-default shadow-[0_4px_16px_rgba(0,0,0,0.10)]",
                "data-[state=closed]:animate-out data-[state=open]:animate-in",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
              )}
            >
              <div
                ref={listRef}
                id={listboxId}
                role="listbox"
                aria-label={label ?? ariaLabel ?? "Options"}
                aria-multiselectable={isMulti || undefined}
                className="max-h-60 overflow-y-auto p-1"
              >
                <AutocompleteDropdownContent
                  loading={loading}
                  loadingText={loadingText}
                  emptyText={emptyText}
                  visibleOptions={visibleOptions}
                  listboxId={listboxId}
                  activeIndex={activeIndex}
                  isMulti={isMulti}
                  selectedMultiValues={selectedMultiValues}
                  selectedValue={selectedValue}
                  onSelect={handleSelect}
                  onMouseEnter={setActiveIndex}
                  renderOption={renderOption}
                />
              </div>
            </Popover.Content>
          </Popover.Portal>

          {bottomText && (
            <AutocompleteHelperText id={helperTextId} error={error}>
              {bottomText}
            </AutocompleteHelperText>
          )}
        </div>
      </Popover.Root>
    );
  },
);

Autocomplete.displayName = "Autocomplete";
