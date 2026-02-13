import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";
import { cn } from "../../utils/cn";

/** Props for the {@link TabsList} component. */
export type TabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>;

/** Container for {@link TabsTrigger} elements. Supports both horizontal and vertical orientations. */
export const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex", // !TODO setup shadows tokens https://linear.app/fanvue/issue/ENG-7368/setup-shadow-tokens
      "data-[orientation=horizontal]:items-center data-[orientation=horizontal]:shadow-[inset_0_-1px_0_0_var(--color-neutral-200)]",
      "data-[orientation=vertical]:flex-col data-[orientation=vertical]:shadow-[inset_-1px_0_0_0_var(--color-neutral-200)]",
      className,
    )}
    {...props}
  />
));

TabsList.displayName = "TabsList";
