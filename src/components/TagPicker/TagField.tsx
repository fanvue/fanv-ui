import * as React from "react";
import { cn } from "../../utils/cn";
import { Tag, type TagVariant } from "../Tag/Tag";

/** A tag the field or picker can show. */
export interface TagPickerOption {
  /** Stable id of the tag. */
  value: string;
  /** Label shown on the tag, without the emoji. */
  label: string;
  /** Emoji shown before the label. Only set it when the creator typed one. */
  emoji?: string;
  /** Colour of the tag. @default "gray" */
  colour?: TagVariant;
}

/** Props for {@link TagField}. */
export interface TagFieldProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  /** The tags to show, in order. */
  tags: TagPickerOption[];
  /** Text shown when there are no tags. @default "Add tags" */
  placeholder?: string;
}

/**
 * The tag area on a record. The whole area is one button that opens the {@link TagPicker}; it has
 * no separate add button, and its tags have no ×, since tags are removed inside the picker.
 * It fills on hover on devices that can hover, and wraps onto new lines when the tags overflow.
 *
 * @example
 * ```tsx
 * <TagField tags={selectedTags} aria-label="Tags" onClick={openPicker} />
 * ```
 */
export const TagField = React.forwardRef<HTMLButtonElement, TagFieldProps>(
  ({ className, tags, placeholder = "Add tags", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "flex min-h-8 w-full cursor-pointer flex-wrap items-center gap-1 rounded-sm px-2 py-1 text-start outline-hidden focus-visible:shadow-focus-ring",
        "data-[state=open]:bg-interaction-hover [@media(hover:hover)]:hover:bg-interaction-hover",
        className,
      )}
      {...props}
    >
      {tags.length === 0 ? (
        <span className="typography-body-small-14px-regular text-content-tertiary">
          {placeholder}
        </span>
      ) : (
        tags.map((tag) => (
          <Tag key={tag.value} variant={tag.colour ?? "gray"} leadingIcon={tag.emoji}>
            {tag.label}
          </Tag>
        ))
      )}
    </button>
  ),
);

TagField.displayName = "TagField";
