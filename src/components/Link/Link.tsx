import { Slot, Slottable } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";
import {
  renderContainedText,
  renderSlottedText,
  renderTextChildren,
} from "../../utils/renderTextChildren";

/**
 * Visual style variant of the link. `inherit` takes the colour of the
 * surrounding text, for links inside tooltips, alerts and other copy that sets
 * its own colour. `subtle` is a quiet "go there" link for card headers, footers
 * and toolbars: secondary text that turns primary and underlines on hover. With
 * an icon it is at least 32px tall, so it sits level with a 32px control, and a
 * `rightIcon` moves 2px towards the destination on hover unless the user asks
 * for reduced motion.
 */
export type LinkVariant = "primary" | "brand" | "inherit" | "subtle";

/**
 * Text size of the link in pixels. `inherit` keeps the font size and weight of
 * the surrounding text, for a link that sits inside a sentence. Without icons it
 * renders inline, so a long link wraps with the sentence.
 */
export type LinkSize = "16" | "14" | "inherit";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Visual style variant of the link. @default "primary" */
  variant?: LinkVariant;
  /** Text size of the link in pixels. @default "16" */
  size?: LinkSize;
  /** When `true`, greys the link out and blocks interaction. @default false */
  disabled?: boolean;
  /** Icon element displayed before the label. */
  leftIcon?: React.ReactNode;
  /** Icon element displayed after the label. */
  rightIcon?: React.ReactNode;
  /** Merge props onto a child element instead of rendering an `<a>`. @default false */
  asChild?: boolean;
}

const SIZE_CLASSES: Record<LinkSize, string> = {
  "16": "typography-body-default-16px-semibold",
  "14": "typography-body-small-14px-semibold",
  inherit: "",
};

const VARIANT_CLASSES: Record<LinkVariant, string> = {
  primary: "text-buttons-link-primary-default hover:text-buttons-link-primary-hover",
  brand: "text-buttons-link-brand-default hover:text-buttons-link-brand-hover",
  inherit: "text-inherit hover:opacity-80",
  subtle: "text-content-secondary hover:text-content-primary",
};

const ICON_WRAPPER = "flex shrink-0 items-center justify-center [&>svg]:size-4";

const UNDERLINE_STYLE = "decoration-from-font decoration-solid [text-underline-position:from-font]";

/**
 * Underline classes for the label. Every variant is underlined at rest except
 * `subtle`, which underlines on hover only. The label is the root itself under
 * `asChild` and a child `<span>` otherwise, so the hover is read from the root
 * in both cases.
 */
function getUnderlineClassName(variant: LinkVariant, asChild: boolean) {
  if (variant !== "subtle") return cn("underline", UNDERLINE_STYLE);
  return cn(
    "no-underline underline-offset-4",
    asChild ? "hover:underline" : "group-hover/link:underline",
    UNDERLINE_STYLE,
  );
}

/**
 * Layout classes for the root: inline for a link inside a sentence, and a flex
 * row otherwise. `subtle` tightens the gap, and with an icon takes the minimum
 * height and side padding of a 32px control, growing if its label wraps. A `subtle` root is always the hover
 * group its label and icon read from, in both layouts.
 */
function getLayoutClassName(variant: LinkVariant, size: LinkSize, hasIcon: boolean) {
  const hoverGroup = variant === "subtle" && "group/link";
  if (size === "inherit" && !hasIcon) return cn("inline", hoverGroup);
  if (variant !== "subtle") return "inline-flex items-center gap-2";
  return cn(hoverGroup, "inline-flex items-center gap-1", hasIcon && "min-h-8 px-1");
}

/**
 * An inline text link for navigating to a related page or section without
 * using a button. Use `primary` for standard navigation and `brand` for the
 * Fanvue green accent on calls to action within content. Use `inherit` with
 * `size="inherit"` for a link inside copy that sets its own colour and type,
 * such as a tooltip. Use `subtle` for a quiet link beside controls, such as
 * "Open full page" in a panel footer.
 *
 * Renders an underlined `<a>` by default. Pass `asChild` to compose with a
 * router link (e.g. Next.js `Link`). When rendering without a visible label,
 * provide an `aria-label`.
 *
 * @example
 * ```tsx
 * <Link href="/pricing" variant="brand">See our plans</Link>
 * ```
 *
 * @example A quiet link with an arrow, level with a 32px control
 * ```tsx
 * <Link href="/campaigns/1" variant="subtle" size="14" rightIcon={<ArrowRightIcon />}>
 *   Open full page
 * </Link>
 * ```
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      variant = "primary",
      size = "16",
      disabled = false,
      leftIcon,
      rightIcon,
      asChild = false,
      children,
      href,
      onClick,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "a";

    const textClasses = cn(SIZE_CLASSES[size], getUnderlineClassName(variant, asChild));

    const disabledProps = disabled ? { "aria-disabled": true, tabIndex: -1 } : {};

    // Radix Slot lets the child's own props win when merging, so a disabled
    // `asChild` link would keep the child's navigable href. Strip it from the
    // child (anchors only) and block default navigation to honor `disabled`.
    const slotChild =
      disabled && React.isValidElement<{ href?: string }>(children) && children.type === "a"
        ? React.cloneElement(children, { href: undefined })
        : children;

    const handleClick = disabled
      ? (event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault()
      : onClick;

    const leftIconNode = leftIcon ? (
      <span className={ICON_WRAPPER} aria-hidden="true">
        {renderContainedText(leftIcon)}
      </span>
    ) : (
      renderTextChildren(leftIcon)
    );
    const rightIconNode = rightIcon ? (
      <span
        className={cn(
          ICON_WRAPPER,
          variant === "subtle" &&
            "motion-safe:transition-transform motion-safe:group-hover/link:translate-x-0.5",
        )}
        aria-hidden="true"
      >
        {renderContainedText(rightIcon)}
      </span>
    ) : (
      renderTextChildren(rightIcon)
    );

    return (
      <Comp
        ref={ref}
        href={disabled ? undefined : href}
        onClick={handleClick}
        className={cn(
          getLayoutClassName(variant, size, Boolean(leftIcon || rightIcon)),
          "rounded-2xs",
          variant === "inherit" ? "transition-opacity" : "transition-colors",
          "focus-visible:shadow-focus-ring focus-visible:outline-none",
          disabled
            ? "pointer-events-none cursor-not-allowed text-content-disabled"
            : VARIANT_CLASSES[variant],
          asChild && textClasses,
          className,
        )}
        {...(asChild ? {} : { "data-testid": "link" })}
        {...disabledProps}
        {...props}
      >
        {leftIconNode}
        {asChild ? (
          <Slottable>{renderSlottedText(slotChild)}</Slottable>
        ) : (
          <span className={textClasses}>{renderContainedText(children)}</span>
        )}
        {rightIconNode}
      </Comp>
    );
  },
);

Link.displayName = "Link";
