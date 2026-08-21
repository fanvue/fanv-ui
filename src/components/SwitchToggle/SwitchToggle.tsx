import { useControllableState } from "@radix-ui/react-use-controllable-state";
import * as React from "react";
import { cn } from "../../utils/cn";
import { AddIcon } from "../Icons/AddIcon";
import { AIIcon } from "../Icons/AIIcon";
import {
  SWITCH_TOGGLE_AI_SELECTED,
  SWITCH_TOGGLE_HEIGHT_CLASSES,
  SWITCH_TOGGLE_PADDING_CLASSES,
  SWITCH_TOGGLE_STATE_CLASSES,
  type SwitchToggleSize,
} from "./switchToggleStyles";

export type { SwitchToggleSize };

/** Visual treatment of the toggle. */
export type SwitchToggleVariant = "default" | "ai";

/**
 * Describes one side of the removed two-option segmented toggle.
 *
 * @deprecated `SwitchToggle` is now a single binary toggle and no longer takes
 * `options`. Use {@link SegmentedControlOption} with {@link SegmentedControl}
 * for two- or three-option selection. Kept as an alias so existing imports keep
 * resolving; it is no longer referenced by {@link SwitchToggleProps}.
 */
export interface SwitchToggleOption {
  /** Display label for the option. */
  label: string;
  /** Value identifier returned via `onChange`. */
  value: string;
}

const ICON_SLOT_CLASSES = "flex size-4 shrink-0 items-center justify-center";

interface SwitchToggleBaseProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children"> {
  /** Visible text label, which is also the accessible name. */
  label: string;
  /** Height of the toggle in pixels. @default "32" */
  size?: SwitchToggleSize;
  /** On/off state for controlled usage. Pair with `onPressedChange`. */
  pressed?: boolean;
  /** Initial on/off state for uncontrolled usage. @default false */
  defaultPressed?: boolean;
  /** Fired with the next state each time the toggle flips. */
  onPressedChange?: (pressed: boolean) => void;
  /** Native button behaviour. @default "button" */
  type?: "button" | "submit" | "reset";
}

/**
 * Props for the `"default"` variant, the only one with icon slots. The two are
 * independent: pass either, neither, or both.
 */
export interface SwitchToggleDefaultProps extends SwitchToggleBaseProps {
  /** Visual treatment. @default "default" */
  variant?: "default";
  /** Show an icon before the label. @default false */
  showLeftIcon?: boolean;
  /** Show an icon after the label. @default false */
  showRightIcon?: boolean;
  /** Icon rendered before the label when `showLeftIcon` is set. @default `<AddIcon size={16} />` */
  leftIcon?: React.ReactNode;
  /** Icon rendered after the label when `showRightIcon` is set. @default `<AddIcon size={16} />` */
  rightIcon?: React.ReactNode;
}

/**
 * Props for the `"ai"` variant. Its leading sparkle is fixed and it has no
 * trailing slot, so neither icon prop is available here.
 */
export interface SwitchToggleAiProps extends SwitchToggleBaseProps {
  /** Visual treatment. */
  variant: "ai";
  /** Unavailable on `"ai"` — the leading sparkle is always shown and cannot be swapped. */
  showLeftIcon?: never;
  /** Unavailable on `"ai"` — this variant has no trailing icon slot. */
  showRightIcon?: never;
  /** Unavailable on `"ai"` — the leading sparkle is fixed. */
  leftIcon?: never;
  /** Unavailable on `"ai"` — this variant has no trailing icon slot. */
  rightIcon?: never;
}

/**
 * Props for {@link SwitchToggle}. A discriminated union on `variant`, so the
 * icon slots only type-check on the `"default"` variant.
 */
export type SwitchToggleProps = SwitchToggleDefaultProps | SwitchToggleAiProps;

