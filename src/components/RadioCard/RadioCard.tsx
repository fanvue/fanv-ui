import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";
import { cn } from "../../utils/cn";

export interface RadioCardProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    "asChild" | "children" | "title"
  > {
  /** Card title. Used as the radio's accessible name. */
  title: React.ReactNode;
  /** Supporting text below the title, linked to the radio via `aria-describedby`. */
  description?: React.ReactNode;
  /** Optional 24px leading icon shown above the title. Decorative (hidden from assistive tech). */
  icon?: React.ReactNode;
}

/**
 * A selectable settings card that acts as a single radio option within a
 * {@link RadioGroup}. The whole card is the click target, arrow keys move the
 * selection between cards, and a trailing radio indicator mirrors {@link Radio}.
 *
 * @example
 * ```tsx
 * <RadioGroup value={type} onValueChange={setType} aria-label="List type" className="grid grid-cols-2 gap-4">
 *   <RadioCard value="dynamic" icon={<RefreshArrowIcon />} title="Dynamic list" description="Updates automatically" />
 *   <RadioCard value="specific" icon={<UsersIcon />} title="Specific fans" description="A fixed set you pick" />
 * </RadioGroup>
 * ```
 */
export const RadioCard = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  RadioCardProps
>(({ className, title, description, icon, id, ...props }, ref) => {
  const generatedId = React.useId();
  const itemId = id || generatedId;
  const titleId = `${itemId}-title`;
  const descriptionId = `${itemId}-description`;

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      id={itemId}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        // Transparent border is reserved so selecting a card does not shift layout.
        "group flex w-full cursor-pointer items-start gap-3 rounded-md border border-transparent bg-surface-primary p-4 text-left transition-colors focus-visible:shadow-focus-ring focus-visible:outline-none disabled:cursor-not-allowed data-[state=checked]:border-border-selected",
        className,
      )}
      {...props}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-2">
        {icon && (
          <span
            aria-hidden="true"
            className="flex size-6 shrink-0 items-center justify-center text-content-primary group-disabled:text-content-tertiary"
          >
            {icon}
          </span>
        )}
        <span className="flex flex-col gap-1">
          <span
            id={titleId}
            className="typography-body-default-16px-semibold text-content-primary group-disabled:text-content-tertiary"
          >
            {title}
          </span>
          {description && (
            <span
              id={descriptionId}
              className="typography-description-12px-regular text-content-secondary group-disabled:text-content-tertiary"
            >
              {description}
            </span>
          )}
        </span>
      </span>
      <span aria-hidden="true" className="shrink-0 pt-1">
        <span className="relative flex size-4 rounded-full border border-content-primary transition-colors group-hover:group-enabled:bg-brand-primary-muted group-disabled:border-neutral-alphas-600">
          <RadioGroupPrimitive.Indicator className="absolute inset-0 flex items-center justify-center">
            <span className="size-2 rounded-full bg-content-primary group-disabled:bg-neutral-alphas-600" />
          </RadioGroupPrimitive.Indicator>
        </span>
      </span>
    </RadioGroupPrimitive.Item>
  );
});

RadioCard.displayName = "RadioCard";
