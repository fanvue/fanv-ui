import { cn } from "../../utils/cn";
import type {
  SegmentedControlAppearance,
  SegmentedControlSize,
  SegmentedControlVariant,
} from "./SegmentedControl";

/**
 * Track height, segment padding and typography per size for the `squared` appearance. The track
 * has a fixed height and its segments fill it, so the control stays level with a button of the
 * same `size` whatever the label's line height. Segments add medium weight and tabular figures on
 * top of this: the labels are usually short numeric ranges, and a segment must not change width
 * when its digits do.
 */
const squaredSizeClasses: Record<SegmentedControlSize, { track: string; segment: string }> = {
  "32": { track: "h-8", segment: "px-3 typography-description-12px-semibold" },
  "40": { track: "h-10", segment: "px-4 typography-body-small-14px-semibold" },
  "48": { track: "h-12", segment: "px-5 typography-body-default-16px-semibold" },
};

/**
 * Classes for one segment of the `squared` appearance: a squared button that fills the track,
 * raised when selected and muted otherwise. Its focus ring is a shadow, so the outline is hidden
 * rather than removed: forced-colors modes drop shadows and draw the outline instead.
 */
function getSquaredSegmentClassName({
  size,
  variant,
  isSelected,
  disabled,
}: {
  size: SegmentedControlSize;
  variant: SegmentedControlVariant;
  isSelected: boolean;
  disabled: boolean;
}) {
  return cn(
    "relative inline-flex h-full min-w-0 cursor-pointer items-center justify-center rounded-2xs",
    "motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-in-out",
    "focus-visible:shadow-focus-ring focus-visible:outline-hidden",
    variant === "fill" ? "flex-1" : "shrink-0",
    squaredSizeClasses[size].segment,
    "font-medium tabular-nums",
    isSelected
      ? "bg-background-primary text-content-primary shadow-sm ring-1 ring-border-primary dark:bg-surface-secondary"
      : "text-content-secondary hover:bg-buttons-switch-hover hover:text-content-primary",
    disabled && "pointer-events-none",
  );
}

/**
 * Padding and typography per size for the `pill` and `brand` appearances. Combined with the
 * container's `p-1` these hit the 32/40/48px heights.
 */
const sizeClasses: Record<SegmentedControlSize, string> = {
  "32": "px-2 py-1 typography-description-12px-semibold",
  "40": "px-3 py-1.75 typography-body-small-14px-semibold",
  "48": "px-4 py-2 typography-body-default-16px-semibold",
};

/**
 * Classes for one segment.
 *
 * - `squared` has its own set, see {@link getSquaredSegmentClassName}.
 * - `plain` is glyph-only: padding with a matching negative margin enlarges the hit target
 *   without changing the visual footprint.
 * - `brand` renders icon and label together, so it spaces them.
 * - A selected segment takes the neutral pill, whose tokens invert with the theme: a white pill
 *   on dark and a black one on light. The exception is the `brand` segment marked `ai`, which
 *   takes the translucent AI fill and the AI gradient stroke. That treatment is scoped to the
 *   marked segment rather than to whatever is selected, so a brand stroke never lands on a
 *   segment that should read as plain.
 */
export function getSegmentClassName({
  appearance,
  size,
  variant,
  isSelected,
  isAiSegment,
  disabled,
}: {
  appearance: SegmentedControlAppearance;
  size: SegmentedControlSize;
  variant: SegmentedControlVariant;
  isSelected: boolean;
  isAiSegment: boolean;
  disabled: boolean;
}) {
  if (appearance === "squared") {
    return getSquaredSegmentClassName({ size, variant, isSelected, disabled });
  }
  return cn(
    "relative inline-flex min-w-0 cursor-pointer items-center justify-center rounded-full",
    "motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-in-out",
    "focus-visible:shadow-focus-ring focus-visible:outline-none",
    variant === "fill" ? "flex-1" : "shrink-0",
    appearance === "plain"
      ? cn(
          "-m-1 p-1",
          isSelected ? "text-icons-primary" : "text-icons-tertiary hover:text-icons-primary",
        )
      : cn(
          sizeClasses[size],
          appearance === "brand" && "gap-1.5",
          isSelected
            ? appearance === "brand" && isAiSegment
              ? "fv-ai-stroke bg-buttons-ai-default text-content-primary"
              : "bg-buttons-primary-default text-content-primary-inverted shadow-sm"
            : "text-content-primary hover:bg-buttons-switch-hover",
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
 *
 * `plain` stays glyph-only: no pill, just the selected icon colour, with the same hit-target
 * padding and negative margin as its segments. The other appearances take a neutral circle rather
 * than the brand pill: collapsed, the control is a switch affordance, not a preview of the selected
 * segment.
 */
export function getCollapsedButtonClassName({
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
      ? "-m-1 p-1 text-icons-primary"
      : cn(
          collapsedSizeClasses[size],
          "bg-surface-secondary text-icons-primary hover:bg-buttons-switch-hover",
        ),
    disabled && "pointer-events-none",
  );
}

/**
 * The expanded container's chrome per appearance: a gap between bare glyphs for `plain`, the
 * bordered squared track for `squared`, and the muted pill track for the rest.
 */
function getTrackClassName(appearance: SegmentedControlAppearance, size: SegmentedControlSize) {
  if (appearance === "plain") return "gap-2";
  if (appearance === "squared") {
    return cn(
      "gap-0.5 border border-border-primary bg-surface-secondary p-0.5 dark:bg-background-secondary",
      squaredSizeClasses[size].track,
    );
  }
  return "bg-surface-tertiary p-1";
}

/**
 * Classes for the control's root. Collapsed, the toggle itself carries the surface, so the root
 * drops its own chrome and centres the button instead of pinning it to the start of a full-width
 * row: in a narrow rail that offset is the whole width of the column.
 */
export function getRootClassName({
  appearance,
  variant,
  size,
  isCollapsed,
  disabled,
}: {
  appearance: SegmentedControlAppearance;
  variant: SegmentedControlVariant;
  size: SegmentedControlSize;
  isCollapsed: boolean;
  disabled: boolean;
}) {
  return cn(
    "relative items-center",
    appearance === "squared" ? "rounded-xs" : "rounded-full",
    variant === "fill" ? "flex w-full" : "inline-flex",
    isCollapsed ? "justify-center" : getTrackClassName(appearance, size),
    disabled && "cursor-not-allowed opacity-50",
  );
}
