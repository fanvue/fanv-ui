import * as ToastPrimitive from "@radix-ui/react-toast";
import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../Button/Button";
import { TickCircleIcon } from "../Icons/TickCircleIcon";
import { TrashIcon } from "../Icons/TrashIcon";

/** Outcome the prompt confirms: a completed change, or a removal. */
export type UndoAlertPromptType = "positive" | "removed";

export interface UndoAlertPromptProps
  extends Omit<React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>, "type" | "title"> {
  /** Outcome being confirmed. Drives the leading icon. @default "positive" */
  type?: UndoAlertPromptType;
  /** Short confirmation of what just happened, e.g. "Template moved". */
  title: string;
  /** Called when the user activates the undo button. The prompt closes afterwards. */
  onUndo: () => void;
  /** Label for the undo button. @default "Undo" */
  undoLabel?: string;
  /**
   * Describes an alternative way to undo, announced to screen reader users
   * who cannot reach the button before the prompt dismisses. @default undoLabel
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
 * the user can reverse it without leaving their flow.
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
    { className, type = "positive", title, onUndo, undoLabel = "Undo", undoAltText, ...props },
    ref,
  ) => {
    return (
      <ToastPrimitive.Root
        ref={ref}
        data-testid="undo-alert-prompt"
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
        <ToastPrimitive.Action altText={undoAltText ?? undoLabel} asChild>
          <Button
            variant="secondary"
            negative
            size="24"
            onClick={onUndo}
            className="typography-description-12px-semibold shrink-0 rounded-xs"
          >
            {undoLabel}
          </Button>
        </ToastPrimitive.Action>
      </ToastPrimitive.Root>
    );
  },
);

UndoAlertPrompt.displayName = "UndoAlertPrompt";
