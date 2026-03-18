import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../Button/Button";

/** Props for the {@link InfoBox} root component. */
export interface InfoBoxProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}

/** Root component that manages open/close state for an info box. */
export const InfoBox = PopoverPrimitive.Root;

/** Props for the {@link InfoBoxTrigger} component. */
export type InfoBoxTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>;

/** The element that triggers the info box on click. */
export const InfoBoxTrigger = PopoverPrimitive.Trigger;

/** Action button with a label and click handler. */
interface InfoBoxButtonAction {
  label: string;
  onClick?: () => void;
}

/** Custom element rendered in place of the default action button. */
interface InfoBoxElementAction {
  element: React.ReactNode;
}

/** Action configuration for {@link InfoBoxContent}. */
export type InfoBoxAction = InfoBoxButtonAction | InfoBoxElementAction;

export interface InfoBoxContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  /** Whether to show the directional arrow pointer. @default true */
  showArrow?: boolean;
  /** Heading text rendered at the top of the info box. */
  heading?: React.ReactNode;
  /** Icon element displayed to the left of the heading. */
  icon?: React.ReactNode;
  /** Pill or badge element displayed to the right of the heading. */
  pill?: React.ReactNode;
  /** Primary action button (brand green). */
  primaryAction?: InfoBoxAction;
  /** Secondary action button (ghost). */
  secondaryAction?: InfoBoxAction;
}

const ACTION_CLASSES: Record<"brand" | "tertiary", string> = {
  brand: "hover:bg-brand-accent-default/80 hover:text-foreground-onaccent",
  tertiary: "text-foreground-inverse hover:text-foreground-inverse hover:bg-foreground-inverse/10",
};

const ActionButton = ({
  action,
  variant,
}: {
  action: InfoBoxAction;
  variant: "brand" | "tertiary";
}) =>
  "element" in action ? (
    action.element
  ) : (
    <Button variant={variant} onClick={action.onClick} className={ACTION_CLASSES[variant]}>
      {action.label}
    </Button>
  );

export const InfoBoxContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  InfoBoxContentProps
>(
  (
    {
      className,
      showArrow = true,
      sideOffset = 8,
      heading,
      icon,
      pill,
      primaryAction,
      secondaryAction,
      children,
      style,
      onOpenAutoFocus,
      ...props
    },
    ref,
  ) => {
    const hasHeader = icon !== undefined || heading !== undefined || pill !== undefined;
    const hasActions = primaryAction !== undefined || secondaryAction !== undefined;
    const headingId = React.useId();

    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          collisionPadding={8}
          style={{ zIndex: "var(--fanvue-ui-portal-z-index, 50)", ...style }}
          className={cn(
            "typography-regular-body-md max-w-[280px] overflow-hidden rounded-2xl border border-neutral-200 bg-surface-pageinverse p-4 text-foreground-inverse shadow-[0px_2px_4px_0px_rgba(17,24,39,0.08)]",
            className,
          )}
          align="center"
          aria-labelledby={heading ? headingId : undefined}
          arrowPadding={12}
          onOpenAutoFocus={(e) => {
            // Prevent auto-focus stealing when opening — content is supplementary, not a dialog.
            e.preventDefault();
            onOpenAutoFocus?.(e);
          }}
          {...props}
        >
          <div className="flex flex-col gap-3">
            {hasHeader && (
              <div className="flex items-center gap-3">
                {icon && <div className="size-5 shrink-0">{icon}</div>}
                {heading && (
                  <p
                    id={headingId}
                    className="typography-semibold-body-lg min-w-0 flex-1 text-foreground-inverse"
                  >
                    {heading}
                  </p>
                )}
                {pill && <div className="shrink-0">{pill}</div>}
              </div>
            )}
            {children && (
              <div className="typography-regular-body-md text-foreground-inverse">{children}</div>
            )}
            {hasActions && (
              <div className="flex items-center gap-1">
                {primaryAction && <ActionButton action={primaryAction} variant="brand" />}
                {secondaryAction && <ActionButton action={secondaryAction} variant="tertiary" />}
              </div>
            )}
          </div>
          {showArrow && (
            <PopoverPrimitive.Arrow
              className={
                "-translate-y-px! fill-surface-pageinverse stroke-2 stroke-surface-pageinverse"
              }
              width={12}
              height={6}
            />
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  },
);
InfoBoxContent.displayName = "InfoBoxContent";
