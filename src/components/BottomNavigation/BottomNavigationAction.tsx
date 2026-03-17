import { Slot, Slottable } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";
import { useBottomNavigationContext } from "./BottomNavigation";

export interface BottomNavigationActionProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  /** Unique value that identifies this action. */
  value: string;
  /** Icon element displayed above the label. */
  icon: React.ReactElement;
  /** Text label displayed below the icon. */
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
    showLabelsOnlyWhenActive,
    hideLabels,
  } = useBottomNavigationContext();

  const isActive = selectedValue === value;
  const showLabel = !hideLabels && (!showLabelsOnlyWhenActive || isActive);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onValueChange?.(value);
    onClick?.(e);
  };

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      {...(!asChild && { type: "button" as const })}
      aria-current={isActive ? "page" : undefined}
      aria-label={!showLabel && label ? label : undefined}
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        "relative flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 overflow-hidden px-2 py-2",
        "motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page",
        isActive
          ? "text-brand-accent-default"
          : "text-foreground-tertiary hover:text-foreground-secondary",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {asChild && <Slottable>{children}</Slottable>}
      <span className="relative inline-flex">
        <span className="flex size-7" aria-hidden="true">
          {icon}
        </span>
        {badge && <span className="absolute -end-1 -top-0.5">{badge}</span>}
      </span>
      {showLabel && label && (
        <span
          className={cn(
            "typography-semibold-body-xs min-w-0 max-w-full truncate",
            isActive ? "text-brand-accent-default" : "text-foreground-tertiary",
          )}
        >
          {label}
        </span>
      )}
    </Comp>
  );
});

BottomNavigationAction.displayName = "BottomNavigationAction";
