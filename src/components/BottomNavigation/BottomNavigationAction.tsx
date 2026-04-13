import { Slot, Slottable } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";
import { useBottomNavigationContext } from "./BottomNavigation";

export interface BottomNavigationActionProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  /** Unique value that identifies this action. */
  value: string;
  /** Icon element displayed in the action. */
  icon: React.ReactElement;
  /** Accessible label applied as `aria-label`. */
  label?: string;
  /** Optional badge element (e.g. {@link Count}) rendered at the top-end corner of the icon. */
  badge?: React.ReactNode;
  /** Merge props onto a child element instead of rendering a `<button>`. @default false */
  asChild?: boolean;
}

export const BottomNavigationAction = React.forwardRef<
  HTMLButtonElement,
  BottomNavigationActionProps
>(({ className, value, icon, label, badge, onClick, asChild = false, children, ...props }, ref) => {
  const {
    value: selectedValue,
    onValueChange,
    hasInformationArchitectureNav,
  } = useBottomNavigationContext();

  const isActive = selectedValue === value;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onValueChange?.(value);
    onClick?.(e);
  };

  const Comp = asChild ? Slot : "button";

  if (hasInformationArchitectureNav) {
    return (
      <Comp
        ref={ref}
        {...(!asChild && { type: "button" as const })}
        aria-current={isActive ? ("page" as const) : undefined}
        data-state={isActive ? "active" : "inactive"}
        onClick={handleClick}
        {...props}
        className={cn(
          "relative flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-1",
          isActive ? "text-icons-primary" : "text-icons-tertiary",
          "motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interaction-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
          className,
        )}
      >
        {asChild && <Slottable>{children}</Slottable>}
        <span className="relative inline-flex">
          <span className="flex items-center justify-center [&>svg]:size-6" aria-hidden="true">
            {icon}
          </span>
          {badge && <span className="absolute -end-1 -top-2.5">{badge}</span>}
        </span>
        {label && (
          <span
            className={cn(
              "typography-medium-caption-xs truncate text-center motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-in-out",
              isActive ? "text-content-primary" : "text-content-tertiary",
            )}
          >
            {label}
          </span>
        )}
      </Comp>
    );
  }

  return (
    <Comp
      ref={ref}
      {...(!asChild && { type: "button" as const })}
      aria-current={isActive ? "page" : undefined}
      aria-label={label}
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        "relative flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 overflow-hidden px-2 py-2",
        "text-content-primary",
        "motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interaction-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {asChild && <Slottable>{children}</Slottable>}
      <span className="relative inline-flex">
        <span className="flex items-center justify-center [&>svg]:size-7" aria-hidden="true">
          {icon}
        </span>
        {badge && <span className="absolute -end-1 -top-2.5">{badge}</span>}
      </span>
    </Comp>
  );
});

BottomNavigationAction.displayName = "BottomNavigationAction";
