import * as React from "react";
import { CloseIcon } from "../Icons/CloseIcon";
import { SearchIcon } from "../Icons/SearchIcon";
import { TextField, type TextFieldProps } from "../TextField/TextField";

export type SearchFieldSize = "48" | "40" | "32";

export interface SearchFieldProps extends Omit<TextFieldProps, "type" | "leftIcon"> {
  /** Size variant of the search field. @default "48" */
  size?: SearchFieldSize;
  /** Callback fired when the clear button is clicked. If provided, a clear button appears when the field has a value. */
  onClear?: () => void;
  /** Debounce delay in milliseconds for the onChange callback. When set, the input maintains internal state for responsive typing while debouncing onChange to the parent. */
  debounceMs?: number;
  /** Minimum number of characters required before onChange fires. The input still updates visually, but onChange is suppressed until the threshold is met. Clearing always fires onClear regardless. */
  minChars?: number;
}

/**
 * A text input field with a search icon and optional clear button.
 *
 * @example
 * ```tsx
 * <SearchField
 *   placeholder="Search..."
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 *   onClear={() => setQuery("")}
 *   debounceMs={500}
 *   minChars={3}
 * />
 * ```
 */
export const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ disabled, onClear, value, debounceMs, minChars, onChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value ?? "");
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    const shouldFireChange = React.useCallback(
      (val: string) => !minChars || val.length >= minChars,
      [minChars],
    );

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        if (!debounceMs) {
          setInternalValue(val);
          if (shouldFireChange(val)) onChange?.(e);
          return;
        }

        setInternalValue(val);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
          if (shouldFireChange(val)) onChange?.(e);
        }, debounceMs);
      },
      [debounceMs, onChange, shouldFireChange],
    );

    const handleClear = React.useCallback(() => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setInternalValue("");
      onClear?.();
    }, [onClear]);

    const displayValue = debounceMs || minChars ? internalValue : value;
    const leftIcon = <SearchIcon />;

    const showClearButton = onClear && displayValue !== undefined && displayValue !== "";

    const rightIcon = showClearButton ? (
      <button
        type="button"
        onClick={handleClear}
        disabled={disabled}
        aria-label="Clear search"
        tabIndex={-1}
        className="flex size-5 shrink-0 items-center justify-center text-body-200 transition-colors hover:text-body-100 focus:outline-none disabled:cursor-not-allowed"
      >
        <CloseIcon />
      </button>
    ) : undefined;

    return (
      <TextField
        ref={ref}
        type="search"
        disabled={disabled}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        value={displayValue}
        onChange={handleChange}
        aria-label={!props.label ? "Search field" : undefined}
        {...props}
      />
    );
  },
);

SearchField.displayName = "SearchField";
