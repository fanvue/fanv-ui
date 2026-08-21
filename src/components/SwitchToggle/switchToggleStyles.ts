/** Height of the toggle in pixels. Matches {@link Button}'s scale. */
export type SwitchToggleSize = "24" | "32" | "40";

/**
 * Horizontal padding and label typography per size, from Figma node `16800:9469`:
 * `Spacing/Global` xs/sm/md against the 12/14/16px semibold ramp.
 *
 * Shared with `SegmentedControl`, whose segments are instances of this same component
 * in the Figma file. Its sizes sit one step above these because the segmented
 * container adds 4px of padding above and below the segment — see `SEGMENT_SIZE`
 * there.
 */
export const SWITCH_TOGGLE_PADDING_CLASSES: Record<SwitchToggleSize, string> = {
  "24": "px-2 py-1 typography-description-12px-semibold",
  "32": "px-3 py-[7px] typography-body-small-14px-semibold",
  "40": "px-4 py-2 typography-body-default-16px-semibold",
};

/**
 * Explicit heights, so a standalone toggle lands on its Figma height rather than
 * inheriting whatever the label's line box rounds to. `SegmentedControl` does not
 * apply these: its segment height comes from the container.
 */
export const SWITCH_TOGGLE_HEIGHT_CLASSES: Record<SwitchToggleSize, string> = {
  "24": "h-6",
  "32": "h-8",
  "40": "h-10",
};

/**
 * Fill and label colour per state, from the node's `State` axis. Shared so a segment
 * and a standalone toggle cannot drift apart.
 */
export const SWITCH_TOGGLE_STATE_CLASSES = {
  /** `State=Active` — `Buttons/Switch/Active` fill under an inverted label. */
  selected: "bg-buttons-primary-default text-content-primary-inverted shadow-sm",
  /** `State=Inactive`, rising to `Buttons/Switch/Hover` on pointer-over. */
  unselected: "text-content-primary hover:bg-buttons-switch-hover",
  /** `State=Disabled` — no fill, `Content/Disabled` label. */
  disabled: "text-content-disabled",
} as const;
