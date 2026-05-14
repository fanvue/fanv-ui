import * as React from "react";

const TAP_MOVEMENT_THRESHOLD_PX = 10;

type ActiveTap = {
  pointerId: number;
  x: number;
  y: number;
  movedPastThreshold: boolean;
};

type GatedHandlers = {
  onPointerDown?: React.PointerEventHandler;
  onPointerMove?: React.PointerEventHandler;
  onPointerCancel?: React.PointerEventHandler;
  onClick?: React.MouseEventHandler;
};

/**
 * Composes the consumer's pointer/click handlers with a touch-drag tracker
 * that suppresses the synthetic click an Android Chrome scroll-drag-end can
 * dispatch on a click-based Radix trigger (Popover / Dialog / Drawer).
 *
 * On touch / pen input, if the press-and-release crosses a movement threshold,
 * the subsequent `click` is preventDefault'd — short-circuiting Radix's own
 * `onOpenToggle` via `composeEventHandlers` — and stopPropagation'd so it
 * doesn't bubble to ancestors. Mouse input passes through unchanged because
 * mouse never triggers the Android scroll-drag bug class.
 *
 * Related: radix-ui/primitives#1912 (DropdownMenu pointerdown variant) and
 * #2702 (DismissableLayer touch dismiss). For the DropdownMenu pointerdown
 * variant see `components/DropdownMenu/DropdownMenu.tsx`.
 */
export function useSuppressClickAfterDrag<P extends GatedHandlers = GatedHandlers>(
  props?: P,
): P & Required<GatedHandlers> {
  const tapRef = React.useRef<ActiveTap | null>(null);
  const consumer = props ?? ({} as P);

  return {
    ...consumer,
    onPointerDown(event) {
      consumer.onPointerDown?.(event);
      if (event.pointerType === "mouse") {
        tapRef.current = null;
        return;
      }
      // Keep pointermove on this element if the finger drifts off.
      // Optional because jsdom (used in tests) doesn't implement it.
      event.currentTarget.setPointerCapture?.(event.pointerId);
      tapRef.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        movedPastThreshold: false,
      };
    },
    onPointerMove(event) {
      consumer.onPointerMove?.(event);
      const tap = tapRef.current;
      if (tap === null || event.pointerId !== tap.pointerId || tap.movedPastThreshold) return;
      const dx = event.clientX - tap.x;
      const dy = event.clientY - tap.y;
      if (Math.hypot(dx, dy) > TAP_MOVEMENT_THRESHOLD_PX) {
        tap.movedPastThreshold = true;
      }
    },
    onPointerCancel(event) {
      consumer.onPointerCancel?.(event);
      const tap = tapRef.current;
      if (tap !== null && event.pointerId === tap.pointerId) {
        tapRef.current = null;
      }
    },
    onClick(event) {
      const tap = tapRef.current;
      tapRef.current = null;
      if (tap?.movedPastThreshold) {
        // preventDefault stops Radix's onClick → onOpenToggle via
        // composeEventHandlers. stopPropagation prevents the synthetic click
        // from bubbling to ancestor click handlers.
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      consumer.onClick?.(event);
    },
  };
}
