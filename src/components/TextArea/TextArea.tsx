import * as React from "react";
import { cn } from "../../utils/cn";
import { IconButton } from "../IconButton/IconButton";
import { CheckOutlineIcon } from "../Icons/CheckOutlineIcon";
import { CloseIcon } from "../Icons/CloseIcon";

/** Text area height in pixels. */
export type TextAreaSize = "48" | "40" | "32";

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  /** Label text displayed above the textarea. Also used as the accessible name. */
  label?: string;
  /** Helper text displayed below the textarea. Replaced by `errorMessage` when `error` is `true`. */
  helperText?: string;
  /** Minimum height of the text area in pixels. @default "48" */
  size?: TextAreaSize;
  /** Whether the text area is in an error state. @default false */
  error?: boolean;
  /** Error message displayed below the textarea. Shown instead of `helperText` when `error` is `true`. */
  errorMessage?: string;
  /** Whether the text area is validated. @default false */
  validated?: boolean;
  /** Whether the text area stretches to fill its container width. @default false */
  fullWidth?: boolean;
  /** Whether to show a clear button when text is present. @default false */
  showClearButton?: boolean;
  /** Callback fired when the clear button is clicked. Note: `onChange` is also called with an empty value when clearing. */
  onClear?: () => void;
  /** Minimum number of rows (lines) for the textarea. */
  minRows?: number;
  /** Maximum number of rows (lines) for the textarea. */
  maxRows?: number;
}

const CONTAINER_MIN_HEIGHT: Record<TextAreaSize, string> = {
  "48": "min-h-12",
  "40": "min-h-10",
  "32": "min-h-8",
};

const TEXTAREA_SIZE_CLASSES: Record<TextAreaSize, string> = {
  "48": "py-3 typography-body-1-regular",
  "40": "py-2 typography-body-1-regular",
  "32": "py-2 typography-body-2-regular",
};

const PADDING_HORIZONTAL: Record<TextAreaSize, string> = {
  "48": "px-4",
  "40": "px-4",
  "32": "px-3",
};

const PADDING_RIGHT_WITH_CLEAR: Record<TextAreaSize, string> = {
  "48": "pr-11",
  "40": "pr-11",
  "32": "pr-10",
};

const CLEAR_BUTTON_RIGHT: Record<TextAreaSize, string> = {
  "48": "right-4 top-3",
  "40": "right-4 top-2",
  "32": "right-3 top-2",
};

function getContainerClassName(size: TextAreaSize, error: boolean, disabled?: boolean) {
  return cn(
    "relative rounded-xl border bg-neutral-100 has-focus-visible:outline-none motion-safe:transition-colors",
    error ? "border-error-500" : "border-transparent",
    !disabled && !error && "hover:border-neutral-400",
    CONTAINER_MIN_HEIGHT[size],
    disabled && "opacity-50",
  );
}

function getTextareaClassName(size: TextAreaSize, hasClearButton: boolean, hasMinRows: boolean) {
  return cn(
    "w-full resize-y rounded-xl bg-transparent text-body-100 no-underline placeholder:text-body-200 placeholder:opacity-40 focus:outline-none disabled:cursor-not-allowed",
    !hasMinRows && "min-h-[80px]",
    TEXTAREA_SIZE_CLASSES[size],
    PADDING_HORIZONTAL[size],
    hasClearButton ? PADDING_RIGHT_WITH_CLEAR[size] : "",
  );
}

function TextAreaHelperText({
  id,
  error,
  children,
}: {
  id: string;
  error: boolean;
  children: React.ReactNode;
}) {
  return (
    <p
      id={id}
      className={cn(
        "typography-caption-regular px-2 pt-1 pb-0.5",
        error ? "text-error-500" : "text-body-200",
      )}
    >
      {children}
    </p>
  );
}

function warnMissingAccessibleName(label?: string, ariaLabel?: string, ariaLabelledBy?: string) {
  if (process.env.NODE_ENV !== "production") {
    if (!label && !ariaLabel && !ariaLabelledBy) {
      console.warn(
        "TextArea: no accessible name provided. Pass a `label`, `aria-label`, or `aria-labelledby` prop.",
      );
    }
  }
}

function calculateMaxHeight(size: TextAreaSize, maxRows?: number): string | undefined {
  if (!maxRows) return undefined;

  // Line height is 24px for body-1 (sizes 48 and 40) and 20px for body-2 (size 32)
  const lineHeight = size === "32" ? 20 : 24;
  // py-2 = 8px, py-3 = 12px
  const verticalPadding = size === "32" ? 8 : size === "40" ? 8 : 12;

  return `${lineHeight * maxRows + verticalPadding * 2}px`;
}

