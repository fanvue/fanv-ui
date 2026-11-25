import * as React from "react";
import { cn } from "../../utils/cn";
import { CrossIcon } from "../Icons/CrossIcon";

/** Colour of the tag, from the V2 Tags palette. */
export type TagVariant = "gray" | "blue" | "teal" | "green" | "amber" | "red" | "pink" | "purple";

/** Height of the tag in pixels. */
export type TagSize = "16" | "20";

/** When the remove button is shown. */
export type TagRemoveVisibility = "always" | "hover";

export interface TagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Colour from the V2 Tags palette. @default "gray" */
  variant?: TagVariant;
  /** Height in pixels: 16 for dense rows, 20 for panels, pickers and filter tags. @default "20" */
  size?: TagSize;
  /** Emoji or icon displayed before the label. Decorative, so it is hidden from assistive technology. */
  leadingIcon?: React.ReactNode;
  /** The visible label. A string so the remove button can name it. */
  children: string;
  /** Renders a remove (×) button when set. */
  onRemove?: () => void;
  /** Accessible name of the remove button. Pass a translated string. @default "Remove {label}" */
  removeLabel?: string;
  /**
   * `"always"` keeps the × visible (lists, filter tags). `"hover"` reveals it on hover or
   * keyboard focus, and keeps it visible on touch devices, which have no hover.
   * Space for the × is reserved either way, so revealing it never shifts the row.
   * @default "always"
   */
  removeVisibility?: TagRemoveVisibility;
}

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

/**
 * A small label for something the user applied, such as a fan tag, a list or an active filter.
 * Status labels belong in {@link Pill} or {@link Badge}.
 *
 * Pass `onRemove` to add a × button. The label is plain text, and the × is a real button named by
 * `removeLabel`, so nothing interactive is nested inside the tag except the ×.
 *
 * @example
 * ```tsx
 * <Tag variant="blue" leadingIcon="🐳" onRemove={() => removeTag("whale")}>
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
      ...props
    },
    ref,
  ) => {
    return (
      <span
        ref={ref}
        data-testid="tag"
        className={cn(
          "group relative inline-flex min-w-0 max-w-full items-center gap-0.5 whitespace-nowrap rounded-2xs px-1 font-medium",
          size === "16" && "h-4 text-[10px] leading-[18px]",
          size === "20" && "h-5 text-xs leading-[18px]",
          variantClass[variant],
          onRemove &&
            "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-tag-hover-overlay before:opacity-0 hover:before:opacity-100",
          className,
        )}
        {...props}
      >
        {leadingIcon && (
          <span className="flex shrink-0 items-center [&>svg]:size-3" aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        <span className="min-w-0 truncate">{children}</span>
        {onRemove && (
          <button
            type="button"
            aria-label={removeLabel ?? `Remove ${children}`}
            onClick={onRemove}
            className={cn(
              "relative flex size-3 shrink-0 cursor-pointer items-center justify-center rounded-3xs after:absolute after:-inset-1.5 focus-visible:opacity-100 focus-visible:shadow-focus-ring focus-visible:outline-none",
              removeVisibility === "hover" &&
                "opacity-0 pointer-coarse:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100",
            )}
          >
            <CrossIcon className="size-3" />
          </button>
        )}
      </span>
    );
  },
);

Tag.displayName = "Tag";
