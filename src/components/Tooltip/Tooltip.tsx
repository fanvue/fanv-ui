import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../Button/Button";

/** Props for the {@link TooltipProvider}. Wraps Radix `Tooltip.Provider`. */
export type TooltipProviderProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>;

/** Provides tooltip delay and skip-delay context. Wrap your app or a subtree. */
export const TooltipProvider = TooltipPrimitive.Provider;

/** Props for the {@link Tooltip} root component. */
export interface TooltipProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> {
  /**
   * Controlled open state. When provided, the component is in controlled mode
   * and you must also supply `onOpenChange` to update the value.
   */
  open?: boolean;
  /** Called when the open state changes. Required when `open` is controlled. */
  onOpenChange?: (open: boolean) => void;
  /** The open state of the tooltip when it is initially rendered (uncontrolled). */
  defaultOpen?: boolean;
}

/** Root component that manages open/close state for a single tooltip. */
export const Tooltip = TooltipPrimitive.Root;

/** Props for the {@link TooltipTrigger} component. */
export type TooltipTriggerProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>;

/** The element that triggers the tooltip on hover/focus. */
export const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * Visual style variant of the tooltip content.
 *
 * - `"tooltip"` — simple text bubble, no border.
 * - `"infobox"` — richer card with a visible border, structured header, body text, and optional actions.
 */
export type TooltipContentVariant = "tooltip" | "infobox";

/** Action button configuration for the infobox variant of {@link TooltipContent}. */
export interface TooltipAction {
  /** Button label. */
  label: string;
  /** Click handler. */
  onClick?: () => void;
}

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  /**
   * Visual style variant.
   *
   * `"tooltip"` is a lightweight text bubble. `"infobox"` renders a structured card
   * with optional heading, icon, pill, body text, and action buttons.
   *
   * @default "tooltip"
   */
  variant?: TooltipContentVariant;
  /** Whether to show the directional arrow pointer. @default true */
  showArrow?: boolean;
  /**
   * Heading text rendered in subtitle style at the top of the infobox.
   * Infobox variant only.
   */
  heading?: React.ReactNode;
  /**
   * Icon element displayed to the left of the heading.
   * Infobox variant only.
   */
  icon?: React.ReactNode;
  /**
   * Pill or badge element displayed to the right of the heading.
   * Infobox variant only.
   */
  pill?: React.ReactNode;
  /**
   * Primary action button (brand green). Rendered below the body text.
   * Infobox variant only.
   */
  primaryAction?: TooltipAction;
  /**
   * Secondary action button (ghost). Rendered next to the primary action.
   * Infobox variant only.
   */
  secondaryAction?: TooltipAction;
}

/**
 * The popup content of the tooltip. Renders inside a portal.
 *
 * Arrow direction is controlled via the `side` and `align` props (Radix passthrough).
 *
 * @example
 * ```tsx
 * // Simple tooltip
 * <TooltipContent>Info text</TooltipContent>
 *
 * // Infobox with structured content
 * <TooltipContent
 *   variant="infobox"
 *   heading="Title"
 *   icon={<InfoCircleIcon className="size-5" />}
 *   primaryAction={{ label: "OK", onClick: () => {} }}
 *   secondaryAction={{ label: "Dismiss" }}
 * >
 *   Info text
 * </TooltipContent>
 * ```
 */
export const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(
  (
    {
      className,
      variant = "tooltip",
      showArrow = true,
      sideOffset = 8,
      heading,
      icon,
      pill,
      primaryAction,
      secondaryAction,
      children,
      side,
      ...props
    },
    ref,
  ) => {
    const isInfobox = variant === "infobox";
    const hasHeader =
      isInfobox && (icon !== undefined || heading !== undefined || pill !== undefined);
    const hasActions = isInfobox && (primaryAction !== undefined || secondaryAction !== undefined);

    return (
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
            "typography-body-2-regular z-50 max-w-[320px] overflow-hidden rounded-3xl bg-background-solid p-4 text-background-inverse-solid shadow-[0px_2px_4px_0px_rgba(17,24,39,0.08)]",
            isInfobox && "border border-neutral-200",
            className,
          )}
          align="center"
          arrowPadding={12}
          side={side}
          {...props}
        >
          {isInfobox ? (
            <div className="flex flex-col gap-3">
              {hasHeader && (
                <div className="flex items-center gap-3">
                  {icon && <div className="size-5 shrink-0">{icon}</div>}
                  {heading && (
                    <p className="typography-subtitle min-w-0 flex-1 text-background-inverse-solid">
                      {heading}
                    </p>
                  )}
                  {pill && <div className="shrink-0">{pill}</div>}
                </div>
              )}
              {children && (
                <div className="typography-body-2-regular text-background-inverse-solid">
                  {children}
                </div>
              )}
              {hasActions && (
                <div className="flex items-center gap-1">
                  {primaryAction && (
                    <Button variant="brand" size="32" onClick={primaryAction.onClick}>
                      {primaryAction.label}
                    </Button>
                  )}
                  {secondaryAction && (
                    <Button variant="tertiary" size="32" onClick={secondaryAction.onClick}>
                      {secondaryAction.label}
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            children
          )}
          {showArrow && (
            <TooltipPrimitive.Arrow
              className={"-translate-y-px! fill-background-solid stroke-2 stroke-background-solid"}
              width={12}
              height={6}
            />
          )}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    );
  },
);
TooltipContent.displayName = "TooltipContent";
