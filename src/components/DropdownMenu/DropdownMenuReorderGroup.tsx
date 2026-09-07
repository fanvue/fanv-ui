import * as React from "react";
import { cn } from "../../utils/cn";
import { DropdownMenuVariantContext } from "./context";
import {
  type DropdownMenuReorderDetail,
  type RegisteredReorderItem,
  type ReorderActions,
  ReorderActionsContext,
  type ReorderDrag,
  type ReorderLifted,
  ReorderLiftedContext,
} from "./reorderShared";

// Movement, in CSS px, below which a press-and-release on a reorder row still
// counts as a click rather than a drag lift.
const REORDER_LIFT_THRESHOLD_PX = 4;

// Distance from a scrollable menu's top/bottom edge within which a lifted drag
// auto-scrolls it, and the fastest per-frame scroll step that ramps up as the
// pointer nears the edge.
const REORDER_AUTOSCROLL_ZONE_PX = 32;
const REORDER_AUTOSCROLL_MAX_STEP_PX = 8;

const DEFAULT_REORDER_INSTRUCTIONS = "Press the up and down arrow keys to move this item.";

function findScrollableAncestor(element: HTMLElement): HTMLElement | null {
  let current = element.parentElement;
  while (current !== null) {
    const { overflowY } = getComputedStyle(current);
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      current.scrollHeight > current.clientHeight
    ) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

// How far past the auto-scroll zone the pointer sits: negative above the top
// zone, positive below the bottom one, 0 when it is clear of both.
function edgeOvershoot(rect: DOMRect, y: number): number {
  if (y < rect.top + REORDER_AUTOSCROLL_ZONE_PX) return y - (rect.top + REORDER_AUTOSCROLL_ZONE_PX);
  if (y > rect.bottom - REORDER_AUTOSCROLL_ZONE_PX) {
    return y - (rect.bottom - REORDER_AUTOSCROLL_ZONE_PX);
  }
  return 0;
}

const POSITIONED = new Set(["relative", "absolute", "fixed", "sticky"]);

// The z-index a row's surface paints at, or null when no positioned ancestor
// carries one. The row's own menu / dialog element is not the place to read
// it: Radix's popper copies the content's z-index onto its wrapper, which is
// where the browser applies it — and a host may raise the wrapper further
// (eden lifts `[data-radix-popper-content-wrapper]` above dialogs with
// `!important`). Walking up to <body> and taking the outermost positioned
// ancestor with a numeric z-index finds the value that wins in either variant.
function surfaceZIndex(element: HTMLElement): string | null {
  let zIndex: string | null = null;
  const { body } = element.ownerDocument;
  for (
    let node = element.parentElement;
    node !== null && node !== body;
    node = node.parentElement
  ) {
    const { position, zIndex: candidate } = getComputedStyle(node);
    if (POSITIONED.has(position) && candidate !== "" && candidate !== "auto") zIndex = candidate;
  }
  return zIndex;
}

// Keeps the latest value of a prop reachable from callbacks that must stay
// referentially stable (they are handed to imperative listeners and a context).
function useLatestRef<T>(value: T): React.RefObject<T> {
  const ref = React.useRef(value);
  React.useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}

function shallowEqualArrays(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}
function defaultReorderAnnouncement({ label, to, total }: DropdownMenuReorderDetail): string {
  return `${label} moved to position ${to + 1} of ${total}`;
}
/** Props for the {@link DropdownMenuReorderGroup} component. */
export interface DropdownMenuReorderGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * Item values in their current order. Must contain one entry per
   * {@link DropdownMenuReorderItem} child, in the same order the children are
   * rendered.
   */
  values: string[];
  /**
   * Fires after a drop or a keyboard move completes with the new order, plus
   * which item moved and from/to where — enough to call a move-to-position
   * API without diffing the arrays.
   */
  onReorder: (values: string[], detail: DropdownMenuReorderDetail) => void;
  /**
   * Builds the text announced to screen readers after a move. Override to
   * localise it.
   * @default ({ label, to, total }) => `${label} moved to position ${to + 1} of ${total}`
   */
  getAnnouncement?: (detail: DropdownMenuReorderDetail) => string;
  /**
   * Screen-reader instructions attached to every drag handle. Override to
   * localise them.
   * @default "Press the up and down arrow keys to move this item."
   */
  instructions?: string;
}

