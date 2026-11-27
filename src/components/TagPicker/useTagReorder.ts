import * as React from "react";

const LIFT_THRESHOLD_PX = 4;

/** Moves the item at `from` to `to`, returning a new array. */
export function moveItem<T>(items: readonly T[], from: number, to: number): T[] {
  const next = items.slice();
  const [item] = next.splice(from, 1);
  if (item !== undefined) next.splice(to, 0, item);
  return next;
}

/**
 * Moves `value` within the full `order` so it lands before `before`, or straight after `after`
 * when it is dropped below the last visible row.
 */
export function placeValue(
  order: readonly string[],
  value: string,
  before: string | undefined,
  after: string | undefined,
) {
  const rest = order.filter((v) => v !== value);
  const anchor = before ?? after;
  if (anchor === undefined) return [...order];
  const index = rest.indexOf(anchor) + (before === undefined ? 1 : 0);
  return [...rest.slice(0, index), value, ...rest.slice(index)];
}

interface DragState {
  value: string;
  pointerId: number;
  startY: number;
  lifted: boolean;
}

/** Where the lifted row's floating copy is drawn and where the drop line sits. */
export interface TagReorderDrag {
  /** Value of the lifted tag. */
  value: string;
  /** Pointer position, for the floating copy. */
  x: number;
  y: number;
  /** Offset from the row's top-left to the pointer when it was lifted. */
  offsetX: number;
  offsetY: number;
  /** Width of the lifted row. */
  width: number;
  /** Top of the drop line inside the list, in px. */
  indicatorTop: number;
}

function rowsOf(list: HTMLElement | null) {
  return Array.from(list?.querySelectorAll<HTMLElement>("[data-reorder-value]") ?? []);
}

function measure(list: HTMLElement, rows: HTMLElement[], y: number) {
  const listRect = list.getBoundingClientRect();
  const rects = rows.map((row) => row.getBoundingClientRect());
  const dropIndex = rects.filter((rect) => rect.top + rect.height / 2 < y).length;
  const edge = (index: number) => {
    const rect = rects[index] ?? rects.at(-1);
    if (!rect) return 0;
    const top = index < rects.length ? rect.top : rect.bottom;
    return top - listRect.top + list.scrollTop;
  };
  return { dropIndex, indicatorTop: edge(dropIndex) };
}

/**
 * Pointer drag-to-reorder for the tag list, in the library's drag pattern: the lifted row follows
 * the pointer as a floating copy, a line marks where it will land, and nothing moves until it is
 * released. Rows are found inside `listRef` by `data-reorder-value`; they may be a filtered subset
 * of `order`, and `onCommit` always receives the full order.
 */
export function useTagReorder(
  order: readonly string[],
  listRef: React.RefObject<HTMLElement | null>,
  onCommit: (order: string[]) => void,
) {
  const [drag, setDrag] = React.useState<TagReorderDrag | null>(null);
  const state = React.useRef<DragState | null>(null);
  const dropIndex = React.useRef(0);

  const update = (event: React.PointerEvent<HTMLElement>, row: HTMLElement | null) => {
    const list = listRef.current;
    if (!list || !state.current) return;
    const measured = measure(list, rowsOf(list), event.clientY);
    dropIndex.current = measured.dropIndex;
    setDrag((current) => {
      if (current)
        return {
          ...current,
          x: event.clientX,
          y: event.clientY,
          indicatorTop: measured.indicatorTop,
        };
      const rect = row?.getBoundingClientRect();
      return {
        value: state.current?.value ?? "",
        x: event.clientX,
        y: event.clientY,
        offsetX: rect ? event.clientX - rect.left : 0,
        offsetY: rect ? event.clientY - rect.top : 0,
        width: rect?.width ?? 0,
        indicatorTop: measured.indicatorTop,
      };
    });
  };

  const finish = (commit: boolean) => {
    const current = state.current;
    state.current = null;
    setDrag(null);
    if (!commit || !current?.lifted) return;
    const visible = rowsOf(listRef.current).map((row) => row.dataset.reorderValue ?? "");
    const from = visible.indexOf(current.value);
    const to = dropIndex.current;
    if (from === -1 || to === from || to === from + 1) return;
    const next = placeValue(order, current.value, visible[to], visible.at(-1));
    if (next.join("\u0000") !== order.join("\u0000")) onCommit(next);
  };

  const handleProps = (value: string) => ({
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      state.current = { value, pointerId: event.pointerId, startY: event.clientY, lifted: false };
      try {
        event.currentTarget.setPointerCapture?.(event.pointerId);
      } catch {
        return;
      }
    },
    onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
      const current = state.current;
      if (!current || current.pointerId !== event.pointerId) return;
      if (!current.lifted && Math.abs(event.clientY - current.startY) < LIFT_THRESHOLD_PX) return;
      current.lifted = true;
      update(event, event.currentTarget.closest<HTMLElement>("[data-reorder-value]"));
    },
    onPointerUp: (event: React.PointerEvent<HTMLElement>) => {
      if (state.current?.pointerId === event.pointerId) finish(true);
    },
    onPointerCancel: () => finish(false),
    onClick: (event: React.MouseEvent) => event.stopPropagation(),
  });

  return { drag, handleProps };
}
