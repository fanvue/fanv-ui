import * as React from "react";
import { cn } from "../../utils/cn";
import {
  SWITCH_TOGGLE_AI_SELECTED,
  SWITCH_TOGGLE_ICON_GAP,
  SWITCH_TOGGLE_PADDING_CLASSES,
  SWITCH_TOGGLE_STATE_CLASSES,
  type SwitchToggleSize,
} from "../SwitchToggle/switchToggleStyles";

/** Height of the segmented control in pixels. */
export type SegmentedControlSize = "32" | "40" | "48";

/**
 * Segment layout.
 * - `"hug"`: each segment is sized to its content.
 * - `"fill"`: the control spans the full width of its container and each segment grows equally.
 */
export type SegmentedControlVariant = "hug" | "fill";

/**
 * Visual style of the control.
 * - `"pill"`: the container has a muted background and the selected segment shows a filled pill (default).
 * - `"plain"`: no container or selected-pill background; segments are bare content and selection is
 *   communicated by color alone. Designed for icon-only toggles (e.g. a list/grid view switch).
 * - `"ai"`: like `"pill"`, but segments render their `icon` alongside the visible `label` and the
 *   selected segment uses the `V2 Switch Button` AI pill — a translucent `Buttons/AI/Default` fill
 *   under a three-stop gradient stroke. Designed for prominent toggles such as the Home/Agent
 *   navigation switch.
 * - `"brand"`: deprecated alias of `"ai"`.
 */
export type SegmentedControlAppearance = "pill" | "plain" | "ai" | "brand";

/** Describes one selectable segment. */
export interface SegmentedControlOption {
  /**
   * Display label for the segment. In `pill`/`plain` appearances, when `icon` is provided the
   * segment renders icon-only and this value becomes its accessible name (applied as `aria-label`)
   * instead of visible text. In the `brand` appearance the label is always rendered as visible text
   * (alongside the icon when present).
   */
  label: string;
  /** Value identifier returned via `onChange`. */
  value: string;
  /**
   * Icon to render for the segment. In `pill`/`plain` appearances the segment renders icon-only and
   * `label` becomes required as its accessible name (applied as `aria-label`, no visible text). In
   * the `brand` appearance the icon renders alongside the visible `label`. Required for every option
   * when `collapsible` is set unless a `collapsedIcon` is given, since the collapsed control
   * otherwise shows the selected option's icon alone.
   */
  icon?: React.ReactNode;
}

export interface SegmentedControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Height of the control in pixels. @default "32" */
  size?: SegmentedControlSize;
  /** Segment layout. @default "hug" */
  variant?: SegmentedControlVariant;
  /** Visual style of the control. @default "pill" */
  appearance?: SegmentedControlAppearance;
  /** The selectable segments. Designed for two or three mutually exclusive options. */
  options: SegmentedControlOption[];
  /** Currently selected value (controlled). */
  value?: string;
  /** Initially selected value (uncontrolled). Defaults to the first option. */
  defaultValue?: string;
  /** Callback fired when the selected value changes. */
  onChange?: (value: string) => void;
  /** Whether the control is disabled. @default false */
  disabled?: boolean;
  /**
   * When `true`, the control automatically collapses to a single icon-only toggle whenever its
   * container is too narrow to show every segment side by side, and expands again when the space
   * returns. Collapsed, it shows `collapsedIcon` when given and otherwise the currently-selected
   * option's `icon`; clicking it (or pressing Enter/Space) advances to the next option, wrapping
   * around from the last back to the first.
   *
   * Only supported for the icon-bearing `"plain"` and `"brand"` appearances, and every option must
   * define an `icon` unless `collapsedIcon` is given (there is nothing to show otherwise). Ignored,
   * with a dev-time warning, when those conditions are not met. @default false
   */
  collapsible?: boolean;
  /**
   * Single glyph for the collapsed toggle, replacing the selected option's icon. Use it when the
   * collapsed control should read as one switch affordance rather than as a preview of the current
   * selection — the collapsed navigation rail shows a repeat glyph this way. The button still
   * announces the selected option as its accessible name, so the current state stays available to
   * assistive tech. Only meaningful alongside `collapsible`.
   */
  collapsedIcon?: React.ReactNode;
}

