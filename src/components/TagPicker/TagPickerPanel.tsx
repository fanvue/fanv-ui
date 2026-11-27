import * as React from "react";
import { cn } from "../../utils/cn";
import type { TagVariant } from "../Tag/Tag";
import { MorphPanel } from "./MorphPanel";
import { type ParsedTagName, parseTagName } from "./parseTagName";
import type { TagPickerOption } from "./TagField";
import type { Labels, TagPickerVariant } from "./TagPicker";
import {
  DragGhost,
  DropIndicator,
  PickerActions,
  ReorderBar,
  SearchBar,
  SheetDone,
  SheetHeader,
  SheetSubView,
  sheetView,
  useKeyboardReorder,
} from "./TagPickerParts";
import { TagPickerRow, type TagPickerRowData, type TagPickerRowMenu } from "./TagPickerRow";
import { useTagReorder } from "./useTagReorder";

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

export function TagPickerPanel({
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
    window.setTimeout(() => {
      listRef.current?.querySelector<HTMLElement>("[data-reorder-handle]")?.focus();
    });
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
