import * as React from "react";
import { cn } from "../../utils/cn";

const HANDLE_SYMBOL = "@";

export interface UserHandleTypographyProps extends React.HTMLAttributes<HTMLSpanElement> {}

/**
 * Renders a user handle prefixed with the `@` symbol as muted, truncated
 * secondary text.
 *
 * @example
 * ```tsx
 * <UserHandleTypography>jane_doe</UserHandleTypography>
 * ```
 */
export const UserHandleTypography = React.forwardRef<HTMLSpanElement, UserHandleTypographyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "typography-body-small-14px-regular block max-w-full truncate text-content-secondary text-sm",
          className,
        )}
        {...props}
      >
        {HANDLE_SYMBOL}
        {children}
      </span>
    );
  },
);

UserHandleTypography.displayName = "UserHandleTypography";
