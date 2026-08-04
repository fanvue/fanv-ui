import * as React from "react";
import { cn } from "../../utils/cn";
/** The three treatments the EU disclosure spec defines. */
export type AiDisclosureLabelTone = "dark" | "light" | "transparent";

/** Overall pill height in px. */
export type AiDisclosureLabelSize = "12" | "16" | "20";

const toneVariants: Record<AiDisclosureLabelTone, string> = {
  dark: "bg-buttons-always-black-default text-content-always-white",
  light: "bg-buttons-always-white-default text-content-always-black",
  transparent: "bg-background-overlay-default text-content-always-white",
};

/** Padding and gap are proportional to the pill height, taken from the Figma mark. */
const sizeVariants: Record<AiDisclosureLabelSize, string> = {
  "12": "h-3 gap-1 px-[5px]",
  "16": "h-4 gap-1.5 px-[7px]",
  "20": "h-5 gap-[7px] px-[9px]",
};

/**
 * Tracking has to sit on each run rather than the pill: as an `em` it resolves
 * against the element's own font size, so putting it on the pill would freeze it
 * at one absolute value for every size and anchor it to whatever font size the
 * host happens to inherit.
 */
const TRACKING = "tracking-[0.1em]";

/**
 * The "AI" run sits at roughly two thirds of the pill height and the wording at
 * just over half. Both land below the 12px floor of the typography scale, so
 * they are spelled out in px, over a base utility that supplies the family.
 */
const markSizeVariants: Record<AiDisclosureLabelSize, string> = {
  "12": "text-[8px]",
  "16": "text-[11px]",
  "20": "text-[13px]",
};

const labelSizeVariants: Record<AiDisclosureLabelSize, string> = {
  "12": "text-[6px]",
  "16": "text-[8px]",
  "20": "text-[10px]",
};

/** Props for {@link AiDisclosureLabel}. */
export interface AiDisclosureLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Wording after the "AI" mark, e.g. a translated "Generated" or "Modified". */
  label: string;
  /** @default "20" */
  size?: AiDisclosureLabelSize;
  /** Colour of the mark itself, chosen for the media behind it. @default "dark" */
  tone?: AiDisclosureLabelTone;
}

/**
 * EU AI-disclosure label: an "AI" mark followed by wording, on a filled pill,
 * for marking AI-generated or AI-modified media.
 *
 * The wording is live text rather than baked artwork, so it translates and
 * scales with the reader's font settings. It is uppercased in CSS, which keeps
 * the mark consistent without forcing callers to pass shouting strings.
 *
 * For the compact disc form with no wording, use `AiDisclosureBadge`.
 *
 * @example
 * ```tsx
 * <AiDisclosureLabel label={t("ai.modified")} tone="transparent" />
 * ```
 */
export const AiDisclosureLabel = React.forwardRef<HTMLSpanElement, AiDisclosureLabelProps>(
  ({ className, label, size = "20", tone = "dark", ...props }, ref) => (
    <span
      ref={ref}
      data-testid="ai-disclosure-label"
      // "AI" and the wording are separate elements with only a flex gap
      // between them, so without a name of its own the pill is announced as
      // the single token "AIGenerated".
      role="img"
      aria-label={`AI ${label}`}
      className={cn(
        "inline-flex select-none items-center justify-center whitespace-nowrap rounded-full",
        // Carries `font-family: Inter` and weight 600; the per-run `text-[Npx]`
        // below overrides its size, as `Count` does for its sub-12px steps.
        "typography-description-12px-semibold uppercase leading-none",
        sizeVariants[size],
        toneVariants[tone],
        className,
      )}
      {...props}
    >
      <span className={cn(TRACKING, markSizeVariants[size])}>AI</span>
      <span className={cn(TRACKING, labelSizeVariants[size])}>{label}</span>
    </span>
  ),
);

AiDisclosureLabel.displayName = "AiDisclosureLabel";
