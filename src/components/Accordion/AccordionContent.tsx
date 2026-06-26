import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as React from "react";
import { cn } from "../../utils/cn";

/** Props for the {@link AccordionContent} panel component. */
export type AccordionContentProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Content
> & {
  /** Remove the default inner padding (`px-3 pb-3`). Useful when you need custom content layout. */
  noPadding?: boolean;
};

/** Renders the collapsible content panel for an {@link AccordionItem}. Animates open and closed. */
export const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, noPadding, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      // Overflow-clipped panel whose `height` is animated (see `accordion-expand`/
      // `accordion-collapse` in base.css). No `display` override here: a closed item
      // keeps Radix's `hidden` attribute, so `[hidden] { display: none }` removes its
      // footprint entirely (a `display: grid` panel would defeat that and leave a strip).
      "overflow-hidden",
      "motion-safe:data-[state=closed]:animate-accordion-collapse",
      "motion-safe:data-[state=open]:animate-accordion-expand",
      className,
    )}
    {...props}
  >
    {/*
      Isolated layer between the height-animated panel and the content. `contain:
      layout paint` makes this its own layout+paint boundary, so the parent's height
      animation only re-clips this already-laid-out, already-painted layer instead of
      re-flowing and re-painting the padded content on every frame. Without it, the
      padding/content reflow per frame and visibly desync from the clip on mobile.
    */}
    <div className="[contain:layout_paint]">
      <div
        className={cn(
          "overflow-wrap-anywhere min-w-0",
          "typography-body-small-14px-regular text-content-secondary",
          !noPadding && "px-3 pt-2 pb-3",
        )}
      >
        {children}
      </div>
    </div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = "AccordionContent";
