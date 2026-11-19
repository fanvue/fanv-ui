import * as React from "react";
import { cn } from "../../utils/cn";
import { renderContainedText } from "../../utils/renderTextChildren";

export interface InlineEmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "dangerouslySetInnerHTML"> {
  /** The message. Keep it to one short sentence. */
  children?: React.ReactNode;
}

/**
 * An empty or coming-soon state as one quiet, centred line in an 80px block. Use it inside a
 * card, table or panel that has nothing to show yet. For a state with a title, artwork or
 * actions, use {@link EmptyState}.
 *
 * @example
 * ```tsx
 * <InlineEmptyState>No links in this campaign yet.</InlineEmptyState>
 * ```
 */
export const InlineEmptyState = React.forwardRef<HTMLParagraphElement, InlineEmptyStateProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          "typography-body-small-14px-regular m-0 flex min-h-20 items-center justify-center px-4 text-center text-content-tertiary",
          className,
        )}
        {...props}
      >
        <span className="min-w-0 [overflow-wrap:anywhere]">{renderContainedText(children)}</span>
      </p>
    );
  },
);

InlineEmptyState.displayName = "InlineEmptyState";
