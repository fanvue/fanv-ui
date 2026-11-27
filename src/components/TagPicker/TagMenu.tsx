import * as React from "react";
import { cn } from "../../utils/cn";
import { TickIcon } from "../Icons/TickIcon";
import { TrashBinIcon } from "../Icons/TrashBinIcon";
import type { TagVariant } from "../Tag/Tag";
import { type ParsedTagName, parseTagName } from "./parseTagName";
import type { TagPickerOption } from "./TagField";

/** Every tag colour, in the order the colour list shows them. */
const TAG_COLOURS: readonly TagVariant[] = [
  "gray",
  "blue",
  "teal",
  "green",
  "amber",
  "red",
  "pink",
  "purple",
];

const swatchClass: Record<TagVariant, string> = {
  gray: "bg-tag-gray-surface",
  blue: "bg-tag-blue-surface",
  teal: "bg-tag-teal-surface",
  green: "bg-tag-green-surface",
  amber: "bg-tag-amber-surface",
  red: "bg-tag-red-surface",
  pink: "bg-tag-pink-surface",
  purple: "bg-tag-purple-surface",
};

/** Text shown in the tag menu. */
export interface TagMenuLabels {
  /** Accessible name of the rename input. */
  renameLabel: string;
  /** Label of the delete row. */
  deleteLabel: string;
  /** Heading above the colours. */
  coloursLabel: string;
  /** Name of each colour. */
  colourNames: Record<TagVariant, string>;
}

/** Props for {@link TagMenu}. */
export interface TagMenuProps extends TagMenuLabels {
  /** The tag being edited. */
  option: TagPickerOption;
  /** Called with the new name when the rename input is committed with a changed, non-empty name. */
  onRename?: (name: ParsedTagName) => void;
  /** Called with the picked colour. */
  onColourChange?: (colour: TagVariant) => void;
  /** Called when Delete is chosen. */
  onDelete?: () => void;
  /** Closes the menu. */
  onClose: () => void;
  /** Lays the menu out for the mobile sheet: full width with 40px rows. */
  isSheet?: boolean;
}

const fullName = (option: TagPickerOption) =>
  option.emoji ? `${option.emoji} ${option.label}` : option.label;

const rowClass =
  "typography-body-small-14px-regular flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 text-start outline-hidden";

const neutralRowClass = "hover:bg-interaction-hover focus-visible:bg-interaction-hover";

const errorRowClass =
  "text-error-content hover:bg-interaction-hover-error focus-visible:bg-interaction-hover-error";

/**
 * The menu behind a tag's ⋯ button: rename the tag inline, delete it, or pick its colour. The
 * rename commits on Enter and when the menu closes; a leading emoji in the new name becomes the
 * tag's emoji (see {@link parseTagName}).
 */
export function TagMenu({
  option,
  onRename,
  onColourChange,
  onDelete,
  onClose,
  isSheet = false,
  renameLabel,
  deleteLabel,
  coloursLabel,
  colourNames,
}: TagMenuProps) {
  const [name, setName] = React.useState(() => fullName(option));
  const committed = React.useRef(false);
  const latest = React.useRef({ name, option, onRename });
  React.useLayoutEffect(() => {
    latest.current = { name, option, onRename };
  });

  const commit = React.useCallback(() => {
    const { name: next, option: current, onRename: rename } = latest.current;
    if (committed.current || !rename) return;
    const parsed = parseTagName(next);
    if (!parsed.label || next.trim() === fullName(current)) return;
    committed.current = true;
    rename(parsed);
  }, []);

  React.useEffect(() => commit, [commit]);

  const current = option.colour ?? "gray";
  const rowHeight = isSheet ? "h-10" : "h-8";
  return (
    <div className={cn("flex flex-col", isSheet ? "w-full" : "w-56")}>
      {onRename && (
        <input
          type="text"
          aria-label={renameLabel}
          value={name}
          onChange={(event) => {
            committed.current = false;
            setName(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit();
              onClose();
            }
          }}
          className={cn(
            "typography-body-small-14px-regular mb-1 w-full rounded-xs border border-border-input bg-transparent px-3 text-content-primary outline-hidden focus-visible:border-border-selected",
            rowHeight,
          )}
        />
      )}
      {onColourChange && (
        <>
          {onRename && <hr className="my-1 h-px border-0 bg-neutral-alphas-200" />}
          <fieldset className="m-0 flex min-w-0 flex-col border-0 p-0">
            <legend className="typography-description-12px-regular px-3 pt-2 pb-2 text-content-secondary">
              {coloursLabel}
            </legend>
            {TAG_COLOURS.map((colour) => (
              <button
                key={colour}
                type="button"
                aria-pressed={colour === current}
                onClick={() => {
                  onColourChange(colour);
                  onClose();
                }}
                className={cn(rowClass, rowHeight, neutralRowClass, "text-content-primary")}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-4 shrink-0 rounded-2xs border border-border-primary",
                    swatchClass[colour],
                  )}
                />
                <span className="min-w-0 flex-1 truncate">{colourNames[colour]}</span>
                {colour === current && <TickIcon size={16} className="shrink-0" />}
              </button>
            ))}
          </fieldset>
        </>
      )}
      {onDelete && (
        <>
          {(onRename || onColourChange) && (
            <hr className="my-1 h-px border-0 bg-neutral-alphas-200" />
          )}
          <button
            type="button"
            onClick={() => {
              committed.current = true;
              onDelete();
              onClose();
            }}
            className={cn(rowClass, rowHeight, errorRowClass)}
          >
            <TrashBinIcon className="size-4 shrink-0" />
            {deleteLabel}
          </button>
        </>
      )}
    </div>
  );
}
