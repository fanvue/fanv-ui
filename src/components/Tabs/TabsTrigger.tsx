import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";
import { cn } from "../../utils/cn";

/** Props for the {@link TabsTrigger} button component. */
export type TabsTriggerProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;

/** An interactive tab button that activates its associated {@link TabsContent} panel when clicked. */
export const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex min-w-0 items-center justify-center",
      "rounded-xs",
      "typography-body-default-16px-semibold cursor-pointer text-content-primary",
      "motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-in-out",
      "data-[orientation=horizontal]:px-4 data-[orientation=horizontal]:py-3",
      "data-[orientation=vertical]:justify-start data-[orientation=vertical]:px-4 data-[orientation=vertical]:py-3",
      "data-[state=active]:hover:text-buttons-primary-muted",
      "data-[state=inactive]:hover:text-neutral-alphas-300",
      "data-[state=active]:active:text-buttons-primary-muted",
      "data-[state=inactive]:active:text-neutral-alphas-300",
      "data-disabled:pointer-events-none",
      "data-disabled:data-[state=active]:text-content-tertiary",
      "data-disabled:data-[state=inactive]:text-neutral-alphas-300",
      "focus-visible:shadow-focus-ring focus-visible:outline-none",
      className,
    )}
    {...props}
  >
    <span className="min-w-0 truncate">{children}</span>
  </TabsPrimitive.Trigger>
));

TabsTrigger.displayName = "TabsTrigger";
