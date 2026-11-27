import * as React from "react";
import { cn } from "../../utils/cn";
import { CrossIcon } from "../Icons/CrossIcon";

/** Colour of the tag, from the V2 Tags palette. */
export type TagVariant = "gray" | "blue" | "teal" | "green" | "amber" | "red" | "pink" | "purple";

/** Height of the tag in pixels. */
export type TagSize = "16" | "20";

/** When the remove button is shown. */
export type TagRemoveVisibility = "always" | "hover";

/** What a press removes the tag from: just the ×, or anywhere on the tag. */
export type TagRemoveTarget = "button" | "tag";

interface TagBaseProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Colour from the V2 Tags palette. @default "gray" */
  variant?: TagVariant;
  /** Height in pixels: 16 for dense rows, 20 for panels, pickers and filter tags. @default "20" */
  size?: TagSize;
  /**
   * Emoji (a string) or icon (an element) displayed before the label. Decorative, so it is hidden
   * from assistive technology. Size an icon yourself: 14px on a 20px tag (`className="size-3.5"`)
   * and 12px on a 16px tag (`className="size-3"`).
   */
  leadingIcon?: React.ReactNode;
  /** The visible label. */
  children: React.ReactNode;
  /**
   * Marks the tag as picked out with the keyboard, such as the last tag in a picker after one
   * Backspace, before a second Backspace removes it. Darkens the fill and keeps the × visible.
   * @default false
   */
  selected?: boolean;
}

interface TagRemovableProps {
  /**
   * Renders a remove (×) button when set. Receives the click, so a caller can stop it bubbling.
   * Pass `undefined` to hide the button conditionally while keeping `removeLabel`.
   */
  onRemove?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | undefined;
  /** Accessible name of the remove button, as one translated string such as "Remove Whale". */
  removeLabel: string;
  /**
   * `"always"` keeps the × visible (lists, filter tags). `"hover"` reveals it on hover or
   * keyboard focus, and keeps it visible on devices that cannot hover.
   * In `"hover"` mode the tag is narrower at rest and widens when the × appears; its height never changes.
   * @default "always"
   */
  removeVisibility?: TagRemoveVisibility;
  /**
   * `"button"` makes only the × remove the tag. `"tag"` stretches the ×'s hit area over the whole
   * tag, for touch and for chips whose only action is removing them, such as picked tags in a
   * picker. It is still one button named by `removeLabel`.
   * @default "button"
   */
  removeTarget?: TagRemoveTarget;
}

interface TagStaticProps {
  /** Leave unset for a tag with no remove button. */
  onRemove?: undefined;
  /** Only used with `onRemove`. */
  removeLabel?: undefined;
  /** Only used with `onRemove`. */
  removeVisibility?: undefined;
  /** Only used with `onRemove`. */
  removeTarget?: undefined;
}

export type TagProps = TagBaseProps & (TagRemovableProps | TagStaticProps);

const variantClass: Record<TagVariant, string> = {
  gray: "bg-tag-gray-surface text-tag-gray-content",
  blue: "bg-tag-blue-surface text-tag-blue-content",
  teal: "bg-tag-teal-surface text-tag-teal-content",
  green: "bg-tag-green-surface text-tag-green-content",
  amber: "bg-tag-amber-surface text-tag-amber-content",
  red: "bg-tag-red-surface text-tag-red-content",
  pink: "bg-tag-pink-surface text-tag-pink-content",
  purple: "bg-tag-purple-surface text-tag-purple-content",
};

function removeButtonClass(size: TagSize, revealOnHover: boolean, wholeTag: boolean) {
  return cn(
    "flex shrink-0 cursor-pointer items-center justify-center rounded-3xs after:absolute focus-visible:opacity-100 focus-visible:outline-hidden",
    wholeTag
      ? "after:inset-0 after:rounded-[inherit] focus-visible:after:shadow-focus-ring"
      : "relative focus-visible:shadow-focus-ring",
    size === "16" && "size-3",
    size === "20" && "size-3.5",
    !wholeTag && size === "16" && "after:-inset-1.5",
    !wholeTag && size === "20" && "after:-inset-1.25",
    revealOnHover &&
      "group-focus-within/tag:pointer-events-auto group-focus-within/tag:ml-0 group-focus-within/tag:opacity-100 group-hover/tag:pointer-events-auto group-hover/tag:ml-0 group-hover/tag:opacity-100 [@media(hover:hover)]:pointer-events-none [@media(hover:hover)]:-ml-0.5 [@media(hover:hover)]:w-0 [@media(hover:hover)]:opacity-0",
    revealOnHover && size === "16" && "group-focus-within/tag:w-3 group-hover/tag:w-3",
    revealOnHover && size === "20" && "group-focus-within/tag:w-3.5 group-hover/tag:w-3.5",
  );
}

/**
 * A small label for something the user applied, such as a fan tag, a list or an active filter.
 * Status labels belong in {@link Pill} or {@link Badge}.
 *
 * Pass `onRemove` to add a × button. The label is plain text, and the × is a real button named by
 * `removeLabel`, so nothing interactive is nested inside the tag except the ×.
 *
 * @example
 * ```tsx
 * <Tag
 *   variant="blue"
 *   leadingIcon="🐳"
 *   onRemove={() => removeTag("whale")}
 *   removeLabel={t("tags.remove", { name: "Whale" })}
 * >
 *   Whale
 * </Tag>
 * ```
 */
export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      className,
      variant = "gray",
      size = "20",
      leadingIcon,
      children,
      onRemove,
      removeLabel,
      removeVisibility = "always",
      removeTarget = "button",
      selected = false,
      ...props
    },
    ref,
  ) => {
    const isEmoji = typeof leadingIcon === "string";
    const revealRemoveOnHover = removeVisibility === "hover" && !selected;
    return (
      <span
        ref={ref}
        data-testid="tag"
        data-selected={selected || undefined}
        className={cn(
          "group/tag relative isolate inline-flex min-w-0 max-w-full items-center gap-0.5 whitespace-nowrap rounded-2xs",
          size === "16" && "typography-tag-16px h-4 px-1",
          size === "20" && "typography-tag-20px h-5 px-1.5",
          variantClass[variant],
          onRemove && removeTarget === "tag" && "cursor-pointer",
          (onRemove || selected) &&
            "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-tag-hover-overlay before:opacity-0 hover:before:opacity-100",
          selected && "before:bg-tag-selected-overlay before:opacity-100",
          className,
        )}
        {...props}
      >
        {leadingIcon && !isEmoji && (
          <span className="flex shrink-0 items-center" aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        <span className="flex min-w-0 items-center gap-1 px-0.5">
          {isEmoji && (
            <span
              className="typography-description-12px-regular flex w-3 shrink-0 justify-center"
              aria-hidden="true"
            >
              {leadingIcon}
            </span>
          )}
          <span className="min-w-0 truncate">{children}</span>
        </span>
        {onRemove && (
          <button
            type="button"
            aria-label={removeLabel}
            onClick={onRemove}
            className={removeButtonClass(size, revealRemoveOnHover, removeTarget === "tag")}
          >
            <CrossIcon className={size === "16" ? "size-3" : "size-3.5"} />
          </button>
        )}
      </span>
    );
  },
);

Tag.displayName = "Tag";
