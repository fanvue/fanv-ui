import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as React from "react";
import { cn } from "../../utils/cn";

/** Size variant of the switch toggle. */
export type SwitchSize = "default" | "small";

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, "asChild"> {
  /** Size variant of the switch. @default "default" */
  size?: SwitchSize;
}

/**
 * A toggle switch for boolean on/off states. Built on Radix UI `Switch`.
 *
 * For a labelled switch with helper text, see {@link SwitchField}.
 *
 * @example
 * ```tsx
 * <Switch checked={on} onCheckedChange={setOn} />
 * ```
 */
export const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, size = "default", ...props }, ref) => {
  const thumbSizeClass =
    size === "default"
      ? "size-4.5 translate-x-0.75 data-[state=checked]:translate-x-4.75"
      : "size-4 translate-x-0.5 data-[state=checked]:translate-x-4.25";

  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors duration-150",
        "focus-visible:shadow-focus-ring focus-visible:outline-none",
        "data-[state=checked]:border-neutral-200 data-[state=checked]:bg-brand-green-500",
        "data-[state=unchecked]:bg-neutral-400",
        "not-disabled:active:opacity-80",
        "disabled:cursor-not-allowed disabled:opacity-50",
        size === "default" && "h-6 w-10.5",
        size === "small" && "h-5 w-9",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none rounded-full bg-body-white-solid-constant shadow-sm transition-transform duration-150 dark:bg-body-black-solid-constant",
          thumbSizeClass,
        )}
      />
    </SwitchPrimitive.Root>
  );
});

Switch.displayName = "Switch";
