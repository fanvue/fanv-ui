import * as React from "react";
import { IconButton, type IconButtonProps, type IconButtonVariant } from "../IconButton/IconButton";
import { MicrophoneIcon } from "../Icons/MicrophoneIcon";
import { StopIcon } from "../Icons/StopIcon";

/**
 * Recording state of the button. Drives the icon and colour: `idle` shows the
 * microphone to start a recording, `recording` shows the stop glyph with the
 * destructive treatment to end it.
 */
export type AudioRecordButtonStatus = "idle" | "recording";

const STATUS_VARIANT: Record<AudioRecordButtonStatus, IconButtonVariant> = {
  idle: "primary",
  recording: "error",
};

const STATUS_ICON: Record<AudioRecordButtonStatus, React.ReactNode> = {
  idle: <MicrophoneIcon />,
  recording: <StopIcon />,
};

const STATUS_LABEL: Record<AudioRecordButtonStatus, string> = {
  idle: "Record",
  recording: "Stop recording",
};

export interface AudioRecordButtonProps
  extends Omit<IconButtonProps, "icon" | "variant" | "aria-label"> {
  /** Recording state; drives the icon and colour. @default "idle" */
  status?: AudioRecordButtonStatus;
  /**
   * Accessible name. Falls back to a status-aware default ("Record" /
   * "Stop recording") when omitted so screen readers announce the action.
   */
  "aria-label"?: string;
}

/**
 * A circular icon button that toggles audio recording. It owns the record
 * lifecycle so consumers flip a single `status` prop instead of swapping an
 * {@link IconButton}'s icon and colour: `idle` shows the microphone to start,
 * `recording` turns destructive with a stop glyph to end. Used by
 * {@link AudioUpload} for its in-progress stop control.
 *
 * @example
 * ```tsx
 * <AudioRecordButton status={recording ? "recording" : "idle"} onClick={toggle} />
 * ```
 */
export const AudioRecordButton = React.forwardRef<HTMLButtonElement, AudioRecordButtonProps>(
  ({ status = "idle", "aria-label": ariaLabel, ...props }, ref) => {
    return (
      <IconButton
        ref={ref}
        variant={STATUS_VARIANT[status]}
        icon={STATUS_ICON[status]}
        aria-label={ariaLabel ?? STATUS_LABEL[status]}
        {...props}
      />
    );
  },
);

AudioRecordButton.displayName = "AudioRecordButton";
