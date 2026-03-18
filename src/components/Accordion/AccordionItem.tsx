import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as React from "react";
import { cn } from "../../utils/cn";

/** Props for the {@link AccordionItem} component. */
export type AccordionItemProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>;

/** A single collapsible section within an {@link Accordion}. Contains an {@link AccordionTrigger} and {@link AccordionContent}. */
export const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("rounded-xl bg-surface-container", "border border-neutral-200", className)}
    {...props}
  />
));

AccordionItem.displayName = "AccordionItem";
