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
  /**
   * Replaces the label body. Use when the label is not plain text — a rotating
   * {@link CyclingText}, for instance. {@link label} stays required and is still
   * the accessible name, so a screen reader is unaffected. Bypasses the
   * per-character shimmer and the `active`/`activeLabel` crossfade, both of which
   * need a string.
   */
  children?: React.ReactNode;
}

/**
 * Renders one `<span>` per character so each can carry its own animation delay.
 * The run is hidden from assistive tech — the button's accessible name comes from
 * its `aria-label`, so a screen reader says "Analyse" rather than spelling it out.
 */
const ShimmerLabel: React.FC<{ text: string; disabled?: boolean }> = ({ text, disabled }) => (
  <span aria-hidden="true">
    {Array.from(text).map((character, index) => (
      <span
        key={`${character}-${index}`}
        className={cn(
          "inline-block whitespace-pre text-content-always-white/80",
          // Gated in JS rather than with a `group-disabled/ai:` override, because
          // that would rely on the generated rule ordering to beat `group-hover`.
          // A faded control that still shimmers and still lights up green under the
          // cursor reads as busy rather than unavailable.
          !disabled && [
            "[animation:fv-ai-letter_2s_ease-in-out_infinite]",
            "group-hover/ai:text-content-always-white group-hover/ai:[animation:none]",
            // On focus each letter blows up and settles, then the idle shimmer
            // resumes underneath it — the two animations are sequenced by delay.
            "group-focus-visible/ai:[animation:fv-ai-letter-focus_1s_ease-in-out,fv-ai-letter_1.2s_ease-in-out_infinite_1s]",
            "group-active/ai:text-content-always-white group-active/ai:[animation:none]",
            "group-active/ai:[text-shadow:0_0_4px_var(--color-content-always-white)]",
          ],
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
 * A pill button for AI actions. The surface comes from the `fv-ai-surface` utility
 * in `base.css`: in light mode the same opaque diagonal gradient `Button`'s `ai`
 * variant paints, in dark the translucent `Buttons/AI/Default` fill with a masked
 * `Buttons/AI/Stroke-*` ring. Either way the pill is dark, which is why every
 * content colour here is `content-always-white` rather than theme-aware.
 *
 * The label shimmers letter by letter from 80% white to full, and the glyph flickers
 * at rest; on hover both settle, the fill steps up, and a sheen pools along the
 * bottom edge under the cursor and follows it across the button. On focus each
 * letter blooms once before the shimmer resumes.
 *
 * It carries no `border-*` class of its own — `fv-ai-surface` owns the ring, and a
 * second border would double it.
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
      children,
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
          "fv-ai-surface fv-ai-button",
          "group/ai inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full",
          // Not `transition-colors`: the light fill is a gradient, and only the
          // two registered stop properties can carry it. Dark's fill is a plain
          // background-color, so both are listed.
          "transition-[--fv-ai-fill-start,--fv-ai-fill-end,background-color] duration-[400ms] ease-out",
          "hover:bg-buttons-ai-hover",
          "focus-visible:shadow-focus-ring focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-60",
          sizeVariants[size],
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            "flex shrink-0 items-center text-content-always-white",
            iconScaleVariants[size],
            "[filter:drop-shadow(0_0_2px_color-mix(in_srgb,var(--color-content-always-white)_60%,transparent))]",
            // Same reasoning as the letters: no flicker and no green lift once the
            // button is unavailable.
            !disabled && [
              "[animation:fv-ai-flicker_2s_linear_infinite] [animation-delay:0.5s]",
              // Settles solid on hover, lit green from below like the sheen.
              "group-hover/ai:[animation:none]",
              "group-hover/ai:[filter:drop-shadow(0_0_3px_var(--color-brand-primary-default))_drop-shadow(0_-4px_6px_color-mix(in_srgb,var(--color-content-always-black)_60%,transparent))]",
              "group-focus-visible/ai:[animation-duration:1.2s] group-focus-visible/ai:[animation-delay:0.2s]",
            ],
            "motion-reduce:[animation:none]",
          )}
        >
          {icon ?? <AIIcon size={iconSizeVariants[size]} filled />}
        </span>
        {/* Both labels occupy one grid cell so the button keeps the width of the
            longer of the two and the swap never reflows the row around it. */}
        {children ?? (
          <span className="grid">
            <span
              className={cn(
                "col-start-1 row-start-1 transition-opacity duration-300",
                active ? "opacity-0" : "opacity-100",
              )}
            >
              <ShimmerLabel text={label} disabled={disabled} />
            </span>
            <span
              className={cn(
                "col-start-1 row-start-1 transition-opacity duration-300",
                active ? "opacity-100" : "opacity-0",
              )}
            >
              <ShimmerLabel text={resolvedActiveLabel} disabled={disabled} />
            </span>
          </span>
        )}
      </button>
    );
  },
);

AiButton.displayName = "AiButton";