/**
 * The `SwitchToggle` size each segment renders at. In Figma every `V2 Segmented
 * Control` segment is an instance of `V2 Switch Button` one step down the scale:
 * a 32px control holds 24px segments, 40px holds 32px, 48px holds 40px. The
 * difference is the container's own `p-1`, which adds 4px above and below.
 */
const SEGMENT_SIZE: Record<SegmentedControlSize, SwitchToggleSize> = {
  "32": "24",
  "40": "32",
  "48": "40",
};

/**
 * Whether this appearance renders the AI pill. `"brand"` is the deprecated spelling of
 * `"ai"`; it previously approximated a brand-green pill with `brand-primary` tokens
 * while dedicated ones were pending, and now resolves to the same Figma-bound
 * treatment `SwitchToggle` uses for `Type=AI`.
 */
const isAiAppearance = (appearance: SegmentedControlAppearance) =>
  appearance === "ai" || appearance === "brand";

function warnMissingAccessibleName(ariaLabel?: string, ariaLabelledBy?: string) {
  if (process.env.NODE_ENV !== "production") {
    if (!ariaLabel && !ariaLabelledBy) {
      console.warn(
        "SegmentedControl: no accessible name provided. Pass an `aria-label` or `aria-labelledby` prop.",
      );
    }
  }
}

function warnMissingOptionAccessibleName(options: SegmentedControlOption[]) {
  if (process.env.NODE_ENV !== "production") {
    for (const option of options) {
      if (option.icon && !option.label?.trim()) {
        console.warn(
          `SegmentedControl: icon-only segment "${option.value}" is missing a non-empty \`label\` to use as its accessible name.`,
        );
      }
    }
  }
}

function warnUnsupportedCollapsible(
  appearance: SegmentedControlAppearance,
  options: SegmentedControlOption[],
  hasCollapsedIcon: boolean,
) {
  if (process.env.NODE_ENV !== "production") {
    if (appearance === "pill") {
      console.warn(
        'SegmentedControl: `collapsible` is only supported for the "plain" and "ai" appearances; ignoring it.',
      );
    } else if (!hasCollapsedIcon && !options.every((option) => option.icon)) {
      console.warn(
        "SegmentedControl: `collapsible` requires every option to define an `icon`, or a `collapsedIcon` to show instead; ignoring it.",
      );
    }
  }
}

function getSegmentClassName({
  appearance,
  size,
  variant,
  isSelected,
  disabled,
}: {
  appearance: SegmentedControlAppearance;
  size: SegmentedControlSize;
  variant: SegmentedControlVariant;
  isSelected: boolean;
  disabled: boolean;
}) {
  return cn(
    "relative inline-flex min-w-0 cursor-pointer items-center justify-center rounded-full",
    "motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-in-out",
    "focus-visible:shadow-focus-ring focus-visible:outline-none",
    variant === "fill" ? "flex-1" : "shrink-0",
    appearance === "plain"
      ? cn(
          // Padding + negative margin enlarge the hit target without changing the
          // visual footprint, which must stay glyph-only to match the design.
          "-m-1 p-1",
          isSelected ? "text-icons-primary" : "text-icons-tertiary hover:text-icons-primary",
        )
      : cn(
          SWITCH_TOGGLE_PADDING_CLASSES[SEGMENT_SIZE[size]],
          // The AI appearance renders icon + label together, so space them.
          isAiAppearance(appearance) && SWITCH_TOGGLE_ICON_GAP,
          isSelected
            ? isAiAppearance(appearance)
              ? `text-content-primary shadow-sm ${SWITCH_TOGGLE_AI_SELECTED}`
              : SWITCH_TOGGLE_STATE_CLASSES.selected
            : SWITCH_TOGGLE_STATE_CLASSES.unselected,
        ),
    disabled && "pointer-events-none",
  );
}

/**
 * Footprint of the collapsed toggle per size. A fixed square keeps the collapsed control the same
 * height as the expanded one, whose height comes from the segment padding plus the container's
 * `p-1` — padding the collapsed button alone would fall short of it by that container padding.
 */
