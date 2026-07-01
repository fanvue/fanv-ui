import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";

/** Visual style variant of the link. */
export type LinkVariant = "primary" | "brand";

/** Text size of the link in pixels. */
export type LinkSize = "16" | "14";

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
};

const VARIANT_CLASSES: Record<LinkVariant, string> = {
  primary: "text-buttons-link-primary-default hover:text-buttons-link-primary-hover",
  brand: "text-buttons-link-brand-default hover:text-buttons-link-brand-hover",
};

const ICON_WRAPPER = "flex shrink-0 items-center justify-center [&>svg]:size-4";

/**
 * An inline text link for navigating to a related page or section without
 * using a button. Use `primary` for standard navigation and `brand` for the
 * Fanvue green accent on calls to action within content.
 *
 * Renders an underlined `<a>` by default. Pass `asChild` to compose with a
 * router link (e.g. Next.js `Link`). When rendering without a visible label,
 * provide an `aria-label`.
 *
 * @example
 * ```tsx
 * <Link href="/pricing" variant="brand">See our plans</Link>
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
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "a";

    const textClasses = cn(
      SIZE_CLASSES[size],
      "underline decoration-from-font decoration-solid [text-underline-position:from-font]",
    );

    const disabledProps = disabled ? { "aria-disabled": true, tabIndex: -1 } : {};

    return (
      <Comp
        ref={ref}
        href={disabled ? undefined : href}
        className={cn(
          "inline-flex items-center gap-2 rounded-2xs transition-colors",
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
        {asChild ? (
          children
        ) : (
          <>
            {leftIcon && (
              <span className={ICON_WRAPPER} aria-hidden="true">
                {leftIcon}
              </span>
            )}
            <span className={textClasses}>{children}</span>
            {rightIcon && (
              <span className={ICON_WRAPPER} aria-hidden="true">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </Comp>
    );
  },
);

Link.displayName = "Link";
