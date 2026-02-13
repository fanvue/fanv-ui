import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";
import { cn } from "../../utils/cn";

/** Props for the {@link TabsContent} panel component. */
export type TabsContentProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>;

/** Renders the content panel for a given tab `value`. Only visible when its value matches the active tab. */
export const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("focus-visible:outline-none", className)}
    {...props}
  />
));

TabsContent.displayName = "TabsContent";
