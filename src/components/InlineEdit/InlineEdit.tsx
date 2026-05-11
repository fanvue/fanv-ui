import * as React from "react";
import { cn } from "../../utils/cn";

/** Height of the inline edit field in pixels. */
export type InlineEditSize = "32" | "40";

export interface InlineEditProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "size" | "onChange" | "onBlur" | "onKeyDown"
  > {
  /** Current value displayed in the chip and used as the starting draft when editing. */
  value: string;
  /** Called with the trimmed draft when the user commits an edit (Enter or blur). */
  onCommit: (value: string) => void;
  /** Called when the user cancels an edit with Escape. */
  onCancel?: () => void;
  /** Height of the field in pixels. @default "40" */
  size?: InlineEditSize;
  /** Whether the field is disabled — prevents entering edit mode. @default false */
  disabled?: boolean;
  /** Maximum length of the input value when editing. */
  maxLength?: number;
  /** Accessible label for the edit affordance. @default "Edit" */
  editLabel?: string;
  /** Icon rendered before the value in display mode. Hidden when editing. */
  leftIcon?: React.ReactNode;
  /** Additional class name applied to the root element. */
  className?: string;
}

const SIZE_CLASSES: Record<InlineEditSize, string> = {
  "32": "h-8",
  "40": "h-10",
};

/**
 * A chip-styled inline edit field. Renders as a dashed-border button that
 * swaps to a text input on click, allowing the value to be edited in place.
 *
 * Enter and blur commit the draft via `onCommit`. Escape reverts to `value`
 * and calls `onCancel`. Empty drafts are rejected and revert to `value`.
 *
 * The forwarded ref points at the underlying `<input>` and is only populated
 * while the field is in edit mode — it resolves to `null` in display mode.
 *
 * @example
 * ```tsx
 * const [name, setName] = useState("New folder");
 * <InlineEdit value={name} onCommit={setName} />
 * ```
 */
export const InlineEdit = React.forwardRef<HTMLInputElement, InlineEditProps>(
  (
    {
      value,
      onCommit,
      onCancel,
      size = "40",
      disabled = false,
      maxLength,
      editLabel = "Edit",
      leftIcon,
      className,
      placeholder,
      ...inputProps
    },
    ref,
  ) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [draft, setDraft] = React.useState(value);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    React.useEffect(() => {
      if (!isEditing) {
        setDraft(value);
      }
    }, [value, isEditing]);

    const enterEditMode = () => {
      if (disabled) return;
      setDraft(value);
      setIsEditing(true);
    };

    React.useEffect(() => {
      if (!isEditing) return;
      const input = inputRef.current;
      if (!input) return;
      input.focus();
      input.select();
    }, [isEditing]);

    const exitEditMode = () => {
      setIsEditing(false);
    };

    const commit = () => {
      const trimmed = draft.trim();
      if (trimmed.length === 0 || trimmed === value) {
        setDraft(value);
        exitEditMode();
        return;
      }
      onCommit(trimmed);
      exitEditMode();
    };

    const cancel = () => {
      setDraft(value);
      exitEditMode();
      onCancel?.();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        commit();
      } else if (event.key === "Escape") {
        event.preventDefault();
        cancel();
      }
    };

    const showLeftIcon = Boolean(leftIcon) && !isEditing;
    const chipClassName = cn(
      "typography-semibold-body-sm inline-flex items-center rounded-xs border border-dashed border-border-primary bg-transparent px-3 text-content-primary motion-safe:transition-colors motion-safe:duration-150",
      SIZE_CLASSES[size],
      disabled && "pointer-events-none opacity-50",
    );
    const iconAdornmentClassName = "pl-9";

    const sizerText = (isEditing ? draft : value) || placeholder || " ";

    return (
      <span
        data-testid="inline-edit"
        className={cn("relative inline-block align-middle", className)}
      >
        <span
          aria-hidden="true"
          className={cn(
            chipClassName,
            "invisible block whitespace-pre",
            showLeftIcon && iconAdornmentClassName,
          )}
        >
          {sizerText}
        </span>
        {showLeftIcon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-content-primary"
          >
            <span className="flex size-4 shrink-0 items-center justify-center">{leftIcon}</span>
          </span>
        )}
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={draft}
            maxLength={maxLength}
            placeholder={placeholder}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commit}
            aria-label={editLabel}
            data-testid="inline-edit-input"
            className={cn(
              chipClassName,
              "absolute inset-0 block h-auto w-full min-w-0 outline-none focus-visible:shadow-focus-ring",
            )}
            {...inputProps}
          />
        ) : (
          <button
            type="button"
            onClick={enterEditMode}
            disabled={disabled}
            aria-label={editLabel}
            data-testid="inline-edit-trigger"
            className={cn(
              chipClassName,
              "absolute inset-0 h-auto w-full cursor-text whitespace-nowrap focus-visible:shadow-focus-ring focus-visible:outline-none",
              !disabled &&
                "hover:border-neutral-alphas-500 hover:bg-neutral-alphas-50 active:border-neutral-alphas-500 active:bg-neutral-alphas-50",
              showLeftIcon && iconAdornmentClassName,
            )}
          >
            <span className="min-w-0 truncate">{value}</span>
          </button>
        )}
      </span>
    );
  },
);

InlineEdit.displayName = "InlineEdit";
