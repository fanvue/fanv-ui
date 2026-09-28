import * as ToastPrimitive from "@radix-ui/react-toast";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../Button/Button";
import { TickCircleIcon } from "../Icons/TickCircleIcon";
import { TickIcon } from "../Icons/TickIcon";
import { TrashIcon } from "../Icons/TrashIcon";

/** Outcome the prompt confirms: a completed change, or a removal. */
export type UndoAlertPromptType = "positive" | "removed";

export interface UndoAlertPromptProps
  extends Omit<React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>, "type" | "title"> {
  /** Outcome being confirmed. Drives the leading icon. @default "positive" */
  type?: UndoAlertPromptType;
  /**
   * Confirmation of the action that just completed. Write it for the action
   * being undone, e.g. "Folder deleted", "Template moved" or
   * "3 messages archived". Accepts rich content for emphasising an item name.
   */
  title: React.ReactNode;
  /**
   * Called once when the user activates the undo button. The button then
   * confirms with `undoneLabel` and a trailing tick, and the prompt closes after
   * `undoneDuration`.
   */
  onUndo: () => void;
  /** Label for the undo button. @default "Undo" */
  undoLabel?: string;
  /** Label shown on the button once the undo has been triggered. @default "Undone" */
  undoneLabel?: string;
  /**
   * How long the "Undone" confirmation stays visible before the prompt closes,
   * in ms. Pass `Infinity` to keep it open. @default 1500
   */
  undoneDuration?: number;
  /**
   * Describes an alternative way to undo, announced to screen reader users
   * who cannot reach the button before the prompt dismisses. Word it for the
   * action, e.g. "Restore the folder from Recently deleted". @default undoLabel
   */
  undoAltText?: string;
}

const TypeIcon = ({ type }: { type: UndoAlertPromptType }) =>
  type === "removed" ? (
    <TrashIcon size={16} filled className="text-alerts-toast-icon-error" />
  ) : (
    <TickCircleIcon size={16} filled className="text-alerts-toast-icon-success" />
  );

/**
 * A compact, auto-dismissing confirmation with a single undo action. Use it
 * straight after a reversible change, such as moving or deleting an item, so
 * the user can reverse it without leaving their flow. The copy is not fixed:
 * pass a `title` describing the action that just happened, and pick `type`
 * by outcome (`removed` for deletions, `positive` for everything else).
 *
 * Activating Undo calls `onUndo` once, swaps the button to "Undone" with a
 * trailing tick, then closes the prompt after `undoneDuration`.
 *
 * Use inside a {@link ToastProvider} with a {@link ToastViewport}.
 *
 * @example
 * ```tsx
 * <UndoAlertPrompt type="removed" title="Folder deleted" onUndo={restoreFolder} />
 * ```
 */
export const UndoAlertPrompt = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Root>,
  UndoAlertPromptProps
>(
  (
    {
      className,
      type = "positive",
      title,
      onUndo,
      undoLabel = "Undo",
      undoneLabel = "Undone",
      undoneDuration = 1500,
      undoAltText,
      open: openProp,
      defaultOpen,
      onOpenChange,
      duration,
      ...props
    },
    ref,
  ) => {
    const [open = true, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen ?? true,
      onChange: onOpenChange,
    });
    const [undone, setUndone] = React.useState(false);
    const [prevOpen, setPrevOpen] = React.useState(open);

    if (open !== prevOpen) {
      setPrevOpen(open);
      if (open) setUndone(false);
    }

    React.useEffect(() => {
      if (!undone || !Number.isFinite(undoneDuration)) return;
      const timer = setTimeout(() => setOpen(false), undoneDuration);
      return () => clearTimeout(timer);
    }, [undone, undoneDuration, setOpen]);

    const handleUndo = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (undone) return;
      setUndone(true);
      onUndo();
    };

    return (
      <ToastPrimitive.Root
        ref={ref}
        data-testid="undo-alert-prompt"
        data-undone={undone || undefined}
        open={open}
        onOpenChange={setOpen}
        duration={undone ? Number.POSITIVE_INFINITY : duration}
        className={cn(
          "group pointer-events-auto relative flex w-fit max-w-full items-center gap-6 overflow-hidden rounded-md bg-surface-primary-inverted py-3 pr-3 pl-4 text-content-primary-inverted shadow-md transition-all",
          "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-(--radix-toast-swipe-end-x) data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[state=closed]:animate-out data-[state=open]:animate-in data-[swipe=end]:animate-out data-[swipe=move]:transition-none",
          className,
        )}
        {...props}
      >
        <div className="flex min-w-0 items-start gap-3 py-1 pr-1">
          <div className="flex shrink-0 items-center pt-px">
            <TypeIcon type={type} />
          </div>
          <ToastPrimitive.Title className="typography-body-small-14px-semibold min-w-0">
            {title}
          </ToastPrimitive.Title>
        </div>
        <ToastPrimitive.Action altText={undoAltText ?? undoLabel} onClick={handleUndo} asChild>
          <Button
            variant="secondary"
            negative
            size="24"
            aria-disabled={undone || undefined}
            rightIcon={
              undone ? (
                <TickIcon data-testid="undone-tick" className="motion-safe:animate-undo-tick-in" />
              ) : undefined
            }
            className={cn(
              "typography-description-12px-semibold shrink-0 rounded-xs",
              undone && "cursor-default hover:bg-buttons-secondary-negative-default",
            )}
          >
            {undone ? undoneLabel : undoLabel}
          </Button>
        </ToastPrimitive.Action>
        <span className="sr-only" aria-live="polite" data-testid="undone-announcement">
          {undone ? undoneLabel : ""}
        </span>
      </ToastPrimitive.Root>
    );
  },
);

UndoAlertPrompt.displayName = "UndoAlertPrompt";
