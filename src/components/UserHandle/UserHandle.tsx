import * as React from "react";
import { cn } from "../../utils/cn";

const HANDLE_SYMBOL = "@";

export interface UserHandleProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * `"secondary"` (default) is the muted handle sitting beneath a display name.
   * Use `"primary"` where the handle *is* the identity line and there is no name
   * above it to carry the emphasis — Figma's table rows do this.
   */
  tone?: "secondary" | "primary";
}

/**
 * Renders a user handle prefixed with the `@` symbol as truncated text, muted by
 * default. Owns the `@` so callers never concatenate it themselves.
 *
 * @example
 * ```tsx
 * <UserHandle>jane_doe</UserHandle>
 * ```
 */
export const UserHandle = React.forwardRef<HTMLSpanElement, UserHandleProps>(
  ({ children, className, tone = "secondary", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "typography-body-small-14px-regular block max-w-full truncate",
          tone === "primary" ? "text-content-primary" : "text-content-secondary",
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
