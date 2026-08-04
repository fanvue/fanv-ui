import * as React from "react";
import { cn } from "../../utils/cn";

/** The three treatments the EU disclosure spec defines. */
export type AiDisclosureBadgeTone = "dark" | "light" | "transparent";

/**
 * Theme-fixed rather than `currentColor`: the badge is a regulatory marker
 * overlaid on arbitrary creator media, so it has to stay legible whatever
 * surface it lands on. That is also why it is not an icon — it cannot take part
 * in the `currentColor` contract the icon set relies on, and `tone` has to say
 * what is behind the mark.
 */
const toneVariants: Record<AiDisclosureBadgeTone, { disc: string; glyph: string }> = {
  dark: { disc: "fill-buttons-always-black-default", glyph: "fill-content-always-white" },
  light: { disc: "fill-buttons-always-white-default", glyph: "fill-content-always-black" },
  transparent: { disc: "fill-background-overlay-default", glyph: "fill-content-always-white" },
};

/** Props for {@link AiDisclosureBadge}. */
export interface AiDisclosureBadgeProps extends React.SVGAttributes<SVGSVGElement> {
  /** Colour of the mark itself, chosen for the media behind it. @default "dark" */
  tone?: AiDisclosureBadgeTone;
}

/**
 * EU AI-disclosure badge: an "AI" wordmark on a filled disc, for overlaying on
 * AI-generated or AI-modified media. Ships at 16px and scales via `className`.
 *
 * Decorative by default. For standalone use pass `aria-hidden={false}` with
 * `role="img"` and an `aria-label`. For the form that carries wording, use
 * `AiDisclosureLabel`.
 *
 * @example
 * ```tsx
 * <AiDisclosureBadge tone="light" className="size-6" />
 * ```
 */
export const AiDisclosureBadge = React.forwardRef<SVGSVGElement, AiDisclosureBadgeProps>(
  ({ className, tone = "dark", ...props }, ref) => {
    const fill = toneVariants[tone];

    return (
      <svg
        ref={ref}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        className={cn("size-4", className)}
        {...props}
      >
        <path
          className={fill.disc}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.677.835a7.165 7.165 0 1 1 0 14.33 7.165 7.165 0 0 1 0-14.33"
        />
        <path
          className={fill.glyph}
          d="M3.708 10.756a.16.16 0 0 1-.114-.051.16.16 0 0 1-.052-.115q0-.04.008-.07l1.856-5.071a.3.3 0 0 1 .1-.154.3.3 0 0 1 .208-.067h1.17q.133 0 .209.067a.3.3 0 0 1 .098.154l1.849 5.07q.015.032.015.071 0 .063-.051.115a.17.17 0 0 1-.122.051H7.91q-.119 0-.177-.06a.3.3 0 0 1-.075-.106l-.309-.806H5.241l-.3.806a.3.3 0 0 1-.071.107q-.055.06-.19.059h-.97m1.856-2.109h1.47L6.29 6.562zm4.31 2.109a.2.2 0 0 1-.142-.055.2.2 0 0 1-.055-.143V5.425q0-.087.055-.142a.2.2 0 0 1 .142-.056h1.059q.087 0 .142.056a.2.2 0 0 1 .055.142v5.133a.2.2 0 0 1-.055.143.2.2 0 0 1-.142.055z"
        />
      </svg>
    );
  },
);

AiDisclosureBadge.displayName = "AiDisclosureBadge";