/**
 * A labelled pill that switches one feature or mode on and off, for settings
 * panels, filter bars and tool options. Unlike {@link Switch} it names the thing
 * it controls, which suits contexts where the action needs spelling out.
 *
 * Rendered as a `<button>` carrying `aria-pressed` — the ARIA toggle-button
 * pattern — so it flips on click and on Enter or Space, and exposes
 * `data-state="on" | "off"` for styling. Supports controlled (`pressed`) and
 * uncontrolled (`defaultPressed`) usage. The visible `label` is the accessible
 * name, so no `aria-label` is needed.
 *
 * The `"default"` variant has two independent icon flags, `showLeftIcon` and
 * `showRightIcon`, each rendering the add glyph on that side. The `"ai"` variant
 * pins a sparkle before the label instead, takes neither flag, and turns green
 * rather than dark when on.
 *
 * @example
 * ```tsx
 * <SwitchToggle label="Hide sold out" pressed={hidden} onPressedChange={setHidden} />
 * ```
 *
 * @example Independent icon flags, available on the default variant only
 * ```tsx
 * <SwitchToggle size="40" label="Add filter" showLeftIcon showRightIcon />
 * ```
 *
 * @example The AI variant, whose sparkle is fixed
 * ```tsx
 * <SwitchToggle variant="ai" label="Smart replies" defaultPressed />
 * ```
 *
 * @example Migrating away from the removed two-option API
 * ```tsx
 * <SwitchToggle
 *   options={[
 *     { label: "Monthly", value: "monthly" },
 *     { label: "Yearly", value: "yearly" },
 *   ]}
 *   value={billing}
 *   onChange={setBilling}
 *   aria-label="Billing period"
 * />
 *
 * <SegmentedControl
 *   options={[
 *     { label: "Monthly", value: "monthly" },
 *     { label: "Yearly", value: "yearly" },
 *   ]}
 *   value={billing}
 *   onChange={setBilling}
 *   aria-label="Billing period"
 * />
 * ```
 */
export const SwitchToggle = React.forwardRef<HTMLButtonElement, SwitchToggleProps>(
  (
    {
      label,
      size = "32",
      variant = "default",
      pressed: pressedProp,
      defaultPressed = false,
      onPressedChange,
      showLeftIcon = false,
      showRightIcon = false,
      leftIcon,
      rightIcon,
      type = "button",
      className,
      disabled = false,
      onClick,
      ...props
    },
    ref,
  ) => {
    const [pressed = false, setPressed] = useControllableState({
      prop: pressedProp,
      defaultProp: defaultPressed,
      onChange: onPressedChange,
    });

    const isAi = variant === "ai";
    const leading = isAi ? (
      <AIIcon size={16} filled />
    ) : showLeftIcon ? (
      (leftIcon ?? <AddIcon size={16} />)
    ) : undefined;
    const trailing = !isAi && showRightIcon ? (rightIcon ?? <AddIcon size={16} />) : undefined;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-pressed={pressed}
        data-state={pressed ? "on" : "off"}
        onClick={(event) => {
          onClick?.(event);
          setPressed(!pressed);
        }}
        className={cn(
          "inline-flex w-fit shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full",
          "motion-safe:transition-colors motion-safe:duration-150",
          "focus-visible:shadow-focus-ring focus-visible:outline-none",
          SWITCH_TOGGLE_HEIGHT_CLASSES[size],
          SWITCH_TOGGLE_PADDING_CLASSES[size],
          !disabled && "cursor-pointer",
          !disabled && !pressed && SWITCH_TOGGLE_STATE_CLASSES.unselected,
          !disabled && pressed && !isAi && SWITCH_TOGGLE_STATE_CLASSES.selected,
          !disabled &&
            pressed &&
            isAi &&
            `text-content-primary shadow-sm ${SWITCH_TOGGLE_AI_SELECTED}`,
          disabled && `cursor-not-allowed ${SWITCH_TOGGLE_STATE_CLASSES.disabled}`,
          className,
        )}
        {...props}
      >
        {leading && (
          <span className={ICON_SLOT_CLASSES} aria-hidden="true">
            {leading}
          </span>
        )}
        <span className="min-w-0 truncate">{label}</span>
        {trailing && (
          <span className={ICON_SLOT_CLASSES} aria-hidden="true">
            {trailing}
          </span>
        )}
      </button>
    );
  },
);

SwitchToggle.displayName = "SwitchToggle";
