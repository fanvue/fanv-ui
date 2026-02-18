import * as SelectPrimitive from "@radix-ui/react-select";
import * as React from "react";
import { cn } from "@/utils/cn";
import { CheckIcon } from "../Icons/CheckIcon";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";

/** Select field height in pixels. */
export type SelectSize = "48" | "40" | "32";

// ---------------------------------------------------------------------------
// Internal context — passes size/error to the styled trigger
// ---------------------------------------------------------------------------

type SelectContextValue = {
  size: SelectSize;
  error: boolean;
  disabled?: boolean;
};

const SelectContext = React.createContext<SelectContextValue>({
  size: "48",
  error: false,
});

// ---------------------------------------------------------------------------
// Size maps — mirrors TextField
// ---------------------------------------------------------------------------

const TRIGGER_HEIGHT: Record<SelectSize, string> = {
  "48": "h-12",
  "40": "h-10",
  "32": "h-8",
};

const TRIGGER_PADDING_X: Record<SelectSize, string> = {
  "48": "px-4",
  "40": "px-4",
  "32": "px-3",
};

const TRIGGER_GAP: Record<SelectSize, string> = {
  "48": "gap-3",
  "40": "gap-3",
  "32": "gap-2",
};

const TRIGGER_TYPOGRAPHY: Record<SelectSize, string> = {
  "48": "typography-body-1-regular",
  "40": "typography-body-1-regular",
  "32": "typography-body-2-regular",
};

// ---------------------------------------------------------------------------
// Select (root + field wrapper + trigger)
// ---------------------------------------------------------------------------

export interface SelectProps extends Omit<SelectPrimitive.SelectProps, "dir"> {
  /** Label text displayed above the trigger. Also used as the accessible name. */
  label?: string;
  /** Accessible name applied directly to the trigger button when no visible `label` is provided. */
  "aria-label"?: string;
  /** ID of an external element that labels the trigger button. */
  "aria-labelledby"?: string;
  /** Helper text displayed below the trigger. Replaced by `errorMessage` when `error` is `true`. */
  helperText?: string;
  /** Height of the select field in pixels. @default "48" */
  size?: SelectSize;
  /** Whether the field is in an error state. @default false */
  error?: boolean;
  /** Error message displayed below the trigger. Shown instead of `helperText` when `error` is `true`. */
  errorMessage?: string;
  /** Placeholder shown when no value is selected. */
  placeholder?: string;
  /** Icon element displayed at the left side of the trigger. */
  leftIcon?: React.ReactNode;
  /** Whether the field stretches to fill its container width. @default false */
  fullWidth?: boolean;
  /** Wraps the `className` of the outermost container div. */
  className?: string;
  /** HTML `id` applied to the trigger button. Auto-generated if omitted. */
  id?: string;
}

/**
 * A select field with optional label, helper/error text, and an icon slot,
 * built on Radix UI Select for full accessibility and keyboard navigation.
 *
 * Pair with {@link SelectContent} and {@link SelectItem} to provide options.
 *
 * @example
 * ```tsx
 * <Select label="Country" placeholder="Select a country">
 *   <SelectContent>
 *     <SelectItem value="us">United States</SelectItem>
 *     <SelectItem value="uk">United Kingdom</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */
