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

/** Position of the tooltip relative to its trigger, combining side and alignment (MUI-style). */
export type TooltipPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

export interface TooltipContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>, "title"> {
  /**
   * Position of the tooltip relative to the trigger. Takes precedence over `side` and `align`.
   * @default "top"
   */
  placement?: TooltipPlacement;
  /**
   * Optional heading above the body, for the two-row tooltip: a bold label
   * naming the thing, then a plain-weight description of it. Without it the
   * tooltip is a single bold line.
   */
  title?: React.ReactNode;
}

export const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(
  (
    { className, sideOffset = 8, style, placement, side, align, title, children, ...props },
    ref,
  ) => {
    let resolvedSide = side;
    let resolvedAlign: "start" | "center" | "end" = align ?? "center";
    if (placement) {
      const [parsedSide, parsedAlign] = placement.split("-") as [
        "top" | "right" | "bottom" | "left",
        "start" | "end" | undefined,
      ];
      resolvedSide = parsedSide;
      resolvedAlign = parsedAlign ?? "center";
    }

    return (
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          ref={ref}
          side={resolvedSide}
          align={resolvedAlign}
          sideOffset={sideOffset}
          collisionPadding={8}
          style={{ zIndex: "var(--fanvue-ui-portal-z-index, 50)", ...style }}
          className={cn(
            "typography-description-12px-semibold max-w-[320px] rounded-sm bg-surface-primary-inverted px-4 py-2 text-content-primary-inverted shadow-[0px_1px_4px_0px_rgba(0,0,0,0.06),0px_1px_3px_0px_rgba(0,0,0,0.05)]",
            className,
          )}
          {...props}
        >
          {title ? (
            <span className="flex flex-col gap-1">
              <span>{title}</span>
              <span className="typography-description-12px-regular">{children}</span>
            </span>
          ) : (
            children
          )}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    );
  },
);
TooltipContent.displayName = "TooltipContent";
