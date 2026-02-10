import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";
import { cn } from "../../utils/cn";

export type TabsTriggerProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;

export const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center",
      "rounded-xs border-transparent",
      "typography-body-1-semibold cursor-pointer text-body-100",
      "data-[orientation=horizontal]:border-b-4 data-[orientation=horizontal]:px-3 data-[orientation=horizontal]:pb-4",
      "data-[orientation=vertical]:justify-start data-[orientation=vertical]:border-r-4 data-[orientation=vertical]:px-4 data-[orientation=vertical]:py-3",
      "data-[state=active]:border-brand-green-500",
      "data-[state=active]:hover:text-hover-100",
      "data-[state=inactive]:hover:text-hover-200",
      "data-disabled:pointer-events-none",
      "data-disabled:data-[state=active]:text-disabled-100",
      "data-disabled:data-[state=inactive]:text-disabled-400",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background-inverse-solid",
      className,
    )}
    {...props}
  />
));

TabsTrigger.displayName = "TabsTrigger";
