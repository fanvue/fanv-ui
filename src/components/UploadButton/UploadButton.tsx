import * as React from "react";
import { IconButton, type IconButtonProps, type IconButtonVariant } from "../IconButton/IconButton";
import { SpinnerIcon } from "../Icons/SpinnerIcon";
import { UploadCloudIcon } from "../Icons/UploadCloudIcon";

/**
 * Upload lifecycle state of the button. Drives the icon and colour:
 * `idle` shows the upload icon, `uploading` shows a spinner and marks the
 * button busy, and `error` switches to the destructive treatment for retry.
 */
export type UploadButtonStatus = "idle" | "uploading" | "error";

const STATUS_VARIANT: Record<UploadButtonStatus, IconButtonVariant> = {
  idle: "primary",
  uploading: "primary",
  error: "error",
};

const STATUS_LABEL: Record<UploadButtonStatus, string> = {
  idle: "Upload",
  uploading: "Uploading",
  error: "Upload failed, try again",
};

export interface UploadButtonProps
  extends Omit<IconButtonProps, "icon" | "variant" | "aria-label"> {
  /** Upload lifecycle state; drives the icon and colour. @default "idle" */
  status?: UploadButtonStatus;
  /** Icon shown in the `idle` and `error` states. @default `<UploadCloudIcon />` */
  icon?: React.ReactNode;
  /**
   * Accessible name. Falls back to a status-aware default (e.g. "Uploading")
   * when omitted so screen readers always announce the current state.
   */
  "aria-label"?: string;
}

/**
 * A circular icon button dedicated to file uploads. It owns the upload
 * lifecycle so consumers flip a single `status` prop instead of wiring up an
 * {@link IconButton} with a spinner and icon swap: `idle` shows the upload
 * icon, `uploading` shows a busy spinner, and `error` turns destructive for
 * retry. Clicks are ignored while `uploading`.
 *
 * @example
 * ```tsx
 * <UploadButton status={status} onClick={startUpload} aria-label="Upload avatar" />
 * ```
 */
export const UploadButton = React.forwardRef<HTMLButtonElement, UploadButtonProps>(
  ({ status = "idle", icon, onClick, "aria-label": ariaLabel, ...props }, ref) => {
    const isUploading = status === "uploading";
    const defaultIcon = icon ?? <UploadCloudIcon />;
    const content = isUploading ? <SpinnerIcon className="animate-spin" /> : defaultIcon;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isUploading) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    return (
      <IconButton
        ref={ref}
        variant={STATUS_VARIANT[status]}
        icon={content}
        aria-label={ariaLabel ?? STATUS_LABEL[status]}
        aria-busy={isUploading || undefined}
        onClick={handleClick}
        {...props}
      />
    );
  },
);

UploadButton.displayName = "UploadButton";
