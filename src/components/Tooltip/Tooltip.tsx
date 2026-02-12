/**
 * !TODO: This is a temporary component to fix a bug in the <Switch />, this needs rebuilding once design is ready https://linear.app/fanvue/issue/ENG-7226/component-library-tooltip-component
 */
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";
import { cn } from "../../utils/cn";

export type TooltipProviderProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>;

export const TooltipProvider = TooltipPrimitive.Provider;

export type TooltipProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>;

export const Tooltip = TooltipPrimitive.Root;

export type TooltipTriggerProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>;

export const TooltipTrigger = TooltipPrimitive.Trigger;

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  /** Whether to show the arrow pointer */
  showArrow?: boolean;
}

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
