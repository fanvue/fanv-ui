import * as React from "react";
import { cn } from "@/utils/cn";
import { Button } from "../Button/Button";
import { MicrophoneIcon } from "../Icons/MicrophoneIcon";
import { StopIcon } from "../Icons/StopIcon";
import { UploadCloudIcon } from "../Icons/UploadCloudIcon";
import { AudioWaveform } from "./AudioWaveform";
import { type AudioValidationError, formatAudioTime, validateAudioFile } from "./audioUtils";
import {
  DEFAULT_ACCEPTED_TYPES,
  DEFAULT_MAX_FILE_SIZE,
  DEFAULT_MAX_RECORDING_DURATION,
  DEFAULT_MIN_RECORDING_DURATION,
} from "./constants";
import { useAudioRecorder } from "./useAudioRecorder";

/** A file that was rejected during drop or browse, along with the reasons. */
export interface AudioFileRejection {
  /** The rejected file. */
  file: File;
  /** One or more validation errors explaining why the file was rejected. */
  errors: AudioValidationError[];
}

export interface AudioUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop"> {
  /** Maximum file size in bytes. @default 10_485_760 (10MB) */
  maxFileSize?: number;
  /** Accepted audio MIME types. @default DEFAULT_ACCEPTED_TYPES */
  accept?: readonly string[];
  /** Maximum number of files per drop. @default 1 */
  maxFiles?: number;
  /** Whether to show the record audio button. @default true */
  allowRecording?: boolean;
  /** Maximum recording duration in seconds. @default 30 */
  maxRecordingDuration?: number;
  /** Minimum recording duration in seconds. @default 5 */
  minRecordingDuration?: number;

  /** Called when valid files are accepted via drop or browse */
  onFilesAccepted?: (files: File[]) => void;
  /** Called when files are rejected (wrong type, too large, etc.) */
  onFilesRejected?: (rejections: AudioFileRejection[]) => void;
  /** Called when a recording completes and meets minimum duration */
  onRecordingComplete?: (blob: Blob, durationMs: number) => void;
  /** Called when recording is stopped but does not meet minimum duration */
  onRecordingTooShort?: (durationMs: number, minDurationMs: number) => void;
  /** Called when microphone permission is denied or unavailable */
  onPermissionError?: (error: Error) => void;
  /** Called when an unexpected recording error occurs */
  onRecordingError?: (error: Error) => void;

  /** Upload area title text. @default "Click to upload, or drag & drop" */
  uploadTitle?: string;
  /** Upload area description text. @default "Audio files only, up to 10MB each" */
  uploadDescription?: string;
  /** Separator text between upload and record. @default "or" */
  separatorText?: string;
  /** Record button label. @default "Record audio" */
  recordButtonLabel?: string;
  /** Stop recording button aria-label. @default "Stop recording" */
  stopButtonAriaLabel?: string;

  /** Whether the component is disabled. @default false */
  disabled?: boolean;
}

function partitionFiles(
  files: File[],
  maxFileSize: number,
  accept: readonly string[],
  maxFiles: number,
): { accepted: File[]; rejected: AudioFileRejection[] } {
  const accepted: File[] = [];
  const rejected: AudioFileRejection[] = [];

  for (const file of files) {
    const errors = validateAudioFile(file, { maxFileSize, acceptedTypes: accept });
    if (errors.length > 0) {
      rejected.push({ file, errors });
    } else {
      accepted.push(file);
    }
  }

  if (maxFiles > 0 && accepted.length > maxFiles) {
    const excess = accepted.splice(maxFiles);
    for (const file of excess) {
      rejected.push({
        file,
        errors: [{ code: "too-many-files", message: `Too many files. Maximum is ${maxFiles}` }],
      });
    }
  }

  return { accepted, rejected };
}

/**
 * Audio file upload with drag-and-drop and optional in-browser recording.
 * Supports file validation, multiple files, and real-time waveform visualization during recording.
 *
 * @example
 * ```tsx
 * <AudioUpload
 *   onFilesAccepted={(files) => console.log(files)}
 *   onRecordingComplete={(blob, duration) => console.log(blob, duration)}
 * />
 * ```
 */
