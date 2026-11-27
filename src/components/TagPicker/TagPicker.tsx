import * as React from "react";
import { cn } from "../../utils/cn";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../Drawer/Drawer";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover/Popover";
import { Tag } from "../Tag/Tag";
import { type ParsedTagName, parseTagName } from "./parseTagName";
import { TagField, type TagPickerOption } from "./TagField";

/** How the picker opens: a popover under the field, or a floating sheet for mobile. */
export type TagPickerVariant = "popover" | "sheet";

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
  /** Shown when no option matches and creating is off. @default "No tags found" */
  emptyLabel?: string;
  /** Accessible name of a picked tag's × button. @default `Remove ${label}` */
  getRemoveLabel?: (option: TagPickerOption) => string;
  /** Accessible name of the sheet's close button. @default "Close" */
  closeLabel?: string;
  /** Additional CSS classes for the field. */
  className?: string;
}

type Row = { kind: "option"; option: TagPickerOption } | { kind: "create"; name: ParsedTagName };

const sameLabel = (a: string, b: string) =>
  a.localeCompare(b, undefined, { sensitivity: "base" }) === 0;

function buildRows(options: TagPickerOption[], query: string, canCreate: boolean): Row[] {
  const name = parseTagName(query);
  const needle = name.label.toLocaleLowerCase();
  const matches = needle
    ? options.filter((option) => option.label.toLocaleLowerCase().includes(needle))
    : options;
  const rows: Row[] = matches.map((option) => ({ kind: "option", option }));
  const exists = options.some((option) => sameLabel(option.label, name.label));
  if (canCreate && name.label && !exists) rows.push({ kind: "create", name });
  return rows;
}

function scrollIntoView(element: HTMLElement | null) {
  element?.scrollIntoView?.({ block: "nearest" });
}

interface TagPickerRowProps {
  id: string;
  row: Row;
  isActive: boolean;
  isPicked: boolean;
  isSheet: boolean;
  createLabel: string;
  onHover: () => void;
  onChoose: () => void;
}

function TagPickerRow({
  id,
  row,
  isActive,
  isPicked,
  isSheet,
  createLabel,
  onHover,
  onChoose,
}: TagPickerRowProps) {
  return (
    <div
      id={id}
      role="option"
      tabIndex={-1}
      aria-selected={isPicked}
      data-active={isActive || undefined}
      onPointerMove={() => {
        if (!isActive) onHover();
      }}
      onPointerDown={(event) => event.preventDefault()}
      onClick={onChoose}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onChoose();
        }
      }}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-sm px-3 outline-hidden",
        isSheet ? "h-10" : "h-8",
        isActive && "bg-interaction-hover",
      )}
    >
      {row.kind === "option" ? (
        <Tag variant={row.option.colour ?? "gray"} leadingIcon={row.option.emoji}>
          {row.option.label}
        </Tag>
      ) : (
        <>
          <span className="typography-body-small-14px-regular text-content-secondary">
            {createLabel}
          </span>
          <Tag leadingIcon={row.name.emoji}>{row.name.label}</Tag>
        </>
      )}
    </div>
  );
}