const collapsedSizeClasses: Record<SegmentedControlSize, string> = {
  "32": "size-8",
  "40": "size-10",
  "48": "size-12",
};

/**
 * Classes for the single button shown while the control is collapsed. Unlike an expanded segment
 * (which carries asymmetric `px`/`py` padding and so reads slightly wider than tall), the collapsed
 * toggle is forced to a square via a fixed footprint and `aspect-square`, so with `rounded-full` the
 * icon-only control reads as a round button.
 */
function getCollapsedButtonClassName({
  appearance,
  size,
  disabled,
}: {
  appearance: SegmentedControlAppearance;
  size: SegmentedControlSize;
  disabled: boolean;
}) {
  return cn(
    "relative inline-flex aspect-square shrink-0 cursor-pointer items-center justify-center rounded-full",
    "motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-in-out",
    "focus-visible:shadow-focus-ring focus-visible:outline-none",
    appearance === "plain"
      ? // Glyph-only: no pill, just the selected icon colour. The negative margin keeps the visual
        // footprint icon-sized while the padding enlarges the hit target.
        "-m-1 p-1 text-icons-primary"
      : cn(
          collapsedSizeClasses[size],
          // Neutral circle rather than the brand pill: collapsed, the control is a switch
          // affordance, not a preview of the selected segment.
          "bg-surface-secondary text-icons-primary hover:bg-buttons-switch-hover",
        ),
    disabled && "pointer-events-none",
  );
}

/**
 * Watches `rootRef`'s available width against the natural width of the fully expanded control
 * (measured from `measureRef`, an off-screen replica) and returns whether the control should
 * collapse. Comparing available space to a stable off-screen measurement — rather than to the
 * live control, which shrinks when it collapses — avoids the expand/collapse oscillation that a
 * self-referential measurement would cause. Returns `false` until both widths are measurable
 * (SSR, jsdom, or a zero-width layout), so the control renders expanded by default.
 */
function useAutoCollapse(
  rootRef: React.RefObject<HTMLDivElement | null>,
  measureRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
): boolean {
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    if (!enabled) {
      setCollapsed(false);
      return;
    }
    const root = rootRef.current;
    const measure = measureRef.current;
    const parent = root?.parentElement;
    if (!root || !measure || !parent) return;

    const evaluate = () => {
      const available = parent.getBoundingClientRect().width;
      const required = measure.getBoundingClientRect().width;
      // Both unmeasured (SSR/jsdom/zero-width): leave the current state untouched.
      if (available <= 0 || required <= 0) return;
      setCollapsed(required > available);
    };

    evaluate();

    const observer = new ResizeObserver(evaluate);
    observer.observe(parent);
    observer.observe(measure);
    return () => observer.disconnect();
  }, [enabled, rootRef, measureRef]);

  return enabled && collapsed;
}

