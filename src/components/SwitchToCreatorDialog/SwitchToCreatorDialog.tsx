import * as React from "react";
import { Button } from "../Button/Button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../Dialog/Dialog";
import { UsersIcon } from "../Icons/UsersIcon";

export interface SwitchToCreatorDialogProps {
  /** Controlled open state of the dialog. */
  open?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Called when the user clicks the switch account button. */
  onSwitchAccount?: () => void;
  /** Label for the switch account button. @default "Switch Account" */
  switchAccountLabel?: string;
  /** Label for the cancel button. @default "Cancel" */
  cancelLabel?: string;
  /** Dialog title. @default "Switch to Creator Account" */
  title?: string;
  /** Dialog description text. */
  description?: string;
}

/**
 * A dialog prompting agency managers to switch to a creator account.
 *
 * Use this when an agency manager tries to perform an action (like purchasing
 * an app) that requires a creator account.
 *
 * @example
 * ```tsx
 * <SwitchToCreatorDialog
 *   open={showDialog}
 *   onOpenChange={setShowDialog}
 *   onSwitchAccount={() => navigate('/switch-account')}
 *   description="To purchase this app, please switch to a creator account."
 * />
 * ```
 */
export const SwitchToCreatorDialog = React.forwardRef<
  React.ComponentRef<typeof DialogContent>,
  SwitchToCreatorDialogProps
>(
  (
    {
      open,
      onOpenChange,
      onSwitchAccount,
      switchAccountLabel = "Switch Account",
      cancelLabel = "Cancel",
      title = "Switch to Creator Account",
      description = "To complete this purchase, please switch to a creator account. You can select any creator account you manage.",
    },
    ref,
  ) => {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={ref} size="sm">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-brand-primary-muted">
                <UsersIcon className="size-8 text-brand-primary" />
              </div>
              <DialogDescription>{description}</DialogDescription>
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">{cancelLabel}</Button>
            </DialogClose>
            <Button variant="brand" onClick={onSwitchAccount}>
              {switchAccountLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

SwitchToCreatorDialog.displayName = "SwitchToCreatorDialog";
