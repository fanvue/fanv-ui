import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";
import { cn } from "../../utils/cn";

/** Props for the {@link TooltipProvider}. Wraps Radix `Tooltip.Provider`. */
export type TooltipProviderProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>;

/** Provides tooltip delay and skip-delay context. Wrap your app or a subtree. */
export const TooltipProvider = TooltipPrimitive.Provider;

/** Props for the {@link Tooltip} root component. */
export interface TooltipProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}

/** Root component that manages open/close state for a single tooltip. */
export const Tooltip = TooltipPrimitive.Root;

/** Props for the {@link TooltipTrigger} component. */
export type TooltipTriggerProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>;

/** The element that triggers the tooltip on hover/focus. */
export const TooltipTrigger = TooltipPrimitive.Trigger;

export type TooltipContentProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>;

export const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, sideOffset = 8, style, ...props }, ref) => {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        collisionPadding={8}
        style={{ zIndex: "var(--fanvue-ui-portal-z-index, 50)", ...style }}
        className={cn(
          "typography-semibold-body-sm max-w-[320px] rounded-sm bg-surface-primary-inverted px-4 py-2 text-content-primary-inverted shadow-[0px_1px_4px_0px_rgba(0,0,0,0.06),0px_1px_3px_0px_rgba(0,0,0,0.05)]",
          className,
        )}
        align="center"
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
});
TooltipContent.displayName = "TooltipContent";
