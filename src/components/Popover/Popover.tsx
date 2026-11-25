import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";
import { cn } from "../../utils/cn";
import { FLOATING_CONTENT_COLLISION_PADDING } from "../../utils/floatingContentCollisionPadding";
import { useSuppressClickAfterDrag } from "../../utils/useSuppressClickAfterDrag";

/** Props for {@link Popover}. */
export type PopoverProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>;

/** Props for {@link PopoverTrigger}. */
export type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>;

/** Props for {@link PopoverAnchor}. */
export type PopoverAnchorProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor>;

/** Props for {@link PopoverClose}. */
export type PopoverCloseProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Close>;

/** Props for {@link PopoverContent}. */
export interface PopoverContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>, "forceMount"> {
  /** Alignment of the content against the trigger. @default "start" */
  align?: PopoverPrimitive.PopoverContentProps["align"];
  /** Distance in pixels between the trigger and the content. @default 8 */
  sideOffset?: PopoverPrimitive.PopoverContentProps["sideOffset"];
  /**
   * Distance in pixels kept between the content and the viewport edge, as a number or a per-side
   * object. @default 16
   */
  collisionPadding?: PopoverPrimitive.PopoverContentProps["collisionPadding"];
  /** Additional CSS classes merged onto the content surface. */
  className?: string;
}

/**
 * Root of a popover. Holds the open state shared by its trigger and content.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverTrigger asChild><Button>Open</Button></PopoverTrigger>
 *   <PopoverContent aria-label="Details">Content</PopoverContent>
 * </Popover>
 * ```
 */
export const Popover = PopoverPrimitive.Root;

/**
 * Element that toggles the popover. Use `asChild` to render your own button.
 *
 * On touch and pen, a press-and-release that moves past a small threshold counts as a drag, and
 * the synthetic click that follows it is ignored, so scrolling past the trigger does not open it.
 */
export const PopoverTrigger = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Trigger>,
  PopoverTriggerProps
>((props, ref) => <PopoverPrimitive.Trigger ref={ref} {...useSuppressClickAfterDrag(props)} />);

PopoverTrigger.displayName = "PopoverTrigger";

/** Optional element the content positions against instead of the trigger. */
export const PopoverAnchor = PopoverPrimitive.Anchor;

/** Element that closes the popover when activated. Use `asChild` to render your own button. */
export const PopoverClose = PopoverPrimitive.Close;

/**
 * Floating panel rendered in a portal, styled like the {@link DropdownMenuContent} surface.
 * Focus moves into it on open and returns to the trigger on close. It renders a `role="dialog"`,
 * so pass `aria-label` or `aria-labelledby` to name it. The content unmounts when closed;
 * `forceMount` is not supported.
 *
 * @example
 * ```tsx
 * <PopoverContent align="end" aria-label="Filters">Filters</PopoverContent>
 * ```
 */
export const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      align = "start",
      sideOffset = 8,
      collisionPadding = FLOATING_CONTENT_COLLISION_PADDING,
      className,
      style,
      ...props
    },
    ref,
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          "w-max max-w-(--radix-popover-content-available-width) overflow-y-auto rounded-md border border-border-strong bg-modal-background p-2 text-content-primary shadow-blur-menu outline-none backdrop-blur-xs",
          "theme-v2:border-modal-stroke",
          className,
        )}
        style={{
          zIndex: "var(--fanvue-ui-portal-z-index, 50)",
          maxHeight: "var(--radix-popover-content-available-height)",
          ...style,
        }}
        {...props}
      />
    </PopoverPrimitive.Portal>
  ),
);

PopoverContent.displayName = "PopoverContent";
