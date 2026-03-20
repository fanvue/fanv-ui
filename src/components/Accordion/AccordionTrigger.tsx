import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as React from "react";
import { cn } from "../../utils/cn";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";

/** Props for the {@link AccordionTrigger} button component. */
export type AccordionTriggerProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
> & {
  /** Custom icon element. Defaults to `ChevronDownIcon`. Pass `null` to suppress the icon entirely. */
  icon?: React.ReactNode | null;
};

/** An interactive button that toggles the visibility of its associated {@link AccordionContent} panel. */
export const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, icon, ...props }, ref) => {
  const showIcon = icon !== null;
  const iconElement =
    icon === undefined ? (
      <ChevronDownIcon className="size-4 shrink-0 text-content-secondary" />
    ) : (
      icon
    );

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between gap-3",
          "rounded-sm px-3 py-3",
          "typography-semibold-body-md text-content-primary",
          "cursor-pointer",
          "motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-in-out",
          "hover:bg-neutral-alphas-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interaction-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <span className="min-w-0 flex-1 truncate text-left">{children}</span>
        {showIcon && (
          <span className="shrink-0 motion-safe:transition-transform motion-safe:duration-200 [[data-state=open]>&]:rotate-180">
            {iconElement}
          </span>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

AccordionTrigger.displayName = "AccordionTrigger";
