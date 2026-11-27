import type * as React from "react";
import { cn } from "../../utils/cn";
import { IconButton } from "../IconButton/IconButton";
import { MoreIcon } from "../Icons/MoreIcon";
import { ReorganiseIcon } from "../Icons/ReorganiseIcon";
import { Popover, PopoverAnchor, PopoverContent } from "../Popover/Popover";
import { Tag } from "../Tag/Tag";
import type { ParsedTagName } from "./parseTagName";
import type { TagPickerOption } from "./TagField";
import { TagMenu, type TagMenuProps } from "./TagMenu";

/** A row in the picker's list: an existing tag, or the row that creates one. */
export type TagPickerRowData =
  | { kind: "option"; option: TagPickerOption }
  | { kind: "create"; name: ParsedTagName };

/** What a row's ⋯ menu needs: its labels and callbacks, minus the tag and close handler. */
export type TagPickerRowMenu = Omit<TagMenuProps, "option" | "onClose" | "isSheet"> & {
  editLabel: string;
};

/** Props for {@link TagPickerRow}. */
interface TagPickerRowProps {
  id: string;
  row: TagPickerRowData;
  isActive: boolean;
  isSheet: boolean;
  isDragging?: boolean;
  createLabel: string;
  onHover: () => void;
  onChoose: () => void;
  showHandle: boolean;
  reordering: boolean;
  handleProps?: React.HTMLAttributes<HTMLElement>;
  handleLabel?: string;
  handleDescribedBy?: string;
  onHandleKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  menu?: TagPickerRowMenu;
  menuOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
  onMenuClosed: () => void;
}

const stopPropagation = (event: React.SyntheticEvent) => event.stopPropagation();

interface RowHandleProps {
  option: TagPickerOption;
  reordering: boolean;
  isDragging: boolean;
  handleProps?: React.HTMLAttributes<HTMLElement>;
  handleLabel?: string;
  handleDescribedBy?: string;
  onHandleKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

const HANDLE_POSITION =
  "absolute start-1 top-1/2 flex size-4 -translate-y-1/2 touch-none items-center justify-center text-icons-tertiary";

function RowHandle({
  option,
  reordering,
  isDragging,
  handleProps,
  handleLabel,
  handleDescribedBy,
  onHandleKeyDown,
}: RowHandleProps) {
  if (reordering) {
    return (
      <button
        type="button"
        aria-label={handleLabel}
        aria-describedby={handleDescribedBy}
        data-reorder-handle={option.value}
        onKeyDown={onHandleKeyDown}
        className={cn(
          HANDLE_POSITION,
          "cursor-grab rounded-3xs outline-hidden focus-visible:shadow-focus-ring",
        )}
        {...handleProps}
      >
        <ReorganiseIcon size={16} filled />
      </button>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        HANDLE_POSITION,
        "cursor-grab transition-opacity duration-150 motion-reduce:transition-none",
        !isDragging && "opacity-0 [@media(hover:hover)]:group-hover/row:opacity-100",
      )}
      {...handleProps}
    >
      <ReorganiseIcon size={16} filled />
    </span>
  );
}

interface RowMenuProps {
  option: TagPickerOption;
  menu: TagPickerRowMenu;
  isSheet: boolean;
  revealOnHover: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClosed: () => void;
}

function RowMenu({
  option,
  menu,
  isSheet,
  revealOnHover,
  open,
  onOpenChange,
  onClosed,
}: RowMenuProps) {
  const button = (
    <IconButton
      variant="tertiary"
      size="24"
      tabIndex={-1}
      icon={<MoreIcon size={16} />}
      aria-label={menu.editLabel}
      onPointerDown={stopPropagation}
      onClick={(event) => {
        event.stopPropagation();
        onOpenChange(!open);
      }}
      className={cn(
        "ms-auto shrink-0",
        revealOnHover &&
          "[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/row:opacity-100",
      )}
    />
  );
  if (isSheet) return button;
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor asChild>{button}</PopoverAnchor>
      <PopoverContent
        side="right"
        align="start"
        aria-label={menu.editLabel}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          onClosed();
        }}
        onPointerDown={stopPropagation}
        onClick={stopPropagation}
      >
        <TagMenu {...menu} option={option} onClose={() => onOpenChange(false)} />
      </PopoverContent>
    </Popover>
  );
}

function RowLabel({ row, createLabel }: { row: TagPickerRowData; createLabel: string }) {
  if (row.kind === "option") {
    return (
      <Tag variant={row.option.colour ?? "gray"} leadingIcon={row.option.emoji}>
        {row.option.label}
      </Tag>
    );
  }
  return (
    <>
      <span className="typography-body-small-14px-regular text-content-secondary">
        {createLabel}
      </span>
      <Tag leadingIcon={row.name.emoji}>{row.name.label}</Tag>
    </>
  );
}

/** One row of the {@link TagPicker} list. */
export function TagPickerRow({
  id,
  row,
  isActive,
  isSheet,
  isDragging = false,
  createLabel,
  onHover,
  onChoose,
  showHandle,
  reordering,
  handleProps,
  handleLabel,
  handleDescribedBy,
  onHandleKeyDown,
  menu,
  menuOpen = false,
  onMenuOpenChange,
  onMenuClosed,
}: TagPickerRowProps) {
  const option = row.kind === "option" ? row.option : null;
  const interactive = !reordering;
  const hasHandle = showHandle && option !== null;
  return (
    <div
      id={id}
      role="option"
      tabIndex={-1}
      aria-selected="false"
      data-active={isActive || undefined}
      data-reorder-value={hasHandle ? option.value : undefined}
      onPointerMove={() => {
        if (!isActive && interactive) onHover();
      }}
      onPointerDown={(event) => event.preventDefault()}
      onClick={(event) => {
        if (interactive && event.currentTarget.contains(event.target as Node)) onChoose();
      }}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget || !interactive) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onChoose();
        }
      }}
      className={cn(
        "group/row relative flex items-center gap-2 rounded-sm ps-3 pe-1 outline-hidden",
        isSheet ? "h-10" : "h-8",
        hasHandle && (reordering || isDragging) && "ps-7",
        hasHandle &&
          !reordering &&
          "transition-[padding] duration-150 motion-reduce:transition-none [@media(hover:hover)]:hover:ps-7",
        interactive && "cursor-pointer",
        isActive && interactive && "bg-interaction-hover",
        isDragging && "opacity-40",
      )}
    >
      {hasHandle && (
        <RowHandle
          option={option}
          reordering={reordering}
          isDragging={isDragging}
          handleProps={handleProps}
          handleLabel={handleLabel}
          handleDescribedBy={handleDescribedBy}
          onHandleKeyDown={onHandleKeyDown}
        />
      )}
      <RowLabel row={row} createLabel={createLabel} />
      {option && menu && onMenuOpenChange && interactive && (
        <RowMenu
          option={option}
          menu={menu}
          isSheet={isSheet}
          revealOnHover={!isSheet && !isActive && !menuOpen}
          open={menuOpen}
          onOpenChange={onMenuOpenChange}
          onClosed={onMenuClosed}
        />
      )}
    </div>
  );
}
