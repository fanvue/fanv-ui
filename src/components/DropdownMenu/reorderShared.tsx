import * as React from "react";

// Types, contexts and the grip glyph shared by DropdownMenuReorderGroup and
// DropdownMenuReorderItem. Internal to the DropdownMenu directory.
// The `V2 Menu Item` drag handle glyph (2×3 dot grip). Inlined rather than
// added to `src/components/Icons` because that directory is generated from
// Figma exports and hand-written files there are overwritten by icons:sync.
export function DragHandleDots(props: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...props}>
      <circle cx="5.333" cy="2.667" r="1.333" />
      <circle cx="5.333" cy="8" r="1.333" />
      <circle cx="5.333" cy="13.333" r="1.333" />
      <circle cx="10.667" cy="2.667" r="1.333" />
      <circle cx="10.667" cy="8" r="1.333" />
      <circle cx="10.667" cy="13.333" r="1.333" />
    </svg>
  );
}

/** Describes a completed reorder: which item moved and where. */
export interface DropdownMenuReorderDetail {
  /** `value` of the item that moved. */
  value: string;
  /** Plain-text name of the item that moved (see `DropdownMenuReorderItem.label`). */
  label: string;
  /** Index the item moved from. */
  from: number;
  /** Index the item now occupies. */
  to: number;
  /** Number of items in the group. */
  total: number;
}

export type RegisteredReorderItem = { element: HTMLDivElement; label: string };

// Everything a drag needs between pointer events. It lives in a ref rather
// than state: pointer moves mutate it and write the ghost's transform directly,
// and only a lift, a drop-index change or the drop itself reach React.
export type ReorderDrag = {
  value: string;
  pointerId: number;
  element: HTMLDivElement;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  lifted: boolean;
  dropIndex: number;
  // Geometry captured once at lift. Rows never move during a drag — the source
  // row stays in flow, dimmed — so the only thing that shifts them is the
  // scroll container, tracked by comparing its scrollTop with the value here.
  /** Row vertical centres in viewport coordinates at measure time. */
  midpoints: number[];
  /** Row top edges plus the last row's bottom, relative to the group. */
  edges: number[];
  scrollTopAtMeasure: number;
  containerRect: DOMRect | null;
};

export type ReorderLifted = { value: string; width: number; zIndex: string };

export type ReorderActions = {
  registerItem: (value: string, item: RegisteredReorderItem | null) => void;
  registerGhost: (element: HTMLDivElement | null) => void;
  /** Returns `false` when another pointer already owns a drag. */
  startDrag: (value: string, event: React.PointerEvent, element: HTMLDivElement) => boolean;
  updateDrag: (event: React.PointerEvent) => void;
  endDrag: (pointerId: number, commit: boolean) => void;
  moveItem: (value: string, delta: number) => void;
  instructionsId: string;
};

export const ReorderActionsContext = React.createContext<ReorderActions | null>(null);
// Separate from the actions so rows re-render only when a lift starts or ends,
// not on every drop-index change (which only the group's indicator needs).
export const ReorderLiftedContext = React.createContext<ReorderLifted | null>(null);
