import * as React from "react";
import type { AutocompleteOption, AutocompleteProps } from "./Autocomplete";
import { CREATE_PREFIX, defaultFilter, getLabel } from "./constants";

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Combobox hook managing interconnected controlled/uncontrolled state
export function useAutocomplete(props: AutocompleteProps) {
  const {
    id,
    options,
    disabled = false,
    filterFn,
    creatable = false,
    creatableLabel,
    onCreate,
    inputValue: inputValueProp,
    onInputChange,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
  } = props;

  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const helperTextId = `${inputId}-helper`;
  const listboxId = `${inputId}-listbox`;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const isMulti = props.multiple === true;

  // --- single-select state ---
  const [internalValue, setInternalValue] = React.useState<string | null>(
    (!isMulti && props.defaultValue) || null,
  );
  const selectedValue: string | null = !isMulti
    ? props.value !== undefined
      ? props.value
      : internalValue
    : null;

  // --- multi-select state ---
  const [internalMultiValue, setInternalMultiValue] = React.useState<string[]>(
    isMulti && props.defaultValue ? props.defaultValue : [],
  );
  const selectedMultiValues: string[] = isMulti
    ? props.value !== undefined
      ? props.value
      : internalMultiValue
    : [];

  // --- input text ---
  const [internalInputValue, setInternalInputValue] = React.useState("");
  const searchText = inputValueProp !== undefined ? inputValueProp : internalInputValue;

  // --- open state ---
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = openProp !== undefined ? openProp : internalOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  // --- active index ---
  const [activeIndex, setActiveIndex] = React.useState(-1);

  // --- filtering ---
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

  const prevOptionsLengthRef = React.useRef(visibleOptions.length);
  const prevSearchTextRef = React.useRef(searchText);

  React.useEffect(() => {
    if (
      searchText !== prevSearchTextRef.current ||
      visibleOptions.length !== prevOptionsLengthRef.current
    ) {
      setActiveIndex(-1);
      prevSearchTextRef.current = searchText;
      prevOptionsLengthRef.current = visibleOptions.length;
    }
  }, [searchText, visibleOptions.length]);

  // --- scroll active option into view ---
  React.useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-option-index="${activeIndex}"]`);
    if (typeof el?.scrollIntoView === "function") {
      el.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  // --- helpers ---
  function clearInputText() {
    if (inputValueProp === undefined) setInternalInputValue("");
    onInputChange?.("");
  }

  function selectSingle(val: string | null) {
    if (!isMulti && props.value === undefined) setInternalValue(val);
    if (!isMulti) (props as { onChange?: (v: string | null) => void }).onChange?.(val);
  }

  function toggleMulti(val: string) {
    const next = selectedMultiValues.includes(val)
      ? selectedMultiValues.filter((v) => v !== val)
      : [...selectedMultiValues, val];
    if (isMulti && props.value === undefined) setInternalMultiValue(next);
    if (isMulti) (props as { onChange?: (v: string[]) => void }).onChange?.(next);
  }

  function handleSelect(option: AutocompleteOption) {
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
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (inputValueProp === undefined) setInternalInputValue(val);
    onInputChange?.(val);
    if (!isOpen) setOpen(true);
  }

  function findNextEnabled(start: number, direction: 1 | -1): number | null {
    let idx = start;
    while (idx >= 0 && idx < visibleOptions.length && visibleOptions[idx]?.disabled) {
      idx += direction;
    }
    return idx >= 0 && idx < visibleOptions.length ? idx : null;
  }

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Flat switch is clearer than splitting into separate handler functions
  function handleKeyDown(e: React.KeyboardEvent) {
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
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    if (isMulti) {
      if (props.value === undefined) setInternalMultiValue([]);
      if (isMulti) (props as { onChange?: (v: string[]) => void }).onChange?.([]);
    } else {
      selectSingle(null);
    }
    clearInputText();
    inputRef.current?.focus();
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const container = e.currentTarget.closest("[data-autocomplete-root]");
    if (container && e.relatedTarget instanceof Node && container.contains(e.relatedTarget)) {
      return;
    }
    if (
      e.relatedTarget instanceof Node &&
      (e.relatedTarget as Element).closest?.("[data-radix-popper-content-wrapper]")
    ) {
      return;
    }
    if (isOpen) setOpen(false);
  }

  function handleFocus() {
    if (!disabled && !isOpen) setOpen(true);
  }

  function handleContainerClick() {
    if (!disabled) {
      inputRef.current?.focus();
      if (!isOpen) setOpen(true);
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      clearInputText();
      setActiveIndex(-1);
    }
  }

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

  const displayInputValue = React.useMemo(() => {
    if (searchText) return searchText;
    if (isMulti || isOpen) return "";
    return selectedOption ? getLabel(selectedOption) : "";
  }, [searchText, isMulti, isOpen, selectedOption]);

  const activeDescendantId = activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;

  return {
    inputId,
    helperTextId,
    listboxId,
    inputRef,
    listRef,
    isMulti,
    isOpen,
    selectedValue,
    selectedMultiValues,
    selectedMultiOptions,
    searchText,
    visibleOptions,
    activeIndex,
    activeDescendantId,
    hasClearableValue,
    displayInputValue,
    setActiveIndex,
    handleSelect,
    handleInputChange,
    handleKeyDown,
    handleClear,
    handleBlur,
    handleFocus,
    handleContainerClick,
    handleOpenChange,
    toggleMulti,
  };
}
