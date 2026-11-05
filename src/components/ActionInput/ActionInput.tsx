import * as React from "react";
import { cn } from "../../utils/cn";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";

/** Border treatment of the trigger: solid `"default"` or dashed `"add"`. */
export type ActionInputVariant = "default" | "add";

export interface ActionInputProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Border treatment of the trigger. @default "default" */
  variant?: ActionInputVariant;
  /** Icon rendered before the label, drawn at 16px. */
  leadingIcon?: React.ReactNode;
  /** Icon rendered after the label at 16px; `null` hides it. @default <ChevronDownIcon size={16} /> */
  trailingIcon?: React.ReactNode | null;
  /** When `true`, shows the selected border to indicate a value has been chosen. @default false */
  filled?: boolean;
  /** When `true`, shows the error border and sets `aria-invalid`. @default false */
  error?: boolean;
}

/**
 * A compact, hug-width button styled as an input, used to open a picker such as a
 * {@link DropdownMenu} on desktop or a {@link Dialog} on mobile. It renders only the
 * trigger and does not own a menu, so compose it with `DropdownMenuTrigger asChild`
 * (which also drives the `data-state="open"` styling) or a dialog trigger.
 *
 * Use `aria-label` when the visible label does not describe the action on its own.
 *
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger asChild>
 *     <ActionInput variant="add" leadingIcon={<AddIcon size={16} />}>
 *       Add condition
 *     </ActionInput>
 *   </DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuItem>Total spent</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */
export const ActionInput = React.forwardRef<HTMLButtonElement, ActionInputProps>(
  (
    {
      variant = "default",
      leadingIcon,
      trailingIcon,
      filled = false,
      error = false,
      disabled,
      type = "button",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const resolvedTrailingIcon =
      trailingIcon === undefined ? <ChevronDownIcon size={16} /> : trailingIcon;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-invalid={error || undefined}
        data-filled={filled ? "" : undefined}
        className={cn(
          "inline-flex h-10 max-w-full shrink-0 items-center gap-2.5 rounded-sm border bg-inputs-inputs-primary px-4 text-content-primary",
          "typography-body-default-16px-regular cursor-pointer outline-none focus-visible:shadow-focus-ring motion-safe:transition-colors",
          error && "border-border-error border-solid",
          !error && filled && "border-border-selected border-solid",
          !error &&
            !filled &&
            variant === "default" &&
            "border-border-primary border-solid data-[state=open]:border-border-selected",
          !error &&
            !filled &&
            variant === "add" &&
            "border-border-strong border-dashed data-[state=open]:border-border-selected data-[state=open]:border-solid",
          !disabled &&
            "hover:bg-linear-to-b hover:from-interaction-hover hover:to-interaction-hover",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        {...props}
      >
        {leadingIcon && (
          <span
            aria-hidden="true"
            className="flex size-4 shrink-0 items-center justify-center [&>svg]:size-4"
          >
            {leadingIcon}
          </span>
        )}
        <span className="min-w-0 truncate">{children}</span>
        {resolvedTrailingIcon && (
          <span
            aria-hidden="true"
            className="flex size-4 shrink-0 items-center justify-center [&>svg]:size-4"
          >
            {resolvedTrailingIcon}
          </span>
        )}
      </button>
    );
  },
);

ActionInput.displayName = "ActionInput";
