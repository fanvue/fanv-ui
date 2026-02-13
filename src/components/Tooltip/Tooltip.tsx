/**
 * @internal Temporary tooltip implementation — will be rebuilt once design is
 * finalised. See https://linear.app/fanvue/issue/ENG-7226
 */
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";
import { cn } from "../../utils/cn";

/** Props for the {@link TooltipProvider}. Wraps Radix `Tooltip.Provider`. */
export type TooltipProviderProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>;

/** Provides tooltip delay and skip-delay context. Wrap your app or a subtree. */
export const TooltipProvider = TooltipPrimitive.Provider;

/** Props for the {@link Tooltip} root component. */
export type TooltipProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>;

/** Root component that manages open/close state for a single tooltip. */
export const Tooltip = TooltipPrimitive.Root;

/** Props for the {@link TooltipTrigger} component. */
export type TooltipTriggerProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>;

/** The element that triggers the tooltip on hover/focus. */
export const TooltipTrigger = TooltipPrimitive.Trigger;

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  /** Whether to show the arrow pointer. @default true */
  showArrow?: boolean;
}

/** The popup content of the tooltip. Renders inside a portal. */
export const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, showArrow = true, sideOffset = 8, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "typography-body-2-regular max-w-xs overflow-hidden rounded-3xl bg-background-solid p-4 text-background-inverse-solid shadow-[0_2px_4px_rgba(17,24,39,0.08)]",
        className,
      )}
      {...props}
    >
      {children}
      {showArrow && (
        <TooltipPrimitive.Arrow className="fill-background-solid" width={12} height={6} />
      )}
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));

TooltipContent.displayName = "TooltipContent";
