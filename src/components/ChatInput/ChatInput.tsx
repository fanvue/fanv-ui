import * as React from "react";
import { cn } from "../../utils/cn";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../Drawer/Drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../DropdownMenu/DropdownMenu";
import { IconButton } from "../IconButton/IconButton";
import { AddIcon } from "../Icons/AddIcon";
import { ArrowUpIcon } from "../Icons/ArrowUpIcon";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";
import { CloseIcon } from "../Icons/CloseIcon";
import { TickIcon } from "../Icons/TickIcon";

/** A single image thumbnail in the built-in attachment strip. */
export interface ChatInputAttachmentItem {
  /** Stable id passed to {@link ChatInputProps.onAttachmentRemove} and used as React `key`. */
  id: string;
  /** Image URL for the thumbnail. */
  src: string;
  /** Optional value passed to the remove control `aria-label`. */
  ariaLabel?: string;
}

/** A single option for the inline model/dropdown selector. */
export interface ChatInputSelectOption {
  /** Unique value for this option. */
  value: string;
  /** Short label shown on the collapsed trigger button (e.g. "Sonnet 4.6"). */
  label: string;
  /**
   * Optional longer title shown on the option's row inside the open menu/sheet
   * (e.g. "Claude Sonnet 4.6"). Falls back to {@link label} when omitted.
   */
  menuLabel?: string;
  /** Optional secondary text shown below the label in the dropdown menu. */
  description?: string;
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
  /**
   * How the built-in selector presents its options:
   * - `"menu"` (default) — a dropdown anchored to the trigger, for pointer/desktop.
   * - `"sheet"` — a bottom sheet, for mobile/touch viewports.
   *
   * The viewport decision belongs to the consumer (it owns the breakpoint
   * source of truth), so pass e.g. `selectVariant={isDesktop ? "menu" : "sheet"}`.
   * @default "menu"
   */
  selectVariant?: "menu" | "sheet";
  /**
   * Title shown at the top of the `"sheet"` variant of the built-in selector
   * (e.g. "Switch AI Model"). @default "Select an option"
   */
  selectMenuTitle?: string;
  /** Currently selected value for the built-in dropdown. Should match one of `selectOptions[].value`. */
  selectValue?: string;
  /** When `true`, disables only the built-in dropdown selector. @default false */
  selectDisabled?: boolean;
  /** Callback fired when the user picks a different dropdown option. */
  onSelectChange?: (value: string) => void;
  /**
   * Image attachments shown in the built-in thumbnail strip. Ignored when {@link ChatInputProps.attachmentPreviews}
   * is provided (including `null`).
   */
  attachments?: ChatInputAttachmentItem[];
  /**
   * Called when the user removes a built-in thumbnail. The remove button is disabled when this is
   * omitted or the input is {@link ChatInputProps.disabled}.
   */
  onAttachmentRemove?: (id: string) => void;
  /**
   * Replaces the built-in attachment strip entirely. When set to any value other than `undefined`
   * (including `null` or `[]`), {@link ChatInputProps.attachments} is ignored.
   */
  attachmentPreviews?: React.ReactNode;
  /** Additional className applied to the outermost container. */
  className?: string;
}

const LINE_HEIGHT = 18;
const TEXTAREA_PY = 12;

function calculateHeight(rows: number): number {
  return LINE_HEIGHT * rows + TEXTAREA_PY * 2;
}

interface ChatInputDefaultAttachmentThumbnailsProps {
  attachments: ChatInputAttachmentItem[];
  onAttachmentRemove?: (id: string) => void;
  disabled?: boolean;
}

