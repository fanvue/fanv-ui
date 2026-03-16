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
      "overflow-hidden",
      "typography-regular-body-md text-foreground-secondary",
      "motion-safe:data-[state=closed]:animate-accordion-collapse",
      "motion-safe:data-[state=open]:animate-accordion-expand",
      !noPadding && "px-3 pb-3",
      className,
    )}
    {...props}
  >
    <div className="min-w-0 overflow-wrap-anywhere">{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = "AccordionContent";
