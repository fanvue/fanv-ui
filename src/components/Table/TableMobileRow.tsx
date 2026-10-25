import * as React from "react";
import { cn } from "../../utils/cn";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";

/** Layout of the main content, matching the Figma `Type` variants. */
export type TableMobileRowType = "base-text" | "default" | "with-image" | "avatar";

/** One column of the sub content line: a small label over a value. */
export interface TableMobileRowSubContentItem {
  /** Small muted label above the value. */
  label: React.ReactNode;
  /** Value beneath the label: plain text or a {@link Pill}. */
  value: React.ReactNode;
}

export interface TableMobileRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Main content layout; `base-text` and `with-image` show the description as a label above the title. @default "default" */
  type?: TableMobileRowType;
  /** Status or type label on the header line, typically a {@link Pill}. Not shown for `avatar`. */
  badge?: React.ReactNode;
  /** Primary line. */
  title: React.ReactNode;
  /** Secondary line (muted), rendered above or below the title depending on `type`. */
  description?: React.ReactNode;
  /** Trailing controls on the header line, or beside the profile for `avatar` (typically a {@link Checkbox}). */
  actions?: React.ReactNode;
  /** Thumbnail shown in a 32px box with a chevron before the text for `with-image`. */
  media?: React.ReactNode;
  /** Avatar shown before the text for `avatar`, typically an {@link Avatar}. */
  avatar?: React.ReactNode;
  /** Up to three label and value columns rendered under the main content. */
  subContent?: TableMobileRowSubContentItem[];
  /** When `true`, the title and description wrap onto more lines instead of truncating. @default false */
  wrap?: boolean;
}

/**
 * Stacked row that stands in for a table row on narrow screens (Figma `V2 Table Mobile`):
 * an optional badge and actions line, the main content in one of four layouts, optional
 * sub content columns, closed by a divider.
 *
 * @example
 * ```tsx
 * <TableMobileRow
 *   badge={<Pill variant="green">Dynamic</Pill>}
 *   title="Top Spenders"
 *   description="320 members"
 *   actions={<IconButton aria-label="Open list" icon={<ChevronRightIcon />} />}
 *   subContent={[{ label: "Created", value: "12 Jan" }]}
 * />
 * ```
 */
export const TableMobileRow = React.forwardRef<HTMLDivElement, TableMobileRowProps>(
  (
    {
      className,
      type = "default",
      badge,
      title,
      description,
      actions,
      media,
      avatar,
      subContent,
      wrap = false,
      ...props
    },
    ref,
  ) => {
    const isAvatar = type === "avatar";
    const labelFirst = type === "base-text" || type === "with-image";
    const showHeader = !isAvatar && (badge || actions);

    const text = (
      <div
        className={cn(
          "flex min-w-0 flex-col",
          labelFirst && "flex-col-reverse",
          type === "with-image" && "flex-1",
        )}
      >
        <p
          className={cn(
            "text-content-primary",
            wrap ? "break-words" : "truncate",
            labelFirst
              ? "typography-body-default-16px-regular"
              : "typography-body-default-16px-semibold",
          )}
        >
          {title}
        </p>
        {description && (
          <p
            className={cn(
              "text-content-tertiary",
              wrap ? "break-words" : "truncate",
              labelFirst
                ? "typography-body-small-14px-semibold"
                : "typography-body-small-14px-regular",
            )}
          >
            {description}
          </p>
        )}
      </div>
    );

    return (
      <div
        ref={ref}
        className={cn("flex w-full flex-col gap-4 border-border-primary border-b py-4", className)}
        {...props}
      >
        {showHeader && (
          <div className="flex min-h-6 items-center justify-between gap-2">
            <div className="flex min-w-0 items-center">{badge}</div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
          </div>
        )}
        {type === "with-image" && (
          <div className="flex items-center gap-4">
            <div className="flex shrink-0 items-center gap-1">
              <div className="size-8 overflow-hidden rounded-xs border border-neutral-alphas-100 [&>img]:size-full [&>img]:object-cover">
                {media}
              </div>
              <ChevronDownIcon size={16} className="text-content-primary" />
            </div>
            {text}
          </div>
        )}
        {isAvatar && (
          <div className="flex items-start gap-3">
            {avatar && <div className="flex shrink-0 items-center">{avatar}</div>}
            <div className="flex min-h-10 min-w-0 flex-1 items-center">{text}</div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
          </div>
        )}
        {!isAvatar && type !== "with-image" && text}
        {subContent && subContent.length > 0 && (
          <div className="flex items-center gap-2">
            {subContent.slice(0, 3).map((item, index) => (
              <div key={index} className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="typography-body-small-14px-semibold truncate text-content-tertiary">
                  {item.label}
                </p>
                <div className="typography-body-default-16px-regular flex min-h-6 min-w-0 items-center text-content-primary [&>span]:truncate">
                  {typeof item.value === "string" ? (
                    <span className="truncate">{item.value}</span>
                  ) : (
                    item.value
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);
TableMobileRow.displayName = "TableMobileRow";
