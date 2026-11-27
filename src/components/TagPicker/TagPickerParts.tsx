import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import { Button } from "../Button/Button";
import { DrawerHeader, DrawerTitle } from "../Drawer/Drawer";
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
import { Tag } from "../Tag/Tag";
import type { TagPickerOption } from "./TagField";
import { TagMenu } from "./TagMenu";
import type { Labels } from "./TagPicker";
import type { TagPickerRowMenu } from "./TagPickerRow";
import { moveItem, type TagReorderDrag } from "./useTagReorder";

const GHOST_Z_INDEX = "calc(var(--fanvue-ui-portal-z-index, 50) + 1)";

/** How the picker opens: a popover under the field, or a floating sheet for mobile. */
export function DropIndicator({ drag }: { drag: TagReorderDrag | null }) {
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

export function DragGhost({
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

export function PickerActions({
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

export function SheetHeader({
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
export function sheetView(
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

export function SheetSubView({
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

export function ReorderBar({
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

export function SheetDone({
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

export function SearchBar({
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
          className="typography-body-small-14px-regular h-6 min-w-8 flex-1 bg-transparent text-content-primary outline-hidden placeholder:text-content-tertiary"
          {...rest}
        />
      </div>
      {!isSheet && actions}
    </div>
  );
}

export function useKeyboardReorder(
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
