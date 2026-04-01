import * as React from "react";
import { cn } from "../../utils/cn";
import { IconButton } from "../IconButton/IconButton";
import { AddIcon } from "../Icons/AddIcon";
import { ArrowUpIcon } from "../Icons/ArrowUpIcon";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";

/** A single option for the inline model/dropdown selector. */
export interface ChatInputSelectOption {
  /** Unique value for this option. */
  value: string;
  /** Display label. */
  label: string;
  /** Optional icon rendered to the left of the label. */
  icon?: React.ReactNode;
}

/**
 * Props for {@link ChatInput}. Standard textarea HTML attributes are forwarded to the inner
 * `<textarea>` except `className` (applied to the outer container), `rows` (use `minRows`), and
 * `onSubmit` (replaced by the chat message submit callback).
 */
export interface ChatInputProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "className" | "rows" | "onSubmit"
  > {
  /** Minimum number of visible rows. @default 1 */
  minRows?: number;
  /** Maximum number of visible rows before scrolling. @default 6 */
  maxRows?: number;
  /** Whether a submission is in progress (disables submit, shows visual feedback). @default false */
  loading?: boolean;
  /**
   * Callback fired when the user submits (clicks the send button or presses Enter without Shift).
   * Receives the current trimmed text value.
   */
  onSubmit?: (value: string) => void;
  /**
   * When `true`, renders an "attach file" button in the bottom-left toolbar.
   * @default false
   */
  showFileButton?: boolean;
  /** Callback fired when the attach-file button is clicked. Only relevant when `showFileButton` is `true`. */
  onFileClick?: () => void;
  /** Accessible label for the attach-file button. @default "Attach file" */
  fileButtonAriaLabel?: string;
  /** Accessible label for the submit button. @default "Send message" */
  submitAriaLabel?: string;
  /** Icon element for the submit button. @default `<ArrowUpIcon />` */
  submitIcon?: React.ReactNode;
  /**
   * Optional content rendered in the bottom-right toolbar, to the left of the submit button.
   * When provided, takes precedence over the built-in `selectOptions` dropdown.
   */
  toolbarRight?: React.ReactNode;
  /**
   * Options for the built-in inline dropdown selector (e.g. model picker).
   * Ignored when `toolbarRight` is provided.
   */
  selectOptions?: ChatInputSelectOption[];
  /** Currently selected value for the built-in dropdown. Should match one of `selectOptions[].value`. */
  selectValue?: string;
  /** Callback fired when the user picks a different dropdown option. */
  onSelectChange?: (value: string) => void;
  /** Additional className applied to the outermost container. */
  className?: string;
}

const LINE_HEIGHT = 18;
const TEXTAREA_PY = 12;

function calculateHeight(rows: number): number {
  return LINE_HEIGHT * rows + TEXTAREA_PY * 2;
}

/**
 * A chat-style multi-line input with an integrated toolbar containing an
 * optional file-attach button, optional right-side controls (e.g. a model
 * selector), and a submit button — all inside a single bordered container.
 *
 * Designed to behave like modern AI chat inputs: auto-grows with content,
 * submits on Enter (Shift+Enter for newlines), and keeps controls inline.
 *
 * @example
 * ```tsx
 * <ChatInput
 *   placeholder="Type a message..."
 *   onSubmit={(text) => send(text)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <ChatInput
 *   placeholder="Ask the agent..."
 *   showFileButton
 *   onFileClick={() => openFilePicker()}
 *   selectOptions={[
 *     { value: "sonnet", label: "Sonnet 4.6" },
 *     { value: "opus", label: "Opus 4.6" },
 *   ]}
 *   selectValue="sonnet"
 *   onSelectChange={(v) => setModel(v)}
 *   onSubmit={(text) => send(text)}
 * />
 * ```
 */