/**
 * A drag-to-reorder list of {@link DropdownMenuReorderItem} rows within a
 * dropdown menu — the "Reorganise" mode of `V2 Menu Dropdown`. Rows are
 * dragged with the pointer (from anywhere on the row with a mouse, from the
 * drag handle on touch) or moved with ArrowUp/ArrowDown on the focused
 * handle. Works in both the `"menu"` and `"sheet"` variants — for a long
 * list in a sheet, give the scrolling ancestor `overflow-y-auto` (the sheet
 * only caps its height) so edge auto-scroll has something to scroll.
 *
 * Inside a `"menu"`, Tab cycles through the handles and any header actions
 * (Radix menus otherwise swallow Tab), and the first handle takes focus when
 * the menu opens straight into the group.
 *
 * Pair with a {@link DropdownMenuHeader} whose `actions` contains a commit
 * button to exit the reorder mode.
 *
 * @example
 * ```tsx
 * <DropdownMenuReorderGroup
 *   values={folders.map((folder) => folder.id)}
 *   onReorder={(_, { value, to }) => moveFolder(value, to)}
 *   aria-label="Reorder folders"
 * >
 *   {folders.map((folder) => (
 *     <DropdownMenuReorderItem key={folder.id} value={folder.id} label={folder.name}>
 *       {folder.name}
 *     </DropdownMenuReorderItem>
 *   ))}
 * </DropdownMenuReorderGroup>
 * ```
 */
export const DropdownMenuReorderGroup = React.forwardRef<
  HTMLDivElement,
  DropdownMenuReorderGroupProps
