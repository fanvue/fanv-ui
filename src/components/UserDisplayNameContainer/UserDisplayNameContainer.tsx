import * as React from "react";
import { cn } from "../../utils/cn";
import { VerifiedIcon } from "../Icons/VerifiedIcon";
import { ProfileOnlineStatus } from "../ProfileOnlineStatus/ProfileOnlineStatus";

const variantClassMap: Record<string, string> = {
  body2SemiBold: "typography-body-small-14px-semibold",
  body1SemiBold: "typography-body-default-16px-semibold",
  subtitle1: "text-lg font-semibold leading-[150%]",
  heading4: "typography-header-heading-xs",
  captionRegular: "typography-description-12px-regular",
};

/** Typography scale options for {@link UserDisplayNameContainer}. */
export type UserDisplayNameVariant =
  | "body2SemiBold"
  | "body1SemiBold"
  | "subtitle1"
  | "heading4"
  | "captionRegular";

export interface UserDisplayNameContainerProps extends React.HTMLAttributes<HTMLElement> {
  /** Render an ambassador badge after the name. */
  ambassador?: boolean;
  /** Accessible label for the ambassador badge. @default "Ambassador" */
  ambassadorLabel?: string;
  /** Text colour override for rendering on dark surfaces. */
  color?: "white";
  /** HTML element used for the root wrapper. @default "span" */
  component?: "span" | "h1" | "h2" | "h3" | "p" | "div";
  /** Maximum width of the root wrapper. */
  maxWidth?: string | number;
  /** Top margin as a spacing multiplier, where `1` equals 8px. */
  mt?: number;
  /** Truncate the display name on a single line. @default true */
  noWrap?: boolean;
  /** Accessible label for the online-status indicator. @default "Online" */
  onlineLabel?: string;
  /** Top padding as a spacing multiplier, where `1` equals 8px. */
  pt?: number;
  /** Render the inline online-status indicator after the name. @default false */
  showOnlineStatus?: boolean;
  /** Horizontal text alignment for the root wrapper. @default "left" */
  textAlign?: "left" | "center" | "right";
  /** Typography style for the display name. @default "body2SemiBold" */
  variant?: UserDisplayNameVariant;
  /** Render a verified badge after the name (ignored when `ambassador` is set). */
  verified?: boolean;
  /** Accessible label for the verified badge. @default "Verified" */
  verifiedLabel?: string;
}

/**
 * Renders a user's display name with the design-system typography scale, with
 * optional ambassador/verified badges and an online-status indicator.
 *
 * Defaults render a truncated `<span>` using the `body2SemiBold` typography
 * variant.
 *
 * @example
 * ```tsx
 * <UserDisplayNameContainer>Jane Doe</UserDisplayNameContainer>
 * ```
 */
export const UserDisplayNameContainer = React.forwardRef<
  HTMLElement,
  UserDisplayNameContainerProps
>(
  (
    {
      ambassador,
      ambassadorLabel = "Ambassador",
      children,
      className,
      color,
      component = "span",
      maxWidth,
      mt,
      noWrap = true,
      onlineLabel = "Online",
      pt,
      showOnlineStatus,
      style,
      textAlign = "left",
      variant,
      verified,
      verifiedLabel = "Verified",
      ...props
    },
    ref,
  ) => {
    const Component = component as React.ElementType;

    const typographyClass =
      variantClassMap[variant ?? "body2SemiBold"] ?? "typography-body-small-14px-semibold";

    // `ambassador` takes precedence over `verified` when both are set.
    const badge = ambassador
      ? { label: ambassadorLabel, tint: "text-icons-brand-green" }
      : verified
        ? { label: verifiedLabel, tint: "text-content-primary" }
        : null;

    return (
      <Component
        ref={ref}
        className={cn(
          "inline-flex max-w-full items-center",
          color === "white" && "text-white",
          className,
        )}
        style={{
          ...(maxWidth && { maxWidth }),
          textAlign,
          ...(mt != null && { marginTop: mt * 8 }),
          ...(pt != null && { paddingTop: pt * 8 }),
          ...style,
        }}
        {...props}
      >
        {/* Only the name shrinks/truncates; badges and status stay visible on the same line. */}
        <span className={cn("min-w-0", typographyClass, noWrap && "truncate")}>{children}</span>
        {badge && (
          <span
            role="img"
            aria-label={badge.label}
            className={cn("ml-2 inline-flex shrink-0 items-center", badge.tint)}
          >
            <VerifiedIcon className="size-4" />
          </span>
        )}
        {showOnlineStatus && <ProfileOnlineStatus label={onlineLabel} className="shrink-0" />}
      </Component>
    );
  },
);

UserDisplayNameContainer.displayName = "UserDisplayNameContainer";
