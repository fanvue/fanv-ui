import * as React from "react";
import { cn } from "../../utils/cn";
import { Chip } from "../Chip/Chip";

/** Height of the inline edit field in pixels. */
export type InlineEditSize = "32" | "40";

export interface InlineEditProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "size" | "onSubmit"
  > {
  /** Current value displayed in the chip and used as the starting draft when editing. */
  value: string;
  /** Called with the trimmed draft when the user commits an edit (Enter or blur). */
  onSubmit: (value: string) => void;
  /** Called when the user cancels an edit with Escape. */
  onCancel?: () => void;
  /** Height of the field in pixels. @default "40" */
  size?: InlineEditSize;
  /** Whether the field is disabled — prevents entering edit mode. @default false */
  disabled?: boolean;
  /** Accessible label for the edit input. @default "Edit" */
  editLabel?: string;
  /** Icon rendered before the value in display mode. Hidden when editing. */
  leftIcon?: React.ReactNode;
  /**
   * Validator for the trimmed draft on commit. Returning `false` reverts to
   * the previous value without calling `onSubmit`. @default rejects empty drafts
   */
  validate?: (draft: string) => boolean;
  /** Additional class name applied to the root element. */
  className?: string;
}

/**
 * A chip-styled inline edit field. Renders as a dashed-border button that
 * swaps to a text input on click, allowing the value to be edited in place.
 *
 * Enter and blur commit the draft via `onSubmit`. Escape reverts to `value`
 * and calls `onCancel`. Drafts that fail `validate` are reverted.
 *
 * The forwarded ref points at the underlying `<input>` and is only populated
 * while the field is in edit mode — it resolves to `null` in display mode.
 *
 * Consumers may pass `onChange`, `onBlur`, and `onKeyDown` to participate in
 * input events. The component's own handlers run after the consumer's, and
 * keyboard handling is skipped if the consumer calls `event.preventDefault()`.
 *
 * @example
 * ```tsx
 * const [name, setName] = useState("New folder");
 * <InlineEdit value={name} onSubmit={setName} />
 * ```
 */
export const InlineEdit = React.forwardRef<HTMLInputElement, InlineEditProps>(
  (
    {
      value,
      onSubmit,
      onCancel,
      size = "40",
      disabled = false,
      editLabel = "Edit",
      leftIcon,
      validate,
      className,
      placeholder,
      onChange,
      onBlur,
      onKeyDown,
      ...inputProps
    },
    ref,
  ) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [draft, setDraft] = React.useState(value);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const setInputRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.RefObject<HTMLInputElement | null>).current = node;
        }
      },
      [ref],
    );

    React.useEffect(() => {
      if (!isEditing) {
        setDraft(value);
      }
    }, [value, isEditing]);

    React.useEffect(() => {
      if (!isEditing) return;
      const input = inputRef.current;
      if (!input) return;
      input.focus();
      input.select();
    }, [isEditing]);

    const enterEditMode = () => {
      if (disabled) return;
      setDraft(value);
      setIsEditing(true);
    };

    const commit = () => {
      const trimmed = draft.trim();
      const isValid = validate ? validate(trimmed) : trimmed.length > 0;
      if (!isValid) {
        setDraft(value);
        setIsEditing(false);
        return;
      }
      if (trimmed !== value) {
        onSubmit(trimmed);
      }
      setIsEditing(false);
    };

    const cancel = () => {
      setDraft(value);
      setIsEditing(false);
      onCancel?.();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      setDraft(event.target.value);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(event);
      commit();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (event.key === "Enter") {
        event.preventDefault();
        commit();
      } else if (event.key === "Escape") {
        event.preventDefault();
        cancel();
      }
    };

    const showLeftIcon = Boolean(leftIcon) && !isEditing;
    const sizerText = (isEditing ? draft : value) || placeholder || " ";

    return (
      <span
        data-testid="inline-edit"
        className={cn("relative inline-block align-middle", className)}
      >
        <span
          aria-hidden="true"
          className={cn(
            "typography-semibold-body-sm invisible block whitespace-pre border border-transparent px-3",
            size === "32" ? "h-8" : "h-10",
            showLeftIcon && "pl-9",
          )}
        >
          {sizerText}
        </span>
        {isEditing ? (
          <Chip
            asChild
            dotted
            variant="square"
            size={size}
            className="absolute inset-0 block h-auto w-full focus-within:shadow-focus-ring"
          >
            <span>
              <input
                ref={setInputRef}
                type="text"
                value={draft}
                placeholder={placeholder}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                aria-label={editLabel}
                data-testid="inline-edit-input"
                className="block h-full w-full bg-transparent px-3 outline-none"
                {...inputProps}
              />
            </span>
          </Chip>
        ) : (
          <Chip
            dotted
            variant="square"
            size={size}
            disabled={disabled}
            leftIcon={leftIcon}
            onClick={enterEditMode}
            data-testid="inline-edit-trigger"
            className="absolute inset-0 h-auto w-full cursor-text"
          >
            {value}
          </Chip>
        )}
      </span>
    );
  },
);

InlineEdit.displayName = "InlineEdit";
