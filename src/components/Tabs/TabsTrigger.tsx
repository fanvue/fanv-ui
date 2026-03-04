import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";
import { cn } from "../../utils/cn";

/** Props for the {@link TabsTrigger} button component. */
export type TabsTriggerProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;

/** An interactive tab button that activates its associated {@link TabsContent} panel when clicked. */
export const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center",
      "rounded-xs",
      "typography-semibold-body-lg cursor-pointer text-foreground-default",
      "motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-in-out",
      "data-[orientation=horizontal]:px-4 data-[orientation=horizontal]:py-3",
      "data-[orientation=vertical]:justify-start data-[orientation=vertical]:px-4 data-[orientation=vertical]:py-3",
      "data-[state=active]:hover:text-neutral-800",
      "data-[state=inactive]:hover:text-neutral-500",
      "data-[state=active]:active:text-neutral-800",
      "data-[state=inactive]:active:text-neutral-500",
      "data-disabled:pointer-events-none",
      "data-disabled:data-[state=active]:text-neutral-250",
      "data-disabled:data-[state=inactive]:text-neutral-300",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-tertiary-default focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page",
      className,
    )}
    {...props}
  />
));

TabsTrigger.displayName = "TabsTrigger";
