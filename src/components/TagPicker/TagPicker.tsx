import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import { Button } from "../Button/Button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../Drawer/Drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../DropdownMenu/DropdownMenu";
import { IconButton } from "../IconButton/IconButton";
import { ArrowLeftIcon } from "../Icons/ArrowLeftIcon";
import { MoreIcon } from "../Icons/MoreIcon";
import { ReorganiseIcon } from "../Icons/ReorganiseIcon";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover/Popover";
import { Tag, type TagVariant } from "../Tag/Tag";
import { MorphPanel } from "./MorphPanel";
import { type ParsedTagName, parseTagName } from "./parseTagName";
import { TagField, type TagPickerOption } from "./TagField";
import { TagMenu, type TagMenuLabels } from "./TagMenu";
import { TagPickerRow, type TagPickerRowData, type TagPickerRowMenu } from "./TagPickerRow";
import { moveItem, type TagReorderDrag, useTagReorder } from "./useTagReorder";

const GHOST_Z_INDEX = "calc(var(--fanvue-ui-portal-z-index, 50) + 1)";

/** How the picker opens: a popover under the field, or a floating sheet for mobile. */
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

type Labels = Required<
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

const sameLabel = (a: string, b: string) =>
  a.localeCompare(b, undefined, { sensitivity: "accent" }) === 0;

function buildRows(
  options: TagPickerOption[],
  hidden: readonly string[],
  query: string,
  canCreate: boolean,
): TagPickerRowData[] {
  const name = parseTagName(query);
  const needle = name.label.toLocaleLowerCase();
  const matches = options.filter(
    (option) =>
      !hidden.includes(option.value) &&
      (!needle || option.label.toLocaleLowerCase().includes(needle)),
  );
  const rows: TagPickerRowData[] = matches.map((option) => ({ kind: "option", option }));
  const exists = options.some((option) => sameLabel(option.label, name.label));
  if (canCreate && name.label && !exists) rows.push({ kind: "create", name });
  return rows;
}

function scrollIntoView(element: HTMLElement | null) {
  element?.scrollIntoView?.({ block: "nearest" });
}

interface TagPickerPanelProps {
  options: TagPickerOption[];
  picked: TagPickerOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  onCreate?: (name: ParsedTagName) => void;
  onRename?: (value: string, name: ParsedTagName) => void;
  onColourChange?: (value: string, colour: TagVariant) => void;
  onDelete?: (value: string) => void;
  onReorder?: (order: string[]) => void;
  variant: TagPickerVariant;
  label: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  labels: Labels;
  reordering: boolean;
  setReordering: (reordering: boolean) => void;
}

function DropIndicator({ drag }: { drag: TagReorderDrag | null }) {
  if (!drag) return null;
  return (
    <div
      aria-hidden="true"
      data-reorder-indicator=""
      className="pointer-events-none absolute inset-x-3 z-10 flex -translate-y-1/2 items-center"
      style={{ top: drag.indicatorTop }}
    >
      <span className="size-2 shrink-0 rounded-full bg-content-primary" />
      <span className="h-0.5 min-w-0 flex-1 rounded-full bg-content-primary" />
    </div>
  );
}

