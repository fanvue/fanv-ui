import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";
import { cn } from "../../utils/cn";

export interface SettingsCardProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    "asChild" | "title"
  > {
  /** Icon shown above the title, drawn at 24px. */
  icon?: React.ReactNode;
  /** Name of the option. Also the accessible name of the card. */
  title: React.ReactNode;
  /** Short explanation shown beneath the title. */
  description?: React.ReactNode;
}

/**
 * A selectable option card with an icon, title, description and a radio indicator
 * (Figma `v2 Settings / Card`). Place two or more inside a {@link RadioGroup} so one
 * option is chosen at a time.
 *
 * @example
 * ```tsx
 * <RadioGroup value={value} onValueChange={setValue} className="grid grid-cols-2 gap-4">
 *   <SettingsCard
 *     value="dynamic"
 *     icon={<RepeatIcon />}
 *     title="Dynamic Logic"
 *     description="Define rules which automatically update"
 *   />
 *   <SettingsCard value="manual" icon={<UsersIcon />} title="Manual" description="Pick members yourself" />
 * </RadioGroup>
 * ```
 */
export const SettingsCard = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  SettingsCardProps
>(({ className, icon, title, description, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "group relative flex w-full cursor-pointer flex-col items-start gap-2 rounded-md bg-surface-primary p-4 text-left outline-none",
        "focus-visible:shadow-focus-ring disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors",
        className,
      )}
      {...props}
    >
      {icon && (
        <span
          aria-hidden="true"
          className="flex size-6 shrink-0 items-center justify-center [&>svg]:size-6"
        >
          {icon}
        </span>
      )}
      <span className="flex min-w-0 flex-col gap-1">
        <span className="typography-body-default-16px-semibold text-content-primary">{title}</span>
        {description && (
          <span className="typography-description-12px-regular text-content-secondary">
            {description}
          </span>
        )}
      </span>
      <span
        aria-hidden="true"
        className="absolute top-4 right-4 flex size-4 items-center justify-center rounded-full border border-content-primary group-disabled:border-neutral-alphas-600"
      >
        <RadioGroupPrimitive.Indicator className="size-2 rounded-full bg-content-primary group-disabled:bg-neutral-alphas-600" />
      </span>
    </RadioGroupPrimitive.Item>
  );
});
SettingsCard.displayName = "SettingsCard";
