import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import { DropdownMenuVariantContext } from "./context";
import {
  DragHandleDots,
  type ReorderActions,
  ReorderActionsContext,
  type ReorderLifted,
  ReorderLiftedContext,
} from "./reorderShared";

const INTERACTIVE_CONTROL_SELECTOR = 'button, a[href], input, select, textarea, [role="button"]';

// A drag starts from a primary mouse button anywhere on the row — except on
// another control inside it (a `trailing` action, say), which keeps its click
// and focus — or from the drag handle only for touch/pen, so the rest of the
// row still scrolls a long menu with a finger.
function canStartReorderDrag(event: React.PointerEvent, handle: HTMLElement | null): boolean {
  if (event.defaultPrevented || !(event.target instanceof Element)) return false;
  const onHandle = handle?.contains(event.target) === true;
  if (event.pointerType !== "mouse") return onHandle;
  if (event.button !== 0) return false;
  return onHandle || event.target.closest(INTERACTIVE_CONTROL_SELECTOR) === null;
}

// pointerdown's preventDefault (needed to stop text selection) also suppresses
// focus, so a plain click on the grip focuses it here — ArrowUp/Down then work.
function focusHandleAfterClick(event: React.PointerEvent, handle: HTMLElement | null): void {
  if (handle !== null && event.target instanceof Node && handle.contains(event.target)) {
    handle.focus({ preventScroll: true });
  }
}
// Icon, label and trailing slot of a row — rendered once in the row itself and
// again inside its floating copy while lifted.
function ReorderRowContent({
  leadingIcon,
  trailing,
  children,
}: Pick<DropdownMenuReorderItemProps, "leadingIcon" | "trailing" | "children">) {
  return (
    <>
      {leadingIcon != null && <span className="shrink-0">{leadingIcon}</span>}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {trailing != null && <span className="shrink-0">{trailing}</span>}
    </>
  );
}

// The floating copy of a lifted row. Anchored at the viewport origin and moved
// with a transform (see the group's positionGhost) so each pointer move is
// compositor work only.
function ReorderGhost({
  lifted,
  registerGhost,
  container,
  children,
}: {
  lifted: ReorderLifted;
  registerGhost: ReorderActions["registerGhost"];
  container: Element;
  children: React.ReactNode;
}) {
  return createPortal(
    <div
      aria-hidden="true"
      data-reorder-ghost=""
      ref={registerGhost}
      className="pointer-events-none fixed top-0 left-0 will-change-transform"
      style={{ width: lifted.width, zIndex: lifted.zIndex }}
    >
      {/*
       * The design draws the floating copy as frosted glass — a translucent
       * surface with a heavy backdrop blur and no drop shadow (the same
       * treatment the panel itself gets) — so what the ghost passes over
       * smears through it.
       */}
      <div className="overflow-hidden rounded-sm bg-surface-primary/65 backdrop-blur-[20px]">
        <div className="typography-body-small-14px-regular flex min-h-10 items-center gap-2 bg-neutral-alphas-100 py-2 pr-6 pl-3 text-content-primary">
          <DragHandleDots className="size-4 shrink-0 text-icons-tertiary" />
          {children}
        </div>
      </div>
    </div>,
    container,
  );
}

/** Props for the {@link DropdownMenuReorderItem} component. */
export interface DropdownMenuReorderItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Value identifying this item within the parent group's `values`. */
  value: string;
  /**
   * Plain-text name used in the group's screen-reader announcements and
   * reported in `onReorder`'s detail. Defaults to `children` when that is a
   * string or number, then to `value` — so pass it whenever `value` is an id.
   */
  label?: string;
  /** Icon (or other node) rendered between the drag handle and the label. */
  leadingIcon?: React.ReactNode;
  /** Content rendered at the end of the row, e.g. an item count. */
  trailing?: React.ReactNode;
  /** Accessible label for the drag handle button. @default "Reorder" */
  dragHandleLabel?: string;
  /** Disables dragging and keyboard reordering for this item. @default false */
  disabled?: boolean;
}

/**
 * A draggable row within a {@link DropdownMenuReorderGroup}. Shows the drag
 * handle grip, dims in place while its floating copy follows the pointer, and
 * supports ArrowUp/ArrowDown reordering when the handle has focus.
 */
