import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../Button/Button";

export type EmptyStateVariant = "default" | "centered";

export type EmptyStateTitleSize =
  | "typography-bold-heading-xl"
  | "typography-bold-heading-lg"
  | "typography-bold-heading-md"
  | "typography-bold-heading-sm"
  | "typography-bold-heading-xs";

export type EmptyStateMediaSize = "xs" | "sm" | "md" | "lg" | "xl";

const mediaSizeClass: Record<EmptyStateMediaSize, string> = {
  xs: "h-[80px]",
  sm: "h-[160px]",
  md: "h-[200px]",
  lg: "h-[280px]",
  xl: "h-[360px]",
};

/** Slot that can be plain copy (styled by `EmptyState`) or custom markup. */
export type EmptyStateSlot = string | React.ReactNode;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function hasSlotContent(value: EmptyStateSlot | undefined): boolean {
  if (value === undefined || value === null || value === false) {
    return false;
  }
  if (typeof value === "string") {
    return value.length > 0;
  }
  return true;
}

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /**
   * Matches Figma property `Property 1` (`Default` / `centered`).
   * @default "default"
   */
  variant?: EmptyStateVariant;
  /** Main heading. Strings use library heading styles; pass a node for full control. */
  title?: EmptyStateSlot;
  /**
   * Typography token applied to the title when it is a string or plain node.
   * @default "typography-bold-heading-lg"
   */
  titleSize?: EmptyStateTitleSize;
  /** Supporting body copy. Strings use library body styles; pass a node for rich text. */
  description?: EmptyStateSlot;
  /**
   * Top visual / illustration slot.
   * A string is treated as an image URL (`<img src={…}>`); pass a node for custom layout.
   */
  media?: EmptyStateSlot;
  /**
   * Height of the media container.
   * @default "lg"
   */
  mediaSize?: EmptyStateMediaSize;
  /**
   * Primary call to action.
   * A string renders a brand `Button` with that label; pass a node for links, loading, etc.
   */
  primaryAction?: EmptyStateSlot;
  /**
   * Secondary action below the primary.
   * A string renders a secondary `Button` with that label; pass a node when you need more control.
   */
  secondaryAction?: EmptyStateSlot;
}

export const EmptyState = React.forwardRef<HTMLElement, EmptyStateProps>(
  (
    {
      className,
      variant = "default",
      title,
      titleSize = "typography-bold-heading-lg",
      description,
      media,
      mediaSize = "lg",
      primaryAction,
      secondaryAction,
      ...props
    },
    ref,
  ) => {
    const isCentered = variant === "centered";
    const titleId = React.useId();
    const regionLabelledBy = hasSlotContent(title) ? titleId : undefined;

    const renderedPrimary =
      primaryAction === undefined ||
      primaryAction === null ||
      primaryAction === false ||
      primaryAction === "" ? null : isNonEmptyString(primaryAction) ? (
        <Button variant="brand" fullWidth>
          {primaryAction}
        </Button>
      ) : (
        primaryAction
      );

    const renderedSecondary =
      secondaryAction === undefined ||
      secondaryAction === null ||
      secondaryAction === false ||
      secondaryAction === "" ? null : isNonEmptyString(secondaryAction) ? (
        <Button variant="secondary" fullWidth>
          {secondaryAction}
        </Button>
      ) : (
        secondaryAction
      );

    const renderedTitle =
      title === undefined ||
      title === null ||
      title === false ||
      title === "" ? null : isNonEmptyString(title) ? (
        <h2 id={titleId} className={cn("m-0 text-content-primary", titleSize)}>
          {title}
        </h2>
      ) : (
        <div id={titleId} className={cn("text-content-primary min-w-0 w-full", titleSize)}>
          {title}
        </div>
      );

    const renderedDescription =
      description === undefined ||
      description === null ||
      description === false ||
      description === "" ? null : isNonEmptyString(description) ? (
        <p className="m-0 typography-regular-body-lg text-content-secondary">{description}</p>
      ) : (
        <div className="typography-regular-body-lg text-content-secondary min-w-0 w-full">
          {description}
        </div>
      );

    const renderedMedia =
      media === undefined ||
      media === null ||
      media === false ||
      media === "" ? null : isNonEmptyString(media) ? (
        <img
          src={media}
          alt=""
          decoding="async"
          className="block h-full w-full object-contain object-center"
        />
      ) : (
        media
      );

    const showMedia = renderedMedia !== null;
    const showActions = renderedPrimary !== null || renderedSecondary !== null;

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
        {showMedia && (
          <div className={cn("w-full overflow-hidden rounded-md", mediaSizeClass[mediaSize])}>
            {renderedMedia}
          </div>
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
            {renderedTitle}
            {renderedDescription}
          </div>

          {showActions ? (
            <div className={cn("flex flex-col gap-4", isCentered ? "items-center" : "items-start")}>
              {renderedPrimary}
              {renderedSecondary}
            </div>
          ) : null}
        </div>
      </section>
    );
  },
);

EmptyState.displayName = "EmptyState";
