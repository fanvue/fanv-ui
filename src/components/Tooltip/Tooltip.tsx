import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";
import { cn } from "../../utils/cn";

/** Props for the {@link TooltipProvider}. Wraps Radix `Tooltip.Provider`. */
export type TooltipProviderProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>;

const DEFAULT_DELAY_DURATION = 200;

/**
 * Provides tooltip delay and skip-delay context. Wrap your app or a subtree.
 *
 * Defaults `delayDuration` to 200ms rather than inheriting Radix's 700ms, which
 * reads as unresponsive on the short hint labels this library uses tooltips for.
 * Pass `delayDuration` to override.
 *
 * Note that `TooltipLabel`, `ChartCard` and `SwitchField` each mount their own
 * provider internally, so they take this default but not an app-level override.
 */
export const TooltipProvider = ({
  delayDuration = DEFAULT_DELAY_DURATION,
  ...props
}: TooltipProviderProps) => <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
TooltipProvider.displayName = "TooltipProvider";

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

/**
 * Fades the tooltip in and out, so it reads as arriving rather than blinking on.
 *
 * Opacity only, deliberately: the content is portalled and positioned by Radix's
 * popper, which owns its transform — animating one here would fight it, and a
 * transform on the content would also make it a stacking context. Declaring an
 * exit animation is what keeps the content mounted long enough to play it, since
 * Radix defers the unmount until `animationend`.
 *
 * Radix reports all three states through `data-state`, and the two open states
 * are matched separately rather than as "not closed", so the exit rule can never
 * be beaten by a broader selector. A consumer's own `data-[state=*]:` override
 * still wins, since tailwind-merge sees the same variant and property.
 */
const ANIMATION_CLASSES =
  "data-[state=delayed-open]:[animation:fv-tooltip-in_150ms_ease-out] data-[state=instant-open]:[animation:fv-tooltip-in_150ms_ease-out] data-[state=closed]:[animation:fv-tooltip-out_120ms_ease-in] motion-reduce:[animation:none]";

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
            "typography-description-12px-semibold max-w-[320px] rounded-xs border border-border-selected bg-surface-primary-inverted px-4 py-2 text-content-primary-inverted shadow-sm",
            ANIMATION_CLASSES,
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