function ChatInputDefaultAttachmentThumbnails({
  attachments,
  onAttachmentRemove,
  disabled = false,
}: ChatInputDefaultAttachmentThumbnailsProps) {
  return attachments.map((item) => (
    <div
      key={item.id}
      className="relative size-16 shrink-0 overflow-hidden rounded-sm border border-neutral-200 bg-background-secondary"
    >
      <img src={item.src} alt="" className="size-full object-cover" />
      <IconButton
        variant="tertiary"
        size="24"
        aria-label={item.ariaLabel ? `Remove ${item.ariaLabel}` : "Remove attachment"}
        icon={<CloseIcon className="!size-3" />}
        disabled={disabled || !onAttachmentRemove}
        onClick={() => onAttachmentRemove?.(item.id)}
        className="absolute top-0.5 right-0.5 size-5 bg-neutral-900/40 p-1 text-white hover:bg-neutral-900/55"
      />
    </div>
  ));
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
 *     { value: "fanvue-ai", label: "Fanvue AI", icon: <AIIcon className="size-4" /> },
 *     { value: "example", label: "Example", icon: <BulbIcon className="size-4" /> },
 *   ]}
 *   selectValue="fanvue-ai"
 *   onSelectChange={(v) => setModel(v)}
 *   onSubmit={(text) => send(text)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <ChatInput
 *   showFileButton
 *   onFileClick={() => openPicker()}
 *   attachments={files}
 *   onAttachmentRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <ChatInput
 *   showFileButton
 *   onFileClick={() => openPicker()}
 *   attachmentPreviews={<CustomVideoStrip items={items} />}
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
      selectVariant = "menu",
      selectMenuTitle,
      selectValue,
      selectDisabled = false,
      onSelectChange,
      attachments,
      onAttachmentRemove,
      attachmentPreviews,
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
    }, [adjustHeight]);

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

    const useCustomAttachmentPreviews = attachmentPreviews !== undefined;
    const customAttachmentStrip = useCustomAttachmentPreviews ? attachmentPreviews : null;
    const defaultAttachmentStrip =
      !useCustomAttachmentPreviews && !!attachments?.length ? (
        <ChatInputDefaultAttachmentThumbnails
          attachments={attachments ?? []}
          disabled={disabled}
          onAttachmentRemove={onAttachmentRemove}
        />
      ) : null;
    const resolvedAttachmentStrip = customAttachmentStrip ?? defaultAttachmentStrip;
    const hasAttachmentStrip = resolvedAttachmentStrip != null;

    const selectedOption =
      selectOptions?.find((o) => o.value === selectValue) ?? selectOptions?.[0];
    const resolvedToolbarRight =
      toolbarRight ??
      (selectOptions && selectOptions.length > 0 ? (
        <InlineSelect
          options={selectOptions}
          value={selectValue}
          onChange={onSelectChange}
          disabled={disabled || selectDisabled}
          selectedOption={selectedOption}
          variant={selectVariant}
          menuTitle={selectMenuTitle}
        />
      ) : null);

    return (
      <div
        className={cn(
          "relative flex flex-col gap-6 rounded-lg border border-border-primary bg-surface-primary",
          "has-focus-visible:outline-none",
          "motion-safe:transition-colors",
          disabled && "opacity-50",
          className,
        )}
      >
        <div className="flex flex-col">
          {hasAttachmentStrip ? (
            <div className="flex gap-2 overflow-x-auto px-4 pt-4 pb-2 [scrollbar-width:thin]">
              {resolvedAttachmentStrip}
            </div>
          ) : null}
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
              "w-full resize-none bg-transparent px-4",
              hasAttachmentStrip ? "pt-0" : "pt-4",
              "typography-body-small-14px-regular text-content-primary",
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
        </div>

        <div className="flex items-center justify-between gap-2 px-4 pb-4">
          <div className="flex items-center gap-1">
            {showFileButton && (
              <IconButton
                variant="tertiary"
                size="32"
                icon={<AddIcon />}
                aria-label={fileButtonAriaLabel}
                onClick={onFileClick}
                disabled={disabled}
                className="max-sm:-ml-2 sm:border sm:border-border-primary"
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
              className="disabled:bg-surface-secondary disabled:text-icons-primary disabled:opacity-100"
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
  /** Presentation: anchored dropdown (`"menu"`) or bottom sheet (`"sheet"`). */
  variant: "menu" | "sheet";
  /** Title for the bottom-sheet header. */
  menuTitle?: string;
}

interface SelectTriggerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether the menu/sheet is open (drives chevron rotation + active background). */
  open: boolean;
  selectedOption?: ChatInputSelectOption;
  /** Label shown when no option is selected. */
  fallbackLabel?: string;
}

/**
 * The collapsed pill trigger (icon + short label + chevron). Shared by the
 * desktop menu and mobile sheet; spreads Radix-injected trigger props via
 * `asChild`.
 */
const SelectTriggerButton = React.forwardRef<HTMLButtonElement, SelectTriggerButtonProps>(
  ({ open, selectedOption, fallbackLabel, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label="Select model"
      className={cn(
        "typography-description-12px-semibold text-content-primary",
        "flex items-center gap-1 rounded-md px-2 py-2",
        "hover:bg-neutral-alphas-50 focus-visible:shadow-focus-ring focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "motion-safe:transition-colors",
        open && "bg-neutral-alphas-50",
        className,
      )}
      {...props}
    >
      {selectedOption?.icon && (
        <span className="flex shrink-0 items-center [&>svg]:size-4">{selectedOption.icon}</span>
      )}
      {selectedOption?.label ?? fallbackLabel ?? "Select"}
      <ChevronDownIcon
        className={cn("size-4 motion-safe:transition-transform", open && "rotate-180")}
      />
    </button>
  ),
);
SelectTriggerButton.displayName = "SelectTriggerButton";

/** The green tick shown on the selected option (matches DropDown V2). */
function SelectedTick() {
  return <TickIcon size={16} className="text-success-negative-content" aria-hidden="true" />;
}

/**
 * Inline model/option selector for the ChatInput toolbar. Renders the
 * design-system dropdown (DropDown V2) on desktop and a bottom sheet on mobile.
 */
function InlineSelect({
  options,
  value,
  onChange,
  disabled,
  selectedOption,
  variant,
  menuTitle,
}: InlineSelectProps) {
  const [open, setOpen] = React.useState(false);
  const fallbackLabel = options[0]?.label;

  // Never allow the menu/sheet to open while disabled, regardless of how the
  // open request originates (click, keyboard, programmatic).
  const handleOpenChange = (next: boolean) => {
    if (disabled && next) return;
    setOpen(next);
  };

  const trigger = (
    <SelectTriggerButton
      open={open}
      selectedOption={selectedOption}
      fallbackLabel={fallbackLabel}
      disabled={disabled}
    />
  );

  if (variant === "sheet") {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent position="bottom" variant="sheet">
          <DrawerHeader>
            <DrawerTitle className="typography-header-heading-xs">
              {menuTitle ?? "Select an option"}
            </DrawerTitle>
          </DrawerHeader>
          {/* Mirrors DropdownMenuItem's two-line layout, which can't be reused
              here because it requires a DropdownMenu (Radix Menu) context. */}
          <div className="flex flex-col gap-1 overflow-y-auto px-4 pb-4" role="listbox">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange?.(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-start gap-2 rounded-sm px-3 py-2 text-left outline-none",
                    "focus-visible:shadow-focus-ring",
                    "typography-body-default-16px-regular text-content-primary hover:bg-neutral-alphas-50",
                    isSelected && ["bg-interaction-hover", "hover:bg-interaction-hover"],
                  )}
                >
                  {option.icon && (
                    <span className="flex shrink-0 items-center pt-1 [&>svg]:size-4">
                      {option.icon}
                    </span>
                  )}
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate">{option.menuLabel ?? option.label}</span>
                    {option.description && (
                      <span className="typography-body-small-14px-regular truncate text-content-secondary">
                        {option.description}
                      </span>
                    )}
                  </span>
                  {isSelected && (
                    <span className="flex shrink-0 items-center pt-1">
                      <SelectedTick />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end" className="min-w-[244px]">
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <DropdownMenuItem
              key={option.value}
              size="40"
              selected={isSelected}
              description={option.description}
              leadingIcon={
                option.icon ? (
                  <span className="flex size-4 items-center [&>svg]:size-4">{option.icon}</span>
                ) : undefined
              }
              trailingIcon={isSelected ? <SelectedTick /> : undefined}
              onSelect={() => onChange?.(option.value)}
            >
              {option.menuLabel ?? option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