function useTextAreaValue(
  value: React.TextareaHTMLAttributes<HTMLTextAreaElement>["value"],
  defaultValue: React.TextareaHTMLAttributes<HTMLTextAreaElement>["defaultValue"],
  showClearButton: boolean,
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>,
  onClear?: () => void,
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>,
) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const resolvedValue = value !== undefined ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e);
  };

  const handleClear = () => {
    setInternalValue("");

    if (onChange && textareaRef?.current) {
      const syntheticEvent = {
        target: { ...textareaRef.current, value: "" },
        currentTarget: { ...textareaRef.current, value: "" },
      } as React.ChangeEvent<HTMLTextAreaElement>;
      onChange(syntheticEvent);
    }

    onClear?.();
  };

  return {
    resolvedValue,
    displayValue: showClearButton ? resolvedValue : value,
    resolvedDefaultValue: showClearButton ? undefined : defaultValue,
    handleChange,
    handleClear,
  };
}

/**
 * A multi-line text input with optional label, helper/error text, and clear button.
 *
 * Provide at least one of `label`, `aria-label`, or `aria-labelledby` for
 * accessibility — a console warning is emitted in development if none are set.
 *
 * @example
 * ```tsx
 * <TextArea
 *   label="Description"
 *   placeholder="Enter your description..."
 *   showClearButton
 *   error={!!descError}
 *   errorMessage={descError}
 * />
 * ```
 */
export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      helperText,
      size = "48",
      error = false,
      errorMessage,
      validated = false,
      className,
      id,
      disabled,
      fullWidth = false,
      showClearButton = false,
      onClear,
      value,
      defaultValue,
      onChange,
      minRows,
      maxRows,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const helperTextId = `${inputId}-helper`;
    const bottomText = error && errorMessage ? errorMessage : helperText;
    const maxHeight = calculateMaxHeight(size, maxRows);

    const internalRef = React.useRef<HTMLTextAreaElement>(null);

    const { resolvedValue, displayValue, resolvedDefaultValue, handleChange, handleClear } =
      useTextAreaValue(value, defaultValue, showClearButton, onChange, onClear, internalRef);

    const mergedRef = (node: HTMLTextAreaElement | null) => {
      internalRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      }
    };

    const showClear = showClearButton && resolvedValue !== "" && !disabled;
    const showValidated = validated && !showClear;
    const ariaDescribedBy = bottomText ? helperTextId : undefined;
    const textareaStyle = maxHeight ? { maxHeight } : undefined;

    warnMissingAccessibleName(label, props["aria-label"], props["aria-labelledby"]);

    return (
      <div
        className={cn("flex flex-col", fullWidth && "w-full", className)}
        data-disabled={disabled ? "" : undefined}
        data-error={error ? "" : undefined}
      >
        {label && (
          <label
            htmlFor={inputId}
            className="typography-caption-semibold px-1 pt-1 pb-2 text-body-100"
          >
            {label}
          </label>
        )}

        <div className={getContainerClassName(size, error, disabled)}>
          <textarea
            ref={mergedRef}
            id={inputId}
            disabled={disabled}
            aria-describedby={ariaDescribedBy}
            aria-invalid={error || undefined}
            className={getTextareaClassName(size, showClear, !!minRows)}
            value={displayValue}
            defaultValue={resolvedDefaultValue}
            onChange={handleChange}
            rows={minRows}
            style={textareaStyle}
            {...props}
          />

          {showClear && (
            <IconButton
              variant="tertiary"
              size="24"
              icon={<CloseIcon />}
              aria-label="Clear text"
              onClick={handleClear}
              className={cn(
                "absolute flex size-5 items-center justify-center self-end",
                CLEAR_BUTTON_RIGHT[size],
              )}
            />
          )}
          {showValidated && (
            <div
              className={cn(
                "pointer-events-none absolute flex size-5 items-center justify-center",
                CLEAR_BUTTON_RIGHT[size],
              )}
            >
              <CheckOutlineIcon className="text-success-500" />
            </div>
          )}
        </div>

        {bottomText && (
          <TextAreaHelperText id={helperTextId} error={error}>
            {bottomText}
          </TextAreaHelperText>
        )}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";