function DragGhost({
  drag,
  options,
  isSheet,
}: {
  drag: TagReorderDrag | null;
  options: TagPickerOption[];
  isSheet: boolean;
}) {
  const option = drag && options.find((candidate) => candidate.value === drag.value);
  if (!drag || !option) return null;
  return createPortal(
    <div
      aria-hidden="true"
      data-reorder-ghost=""
      className="pointer-events-none fixed top-0 left-0 will-change-transform"
      style={{
        width: drag.width,
        zIndex: GHOST_Z_INDEX,
        transform: `translate(${drag.x - drag.offsetX}px, ${drag.y - drag.offsetY}px)`,
      }}
    >
      <div className="overflow-hidden rounded-sm bg-surface-primary/65 backdrop-blur-[20px]">
        <div
          className={cn(
            "relative flex items-center bg-neutral-alphas-100 ps-7 pe-6",
            isSheet ? "h-10" : "h-8",
          )}
        >
          <ReorganiseIcon
            size={16}
            filled
            className="absolute start-1 top-1/2 -translate-y-1/2 text-icons-tertiary"
          />
          <Tag variant={option.colour ?? "gray"} leadingIcon={option.emoji}>
            {option.label}
          </Tag>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function PickerActions({
  labels,
  isSheet,
  onReorderMode,
  onOpenOptions,
}: {
  labels: Labels;
  isSheet: boolean;
  onReorderMode: () => void;
  onOpenOptions: () => void;
}) {
  const trigger = (
    <IconButton
      variant="tertiary"
      size={isSheet ? "32" : "24"}
      icon={<MoreIcon size={16} />}
      aria-label={labels.actionsLabel}
      onClick={isSheet ? onOpenOptions : undefined}
      className="shrink-0"
    />
  );
  if (isSheet) return trigger;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          leadingIcon={<ReorganiseIcon size={16} filled />}
          onSelect={onReorderMode}
        >
          {labels.reorderLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SheetHeader({
  title,
  closeLabel,
  back,
  actions,
}: {
  title: string;
  closeLabel: string;
  back?: { label: string; onBack: () => void };
  actions?: React.ReactNode;
}) {
  return (
    <DrawerHeader closeLabel={closeLabel} className={back ? "pb-2" : "pb-0"}>
      <div className={cn("flex items-center", back ? "gap-1" : "gap-2")}>
        {back && (
          <IconButton
            variant="tertiary"
            size="32"
            icon={<ArrowLeftIcon />}
            aria-label={back.label}
            onClick={back.onBack}
            className="shrink-0"
          />
        )}
        <DrawerTitle
          className={cn("typography-body-default-16px-regular min-w-0 flex-1", !back && "px-3")}
        >
          {title}
        </DrawerTitle>
        {actions}
      </div>
    </DrawerHeader>
  );
}

type SheetView = { kind: "options" } | { kind: "edit"; option: TagPickerOption };

/** Which sheet sub-view replaces the tags, if any: a tag's edit menu, or Tag options. */
function sheetView(
  isSheet: boolean,
  options: TagPickerOption[],
  menuFor: string | null,
  showOptions: boolean,
): SheetView | null {
  if (!isSheet) return null;
  const option = options.find((candidate) => candidate.value === menuFor);
  if (option) return { kind: "edit", option };
  return showOptions ? { kind: "options" } : null;
}

function SheetSubView({
  view,
  labels,
  closeLabel,
  getMenu,
  onBack,
  onReorder,
}: {
  view: SheetView;
  labels: Labels;
  closeLabel: string;
  getMenu: (option: TagPickerOption) => TagPickerRowMenu;
  onBack: () => void;
  onReorder: () => void;
}) {
  const back = { label: labels.backLabel, onBack };
  if (view.kind === "options") {
    return (
      <>
        <SheetHeader title={labels.actionsLabel} closeLabel={closeLabel} back={back} />
        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={onReorder}
            className="typography-body-small-14px-regular flex h-10 w-full cursor-pointer items-center gap-2 rounded-sm px-3 text-start text-content-primary outline-hidden hover:bg-interaction-hover focus-visible:bg-interaction-hover"
          >
            <ReorganiseIcon size={16} filled className="shrink-0" />
            {labels.reorderLabel}
          </button>
        </div>
      </>
    );
  }
  return (
    <>
      <SheetHeader title={labels.editTitle} closeLabel={closeLabel} back={back} />
      <div className="min-h-0 overflow-y-auto px-4 pb-4">
        <TagMenu {...getMenu(view.option)} option={view.option} isSheet onClose={onBack} />
      </div>
    </>
  );
}

function ReorderBar({
  isSheet,
  labels,
  onDone,
}: {
  isSheet: boolean;
  labels: Labels;
  onDone: () => void;
}) {
  return (
    <div className={cn("flex items-center gap-2 py-2", isSheet ? "ps-7 pe-4" : "ps-5 pe-2")}>
      <span className="typography-description-12px-regular min-w-0 flex-1 text-content-secondary">
        {labels.reorderHint}
      </span>
      {!isSheet && (
        <Button variant="tertiary" size="24" onClick={onDone}>
          {labels.doneLabel}
        </Button>
      )}
    </div>
  );
}

function SheetDone({
  show,
  labels,
  onDone,
}: {
  show: boolean;
  labels: Labels;
  onDone: () => void;
}) {
  if (!show) return null;
  return (
    <div className="shrink-0 px-4 pt-2 pb-4">
      <Button variant="primary" size="40" className="w-full" onClick={onDone}>
        {labels.doneLabel}
      </Button>
    </div>
  );
}

interface SearchBarProps {
  isSheet: boolean;
  picked: TagPickerOption[];
  selectedTag: string | null;
  labels: Labels;
  onRemove: (value: string) => void;
  inputProps: React.InputHTMLAttributes<HTMLInputElement> & {
    ref: React.RefObject<HTMLInputElement | null>;
  };
  actions: React.ReactNode;
}

function SearchBar({
  isSheet,
  picked,
  selectedTag,
  labels,
  onRemove,
  inputProps,
  actions,
}: SearchBarProps) {
  const { ref, ...rest } = inputProps;
  return (
    <div className={cn("flex items-start gap-1 py-2", isSheet ? "ps-7 pe-4" : "ps-5 pe-2")}>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
        {picked.map((option) => (
          <Tag
            key={option.value}
            variant={option.colour ?? "gray"}
            leadingIcon={option.emoji}
            selected={selectedTag === option.value}
            onRemove={() => onRemove(option.value)}
            removeLabel={labels.getRemoveLabel(option)}
            removeTarget="tag"
          >
            {option.label}
          </Tag>
        ))}
        <input
          ref={ref}
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="list"
          autoComplete="off"
          placeholder={picked.length === 0 ? labels.searchPlaceholder : undefined}
          className="typography-body-small-14px-regular h-6 min-w-16 flex-1 bg-transparent text-content-primary outline-hidden placeholder:text-content-tertiary"
          {...rest}
        />
      </div>
      {!isSheet && actions}
    </div>
  );
}

const NO_VALUES: readonly string[] = [];

/** Navigation depth of the panel's view: the tags, then Tag options or Edit tag, then reorder mode. */
function viewStep(showingSubView: boolean, reordering: boolean) {
  if (showingSubView) return 1;
  return reordering ? 2 : 0;
}

/** Handles show while not searching: on hover on desktop, and only in reorder mode in the sheet. */
function handlesVisible(canReorder: boolean, query: string, reordering: boolean, isSheet: boolean) {
  return canReorder && query === "" && (reordering || !isSheet);
}

function useRows(
  options: TagPickerOption[],
  value: string[],
  query: string,
  canCreate: boolean,
  reordering: boolean,
) {
  return React.useMemo(
    () =>
      reordering
        ? buildRows(options, NO_VALUES, "", false)
        : buildRows(options, value, query, canCreate),
    [options, value, query, canCreate, reordering],
  );
}

function useKeyboardReorder(
  order: readonly string[],
  onReorder: ((order: string[]) => void) | undefined,
  getAnnouncement: Labels["getMoveAnnouncement"],
) {
  const [announcement, setAnnouncement] = React.useState("");
  const move = (option: TagPickerOption, step: number) => {
    const from = order.indexOf(option.value);
    const to = from + step;
    if (from === -1 || to < 0 || to >= order.length) return;
    onReorder?.(moveItem(order, from, to));
    setAnnouncement(getAnnouncement({ option, position: to + 1, total: order.length }));
    requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>(`[data-reorder-handle="${CSS.escape(option.value)}"]`)
        ?.focus();
    });
  };
  return { announcement, move };
}

function TagPickerPanel({
  options,
  picked,
  value,
  onValueChange,
  onCreate,
  onRename,
  onColourChange,
  onDelete,
  onReorder,
  variant,
  label,
  inputRef,
  labels,
  reordering,
  setReordering,
}: TagPickerPanelProps) {
  const id = React.useId();
  const listId = `${id}-list`;
  const instructionsId = `${id}-instructions`;
  const listRef = React.useRef<HTMLDivElement>(null);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);
  const [menuFor, setMenuFor] = React.useState<string | null>(null);
  const [showOptions, setShowOptions] = React.useState(false);
  const order = React.useMemo(() => options.map((option) => option.value), [options]);
  const keyboardReorder = useKeyboardReorder(order, onReorder, labels.getMoveAnnouncement);
  const reorder = useTagReorder(order, listRef, (next) => onReorder?.(next));
  const rows = useRows(options, value, query, onCreate !== undefined, reordering);
  const active = rows.length > 0 ? Math.min(activeIndex, rows.length - 1) : -1;
  const rowId = React.useCallback((index: number) => `${id}-row-${index}`, [id]);
  const isSheet = variant === "sheet";
  const canEdit = [onRename, onColourChange, onDelete].some((callback) => callback !== undefined);
  const showHandles = handlesVisible(onReorder !== undefined, query, reordering, isSheet);

  React.useEffect(() => {
    if (active >= 0 && !reordering) scrollIntoView(document.getElementById(rowId(active)));
  }, [active, rowId, reordering]);

  const focusInput = () => inputRef.current?.focus();

  const remove = (tagValue: string) => {
    onValueChange(value.filter((v) => v !== tagValue));
    setSelectedTag(null);
    focusInput();
  };

  const choose = (row: TagPickerRowData) => {
    if (row.kind === "create") onCreate?.(row.name);
    else onValueChange([...value, row.option.value]);
    setQuery("");
    setActiveIndex(0);
    setSelectedTag(null);
    focusInput();
  };

  const selectOrRemoveLast = () => {
    const last = picked.at(-1);
    if (!last) return;
    if (selectedTag === last.value) remove(last.value);
    else setSelectedTag(last.value);
  };

  const moveActive = (step: number) => {
    if (rows.length > 0) setActiveIndex((active + step + rows.length) % rows.length);
  };

  const keyActions: Record<string, (event: React.KeyboardEvent<HTMLInputElement>) => boolean> = {
    ArrowDown: () => {
      moveActive(1);
      return true;
    },
    ArrowUp: () => {
      moveActive(-1);
      return true;
    },
    Enter: () => {
      const row = rows[active];
      if (row) choose(row);
      return true;
    },
    ArrowRight: (event) => {
      const row = rows[active];
      if (!canEdit || row?.kind !== "option" || event.currentTarget.selectionStart !== query.length)
        return false;
      setMenuFor(row.option.value);
      return true;
    },
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (event.key === "Backspace" && query === "" && picked.length > 0) {
      if (event.repeat) return;
      event.preventDefault();
      selectOrRemoveLast();
      return;
    }
    if (selectedTag !== null) setSelectedTag(null);
    if (keyActions[event.key]?.(event)) event.preventDefault();
  };

  const tagMenu = (option: TagPickerOption): TagPickerRowMenu => ({
    editLabel: labels.getEditLabel(option),
    renameLabel: labels.renameLabel,
    deleteLabel: labels.deleteLabel,
    coloursLabel: labels.coloursLabel,
    colourNames: labels.colourNames,
    onRename: onRename && ((name) => onRename(option.value, name)),
    onColourChange: onColourChange && ((colour) => onColourChange(option.value, colour)),
    onDelete: onDelete && (() => onDelete(option.value)),
  });

  const optionRowProps = (option: TagPickerOption) => ({
    isDragging: reorder.drag?.value === option.value,
    handleProps: reorder.handleProps(option.value),
    handleLabel: labels.getMoveLabel(option),
    onHandleKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
      event.preventDefault();
      keyboardReorder.move(option, event.key === "ArrowUp" ? -1 : 1);
    },
    menu: canEdit ? tagMenu(option) : undefined,
    menuOpen: menuFor === option.value,
    onMenuOpenChange: (open: boolean) => setMenuFor(open ? option.value : null),
  });

  const finishReorder = () => {
    setReordering(false);
    requestAnimationFrame(focusInput);
  };

  const startReorder = () => {
    setQuery("");
    setReordering(true);
  };

  const actions = onReorder !== undefined && !reordering && (
    <PickerActions
      labels={labels}
      isSheet={isSheet}
      onReorderMode={startReorder}
      onOpenOptions={() => setShowOptions(true)}
    />
  );

  const view = sheetView(isSheet, options, menuFor, showOptions);
  const step = viewStep(view !== null, reordering);

  if (view) {
    return (
      <MorphPanel step={step}>
        <SheetSubView
          view={view}
          labels={labels}
          closeLabel={labels.closeLabel}
          getMenu={tagMenu}
          onBack={() => {
            setMenuFor(null);
            setShowOptions(false);
          }}
          onReorder={() => {
            setShowOptions(false);
            startReorder();
          }}
        />
      </MorphPanel>
    );
  }

  return (
    <MorphPanel step={step}>
      <div className="flex min-h-0 flex-col">
        {isSheet && (
          <SheetHeader
            title={reordering ? labels.reorderLabel : label}
            closeLabel={labels.closeLabel}
            actions={actions}
          />
        )}
        {reordering ? (
          <ReorderBar isSheet={isSheet} labels={labels} onDone={finishReorder} />
        ) : (
          <SearchBar
            isSheet={isSheet}
            picked={picked}
            selectedTag={selectedTag}
            labels={labels}
            onRemove={remove}
            actions={actions}
            inputProps={{
              ref: inputRef,
              "aria-label": label,
              "aria-controls": listId,
              "aria-activedescendant": active >= 0 ? rowId(active) : undefined,
              value: query,
              onChange: (event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
                setSelectedTag(null);
              },
              onKeyDown,
            }}
          />
        )}
        <hr className="h-px shrink-0 border-0 bg-neutral-alphas-200" />
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={labels.listLabel}
          aria-multiselectable="true"
          className={cn("relative min-h-0 overflow-y-auto", isSheet ? "p-4" : "p-2")}
        >
          {!reordering && rows.some((row) => row.kind === "option") && (
            <div
              role="presentation"
              className="typography-description-12px-regular px-3 pt-2 pb-2 text-content-secondary"
            >
              {labels.listLabel}
            </div>
          )}
          {rows.map((row, index) => (
            <TagPickerRow
              key={row.kind === "option" ? `option-${row.option.value}` : "create"}
              id={rowId(index)}
              row={row}
              isActive={index === active}
              {...(row.kind === "option" && optionRowProps(row.option))}
              isSheet={isSheet}
              createLabel={labels.createLabel}
              onHover={() => setActiveIndex(index)}
              onChoose={() => choose(row)}
              showHandle={showHandles}
              reordering={reordering}
              handleDescribedBy={instructionsId}
              onMenuClosed={focusInput}
            />
          ))}
          <DropIndicator drag={reorder.drag} />
        </div>
        {rows.length === 0 && (
          <output
            className={cn(
              "typography-body-small-14px-regular px-5 pb-3 text-content-tertiary",
              isSheet && "px-7 pb-5",
            )}
          >
            {labels.emptyLabel}
          </output>
        )}
        <SheetDone show={isSheet && reordering} labels={labels} onDone={finishReorder} />
        <DragGhost drag={reorder.drag} options={options} isSheet={isSheet} />
        {onReorder && (
          <>
            <span id={instructionsId} className="sr-only">
              {labels.moveInstructions}
            </span>
            <span aria-live="polite" className="sr-only">
              {keyboardReorder.announcement}
            </span>
          </>
        )}
      </div>
    </MorphPanel>
  );
}

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
