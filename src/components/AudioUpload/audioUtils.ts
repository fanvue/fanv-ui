import { DEFAULT_ACCEPTED_TYPES, DEFAULT_MAX_FILE_SIZE } from "./constants";

/** An error returned when an audio file fails validation. */
export interface AudioValidationError {
  /** Machine-readable error code. */
  code: "file-too-large" | "file-invalid-type" | "too-many-files";
  /** Human-readable error message. */
  message: string;
}

export interface AudioValidationOptions {
  /** Maximum file size in bytes. @default 10_485_760 (10MB) */
  maxFileSize?: number;
  /** Accepted MIME types. @default DEFAULT_ACCEPTED_TYPES */
  acceptedTypes?: readonly string[];
}

/**
 * Validate an audio file's size and MIME type synchronously.
 * Returns an array of validation errors (empty if valid).
 */
export function validateAudioFile(
  file: File,
  options: AudioValidationOptions = {},
): AudioValidationError[] {
  const { maxFileSize = DEFAULT_MAX_FILE_SIZE, acceptedTypes = DEFAULT_ACCEPTED_TYPES } = options;
  const errors: AudioValidationError[] = [];

  if (file.size > maxFileSize) {
    const maxMB = Math.round(maxFileSize / (1024 * 1024));
    errors.push({
      code: "file-too-large",
      message: `File "${file.name}" exceeds ${maxMB}MB limit`,
    });
  }

  if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
    errors.push({
      code: "file-invalid-type",
      message: `File "${file.name}" is not a supported audio format`,
    });
  }

  return errors;
}

/**
 * Format milliseconds to "m:ss" display string.
 *
 * @example
 * formatAudioTime(0)       // "0:00"
 * formatAudioTime(5000)    // "0:05"
 * formatAudioTime(65000)   // "1:05"
 */
export function formatAudioTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Get the appropriate recording MIME type for the current browser.
 * Safari/iOS use audio/mp4; others use audio/webm.
 */
export function getRecordingMimeType(): string {
  if (typeof MediaRecorder === "undefined") {
    return "";
  }

  if (MediaRecorder.isTypeSupported("audio/webm")) {
    return "audio/webm";
  }

  if (MediaRecorder.isTypeSupported("audio/mp4")) {
    return "audio/mp4";
  }

  return "";
}
