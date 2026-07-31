import * as React from "react";
import { cn } from "../../utils/cn";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./Tooltip";

/** Props for {@link TooltipLabel}. */
export interface TooltipLabelProps extends React.ComponentPropsWithoutRef<"button"> {
  /** Tooltip content. Pass a translated string for i18n. */
  tooltip: React.ReactNode;
  /** The label text, which doubles as the trigger. */
  children: React.ReactNode;
}

/**
 * A text label that is itself the tooltip trigger, marked by a dashed
 * underline. Use this instead of pairing a label with a separate info glyph:
 * the visible text becomes the trigger's accessible name, and the row stays at
 * text height rather than being stretched by an icon button.
 *
 * The label is repeated as the tooltip's heading, so the tooltip reads as the
 * two-row block the design specifies — the term, then what it means.
 *
 * Tapping the label toggles the tooltip on touch devices, where there is no
 * hover to trigger it. Tapping elsewhere, scrolling, or opening another tooltip
 * dismisses it.
 *
 * @example
 * ```tsx
 * <TooltipLabel tooltip="Total earnings for the selected period.">Total Earnings</TooltipLabel>
 * ```
 */
export const TooltipLabel = React.forwardRef<HTMLButtonElement, TooltipLabelProps>(
  ({ tooltip, children, className, onClick, onPointerDown, onBlur, ...props }, ref) => {
    /*
     * Touch has to drive the tooltip from the tap itself, not from focus.
     *
     * Radix's trigger ignores pointer events whose `pointerType` is "touch", so
     * hover never opens the tooltip on a phone; focus is the only thing that
     * does. That is not enough on its own for two reasons, and both need the
     * open state controlled here:
     *
     *   - The trigger closes on click. Since the tap that focuses the label is
     *     also a click, focus opens the tooltip and the click immediately shuts
     *     it, so it only flashes.
     *   - After the first tap the label keeps focus. Dismissing the tooltip by
     *     tapping elsewhere leaves it focused, so a second tap fires no focus
     *     event and nothing would reopen it.
     *
     * Radix composes trigger handlers with `checkForDefaultPrevented`, so
     * calling `preventDefault` makes it skip its own open/close and leaves the
     * toggle below in charge. Dismissal still comes from Radix: `TooltipContent`
     * closes on outside pointerdown, Escape, scroll, and when another tooltip
     * opens.
     *
     * All of this is scoped to touch, so mouse and keyboard behave as before.
     */
    const [open, setOpen] = React.useState(false);
    const pointerTypeRef = React.useRef<string>("");
    /**
     * The open state as it was when the tap began. The trigger's own pointerdown
     * close lands between pointerdown and click, so toggling against the live
     * state would read the value Radix just reset and reopen on every tap.
     */
    const openAtTapStartRef = React.useRef(false);

    const isTouch = () => pointerTypeRef.current === "touch";

    return (
      <TooltipProvider>
        <Tooltip open={open} onOpenChange={setOpen}>
          <TooltipTrigger asChild>
            <button
              ref={ref}
              type="button"
              className={cn(
                // `w-fit` keeps the trigger the size of its label. The button is
                // block-level, so a column flex or grid cell would otherwise stretch it
                // and the whole row would answer to hover with a help cursor, opening
                // this label's tooltip from a long way away from the label.
                "typography-body-small-14px-regular w-fit cursor-help rounded-2xs text-left text-content-secondary outline-none",
                "hover:text-content-primary focus-visible:shadow-focus-ring",
                className,
              )}
              onPointerDown={(event) => {
                pointerTypeRef.current = event.pointerType;
                openAtTapStartRef.current = open;
                onPointerDown?.(event);
              }}
              onClick={(event) => {
                onClick?.(event);
                if (!isTouch()) return;
                event.preventDefault();
                setOpen(!openAtTapStartRef.current);
              }}
              onBlur={(event) => {
                // Forget the pointer type once the label loses focus, so a later
                // keyboard focus still opens the tooltip on a device that has
                // both a touchscreen and a keyboard.
                pointerTypeRef.current = "";
                onBlur?.(event);
              }}
              {...props}
            >
              {/*
               * The dash lives on this inline span, not the button. The button is a
               * block-level trigger and stretches to whatever its container gives it —
               * a column flex or grid cell makes it full width — which dragged the
               * underline across the whole row instead of the label.
               *
               * Anchor the 4-on/4-off tile to the left edge. A centred position (the
               * `bg-bottom` default) lays the pattern out from the middle outward and
               * clips mid-dash at the start of the label as well as the end.
               *
               * No bottom padding: the dash sits in the descender space the 18px
               * line-height already leaves under the 14px text. Padding it out made
               * the label 20px, and since this label is the entire header of a
               * title-only insight card, that put the card over its designed height.
               */}
              <span className="bg-[length:8px_1px] bg-[linear-gradient(to_right,var(--color-icons-tertiary)_0_4px,transparent_4px_8px)] bg-bottom-left bg-repeat-x">
                {children}
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent title={children}>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);

TooltipLabel.displayName = "TooltipLabel";
