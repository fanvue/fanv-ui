import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as React from "react";
import { cn } from "../../utils/cn";

export type CheckboxSize = "default" | "small";

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, "asChild"> {
  /** Size variant for label and helper text */
  size?: CheckboxSize;
  /** Label text displayed next to the checkbox */
  label?: string;
  /** Helper text displayed below the label */
  helperText?: string;
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 3L4.5 8.5L2 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IndeterminateIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M2 6H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, size = "default", label, helperText, disabled, name, ...props }, ref) => {
    const id = React.useId();
    const helperTextId = helperText ? `${id}-helper` : undefined;
    const hasLabel = Boolean(label || helperText);

    // Hidden input for form library compatibility (e.g. react-hook-form register)
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleCheckedChange = (value: boolean | "indeterminate") => {
      const checked = value === true;
      if (inputRef.current) {
        inputRef.current.checked = checked;
        inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
      }
      props.onCheckedChange?.(value);
    };

    const checkboxElement = (
      <span
        className={cn(
          "relative inline-flex size-5 shrink-0",
          // Alignment when used with label
          label && (helperText ? "mt-1" : "mt-0.5"),
        )}
      >
        <input
          ref={inputRef}
          type="checkbox"
          name={name}
          disabled={disabled}
          aria-hidden
          tabIndex={-1}
          onChange={() => {}}
          className="pointer-events-none absolute size-px overflow-hidden opacity-0"
          style={{ clip: "rect(0,0,0,0)" }}
        />
        <CheckboxPrimitive.Root
          id={id}
          disabled={disabled}
          aria-describedby={helperTextId}
          data-testid="checkbox"
          {...props}
          onCheckedChange={handleCheckedChange}
          className={cn(
            // Base styles
            "flex size-5 items-center justify-center rounded border-2",
            "transition-[border-color,background-color,color,box-shadow] duration-150",
            // Default state
            "border-body-100 bg-transparent text-transparent",
            // Checked state
            "data-[state=checked]:border-body-100 data-[state=checked]:bg-body-100 data-[state=checked]:text-body-300",
            // Indeterminate state
            "data-[state=indeterminate]:border-body-100 data-[state=indeterminate]:bg-body-100 data-[state=indeterminate]:text-body-300",
            // Hover state
            "hover:ring-2 hover:ring-brand-green-500 group-hover:ring-2 group-hover:ring-brand-green-500",
            // Focus state
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background-inverse-solid",
            // Disabled state
            "disabled:cursor-not-allowed disabled:border-disabled-400 disabled:ring-0 disabled:group-hover:ring-0",
            "disabled:data-[state=checked]:border-disabled-400 disabled:data-[state=checked]:bg-disabled-400 disabled:data-[state=checked]:text-disabled-100",
            !hasLabel && className,
          )}
        >
          <CheckboxPrimitive.Indicator
            forceMount
            className={cn(
              "flex size-3 items-center justify-center text-body-300",
              "data-[state=unchecked]:invisible",
            )}
          >
            {props.checked === "indeterminate" ? <IndeterminateIcon /> : <CheckIcon />}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
      </span>
    );

    if (!hasLabel) {
      return checkboxElement;
    }

    return (
      <div
        className={cn(
          "inline-flex flex-col gap-0.5",
          disabled && "is-disabled cursor-not-allowed",
          className,
        )}
      >
        <div className="group inline-flex items-start gap-2">
          {checkboxElement}
          {label && (
            <label
              htmlFor={id}
              className={cn(
                "cursor-pointer select-none font-semibold text-body-100",
                "group-has-disabled:cursor-not-allowed group-has-disabled:text-disabled-100",
                size === "small" ? "text-sm leading-snug" : "text-base leading-normal",
              )}
            >
              {label}
            </label>
          )}
        </div>
        {helperText && (
          <span
            id={helperTextId}
            className={cn(
              "ml-7 font-light text-body-200",
              "in-[.is-disabled]:cursor-not-allowed in-[.is-disabled]:text-disabled-100",
              size === "small" ? "text-xs leading-snug" : "text-sm leading-normal",
            )}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
