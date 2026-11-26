/**
 * Focus treatment for a text-input container under the v2 palette: a 1px
 * `Border/Selected` stroke in place of the inset focus ring. Shared by TextField,
 * TextArea, PhoneField and Autocomplete so the four containers cannot drift.
 */
export const INPUT_FIELD_V2_FOCUS_CLASSES =
  "theme-v2:has-focus-visible:border-border-selected theme-v2:has-focus-visible:after:shadow-none";

/**
 * Disabled treatment for a text-input container. The current palette fades the
 * field to 50% opacity; the v2 palette takes the Figma Disabled state instead: no
 * border, `Inputs/Inputs Disabled` fill, full opacity.
 */
export const INPUT_FIELD_DISABLED_CLASSES =
  "theme-v2:border-transparent theme-v2:bg-inputs-inputs-disabled opacity-50 theme-v2:opacity-100";
