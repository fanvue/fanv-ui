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
 * Explicit heights, so a control lands on its Figma height rather than inheriting
 * whatever the label's line box happens to round to. Both components apply these:
 * nothing stretches a segment, so without them a segment's height would depend on
 * the 12/14/16px sizes mapping to 16/18/24px line heights, which is exactly the kind
 * of implicit dependency a token remap can break.
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
  selected: "bg-buttons-switch-active text-content-primary-inverted shadow-sm",
  /** `State=Inactive`, rising to `Buttons/Switch/Hover` on pointer-over. */
  unselected: "text-content-primary hover:bg-buttons-switch-hover",
  /** `State=Disabled` — no fill, `Content/Disabled` label. */
  disabled: "text-content-disabled",
} as const;

/**
 * `Type=AI, State=Active` treatment, from Figma node `16800:9469`: the translucent
 * `Buttons/AI/Default` fill under a 1px stroke whose three-stop gradient runs
 * `Stroke-End → Stroke-Start → Stroke-End` horizontally.
 *
 * The stroke is a masked overlay rather than a border because Figma draws it with
 * `strokeAlign: INSIDE` — a real border would add 2px to the hug width and push every
 * size past its Figma dimensions.
 *
 * Written as one literal string because Tailwind scans source text; composing it from
 * parts stops the utilities being generated at all.
 *
 * Shared with `SegmentedControl`, whose `ai` appearance is the same pill.
 */
export const SWITCH_TOGGLE_AI_SELECTED =
  "relative bg-buttons-ai-default before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:p-px before:[background:linear-gradient(90deg,var(--color-buttons-ai-stroke-end)_0%,var(--color-buttons-ai-stroke-start)_50%,var(--color-buttons-ai-stroke-end)_100%)] before:[mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)]";

/** Gap between a leading or trailing glyph and the label, `Spacing/Global/xs`. */
export const SWITCH_TOGGLE_ICON_GAP = "gap-2";
