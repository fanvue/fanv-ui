import * as React from "react";
import { cn } from "../../utils/cn";
import { AIIcon } from "../Icons/AIIcon";
import type { IconSize } from "../Icons/types";

/** Height, padding and label typography, matching {@link Button}'s scale. */
export type AiButtonSize = "24" | "32" | "40";

const sizeVariants: Record<AiButtonSize, string> = {
  // At 24 the label steps down to the 12px description scale: the 14px label
  // Button uses at this height leaves the glyph and text crowding a 24px box,
  // since 16px is the smallest authored icon geometry and cannot step down with it.
  "24": "h-6 gap-1 px-2 py-1 typography-description-12px-semibold",
  "32": "h-8 gap-2 px-3 py-[7px] typography-body-small-14px-semibold",
  "40": "h-10 gap-2 px-4 py-2 typography-body-default-16px-semibold",
};

const iconSizeVariants: Record<AiButtonSize, IconSize> = {
  "24": 16,
  "32": 16,
  "40": 24,
};

/**
 * Optical size, applied on top of the authored geometry. Only 16, 24 and 32 have
 * dedicated paths, so the 24 button renders the 16px glyph down at 14 to sit with
 * its 12px label rather than towering over it.
 */
const iconScaleVariants: Record<AiButtonSize, string> = {
  "24": "[&_svg]:size-3.5",
  "32": "",
  "40": "",
};

/** Delay between adjacent letters, in seconds. */
const LETTER_STAGGER = 0.08;

/**
 * Points the bottom sheen at the cursor by writing its x offset, as a percentage
 * of the button's width, straight to the DOM node. Deliberately not React state:
 * this fires every pointer-move frame, and a re-render per frame would both cost
 * more than the paint and leave the glow trailing the cursor.
 */
const trackPointer = (event: React.PointerEvent<HTMLButtonElement>) => {
  const { left, width } = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--fv-ai-x", `${((event.clientX - left) / width) * 100}%`);
};

/** Props for {@link AiButton}. */
export interface AiButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  /** Resting label. Also the accessible name unless `aria-label` is given. */
  label: string;
  /** Label shown while `active`. Falls back to {@link label}. */
  activeLabel?: string;
  /** Swap to {@link activeLabel} and keep the shimmer running. @default false */
  active?: boolean;
  /** @default "32" */
  size?: AiButtonSize;
  /** Replace the leading AI glyph. */
  icon?: React.ReactNode;
  /** @default "button" */
  type?: "button" | "submit" | "reset";
}

/**
 * Renders one `<span>` per character so each can carry its own animation delay.
 * The run is hidden from assistive tech — the button's accessible name comes from
 * its `aria-label`, so a screen reader says "Analyse" rather than spelling it out.
 */
const ShimmerLabel: React.FC<{ text: string }> = ({ text }) => (
  <span aria-hidden="true">
    {Array.from(text).map((character, index) => (
      <span
        key={`${character}-${index}`}
        className={cn(
          "inline-block whitespace-pre text-content-secondary",
          "[animation:fv-ai-letter_2s_ease-in-out_infinite]",
          "group-hover/ai:text-content-primary group-hover/ai:[animation:none]",
          // On focus each letter blows up and settles, then the idle shimmer
          // resumes underneath it — the two animations are sequenced by delay.
          "group-focus-visible/ai:[animation:fv-ai-letter-focus_1s_ease-in-out,fv-ai-letter_1.2s_ease-in-out_infinite_1s]",
          "group-active/ai:text-content-primary group-active/ai:[animation:none]",
          "group-active/ai:[text-shadow:0_0_4px_var(--color-content-primary)]",
          "motion-reduce:[animation:none]",
        )}
        style={{ animationDelay: `${index * LETTER_STAGGER}s` }}
      >
        {character}
      </span>
    ))}
  </span>
);

