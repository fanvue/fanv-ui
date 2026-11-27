import * as React from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "../Drawer/Drawer";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover/Popover";
import type { TagVariant } from "../Tag/Tag";
import { type ParsedTagName, parseTagName } from "./parseTagName";
import { TagField, type TagPickerOption } from "./TagField";
import type { TagMenuLabels } from "./TagMenu";
import { TagPickerPanel } from "./TagPickerPanel";

export type TagPickerVariant = "popover" | "sheet";

/** Where a moved tag landed, passed to `getMoveAnnouncement`. */
export interface TagPickerMoveDetail {
  /** The moved tag. */
  option: TagPickerOption;
  /** Its new position, counting from 1. */
  position: number;
  /** How many tags there are. */
  total: number;
}

const DEFAULT_COLOUR_NAMES: Record<TagVariant, string> = {
  gray: "Gray",
  blue: "Blue",
  teal: "Teal",
  green: "Green",
  amber: "Amber",
  red: "Red",
  pink: "Pink",
  purple: "Purple",
};

/** Props for {@link TagPicker}. */
export interface TagPickerProps {
  /** Every tag the user can pick from, in display order. */
  options: TagPickerOption[];
  /** Values of the picked tags, in the order they were added. */
  value: string[];
  /** Called with the new list of picked values when a tag is added or removed. */
  onValueChange: (value: string[]) => void;
  /**
   * Called when the user creates a tag from their query, with the name split into its leading
   * emoji (if any) and label by {@link parseTagName}. Add the new option to `options` and its value
   * to `value` in response. Leave unset to hide the Create row.
   */
  onCreate?: (name: ParsedTagName) => void;
  /** Called when a tag is renamed in its ⋯ menu, with the new name split like `onCreate`. */
  onRename?: (value: string, name: ParsedTagName) => void;
  /** Called when a tag's colour is changed in its ⋯ menu. */
  onColourChange?: (value: string, colour: TagVariant) => void;
  /** Called when a tag is deleted in its ⋯ menu. Remove it from `options`. */
  onDelete?: (value: string) => void;
  /**
   * Called with every option value in its new order after a tag is dragged or moved. Setting it
   * shows the drag handle on hover (desktop) and the ⋯ action with "Reorder tags", which turns on
   * reorder mode for touch and keyboard users.
   */
  onReorder?: (order: string[]) => void;
  /** `"popover"` opens under the field; `"sheet"` opens a sheet floated 16px from the sides and bottom, for mobile. @default "popover" */
  variant?: TagPickerVariant;
  /** Controlled open state. */
  open?: boolean;
  /** Open state on first render when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called when the picker opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Accessible name of the field and the picker, and the sheet's title. */
  label: string;
  /** Text in the field when no tags are picked. @default "Add tags" */
  fieldPlaceholder?: string;
  /** Placeholder of the search input when no tags are picked. @default "Search or create a tag" */
  searchPlaceholder?: string;
  /** Heading above the options. @default "Select a tag or create one" */
  listLabel?: string;
  /** Word before the new tag on the Create row. @default "Create" */
  createLabel?: string;
  /** Shown when the list is empty: no option matches and there is nothing to create. @default "No tags found" */
  emptyLabel?: string;
  /** Accessible name of a picked tag's × button. @default `Remove ${option.label}` */
  getRemoveLabel?: (option: TagPickerOption) => string;
  /** Accessible name of a row's ⋯ button. @default `Edit ${option.label}` */
  getEditLabel?: (option: TagPickerOption) => string;
  /** Accessible name of the rename input in the ⋯ menu. @default "Tag name" */
  renameLabel?: string;
  /** Title of the ⋯ menu when it opens as a sheet. @default "Edit tag" */
  editTitle?: string;
  /** Label of the delete row in the ⋯ menu. @default "Delete" */
  deleteLabel?: string;
  /** Heading above the colours in the ⋯ menu. @default "Colours" */
  coloursLabel?: string;
  /** Name of each colour in the ⋯ menu. @default English names */
  colourNames?: Record<TagVariant, string>;
  /** Accessible name of the picker's ⋯ action button. @default "Tag options" */
  actionsLabel?: string;
  /** The action that turns on reorder mode. @default "Reorder tags" */
  reorderLabel?: string;
  /** Accessible name of the back button in the sheet's options view. @default "Back" */
  backLabel?: string;
  /** Hint shown in reorder mode. @default "Drag tags to reorder" */
  reorderHint?: string;
  /** Button that leaves reorder mode. @default "Done" */
  doneLabel?: string;
  /** Accessible name of a drag handle in reorder mode. @default `Move ${option.label}` */
  getMoveLabel?: (option: TagPickerOption) => string;
  /** Instructions read with a focused drag handle. @default "Press the up and down arrow keys to move this tag." */
  moveInstructions?: string;
  /** Announced after a tag moves. @default `${option.label}, position ${position} of ${total}` */
  getMoveAnnouncement?: (detail: TagPickerMoveDetail) => string;
  /** Accessible name of the sheet's close button. @default "Close" */
  closeLabel?: string;
  /** Additional CSS classes for the field. */
  className?: string;
}

