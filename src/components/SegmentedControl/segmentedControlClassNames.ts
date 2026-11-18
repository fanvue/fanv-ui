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
export function getSquaredSegmentClassName({
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
