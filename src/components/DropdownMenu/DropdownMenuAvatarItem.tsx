import * as React from "react";
import { cn } from "../../utils/cn";
import { getInitials } from "../../utils/getInitials";
import { Avatar } from "../Avatar/Avatar";
import { DropdownMenuItem, type DropdownMenuItemProps } from "./DropdownMenuItem";

/** Props for the {@link DropdownMenuAvatarItem} component. */
export interface DropdownMenuAvatarItemProps
  extends Omit<
    DropdownMenuItemProps,
    | "children"
    | "asChild"
    | "size"
    | "avatar"
    | "leadingIcon"
    | "trailingIcon"
    | "count"
    | "description"
    | "destructive"
  > {
  /** Display name, rendered semibold on the first line. */
  name: string;
  /** Secondary line under the name, e.g. a `@handle`. Omit for a single-line row. */
  handle?: React.ReactNode;
  /** Avatar image URL. When missing, the avatar falls back to the name's initials. */
  avatarSrc?: string;
  /** Avatar fallback content. @default the initials of `name` */
  avatarFallback?: React.ReactNode;
  /** Node pinned to the end of the row, e.g. a `MoreIcon` or a check. */
  trailing?: React.ReactNode;
}

/**
 * A menu row for a person or account: a 32px avatar, a name and an optional
 * handle line, with an optional trailing node. Takes `selected` and `disabled`
 * from {@link DropdownMenuItem}.
 *
 * @example
 * ```tsx
 * <DropdownMenuAvatarItem name="Maya Chen" handle="@mayachen" avatarSrc={src} />
 * <DropdownMenuAvatarItem name="Maya Chen" handle="@mayachen" selected />
 * ```
 */
export const DropdownMenuAvatarItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuItem>,
  DropdownMenuAvatarItemProps
>(({ name, handle, avatarSrc, avatarFallback, trailing, selected, className, ...props }, ref) => (
  <DropdownMenuItem
    ref={ref}
    asChild
    selected={selected}
    // `V2 Menu Avatar Item` is a 52px row with a 12px radius, not the 40px
    // item's 16px type and xs radius, so the size classes are overridden here.
    className={cn("min-h-0 gap-3 rounded-sm py-2", className)}
    {...props}
  >
    <div>
      <Avatar size={32} src={avatarSrc} alt="" fallback={avatarFallback ?? getInitials(name)} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="typography-body-small-14px-semibold truncate">{name}</span>
        {handle != null && (
          <span
            className={cn(
              "typography-body-small-14px-regular truncate",
              selected
                ? "text-content-primary-inverted"
                : "text-content-tertiary group-data-[disabled]:text-content-disabled group-aria-disabled:text-content-disabled",
            )}
          >
            {handle}
          </span>
        )}
      </span>
      {trailing != null && <span className="flex shrink-0 items-center">{trailing}</span>}
    </div>
  </DropdownMenuItem>
));
DropdownMenuAvatarItem.displayName = "DropdownMenuAvatarItem";