/**
 * A compact selector for choosing between two or three mutually exclusive
 * options where the choice affects the content immediately below it. Use
 * instead of tabs when the options are more like settings or filters than
 * navigation, such as toggling a list/grid view or a monthly/annual price.
 *
 * Rendered as a `radiogroup` with roving-tabindex keyboard navigation. Supports
 * both controlled and uncontrolled usage. With `collapsible`, the icon-bearing
 * `plain`/`brand` appearances shrink to a single cycling icon toggle when space
 * is tight (rendered as a `group` containing one button).
 *
 * @example
 * ```tsx
 * <SegmentedControl
 *   options={[
 *     { label: "Net", value: "net" },
 *     { label: "Gross", value: "gross" },
 *   ]}
 *   value={amount}
 *   onChange={setAmount}
 *   aria-label="Amount type"
 * />
 * ```
 *
 * @example Icon-only segments (e.g. a list/grid view toggle)
 * ```tsx
 * <SegmentedControl
 *   appearance="plain"
 *   options={[
 *     { label: "List view", value: "list", icon: <ListViewIcon size={16} /> },
 *     { label: "Grid view", value: "grid", icon: <GridViewIcon size={16} /> },
 *   ]}
 *   value={view}
 *   onChange={setView}
 *   aria-label="View"
 * />
 * ```
 *
 * @example Icon + label with the brand-green pill (e.g. the Home/Agent nav switch)
 * ```tsx
 * <SegmentedControl
 *   appearance="brand"
 *   options={[
 *     { label: "Home", value: "home", icon: <HomeIcon size={16} /> },
 *     { label: "Agent", value: "agent", icon: <AIIcon size={16} /> },
 *   ]}
 *   value={mode}
 *   onChange={setMode}
 *   aria-label="Navigation mode"
 * />
 * ```
 *
 * @example Collapses to a cycling icon toggle when the container is too narrow
 * ```tsx
 * <SegmentedControl
 *   appearance="plain"
 *   collapsible
 *   options={[
 *     { label: "List view", value: "list", icon: <ListViewIcon size={16} /> },
 *     { label: "Grid view", value: "grid", icon: <GridViewIcon size={16} /> },
 *   ]}
 *   value={view}
 *   onChange={setView}
 *   aria-label="View"
 * />
 * ```
 *
 * @example A collapsed toggle that shows one switch glyph instead of the selected icon
 * ```tsx
 * <SegmentedControl
 *   appearance="brand"
 *   collapsible
 *   collapsedIcon={<RepeatIcon size={16} />}
 *   options={[
 *     { label: "Home", value: "home", icon: <HomeIcon size={16} /> },
 *     { label: "Agent", value: "agent", icon: <AIIcon size={16} filled /> },
 *   ]}
 *   value={mode}
 *   onChange={setMode}
 *   aria-label="Navigation mode"
 * />
 * ```
 */
