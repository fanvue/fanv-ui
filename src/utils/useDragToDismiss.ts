import * as React from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const DRAG_START_THRESHOLD_PX = 8;
const DISMISS_DISTANCE_RATIO = 0.25;
const DISMISS_VELOCITY_PX_PER_MS = 0.5;
const FLICK_WINDOW_MS = 100;
const SNAP_BACK_TRANSITION = "transform 200ms ease-out";
const NON_DRAGGABLE_TARGETS = "input, textarea, select, [contenteditable='true']";

/**
 * Whether a released sheet drag should dismiss the sheet: past a quarter of
 * the sheet's height, or a fast downward flick at any distance.
 */
export function shouldDismissDrag({
  offset,
  height,
  velocity,
}: {
  offset: number;
  height: number;
  velocity: number;
}): boolean {
  if (offset <= 0) return false;
  return offset >= height * DISMISS_DISTANCE_RATIO || velocity >= DISMISS_VELOCITY_PX_PER_MS;
}

type DragHandlers = {
  onPointerDown?: React.PointerEventHandler<HTMLDivElement>;
  onPointerMove?: React.PointerEventHandler<HTMLDivElement>;
  onPointerUp?: React.PointerEventHandler<HTMLDivElement>;
  onPointerCancel?: React.PointerEventHandler<HTMLDivElement>;
};

type ActiveDrag = {
  pointerId: number;
  element: HTMLDivElement;
  startY: number;
  startX: number;
  lastY: number;
  lastTime: number;
  velocity: number;
  dragging: boolean;
  stopBlockingTouchScroll: () => void;
};

export interface UseDragToDismissOptions {
  /** Whether dragging is active at all. */
  enabled: boolean;
  /** Called once a release passes the dismiss threshold. */
  onDismiss: () => void;
  /** Media query that must match for a drag to start, e.g. to limit it to mobile. */
  media?: string;
}

function isScrolledAwayFromTop(target: EventTarget | null, container: HTMLElement): boolean {
  let node = target instanceof HTMLElement ? target : null;
  while (node && node !== container) {
    if (node.scrollTop > 0) return true;
    node = node.parentElement;
  }
  return container.scrollTop > 0;
}

function blockTouchScrollWhileDragging(
  element: HTMLElement,
  getDrag: () => ActiveDrag | null,
): () => void {
  const onTouchMove = (event: TouchEvent) => {
    const drag = getDrag();
    const touch = event.touches[0];
    if (!drag || !touch) return;
    const offset = touch.clientY - drag.startY;
    if (drag.dragging || offset > Math.abs(touch.clientX - drag.startX)) event.preventDefault();
  };
  element.addEventListener("touchmove", onTouchMove, { passive: false });
  return () => element.removeEventListener("touchmove", onTouchMove);
}

/**
 * Composes the consumer's pointer handlers with drag-down-to-dismiss for a
 * bottom sheet. The sheet follows the pointer downwards, and on release either
 * dismisses or snaps back. A drag never starts inside a form field or inside
 * scrollable content that is not scrolled to the top, so it does not fight
 * text selection or scrolling.
 */
export function useDragToDismiss<P extends DragHandlers>(
  { enabled, onDismiss, media }: UseDragToDismissOptions,
  props: P,
): P & Required<DragHandlers> {
  const dragRef = React.useRef<ActiveDrag | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const snapBack = (element: HTMLDivElement) => {
    element.style.transition = prefersReducedMotion ? "" : SNAP_BACK_TRANSITION;
    element.style.transform = "";
  };

  const release = (drag: ActiveDrag, dismiss: boolean) => {
    dragRef.current = null;
    drag.stopBlockingTouchScroll();
    drag.element.releasePointerCapture?.(drag.pointerId);
    if (!drag.dragging) return;
    if (!dismiss) {
      snapBack(drag.element);
      return;
    }
    onDismiss();
    requestAnimationFrame(() => {
      if (drag.element.isConnected && drag.element.dataset.state !== "closed") {
        snapBack(drag.element);
      }
    });
  };

  return {
    ...props,
    onPointerDown(event) {
      props.onPointerDown?.(event);
      if (!enabled || event.defaultPrevented || event.button !== 0) return;
      if (media && typeof window.matchMedia === "function" && !window.matchMedia(media).matches)
        return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest(NON_DRAGGABLE_TARGETS)) return;
      if (isScrolledAwayFromTop(event.target, event.currentTarget)) return;
      const element = event.currentTarget;
      dragRef.current = {
        pointerId: event.pointerId,
        element,
        startY: event.clientY,
        startX: event.clientX,
        lastY: event.clientY,
        lastTime: event.timeStamp,
        velocity: 0,
        dragging: false,
        stopBlockingTouchScroll: blockTouchScrollWhileDragging(element, () => dragRef.current),
      };
    },
    onPointerMove(event) {
      props.onPointerMove?.(event);
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;
      const offset = event.clientY - drag.startY;
      if (!drag.dragging) {
        const dx = Math.abs(event.clientX - drag.startX);
        if (Math.max(Math.abs(offset), dx) < DRAG_START_THRESHOLD_PX) return;
        if (offset <= dx) {
          release(drag, false);
          return;
        }
        drag.dragging = true;
        drag.element.setPointerCapture?.(event.pointerId);
        drag.element.style.transition = "none";
      }
      const elapsed = event.timeStamp - drag.lastTime;
      if (elapsed > 0) drag.velocity = (event.clientY - drag.lastY) / elapsed;
      drag.lastY = event.clientY;
      drag.lastTime = event.timeStamp;
      drag.element.style.transform = `translate3d(0, ${Math.max(offset, 0)}px, 0)`;
    },
    onPointerUp(event) {
      props.onPointerUp?.(event);
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;
      const dismiss = shouldDismissDrag({
        offset: event.clientY - drag.startY,
        height: drag.element.getBoundingClientRect().height,
        velocity: event.timeStamp - drag.lastTime > FLICK_WINDOW_MS ? 0 : drag.velocity,
      });
      release(drag, dismiss);
    },
    onPointerCancel(event) {
      props.onPointerCancel?.(event);
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;
      release(drag, false);
    },
  };
}