export const Select = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  SelectProps
>(
  (
    {
      label,
      helperText,
      size = "48",
      error = false,
      errorMessage,
      placeholder,
      leftIcon,
      fullWidth = false,
      className,
      id,
      disabled,
      children,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const triggerId = id ?? generatedId;
    const helperTextId = `${triggerId}-helper`;
    const bottomText = error && errorMessage ? errorMessage : helperText;

    return (
      <SelectContext.Provider value={{ size, error, disabled }}>
        <div
          className={cn("flex flex-col", fullWidth && "w-full", className)}
          data-disabled={disabled ? "" : undefined}
          data-error={error ? "" : undefined}
        >
          {label && (
            <label
              htmlFor={triggerId}
              className="typography-caption-semibold px-1 pt-1 pb-2 text-body-100"
            >
              {label}
            </label>
          )}

          <SelectPrimitive.Root disabled={disabled} {...props}>
            <SelectPrimitive.Trigger
              ref={ref}
              id={triggerId}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledby}
              aria-describedby={bottomText ? helperTextId : undefined}
              aria-invalid={error || undefined}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between rounded-xl border bg-neutral-100 outline-none motion-safe:transition-colors",
                TRIGGER_HEIGHT[size],
                TRIGGER_PADDING_X[size],
                TRIGGER_GAP[size],
                TRIGGER_TYPOGRAPHY[size],
                error ? "border-error-500" : "border-transparent",
                !disabled &&
                  !error &&
                  "hover:border-neutral-400 data-[state=open]:border-neutral-400",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <div className="flex items-center gap-2">
                {leftIcon && (
                  <span className="flex size-5 shrink-0 items-center justify-center text-body-200">
                    {leftIcon}
                  </span>
                )}
                <SelectPrimitive.Value
                  placeholder={placeholder}
                  className="min-w-0 flex-1 truncate text-left text-body-100 [&[data-placeholder]]:text-body-200 [&[data-placeholder]]:opacity-40"
                />
              </div>

              <SelectPrimitive.Icon asChild>
                <ChevronDownIcon />
              </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>

            {children}
          </SelectPrimitive.Root>

          {bottomText && (
            <p
              id={helperTextId}
              className={cn(
                "typography-caption-regular px-2 pt-1 pb-0.5",
                error ? "text-error-500" : "text-body-200",
              )}
            >
              {bottomText}
            </p>
          )}
        </div>
      </SelectContext.Provider>
    );
  },
);

Select.displayName = "Select";

// ---------------------------------------------------------------------------
// SelectContent
// ---------------------------------------------------------------------------

export interface SelectContentProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {}

/**
 * The dropdown panel rendered inside a portal. Place {@link SelectItem} elements
 * (and optionally {@link SelectGroup} / {@link SelectLabel}) as children.
 */
export const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(({ className, children, position = "popper", sideOffset = 4, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      onClick={() => {
        console.log("clicked");
      }}
      position={position}
      sideOffset={sideOffset}
      className={cn(
        "relative z-50 min-w-(--radix-select-trigger-width) overflow-hidden rounded-xl border border-neutral-200 bg-background-inverse-solid text-body-100 shadow-[0_4px_16px_rgba(0,0,0,0.10)]",
        "data-[state=closed]:animate-out data-[state=open]:animate-in",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));

SelectContent.displayName = "SelectContent";

// ---------------------------------------------------------------------------
// SelectItem
// ---------------------------------------------------------------------------

export interface SelectItemProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {}

/**
 * An individual option inside {@link SelectContent}.
 */
export const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "typography-body-1-regular relative flex w-full cursor-pointer select-none items-center gap-2 rounded-lg py-2 pr-2 pl-3 text-body-100 outline-none",
      "focus:bg-neutral-100 data-disabled:pointer-events-none data-disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator className="ml-auto flex size-4 shrink-0 items-center justify-center">
      <CheckIcon className="size-4 text-body-100" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));

SelectItem.displayName = "SelectItem";

// ---------------------------------------------------------------------------
// SelectGroup + SelectLabel
// ---------------------------------------------------------------------------

/** Props for {@link SelectGroup}. */
export type SelectGroupProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Group>;

/**
 * Groups related {@link SelectItem} elements under a {@link SelectLabel}.
 */
export const SelectGroup = SelectPrimitive.Group;
SelectGroup.displayName = "SelectGroup";

export interface SelectLabelProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> {}

/**
 * A non-interactive label shown above a {@link SelectGroup}.
 */
export const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  SelectLabelProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("typography-caption-semibold px-3 py-1.5 text-body-200", className)}
    {...props}
  />
));

SelectLabel.displayName = "SelectLabel";

// ---------------------------------------------------------------------------
// SelectSeparator
// ---------------------------------------------------------------------------

export interface SelectSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> {}

/** A horizontal rule that visually separates groups in {@link SelectContent}. */
export const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  SelectSeparatorProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-neutral-200", className)}
    {...props}
  />
));

SelectSeparator.displayName = "SelectSeparator";