export const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    {
      className,
      size = "32",
      variant = "hug",
      appearance = "pill",
      options,
      value: controlledValue,
      defaultValue,
      onChange,
      disabled = false,
      collapsible = false,
      collapsedIcon,
      ...props
    },
    ref,
  ) => {
    warnMissingAccessibleName(props["aria-label"], props["aria-labelledby"]);
    warnMissingOptionAccessibleName(options);
    if (collapsible) warnUnsupportedCollapsible(appearance, options, collapsedIcon !== undefined);

    // Tracks selection for uncontrolled usage; ignored when `value` prop is provided
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? options[0]?.value);
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;
    const anySelected = options.some((o) => o.value === currentValue);
    const buttonRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

    // Collapsing only makes sense for icon-bearing appearances where there is a glyph to show:
    // either a `collapsedIcon` for every state, or an icon on every option. Anything else falls
    // back to the normal expanded control (a dev warning fires above).
    const canCollapse =
      collapsible &&
      (appearance === "plain" || isAiAppearance(appearance)) &&
      (collapsedIcon !== undefined || options.every((option) => option.icon));

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const measureRef = React.useRef<HTMLDivElement | null>(null);
    const setRootRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );
    const isCollapsed = useAutoCollapse(rootRef, measureRef, canCollapse);

    const handleSelect = (optionValue: string) => {
      if (disabled || optionValue === currentValue) return;
      if (!isControlled) {
        setInternalValue(optionValue);
      }
      onChange?.(optionValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
      const nextIndex =
        e.key === "ArrowRight" || e.key === "ArrowDown"
          ? (index + 1) % options.length
          : e.key === "ArrowLeft" || e.key === "ArrowUp"
            ? (index - 1 + options.length) % options.length
            : null;
      if (nextIndex === null) return;
      e.preventDefault();
      const nextOption = options[nextIndex] as SegmentedControlOption;
      handleSelect(nextOption.value);
      buttonRefs.current[nextIndex]?.focus();
    };

    const renderSegment = (option: SegmentedControlOption, index: number) => {
      const isSelected = currentValue === option.value;
      // `brand` shows the label as visible text (with the icon); `pill`/`plain` render
      // icon-only when an icon is given, falling back to the label otherwise.
      const showLabelText = isAiAppearance(appearance) || !option.icon;
      return (
        // biome-ignore lint/a11y/useSemanticElements: native radio inputs only allow Tab-focus on the checked item; buttons with roving tabindex give full keyboard navigation
        <button
          key={option.value}
          ref={(el) => {
            buttonRefs.current[index] = el;
          }}
          type="button"
          role="radio"
          aria-checked={isSelected}
          tabIndex={isSelected || (!anySelected && index === 0) ? 0 : -1}
          disabled={disabled}
          aria-label={showLabelText ? undefined : option.label}
          onClick={() => handleSelect(option.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={getSegmentClassName({ appearance, size, variant, isSelected, disabled })}
        >
          {option.icon && (
            <span className="flex shrink-0 items-center justify-center" aria-hidden="true">
              {option.icon}
            </span>
          )}
          {showLabelText && <span className="min-w-0 truncate">{option.label}</span>}
        </button>
      );
    };

    // Off-screen replica of one segment used only to size the expanded control. Rendered as an
    // inert (disabled + `aria-hidden`) button with no `radio` semantics so it stays out of the
    // accessibility tree and tab order, and always with hug sizing so the replica reflects the
    // natural (uncompressed) width even under a `fill` layout.
    const renderMeasureSegment = (option: SegmentedControlOption) => {
      const showLabelText = isAiAppearance(appearance) || !option.icon;
      return (
        <button
          key={option.value}
          type="button"
          disabled
          aria-hidden="true"
          tabIndex={-1}
          className={getSegmentClassName({
            appearance,
            size,
            variant: "hug",
            isSelected: currentValue === option.value,
            disabled,
          })}
        >
          {option.icon && (
            <span className="flex shrink-0 items-center justify-center" aria-hidden="true">
              {option.icon}
            </span>
          )}
          {showLabelText && <span className="min-w-0 truncate">{option.label}</span>}
        </button>
      );
    };

    // Collapsed: a single button showing the selected option's icon that cycles to the next
    // option on activation, wrapping from the last option back to the first.
    const selectedIndex = options.findIndex((option) => option.value === currentValue);
    const selectedOption = options[selectedIndex] ?? options[0];
    const handleCycle = () => {
      if (disabled || options.length === 0) return;
      const from = selectedIndex < 0 ? 0 : selectedIndex;
      const nextOption = options[(from + 1) % options.length] as SegmentedControlOption;
      handleSelect(nextOption.value);
    };

    return (
      <div
        ref={setRootRef}
        role={isCollapsed ? "group" : "radiogroup"}
        className={cn(
          "relative items-center rounded-full",
          variant === "fill" ? "flex w-full" : "inline-flex",
          isCollapsed
            ? // Collapsed, the toggle itself carries the surface, so the container drops its own
              // chrome and centres the button instead of pinning it to the start of a full-width
              // row — in a narrow rail that offset is the whole width of the column.
              "justify-center"
            : appearance === "plain"
              ? "gap-2"
              : "bg-surface-tertiary p-1",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        {...props}
      >
        {isCollapsed && selectedOption ? (
          <button
            type="button"
            disabled={disabled}
            aria-label={selectedOption.label}
            onClick={handleCycle}
            className={getCollapsedButtonClassName({ appearance, size, disabled })}
          >
            {(collapsedIcon ?? selectedOption.icon) && (
              <span className="flex shrink-0 items-center justify-center" aria-hidden="true">
                {collapsedIcon ?? selectedOption.icon}
              </span>
            )}
          </button>
        ) : (
          options.map((option, index) => renderSegment(option, index))
        )}

        {canCollapse && (
          // Off-screen replica of the fully expanded control. Kept in the DOM (out of flow, hidden
          // from AT and tab order) so its natural width is always measurable, whether the visible
          // control is currently expanded or collapsed.
          <div
            ref={measureRef}
            aria-hidden="true"
            className={cn(
              "pointer-events-none invisible absolute top-0 left-0 -z-10 flex items-center whitespace-nowrap rounded-full",
              appearance === "plain" ? "gap-2" : "bg-surface-tertiary p-1",
            )}
          >
            {options.map((option) => renderMeasureSegment(option))}
          </div>
        )}
      </div>
    );
  },
);

SegmentedControl.displayName = "SegmentedControl";
