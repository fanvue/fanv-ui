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
  color?: "white";
  component?: "span" | "h1" | "h2" | "h3" | "p" | "div";
  maxWidth?: string | number;
  mt?: number;
  noWrap?: boolean;
  /** Accessible label for the online-status indicator. @default "Online" */
  onlineLabel?: string;
  pt?: number;
  showOnlineStatus?: boolean;
  textAlign?: "left" | "center" | "right";
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
          "inline-block max-w-full",
          typographyClass,
          noWrap && "truncate",
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
        {children}
        {badge && (
          <span
            role="img"
            aria-label={badge.label}
            className={`relative -top-[25%] ml-2 inline-flex h-full translate-y-[25%] items-center ${badge.tint}`}
          >
            <VerifiedIcon className="size-4" />
          </span>
        )}
        {showOnlineStatus && <ProfileOnlineStatus label={onlineLabel} />}
      </Component>
    );
  },
);

UserDisplayNameContainer.displayName = "UserDisplayNameContainer";