>(
  (
    {
      values,
      onReorder,
      getAnnouncement = defaultReorderAnnouncement,
      instructions = DEFAULT_REORDER_INSTRUCTIONS,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const variant = React.useContext(DropdownMenuVariantContext);
    const instructionsId = React.useId();
    const groupRef = React.useRef<HTMLDivElement | null>(null);
    const itemsRef = React.useRef(new Map<string, RegisteredReorderItem>());
    const dragRef = React.useRef<ReorderDrag | null>(null);
    const ghostRef = React.useRef<HTMLDivElement | null>(null);
    const scrollContainerRef = React.useRef<HTMLElement | null>(null);
    const lastPointerRef = React.useRef<{ x: number; y: number } | null>(null);
    const autoScrollFrameRef = React.useRef<number | null>(null);
    const dragDisposersRef = React.useRef<Array<() => void>>([]);
    const valuesRef = useLatestRef(values);
    const onReorderRef = useLatestRef(onReorder);
    const getAnnouncementRef = useLatestRef(getAnnouncement);
    const [lifted, setLifted] = React.useState<ReorderLifted | null>(null);
    const [dropIndex, setDropIndex] = React.useState(-1);
    const [announcement, setAnnouncement] = React.useState("");

    const registerItem = React.useCallback((value: string, item: RegisteredReorderItem | null) => {
      if (item === null) {
        itemsRef.current.delete(value);
      } else {
        itemsRef.current.set(value, item);
      }
    }, []);

    const positionGhost = React.useCallback(() => {
      const drag = dragRef.current;
      const ghost = ghostRef.current;
      const pointer = lastPointerRef.current;
      if (drag === null || ghost === null || pointer === null) return;
      // A transform, not left/top: it moves the ghost on the compositor
      // without invalidating layout, so nothing forces a reflow per move.
      ghost.style.transform = `translate3d(${pointer.x - drag.offsetX}px, ${pointer.y - drag.offsetY}px, 0)`;
    }, []);

    const registerGhost = React.useCallback(
      (element: HTMLDivElement | null) => {
        ghostRef.current = element;
        // The ghost mounts in the commit after the lift; place it straight away
        // rather than waiting for the next pointer move.
        if (element !== null) positionGhost();
      },
      [positionGhost],
    );

    // Reads every row rect once, in a single batch with no writes in between,
    // so it costs one layout flush per lift instead of one per pointer move.
    const measure = React.useCallback(
      (drag: ReorderDrag) => {
        const group = groupRef.current;
        if (group === null) return;
        const groupTop = group.getBoundingClientRect().top;
        const midpoints: number[] = [];
        const edges: number[] = [];
        let bottom = groupTop;
        for (const value of valuesRef.current) {
          const rect = itemsRef.current.get(value)?.element.getBoundingClientRect();
          if (rect === undefined) {
            midpoints.push(bottom);
            edges.push(bottom - groupTop);
            continue;
          }
          midpoints.push(rect.top + rect.height / 2);
          edges.push(rect.top - groupTop);
          bottom = rect.bottom;
        }
        edges.push(bottom - groupTop);
        drag.midpoints = midpoints;
        drag.edges = edges;
        const container = scrollContainerRef.current;
        drag.scrollTopAtMeasure = container?.scrollTop ?? 0;
        drag.containerRect = container?.getBoundingClientRect() ?? null;
      },
      [valuesRef],
    );

    // Rows only move when the container scrolls, so a pointer position in
    // measure-time coordinates is the live one shifted by the scroll delta.
    const computeDropIndex = React.useCallback((drag: ReorderDrag, clientY: number) => {
      const container = scrollContainerRef.current;
      const y = clientY + (container === null ? 0 : container.scrollTop - drag.scrollTopAtMeasure);
      let index = 0;
      for (const midpoint of drag.midpoints) {
        if (midpoint >= y) break;
        index += 1;
      }
      return index;
    }, []);

    const refreshDropIndex = React.useCallback(
      (drag: ReorderDrag, clientY: number) => {
        const next = computeDropIndex(drag, clientY);
        if (next === drag.dropIndex) return;
        drag.dropIndex = next;
        setDropIndex(next);
      },
      [computeDropIndex],
    );

    const stopAutoScroll = React.useCallback(() => {
      if (autoScrollFrameRef.current === null) return;
      cancelAnimationFrame(autoScrollFrameRef.current);
      autoScrollFrameRef.current = null;
    }, []);

    // Runs a frame loop only while the pointer sits in an edge zone of a
    // scrollable container; each frame scrolls one step and the container's
    // scroll event (below) moves the drop target. The loop ends by itself when
    // the pointer leaves the zone or the container runs out of scroll range.
    const updateAutoScroll = React.useCallback(() => {
      const drag = dragRef.current;
      const container = scrollContainerRef.current;
      const pointer = lastPointerRef.current;
      if (
        drag === null ||
        !drag.lifted ||
        container === null ||
        drag.containerRect === null ||
        pointer === null ||
        edgeOvershoot(drag.containerRect, pointer.y) === 0
      ) {
        stopAutoScroll();
        return;
      }
      if (autoScrollFrameRef.current !== null) return;
      const step = () => {
        autoScrollFrameRef.current = null;
        const current = dragRef.current;
        const latest = lastPointerRef.current;
        if (
          current === null ||
          !current.lifted ||
          current.containerRect === null ||
          latest === null
        ) {
          return;
        }
        const overshoot = edgeOvershoot(current.containerRect, latest.y);
        if (overshoot === 0) return;
        const amount = Math.min(Math.ceil(Math.abs(overshoot) / 4), REORDER_AUTOSCROLL_MAX_STEP_PX);
        const before = container.scrollTop;
        container.scrollTop = before + (overshoot < 0 ? -amount : amount);
        // At the end of the scroll range there is nothing more to do until the
        // pointer moves again.
        if (container.scrollTop === before) return;
        autoScrollFrameRef.current = requestAnimationFrame(step);
      };
      autoScrollFrameRef.current = requestAnimationFrame(step);
    }, [stopAutoScroll]);

    const clearDrag = React.useCallback(() => {
      stopAutoScroll();
      for (const dispose of dragDisposersRef.current) dispose();
      dragDisposersRef.current = [];
      const drag = dragRef.current;
      dragRef.current = null;
      lastPointerRef.current = null;
      scrollContainerRef.current = null;
      if (drag?.lifted) {
        setLifted(null);
        setDropIndex(-1);
      }
    }, [stopAutoScroll]);

    const applyReorder = React.useCallback(
      (value: string, from: number, to: number) => {
        const next = [...valuesRef.current];
        next.splice(from, 1);
        next.splice(to, 0, value);
        const detail: DropdownMenuReorderDetail = {
          value,
          label: itemsRef.current.get(value)?.label ?? value,
          from,
          to,
          total: next.length,
        };
        onReorderRef.current(next, detail);
        setAnnouncement(getAnnouncementRef.current(detail));
      },
      [valuesRef, onReorderRef, getAnnouncementRef],
    );

    const endDrag = React.useCallback(
      (pointerId: number, commit: boolean) => {
        const drag = dragRef.current;
        if (drag === null || pointerId !== drag.pointerId) return;
        clearDrag();
        if (!commit || !drag.lifted) return;
        const current = valuesRef.current;
        const from = current.indexOf(drag.value);
        if (from === -1) return;
        const to = Math.max(
          0,
          Math.min(drag.dropIndex > from ? drag.dropIndex - 1 : drag.dropIndex, current.length - 1),
        );
        if (to === from) return;
        applyReorder(drag.value, from, to);
      },
      [clearDrag, applyReorder, valuesRef],
    );

    const startDrag = React.useCallback(
      (value: string, event: React.PointerEvent, element: HTMLDivElement) => {
        // One drag at a time: a second finger cannot hijack the first.
        if (dragRef.current !== null || groupRef.current === null) return false;
        dragRef.current = {
          value,
          pointerId: event.pointerId,
          element,
          startX: event.clientX,
          startY: event.clientY,
          offsetX: 0,
          offsetY: 0,
          lifted: false,
          dropIndex: -1,
          midpoints: [],
          edges: [],
          scrollTopAtMeasure: 0,
          containerRect: null,
        };
        lastPointerRef.current = { x: event.clientX, y: event.clientY };

        const view = element.ownerDocument.defaultView ?? window;
        // The row's own pointer handlers end the drag in the normal case. These
        // catch the pointer the row never sees again — the row unmounting
        // mid-drag (a list refetch) or its capture being lost — so a drag can't
        // be left half-finished with its listeners still attached.
        const onPointerUp = (pointerEvent: PointerEvent) => endDrag(pointerEvent.pointerId, true);
        const onPointerCancel = (pointerEvent: PointerEvent) =>
          endDrag(pointerEvent.pointerId, false);
        const onKeyDown = (keyEvent: KeyboardEvent) => {
          // Before the lift a press is still just a press: Escape must keep
          // closing the menu as usual.
          if (keyEvent.key !== "Escape" || dragRef.current?.lifted !== true) return;
          // Swallow it entirely so Radix's dismissable layer doesn't also close
          // the whole menu — Escape mid-drag only cancels the drag.
          keyEvent.preventDefault();
          keyEvent.stopPropagation();
          clearDrag();
        };
        view.addEventListener("pointerup", onPointerUp);
        view.addEventListener("pointercancel", onPointerCancel);
        view.addEventListener("keydown", onKeyDown, true);
        dragDisposersRef.current.push(() => {
          view.removeEventListener("pointerup", onPointerUp);
          view.removeEventListener("pointercancel", onPointerCancel);
          view.removeEventListener("keydown", onKeyDown, true);
        });
        return true;
      },
      [endDrag, clearDrag],
    );

    const lift = React.useCallback(
      (drag: ReorderDrag, pointer: { x: number; y: number }) => {
        const { element } = drag;
        const rect = element.getBoundingClientRect();
        drag.offsetX = drag.startX - rect.left;
        drag.offsetY = drag.startY - rect.top;

        const container = findScrollableAncestor(element);
        scrollContainerRef.current = container;
        if (container !== null) {
          // Covers both edge auto-scroll and the user wheel-scrolling mid-drag:
          // the pointer may not move again, so pointermove alone can't keep the
          // drop target honest.
          const onScroll = () => {
            const current = dragRef.current;
            const latest = lastPointerRef.current;
            if (current === null || !current.lifted || latest === null) return;
            refreshDropIndex(current, latest.y);
          };
          container.addEventListener("scroll", onScroll, { passive: true });
          dragDisposersRef.current.push(() => container.removeEventListener("scroll", onScroll));
        }

        measure(drag);
        drag.lifted = true;
        drag.dropIndex = computeDropIndex(drag, pointer.y);

        // The ghost is portalled to <body>, outside the menu's stacking context,
        // so it inherits none of the menu's z-index. Match the z the surface it
        // lifted from actually paints at — being appended later in the DOM keeps
        // the ghost above at equal z.
        setLifted({
          value: drag.value,
          width: rect.width,
          zIndex: surfaceZIndex(element) ?? "var(--fanvue-ui-portal-z-index, 50)",
        });
        setDropIndex(drag.dropIndex);
      },
      [measure, computeDropIndex, refreshDropIndex],
    );

    const updateDrag = React.useCallback(
      (event: React.PointerEvent) => {
        const drag = dragRef.current;
        if (drag === null || event.pointerId !== drag.pointerId) return;
        const pointer = { x: event.clientX, y: event.clientY };
        lastPointerRef.current = pointer;
        if (!drag.lifted) {
          if (
            Math.hypot(pointer.x - drag.startX, pointer.y - drag.startY) <=
            REORDER_LIFT_THRESHOLD_PX
          ) {
            return;
          }
          lift(drag, pointer);
        }
        positionGhost();
        refreshDropIndex(drag, pointer.y);
        updateAutoScroll();
      },
      [lift, positionGhost, refreshDropIndex, updateAutoScroll],
    );

    const moveItem = React.useCallback(
      (value: string, delta: number) => {
        const current = valuesRef.current;
        const from = current.indexOf(value);
        const to = from + delta;
        if (from === -1 || to < 0 || to >= current.length) return;
        applyReorder(value, from, to);
      },
      [applyReorder, valuesRef],
    );

    // Never leave listeners or a frame loop behind when the group goes away
    // mid-drag (the menu closing, for instance).
    React.useEffect(() => clearDrag, [clearDrag]);

    // The list changed under a drag: drop the drag if its row is gone, else
    // re-measure so the indicator tracks the rows' new positions.
    const previousValuesRef = React.useRef(values);
    React.useLayoutEffect(() => {
      if (shallowEqualArrays(previousValuesRef.current, values)) return;
      previousValuesRef.current = values;
      const drag = dragRef.current;
      if (drag === null) return;
      if (!values.includes(drag.value)) {
        clearDrag();
        return;
      }
      if (!drag.lifted) return;
      measure(drag);
      const pointer = lastPointerRef.current;
      if (pointer !== null) refreshDropIndex(drag, pointer.y);
    }, [values, clearDrag, measure, refreshDropIndex]);

    // Keyboard reachability inside a Radix menu. Radix parks focus on the menu
    // content when it opens and moves it only between menu items — which
    // these rows are not — so without help a keyboard user could never reach
    // a handle. When the menu opens straight into the group, the first handle
    // takes focus once Radix has finished its own focus work. And if focus has
    // fallen to <body> (the control that switched the menu into reorder mode
    // unmounted under it), Tab lands on the first handle instead of leaving
    // the menu for the page behind it.
    React.useEffect(() => {
      if (variant !== "menu") return;
      const group = groupRef.current;
      const menu = group?.closest<HTMLElement>('[role="menu"]') ?? null;
      // Nothing to do outside a menu (the sheet variant, or a bare group).
      if (group === null || menu === null) return;
      const doc = group.ownerDocument;
      const focusFirstHandle = () => {
        const handle = group.querySelector<HTMLElement>("button:not(:disabled)");
        if (handle === null) return false;
        handle.focus({ preventScroll: true });
        return true;
      };
      const frame = requestAnimationFrame(() => {
        const active = doc.activeElement;
        const parkedOnMenu = active === null || active === doc.body || active === menu;
        // A menu that also lists regular items keeps Radix's item-first
        // navigation; only claim focus when the group is all there is.
        const hasMenuItems = menu.querySelector('[role^="menuitem"]') !== null;
        if (parkedOnMenu && !hasMenuItems) focusFirstHandle();
      });
      const rescueTab = (event: KeyboardEvent) => {
        if (event.key !== "Tab" || event.altKey || event.ctrlKey || event.metaKey) return;
        const active = doc.activeElement;
        if (active !== null && active !== doc.body) return;
        if (menu.getAttribute("data-state") !== "open") return;
        if (focusFirstHandle()) event.preventDefault();
      };
      doc.addEventListener("keydown", rescueTab, true);
      return () => {
        cancelAnimationFrame(frame);
        doc.removeEventListener("keydown", rescueTab, true);
      };
    }, [variant]);

    const actions = React.useMemo<ReorderActions>(
      () => ({
        registerItem,
        registerGhost,
        startDrag,
        updateDrag,
        endDrag,
        moveItem,
        instructionsId,
      }),
      [registerItem, registerGhost, startDrag, updateDrag, endDrag, moveItem, instructionsId],
    );

    const drag = dragRef.current;
    const liftedFrom = lifted === null ? -1 : values.indexOf(lifted.value);
    const showDropIndicator =
      lifted !== null &&
      drag !== null &&
      dropIndex !== -1 &&
      dropIndex !== liftedFrom &&
      dropIndex !== liftedFrom + 1;

    return (
      // biome-ignore lint/a11y/useSemanticElements: <fieldset> carries form semantics and default styling we don't want inside a menu; role="group" is the correct ARIA pattern here
      <div
        ref={(node) => {
          groupRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        role="group"
        data-dropdown-menu-tab-stops=""
        className={cn("relative flex w-full flex-col", className)}
        {...props}
      >
        <ReorderActionsContext.Provider value={actions}>
          <ReorderLiftedContext.Provider value={lifted}>{children}</ReorderLiftedContext.Provider>
        </ReorderActionsContext.Provider>
        {showDropIndicator && (
          <div
            aria-hidden="true"
            data-reorder-indicator=""
            className="pointer-events-none absolute inset-x-3 z-10 flex -translate-y-1/2 items-center"
            style={{ top: drag.edges[dropIndex] }}
          >
            <span className="size-2 shrink-0 rounded-full bg-content-primary" />
            <span className="h-0.5 min-w-0 flex-1 rounded-full bg-content-primary" />
          </div>
        )}
        <span id={instructionsId} className="sr-only">
          {instructions}
        </span>
        {/* biome-ignore lint/a11y/useSemanticElements: <output> is not appropriate here; using role="status" for live region announcements */}
        <span role="status" aria-live="polite" className="sr-only">
          {announcement}
        </span>
      </div>
    );
  },
);
DropdownMenuReorderGroup.displayName = "DropdownMenuReorderGroup";
