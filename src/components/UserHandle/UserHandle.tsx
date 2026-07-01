import * as React from "react";
import { cn } from "../../utils/cn";

const HANDLE_SYMBOL = "@";

export interface UserHandleProps extends React.HTMLAttributes<HTMLSpanElement> {}

/**
 * Renders a user handle prefixed with the `@` symbol as muted, truncated
 * secondary text.
 *
 * @example
 * ```tsx
 * <UserHandle>jane_doe</UserHandle>
 * ```
 */
export const UserHandle = React.forwardRef<HTMLSpanElement, UserHandleProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "typography-body-small-14px-regular block max-w-full truncate text-content-secondary",
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

UserHandle.displayName = "UserHandle";