export type Labels = Required<
  Pick<
    TagPickerProps,
    | "searchPlaceholder"
    | "listLabel"
    | "createLabel"
    | "emptyLabel"
    | "getRemoveLabel"
    | "getEditLabel"
    | "editTitle"
    | "closeLabel"
    | "actionsLabel"
    | "reorderLabel"
    | "backLabel"
    | "reorderHint"
    | "doneLabel"
    | "getMoveLabel"
    | "moveInstructions"
    | "getMoveAnnouncement"
  >
> &
  TagMenuLabels;

/**
 * A Notion-style tag picker. The {@link TagField} shows the picked tags; clicking anywhere on it
 * opens a panel with a search input and the list of tags.
 *
 * - Type to filter. ↑ and ↓ move the active row (wrapping), Enter picks it, Escape closes.
 * - Picked tags show at the top with a ×. On an empty input, Backspace selects the last tag and a
 *   second Backspace removes it.
 * - Clicking a row picks the tag. Picked tags leave the list and show only as chips at the top,
 *   so each tag appears once.
 * - When no tag has the typed name, a Create row adds it through `onCreate`. A leading emoji in
 *   the name becomes the tag's emoji (see {@link parseTagName}).
 * - With `onRename`, `onColourChange` or `onDelete`, each row has a ⋯ button (on hover on desktop,
 *   always in the sheet) that opens the tag menu. → on the active row opens it from the keyboard.
 * - With `onReorder`, a drag handle shows on hover on desktop. Dragging lifts a floating copy and
 *   a line marks where the tag will land; the list only changes on release. The ⋯ action at the
 *   top right offers "Reorder tags": reorder mode lists every tag, picked or not, with its handle,
 *   and ↑ ↓ on a focused handle move it.
 *
 * The caller owns the data: `options`, `value` and the callbacks. Every visible string is a prop,
 * so pass translated text.
 *
 * @example
 * ```tsx
 * <TagPicker
 *   label="Tags"
 *   options={tags}
 *   value={picked}
 *   onValueChange={setPicked}
 *   onCreate={({ label, emoji }) => createTag({ label, emoji })}
 *   onReorder={setOrder}
 * />
 * ```
 */
export function TagPicker({
  options,
  value,
  onValueChange,
  onCreate,
  onRename,
  onColourChange,
  onDelete,
  onReorder,
  variant = "popover",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  label,
  fieldPlaceholder,
  searchPlaceholder = "Search or create a tag",
  listLabel = "Select a tag or create one",
  createLabel = "Create",
  emptyLabel = "No tags found",
  getRemoveLabel = (option) => `Remove ${option.label}`,
  getEditLabel = (option) => `Edit ${option.label}`,
  editTitle = "Edit tag",
  renameLabel = "Tag name",
  deleteLabel = "Delete",
  coloursLabel = "Colours",
  colourNames = DEFAULT_COLOUR_NAMES,
  actionsLabel = "Tag options",
  reorderLabel = "Reorder tags",
  backLabel = "Back",
  reorderHint = "Drag tags to reorder",
  doneLabel = "Done",
  getMoveLabel = (option) => `Move ${option.label}`,
  moveInstructions = "Press the up and down arrow keys to move this tag.",
  getMoveAnnouncement = ({ option, position, total }) =>
    `${option.label}, position ${position} of ${total}`,
  closeLabel = "Close",
  className,
}: TagPickerProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [reordering, setReordering] = React.useState(false);
  const open = openProp ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setUncontrolledOpen(next);
    if (!next) setReordering(false);
    onOpenChange?.(next);
  };
  const inputRef = React.useRef<HTMLInputElement>(null);
  const picked = value
    .map((v) => options.find((option) => option.value === v))
    .filter((option): option is TagPickerOption => option !== undefined);
  const labels: Labels = {
    searchPlaceholder,
    listLabel,
    createLabel,
    emptyLabel,
    getRemoveLabel,
    getEditLabel,
    editTitle,
    closeLabel,
    renameLabel,
    deleteLabel,
    coloursLabel,
    colourNames,
    actionsLabel,
    reorderLabel,
    backLabel,
    reorderHint,
    doneLabel,
    getMoveLabel,
    moveInstructions,
    getMoveAnnouncement,
  };

  const field = (
    <TagField
      tags={picked}
      placeholder={fieldPlaceholder}
      aria-label={
        picked.length > 0 ? `${label}: ${picked.map((tag) => tag.label).join(", ")}` : label
      }
      className={className}
    />
  );
  const panel = (
    <TagPickerPanel
      options={options}
      picked={picked}
      value={value}
      onValueChange={onValueChange}
      onCreate={onCreate}
      onRename={onRename}
      onColourChange={onColourChange}
      onDelete={onDelete}
      onReorder={onReorder}
      variant={variant}
      label={label}
      inputRef={inputRef}
      labels={labels}
      reordering={reordering}
      setReordering={setReordering}
    />
  );
  const focusInputOnOpen = (event: Event) => {
    event.preventDefault();
    inputRef.current?.focus();
  };

  if (variant === "sheet") {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{field}</DrawerTrigger>
        <DrawerContent
          position="bottom"
          variant="menu"
          aria-describedby={undefined}
          onOpenAutoFocus={focusInputOnOpen}
          className="flex max-h-[80dvh] flex-col"
        >
          {panel}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{field}</PopoverTrigger>
      <PopoverContent
        aria-label={label}
        onOpenAutoFocus={focusInputOnOpen}
        className="flex w-80 flex-col p-0"
      >
        {panel}
      </PopoverContent>
    </Popover>
  );
}