export const DropdownMenuReorderItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuReorderItemProps
>(
  (
    {
      value,
      label,
      leadingIcon,
      trailing,
      dragHandleLabel = "Reorder",
      disabled,
      className,
      children,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      ...props
    },
    ref,
  ) => {
    const actions = React.useContext(ReorderActionsContext);
    const lifted = React.useContext(ReorderLiftedContext);
    const variant = React.useContext(DropdownMenuVariantContext);
    const elementRef = React.useRef<HTMLDivElement | null>(null);
    const handleRef = React.useRef<HTMLButtonElement | null>(null);
    const liftedHere = lifted !== null && lifted.value === value ? lifted : null;
    const isLifted = liftedHere !== null;
    const resolvedLabel =
      label ??
      (typeof children === "string" || typeof children === "number" ? String(children) : value);
    const grabCursor = isLifted ? "cursor-grabbing" : "cursor-grab";
    // The design dims the lifted source row as a whole — 60% opacity over its
    // own colours — rather than swapping to the disabled tone.
    const rowStateClasses = disabled
      ? "cursor-default text-content-disabled"
      : cn(grabCursor, isLifted ? "opacity-60" : "hover:bg-neutral-alphas-50");
    const handleStateClasses = disabled
      ? "cursor-not-allowed [&>svg]:text-content-disabled"
      : grabCursor;

    const setElement = React.useCallback(
      (node: HTMLDivElement | null) => {
        elementRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    // Registered from an effect, not the ref callback, so re-renders don't
    // churn the group's registry with a delete + set per row.
    React.useLayoutEffect(() => {
      const element = elementRef.current;
      if (actions === null || element === null) return;
      actions.registerItem(value, { element, label: resolvedLabel });
      return () => actions.registerItem(value, null);
    }, [actions, value, resolvedLabel]);

    const rowContent = (
      <ReorderRowContent leadingIcon={leadingIcon} trailing={trailing}>
        {children}
      </ReorderRowContent>
    );

    return (
      <div
        ref={setElement}
        data-dragging={isLifted || undefined}
        className={cn(
          "typography-body-small-14px-regular group relative flex min-h-10 w-full select-none items-center gap-2 rounded-sm px-3 py-2 text-content-primary",
          variant === "sheet" && "mx-3 w-auto",
          rowStateClasses,
          className,
        )}
        {...props}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          const element = elementRef.current;
          if (disabled || actions === null || element === null) return;
          if (!canStartReorderDrag(event, handleRef.current)) return;
          if (!actions.startDrag(value, event, element)) return;
          event.preventDefault();
          element.setPointerCapture?.(event.pointerId);
        }}
        onPointerMove={(event) => {
          onPointerMove?.(event);
          actions?.updateDrag(event);
        }}
        onPointerUp={(event) => {
          onPointerUp?.(event);
          actions?.endDrag(event.pointerId, true);
          if (!isLifted) focusHandleAfterClick(event, handleRef.current);
        }}
        onPointerCancel={(event) => {
          onPointerCancel?.(event);
          actions?.endDrag(event.pointerId, false);
        }}
      >
        <button
          ref={handleRef}
          type="button"
          aria-label={dragHandleLabel}
          aria-describedby={actions?.instructionsId}
          disabled={disabled}
          className={cn(
            "relative flex size-4 shrink-0 touch-none items-center justify-center rounded-2xs outline-none focus-visible:shadow-focus-ring",
            // The grip draws at 16px but is the only touch drag affordance, so
            // its hit area extends 12px each way to the row's edges — a 40px
            // target — without changing the glyph.
            "before:absolute before:-inset-3 before:content-['']",
            handleStateClasses,
          )}
          onKeyDown={(event) => {
            if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
            event.preventDefault();
            event.stopPropagation();
            actions?.moveItem(value, event.key === "ArrowUp" ? -1 : 1);
          }}
        >
          <DragHandleDots className="size-4 text-icons-tertiary" />
        </button>
        {rowContent}
        {liftedHere !== null && actions !== null && (
          <ReorderGhost
            lifted={liftedHere}
            registerGhost={actions.registerGhost}
            container={elementRef.current?.ownerDocument.body ?? document.body}
          >
            {rowContent}
          </ReorderGhost>
        )}
      </div>
    );
  },
);
DropdownMenuReorderItem.displayName = "DropdownMenuReorderItem";
