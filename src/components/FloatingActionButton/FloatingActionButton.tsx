import * as React from "react";
import { cn } from "../../utils/cn";

export interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon to render inside the button. Pass an icon component (e.g. `<AddIcon />`). */
  children: React.ReactNode;
}

function warnMissingAccessibleName(ariaLabel?: string, ariaLabelledBy?: string) {
  if (process.env.NODE_ENV !== "production") {
    if (!ariaLabel && !ariaLabelledBy) {
      console.warn(
        "FloatingActionButton: no accessible name provided. Pass an `aria-label` or `aria-labelledby` prop.",
      );
    }
  }
}

/**
 * A circular, elevated button for the single most important action on a
 * screen (e.g. creating new content). Unlike {@link IconButton}, it always
 * floats above page content with a drop shadow and is meant to be
 * positioned by the consumer (e.g. `fixed bottom-6 right-6`) rather than
 * inline in a toolbar or action row.
 *
 * Requires an accessible name — pass `aria-label` or `aria-labelledby`, since
 * the icon alone doesn't convey the action to screen readers.
 *
 * @example
 * ```tsx
 * <FloatingActionButton aria-label="Add content" className="fixed right-6 bottom-6">
 *   <AddIcon />
 * </FloatingActionButton>
 * ```
 */
export const FloatingActionButton = React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ className, children, disabled = false, type = "button", ...props }, ref) => {
    warnMissingAccessibleName(props["aria-label"], props["aria-labelledby"]);

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          "inline-flex size-12 shrink-0 items-center justify-center p-3",
          "cursor-pointer rounded-full shadow-lg disabled:cursor-default",
          "motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-in-out",
          "bg-buttons-primary-default text-content-primary-inverted",
          "hover:bg-buttons-primary-hover not-disabled:active:bg-buttons-primary-hover",
          "focus-visible:shadow-focus-ring focus-visible:outline-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <span className="flex size-6 shrink-0 items-center justify-center" aria-hidden="true">
          {children}
        </span>
      </button>
    );
  },
);

FloatingActionButton.displayName = "FloatingActionButton";
