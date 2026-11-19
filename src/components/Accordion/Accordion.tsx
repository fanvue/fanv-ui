import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as React from "react";
import { cn } from "../../utils/cn";

/** Props for the {@link Accordion} root component. Extends Radix `Accordion.Root` props. */
export type AccordionProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>;

/**
 * Root container for an accordion interface. Manages the expand/collapse state
 * and coordinates {@link AccordionItem}, {@link AccordionTrigger}, and {@link AccordionContent}.
 *
 * Built on Radix UI `Accordion`.
 *
 * @example
 * ```tsx
 * <Accordion type="single" collapsible>
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Section 1</AccordionTrigger>
 *     <AccordionContent>Content 1</AccordionContent>
 *   </AccordionItem>
 *   <AccordionItem value="item-2">
 *     <AccordionTrigger>Section 2</AccordionTrigger>
 *     <AccordionContent>Content 2</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
export const Accordion = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Root ref={ref} className={cn("space-y-2", className)} {...props} />
));

Accordion.displayName = "Accordion";
