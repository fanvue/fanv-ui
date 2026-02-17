/** Maximum audio file size in bytes (10MB) */
export const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Maximum recording duration in seconds */
export const DEFAULT_MAX_RECORDING_DURATION = 30;

/** Minimum recording duration in seconds */
export const DEFAULT_MIN_RECORDING_DURATION = 5;

/** Default accepted audio MIME types */
export const DEFAULT_ACCEPTED_TYPES = [
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
  "audio/x-m4a",
  "audio/mp4",
  "audio/flac",
  "audio/webm",
  "audio/aac",
] as const;
