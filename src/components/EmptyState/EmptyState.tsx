import * as React from "react";
import { cn } from "../../utils/cn";

export type EmptyStateLayout = "default" | "centered";

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /**
   * Matches Figma property `Property 1` (`Default` / `centered`).
   * @default "default"
   */
  layout?: EmptyStateLayout;
  /** Main heading. */
  title?: React.ReactNode;
  /** Supporting body copy. */
  description?: React.ReactNode;
  /** Top visual/illustration slot. */
  media?: React.ReactNode;
  /** Primary call-to-action node. */
  primaryAction?: React.ReactNode;
  /** Optional secondary action rendered below primary. */
  secondaryAction?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLElement, EmptyStateProps>(
  (
    {
      className,
      layout = "default",
      title,
      description,
      media,
      primaryAction,
      secondaryAction,
      ...props
    },
    ref,
  ) => {
    const isCentered = layout === "centered";
    const titleId = React.useId();
    const regionLabelledBy =
      title !== undefined && title !== null && title !== false ? titleId : undefined;

    return (
      <section
        ref={ref}
        aria-labelledby={regionLabelledBy}
        data-testid="empty-state"
        className={cn(
          "flex w-full max-w-[375px] flex-col gap-6",
          isCentered ? "items-center text-center" : "items-start text-left",
          className,
        )}
        {...props}
      >
        {media !== undefined && media !== null && (
          <div className="h-[280px] w-full overflow-hidden rounded-md">{media}</div>
        )}

        <div
          className={cn("flex w-full flex-col gap-6", isCentered ? "items-center" : "items-start")}
        >
          <div
            className={cn(
              "flex w-full flex-col gap-4",
              isCentered ? "items-center" : "items-start",
            )}
          >
            {title !== undefined && title !== null && title !== false && (
              <div id={titleId} className="typography-bold-heading-lg text-content-primary">
                {title}
              </div>
            )}
            {description !== undefined && description !== null && description !== false && (
              <p className="typography-regular-body-lg text-content-secondary">{description}</p>
            )}
          </div>

          {(primaryAction !== undefined && primaryAction !== null) ||
          (secondaryAction !== undefined && secondaryAction !== null) ? (
            <div className={cn("flex flex-col gap-4", isCentered ? "items-center" : "items-start")}>
              {primaryAction}
              {secondaryAction}
            </div>
          ) : null}
        </div>
      </section>
    );
  },
);

EmptyState.displayName = "EmptyState";