interface TagPickerPanelProps
  extends Required<
    Pick<
      TagPickerProps,
      "searchPlaceholder" | "listLabel" | "createLabel" | "emptyLabel" | "getRemoveLabel"
    >
  > {
  options: TagPickerOption[];
  picked: TagPickerOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  onCreate?: (name: ParsedTagName) => void;
  variant: TagPickerVariant;
  label: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

function TagPickerPanel({
  options,
  picked,
  value,
  onValueChange,
  onCreate,
  variant,
  label,
  inputRef,
  searchPlaceholder,
  listLabel,
  createLabel,
  emptyLabel,
  getRemoveLabel,
}: TagPickerPanelProps) {
  const id = React.useId();
  const listId = `${id}-list`;
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);
  const rows = React.useMemo(
    () => buildRows(options, query, onCreate !== undefined),
    [options, query, onCreate],
  );
  const active = rows.length > 0 ? Math.min(activeIndex, rows.length - 1) : -1;
  const rowId = (index: number) => `${id}-row-${index}`;
  const isSheet = variant === "sheet";

  React.useEffect(() => {
    if (active >= 0) scrollIntoView(document.getElementById(`${id}-row-${active}`));
  }, [active, id]);

  const remove = (tagValue: string) => {
    onValueChange(value.filter((v) => v !== tagValue));
    setSelectedTag(null);
    inputRef.current?.focus();
  };

  const toggle = (option: TagPickerOption) => {
    onValueChange(
      value.includes(option.value)
        ? value.filter((v) => v !== option.value)
        : [...value, option.value],
    );
  };

  const choose = (row: Row) => {
    if (row.kind === "option") toggle(row.option);
    else onCreate?.(row.name);
    setQuery("");
    setActiveIndex(0);
    setSelectedTag(null);
    inputRef.current?.focus();
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

  const keyActions: Record<string, () => void> = {
    ArrowDown: () => moveActive(1),
    ArrowUp: () => moveActive(-1),
    Enter: () => {
      const row = rows[active];
      if (row) choose(row);
    },
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && query === "" && picked.length > 0) {
      event.preventDefault();
      selectOrRemoveLast();
      return;
    }
    if (selectedTag !== null) setSelectedTag(null);
    const action = keyActions[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  };

  return (
    <div className="flex min-h-0 flex-col">
      <div className={cn("flex flex-wrap items-center gap-1 py-2", isSheet ? "px-7" : "px-5")}>
        {picked.map((option) => (
          <Tag
            key={option.value}
            variant={option.colour ?? "gray"}
            leadingIcon={option.emoji}
            selected={selectedTag === option.value}
            onRemove={() => remove(option.value)}
            removeLabel={getRemoveLabel(option)}
          >
            {option.label}
          </Tag>
        ))}
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-label={label}
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? rowId(active) : undefined}
          autoComplete="off"
          value={query}
          placeholder={picked.length === 0 ? searchPlaceholder : undefined}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setSelectedTag(null);
          }}
          onKeyDown={onKeyDown}
          className="typography-body-small-14px-regular h-6 min-w-16 flex-1 bg-transparent text-content-primary outline-hidden placeholder:text-content-tertiary"
        />
      </div>
      <hr className="h-px shrink-0 border-0 bg-neutral-alphas-200" />
      <div
        id={listId}
        role="listbox"
        aria-label={listLabel}
        aria-multiselectable="true"
        className={cn("min-h-0 overflow-y-auto", isSheet ? "p-4" : "p-2")}
      >
        {rows.some((row) => row.kind === "option") && (
          <div
            role="presentation"
            className="typography-description-12px-regular px-3 pt-2 pb-2 text-content-secondary"
          >
            {listLabel}
          </div>
        )}
        {rows.map((row, index) => (
          <TagPickerRow
            key={row.kind === "option" ? row.option.value : "create"}
            id={rowId(index)}
            row={row}
            isActive={index === active}
            isPicked={row.kind === "option" && value.includes(row.option.value)}
            isSheet={isSheet}
            createLabel={createLabel}
            onHover={() => setActiveIndex(index)}
            onChoose={() => choose(row)}
          />
        ))}
        {rows.length === 0 && (
          <div className="typography-body-small-14px-regular px-3 py-2 text-content-tertiary">
            {emptyLabel}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * A Notion-style tag picker. The {@link TagField} shows the picked tags; clicking anywhere on it
 * opens a panel with a search input and the list of tags.
 *
 * - Type to filter. ↑ and ↓ move the active row (wrapping), Enter picks it, Escape closes.
 * - Picked tags show at the top with a ×. On an empty input, Backspace selects the last tag and a
 *   second Backspace removes it.
 * - Clicking a row picks the tag, or removes it when it is already picked. Picked tags stay in the
 *   list, marked with `aria-selected`.
 * - When no tag has the typed name, a Create row adds it through `onCreate`. A leading emoji in
 *   the name becomes the tag's emoji (see {@link parseTagName}).
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
 * />
 * ```
 */
export function TagPicker({
  options,
  value,
  onValueChange,
  onCreate,
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
  closeLabel = "Close",
  className,
}: TagPickerProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  const inputRef = React.useRef<HTMLInputElement>(null);
  const picked = value
    .map((v) => options.find((option) => option.value === v))
    .filter((option): option is TagPickerOption => option !== undefined);

  const field = (
    <TagField
      tags={picked}
      placeholder={fieldPlaceholder}
      aria-label={label}
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
      variant={variant}
      label={label}
      inputRef={inputRef}
      searchPlaceholder={searchPlaceholder}
      listLabel={listLabel}
      createLabel={createLabel}
      emptyLabel={emptyLabel}
      getRemoveLabel={getRemoveLabel}
    />
  );
  const focusInput = (event: Event) => {
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
          onOpenAutoFocus={focusInput}
          className="flex max-h-[80dvh] flex-col"
        >
          <DrawerHeader closeLabel={closeLabel} className="pb-0">
            <DrawerTitle className="typography-body-default-16px-regular px-3">{label}</DrawerTitle>
          </DrawerHeader>
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
        onOpenAutoFocus={focusInput}
        className="flex w-80 flex-col p-0"
      >
        {panel}
      </PopoverContent>
    </Popover>
  );
}