/**
 * A pill button for AI actions. The label shimmers letter by letter and the glyph
 * flickers at rest; on hover both settle and the green treatment eases in together
 * — outline, rim and a sheen pooling along the bottom edge under the cursor, which
 * follows it across the button. On focus each letter blooms once before the shimmer
 * resumes. The lit rim and sheen come from the `fv-ai-button` utility in `base.css`.
 *
 * It shares {@link Button}'s geometry — `rounded-full`, the same heights and label
 * typography — so it sits alongside one without looking foreign. Both labels are
 * rendered stacked in a single grid cell, so swapping to `active` crossfades
 * without the button changing width.
 *
 * Honours `prefers-reduced-motion`: the shimmer and flicker are dropped and the
 * label renders in its settled state.
 *
 * @example
 * ```tsx
 * <AiButton label="Analyse" activeLabel="Analysing" active={isPending} onClick={run} />
 * ```
 */
export const AiButton = React.forwardRef<HTMLButtonElement, AiButtonProps>(
  (
    {
      label,
      activeLabel,
      active = false,
      size = "32",
      icon,
      type = "button",
      className,
      disabled,
      onPointerMove,
      onPointerLeave,
      ...props
    },
    ref,
  ) => {
    const resolvedActiveLabel = activeLabel ?? label;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-label={props["aria-label"] ?? (active ? resolvedActiveLabel : label)}
        aria-busy={active || undefined}
        onPointerMove={(event) => {
          trackPointer(event);
          onPointerMove?.(event);
        }}
        // Drop back to the utility's centred default, so a keyboard focus after
        // the pointer has left does not light up wherever the cursor last was.
        onPointerLeave={(event) => {
          event.currentTarget.style.removeProperty("--fv-ai-x");
          onPointerLeave?.(event);
        }}
        className={cn(
          "fv-ai-button",
          "group/ai inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full",
          "border border-border-primary bg-background-primary",
          // Matched to the rim and sheen so the whole treatment arrives as one
          // movement — at the old 300ms the outline landed ahead of the glow.
          "transition-[background-color,border-color] duration-[400ms] ease-out",
          "hover:border-brand-primary-default",
          "focus-visible:outline-none",
          "active:border-brand-primary-hover active:bg-brand-primary-muted",
          "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-border-primary",
          sizeVariants[size],
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            "flex shrink-0 items-center text-content-primary",
            iconScaleVariants[size],
            "[filter:drop-shadow(0_0_2px_color-mix(in_srgb,var(--color-content-primary)_60%,transparent))]",
            "[animation:fv-ai-flicker_2s_linear_infinite] [animation-delay:0.5s]",
            // Settles solid on hover, lit green from below like the sheen.
            "group-hover/ai:[animation:none]",
            "group-hover/ai:[filter:drop-shadow(0_0_3px_var(--color-brand-primary-default))_drop-shadow(0_-4px_6px_color-mix(in_srgb,var(--color-content-always-black)_60%,transparent))]",
            "group-focus-visible/ai:[animation-duration:1.2s] group-focus-visible/ai:[animation-delay:0.2s]",
            "motion-reduce:[animation:none]",
          )}
        >
          {icon ?? <AIIcon size={iconSizeVariants[size]} filled />}
        </span>
        {/* Both labels occupy one grid cell so the button keeps the width of the
            longer of the two and the swap never reflows the row around it. */}
        <span className="grid">
          <span
            className={cn(
              "col-start-1 row-start-1 transition-opacity duration-300",
              active ? "opacity-0" : "opacity-100",
            )}
          >
            <ShimmerLabel text={label} />
          </span>
          <span
            className={cn(
              "col-start-1 row-start-1 transition-opacity duration-300",
              active ? "opacity-100" : "opacity-0",
            )}
          >
            <ShimmerLabel text={resolvedActiveLabel} />
          </span>
        </span>
      </button>
    );
  },
);

AiButton.displayName = "AiButton";