export const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  (
    {
      className,
      minRows = 1,
      maxRows = 6,
      disabled = false,
      loading = false,
      value,
      defaultValue,
      placeholder,
      maxLength,
      "aria-label": ariaLabel,
      onChange,
      onKeyDown,
      onSubmit,
      showFileButton = false,
      onFileClick,
      fileButtonAriaLabel = "Attach file",
      submitAriaLabel = "Send message",
      submitIcon,
      toolbarRight,
      selectOptions,
      selectValue,
      onSelectChange,
      style,
      ...textareaProps
    },
    ref,
  ) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null);
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
    const resolvedValue = value !== undefined ? value : internalValue;
    const isControlled = value !== undefined;

    const mergedRef = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        (internalRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
        }
      },
      [ref],
    );

    const adjustHeight = React.useCallback(() => {
      const textarea = internalRef.current;
      if (!textarea) return;

      const minHeight = calculateHeight(minRows);
      const maxHeight = calculateHeight(maxRows);

      textarea.style.height = `${minHeight}px`;
      const desired = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${desired}px`;
    }, [minRows, maxRows]);

    React.useEffect(() => {
      adjustHeight();
    }, [resolvedValue, adjustHeight]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const canSubmit = !!String(resolvedValue).trim() && !disabled && !loading;

    const handleSubmit = () => {
      const text = String(resolvedValue).trim();
      if (!text || !canSubmit) return;
      onSubmit?.(text);
      if (!isControlled) {
        setInternalValue("");
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
      onKeyDown?.(e);
    };

    const minHeight = calculateHeight(minRows);
    const maxHeight = calculateHeight(maxRows);

    const selectedOption =
      selectOptions?.find((o) => o.value === selectValue) ?? selectOptions?.[0];
    const resolvedToolbarRight =
      toolbarRight ??
      (selectOptions && selectOptions.length > 0 ? (
        <InlineSelect
          options={selectOptions}
          value={selectValue}
          onChange={onSelectChange}
          disabled={disabled}
          selectedOption={selectedOption}
        />
      ) : null);

    return (
      <div
        className={cn(
          "relative flex flex-col rounded-lg border border-neutral-alphas-200 bg-surface-primary",
          "has-focus-visible:border-neutral-alphas-400 has-focus-visible:outline-none",
          "motion-safe:transition-colors",
          disabled && "opacity-50",
          className,
        )}
      >
        <textarea
          {...textareaProps}
          ref={mergedRef}
          value={isControlled ? value : internalValue}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          aria-label={ariaLabel ?? placeholder}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={minRows}
          className={cn(
            "w-full resize-none bg-transparent px-4 pt-4",
            "typography-regular-body-md text-content-primary",
            "placeholder:text-content-tertiary",
            "focus:outline-none disabled:cursor-not-allowed",
            "overflow-y-auto",
          )}
          style={{
            minHeight: `${minHeight}px`,
            maxHeight: `${maxHeight}px`,
            ...style,
          }}
        />

        <div className="flex items-center justify-between gap-2 px-4 pb-4 pt-3">
          <div className="flex items-center gap-1">
            {showFileButton && (
              <IconButton
                variant="tertiary"
                size="32"
                icon={<AddIcon />}
                aria-label={fileButtonAriaLabel}
                onClick={onFileClick}
                disabled={disabled}
                className="sm:border sm:border-border-primary max-sm:-ml-2"
              />
            )}
          </div>

          <div className="flex items-center gap-1">
            {resolvedToolbarRight}
            <IconButton
              variant="primary"
              size="32"
              icon={submitIcon ?? <ArrowUpIcon />}
              aria-label={submitAriaLabel}
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="disabled:bg-surface-tertiary disabled:text-icons-primary"
            />
          </div>
        </div>
      </div>
    );
  },
);

ChatInput.displayName = "ChatInput";

interface InlineSelectProps {
  options: ChatInputSelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  selectedOption?: ChatInputSelectOption;
}

function InlineSelect({ options, value, onChange, disabled, selectedOption }: InlineSelectProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select model"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "typography-semibold-body-sm text-content-secondary",
          "flex items-center gap-1 rounded-sm px-2 py-1",
          "hover:bg-neutral-alphas-50 focus-visible:shadow-focus-ring focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "motion-safe:transition-colors",
        )}
      >
        {selectedOption?.icon && (
          <span className="flex shrink-0 items-center [&>svg]:size-4">{selectedOption.icon}</span>
        )}
        {selectedOption?.label ?? options[0]?.label ?? "Select"}
        <ChevronDownIcon
          className={cn("size-4 motion-safe:transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={cn(
            "absolute right-0 bottom-full z-10 mb-1 min-w-[140px]",
            "overflow-hidden rounded-xs border border-neutral-alphas-200 bg-surface-primary p-1 shadow-lg",
          )}
        >
          {options.map((option) => (
            <div
              key={option.value}
              role="option"
              tabIndex={0}
              aria-selected={option.value === value}
              className={cn(
                "typography-regular-body-md flex cursor-pointer items-center gap-2 rounded-xs px-3 py-1.5",
                "text-content-primary hover:bg-neutral-alphas-50",
                "focus-visible:shadow-focus-ring focus-visible:outline-none",
                option.value === value && "bg-neutral-alphas-50",
              )}
              onClick={() => {
                onChange?.(option.value);
                setOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onChange?.(option.value);
                  setOpen(false);
                }
              }}
            >
              {option.icon && (
                <span className="flex shrink-0 items-center [&>svg]:size-4">{option.icon}</span>
              )}
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
