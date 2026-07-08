import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as React from "react";
import { cn } from "../../utils/cn";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";

/** Props for the {@link AccordionTrigger} button component. */
export type AccordionTriggerProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
> & {
  /** Trailing indicator icon. Defaults to `ChevronDownIcon` (rotates when open). Pass `null` to suppress it. */
  icon?: React.ReactNode | null;
  /** Secondary line rendered under the title, for extra context. */
  description?: React.ReactNode;
  /** Leading icon shown before the title (sized to 16px). */
  leadingIcon?: React.ReactNode;
  /** Leading avatar shown before the title, for headers representing a person or account. Pass an `Avatar` sized to `24`. */
  avatar?: React.ReactNode;
};

/** An interactive button that toggles the visibility of its associated {@link AccordionContent} panel. */
export const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, icon, description, leadingIcon, avatar, ...props }, ref) => {
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
          "typography-body-small-14px-semibold text-content-primary",
          "cursor-pointer",
          "motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-in-out",
          "hover:bg-neutral-alphas-100",
          "focus-visible:shadow-focus-ring focus-visible:outline-none",
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <span className="flex min-w-0 flex-1 items-center gap-3">
          {avatar && (
            <span className="flex shrink-0 items-center" aria-hidden="true">
              {avatar}
            </span>
          )}
          <span className="flex min-w-0 flex-1 items-start gap-2 text-left">
            {leadingIcon && (
              <span className="flex shrink-0 items-center pt-px [&>svg]:size-4" aria-hidden="true">
                {leadingIcon}
              </span>
            )}
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="truncate typography-body-small-14px-semibold text-content-primary">
                {children}
              </span>
              {description && (
                <span className="typography-description-12px-regular text-content-secondary">
                  {description}
                </span>
              )}
            </span>
          </span>
        </span>
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