export const AudioUpload = React.forwardRef<HTMLDivElement, AudioUploadProps>(
  (
    {
      className,
      maxFileSize = DEFAULT_MAX_FILE_SIZE,
      accept = DEFAULT_ACCEPTED_TYPES,
      maxFiles = 1,
      allowRecording = true,
      maxRecordingDuration = DEFAULT_MAX_RECORDING_DURATION,
      minRecordingDuration = DEFAULT_MIN_RECORDING_DURATION,
      onFilesAccepted,
      onFilesRejected,
      onRecordingComplete,
      onRecordingTooShort,
      onPermissionError,
      onRecordingError,
      uploadTitle = "Click to upload, or drag & drop",
      uploadDescription = "Audio files only, up to 10MB each",
      separatorText = "or",
      recordButtonLabel = "Record audio",
      stopButtonAriaLabel = "Stop recording",
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const inputId = React.useId();
    const descriptionId = React.useId();
    const [isDragActive, setIsDragActive] = React.useState(false);
    const stopButtonRef = React.useRef<HTMLButtonElement>(null);

    const {
      isRecording,
      elapsedMs,
      startRecording,
      stopRecording,
      analyserNode,
      isSupported: isRecordingSupported,
    } = useAudioRecorder({
      maxDuration: maxRecordingDuration,
      minDuration: minRecordingDuration,
      onComplete: onRecordingComplete,
      onTooShort: onRecordingTooShort,
      onPermissionError,
      onError: onRecordingError,
    });

    const acceptString = accept.join(",");

    // Move focus to stop button when recording starts
    React.useEffect(() => {
      if (isRecording) {
        stopButtonRef.current?.focus();
      }
    }, [isRecording]);

    const validateAndAcceptFiles = React.useCallback(
      (files: FileList | File[]) => {
        const { accepted, rejected } = partitionFiles(
          Array.from(files),
          maxFileSize,
          accept,
          maxFiles,
        );
        if (accepted.length > 0) onFilesAccepted?.(accepted);
        if (rejected.length > 0) onFilesRejected?.(rejected);
      },
      [maxFileSize, accept, maxFiles, onFilesAccepted, onFilesRejected],
    );

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (disabled) return;

      const { files } = e.dataTransfer;
      if (files.length > 0) {
        validateAndAcceptFiles(files);
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragActive(true);
      }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;
      if (files && files.length > 0) {
        validateAndAcceptFiles(files);
      }
      // Reset input so same file can be selected again
      e.target.value = "";
    };

    const handleRecordClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      startRecording();
    };

    const handleStopClick = () => {
      stopRecording();
    };

    if (isRecording) {
      const formattedElapsed = formatAudioTime(elapsedMs);

      return (
        // biome-ignore lint/a11y/useSemanticElements: <fieldset> would break the public HTMLDivElement ref/props API
        <div
          ref={ref}
          role="group"
          aria-label="Audio recording in progress"
          data-testid="audio-upload"
          data-state="recording"
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-xl bg-neutral-100 px-4 py-3",
            className,
          )}
          {...props}
        >
          <div className="flex flex-1 flex-col items-center gap-2">
            <div
              className="flex size-[72px] items-center justify-center rounded-full bg-neutral-400"
              aria-hidden="true"
            >
              <MicrophoneIcon className="size-5 text-body-300" />
            </div>

            <p
              role="timer"
              aria-label="Recording time"
              className="typography-body-1-regular text-body-100"
            >
              {formattedElapsed} / {formatAudioTime(maxRecordingDuration * 1000)}
            </p>
          </div>

          <div className="flex w-full items-center gap-2.5" aria-hidden="true">
            <AudioWaveform
              analyserNode={analyserNode}
              isRecording={isRecording}
              className="flex-1"
            />
          </div>

          <button
            ref={stopButtonRef}
            type="button"
            onClick={handleStopClick}
            className="mt-1 flex size-11 items-center justify-center rounded-full bg-error-500 text-body-white-solid-constant transition-colors hover:bg-error-500/80 focus:shadow-focus-ring focus-visible:outline-none"
            aria-label={stopButtonAriaLabel}
          >
            <StopIcon className="size-5" />
          </button>
        </div>
      );
    }

    return (
      // biome-ignore lint/a11y/useSemanticElements: <fieldset> would break the public HTMLDivElement ref/props API
      <div
        ref={ref}
        role="group"
        aria-label="Audio upload"
        data-testid="audio-upload"
        data-state="idle"
        aria-disabled={disabled || undefined}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl bg-neutral-100 px-4 py-3 transition-colors",
          isDragActive && "bg-brand-green-50 ring-2 ring-brand-green-500",
          disabled && "pointer-events-none opacity-50",
          className,
        )}
        {...props}
      >
        <input
          id={inputId}
          type="file"
          accept={acceptString}
          multiple={maxFiles > 1}
          onChange={handleFileInputChange}
          className="peer sr-only"
          disabled={disabled}
          aria-describedby={descriptionId}
        />

        <label
          htmlFor={inputId}
          className="flex cursor-pointer flex-col items-center gap-2 rounded-lg px-2 py-1 peer-focus-visible:shadow-focus-ring"
        >
          <UploadCloudIcon className="size-5 text-body-100" />

          <span className="typography-body-1-semibold text-center text-body-100">
            {uploadTitle}
          </span>

          <span id={descriptionId} className="typography-body-2-regular text-center text-body-100">
            {uploadDescription}
          </span>
        </label>

        {allowRecording && isRecordingSupported && (
          <>
            <p className="typography-body-2-regular text-center text-body-100">{separatorText}</p>

            <Button
              variant="brand"
              size="40"
              leftIcon={<MicrophoneIcon className="size-5" />}
              onClick={handleRecordClick}
              disabled={disabled}
              type="button"
            >
              {recordButtonLabel}
            </Button>
          </>
        )}
      </div>
    );
  },
);

AudioUpload.displayName = "AudioUpload";
