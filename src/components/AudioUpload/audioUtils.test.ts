import { afterEach, describe, expect, it, vi } from "vitest";
import { formatAudioTime, getRecordingMimeType, validateAudioFile } from "./audioUtils";

describe("validateAudioFile", () => {
  const createFile = (name: string, size: number, type: string) =>
    new File(["x".repeat(size)], name, { type });

  it("returns empty array for a valid file", () => {
    const file = createFile("test.mp3", 1024, "audio/mpeg");
    expect(validateAudioFile(file)).toEqual([]);
  });

  it("returns file-too-large error when exceeding max size", () => {
    const file = createFile("big.mp3", 11 * 1024 * 1024, "audio/mpeg");
    const errors = validateAudioFile(file);
    expect(errors).toHaveLength(1);
    expect(errors[0]?.code).toBe("file-too-large");
  });

  it("returns file-invalid-type error for wrong MIME type", () => {
    const file = createFile("test.txt", 1024, "text/plain");
    const errors = validateAudioFile(file);
    expect(errors).toHaveLength(1);
    expect(errors[0]?.code).toBe("file-invalid-type");
  });

  it("returns multiple errors when multiple validations fail", () => {
    const file = createFile("big.txt", 11 * 1024 * 1024, "text/plain");
    const errors = validateAudioFile(file);
    expect(errors).toHaveLength(2);
    expect(errors.map((e) => e.code)).toContain("file-too-large");
    expect(errors.map((e) => e.code)).toContain("file-invalid-type");
  });

  it("respects custom maxFileSize option", () => {
    const file = createFile("test.mp3", 500, "audio/mpeg");
    const errors = validateAudioFile(file, { maxFileSize: 100 });
    expect(errors).toHaveLength(1);
    expect(errors[0]?.code).toBe("file-too-large");
  });

  it("respects custom acceptedTypes option", () => {
    const file = createFile("test.mp3", 100, "audio/mpeg");
    const errors = validateAudioFile(file, { acceptedTypes: ["audio/wav"] });
    expect(errors).toHaveLength(1);
    expect(errors[0]?.code).toBe("file-invalid-type");
  });

  it("allows any type when acceptedTypes is empty", () => {
    const file = createFile("test.txt", 100, "text/plain");
    const errors = validateAudioFile(file, { acceptedTypes: [] });
    expect(errors).toEqual([]);
  });
});

describe("formatAudioTime", () => {
  it("formats 0ms as 0:00", () => {
    expect(formatAudioTime(0)).toBe("0:00");
  });

  it("formats 5000ms as 0:05", () => {
    expect(formatAudioTime(5000)).toBe("0:05");
  });

  it("formats 30000ms as 0:30", () => {
    expect(formatAudioTime(30000)).toBe("0:30");
  });

  it("formats 65000ms as 1:05", () => {
    expect(formatAudioTime(65000)).toBe("1:05");
  });

  it("floors partial seconds", () => {
    expect(formatAudioTime(5999)).toBe("0:05");
  });
});

describe("getRecordingMimeType", () => {
  const originalMediaRecorder = globalThis.MediaRecorder;

  afterEach(() => {
    if (originalMediaRecorder) {
      vi.stubGlobal("MediaRecorder", originalMediaRecorder);
    }
  });

  it('returns "audio/webm" when browser supports it', () => {
    vi.stubGlobal("MediaRecorder", {
      isTypeSupported: (type: string) => type === "audio/webm",
    });
    expect(getRecordingMimeType()).toBe("audio/webm");
  });

  it('returns "audio/mp4" when webm is not supported but mp4 is', () => {
    vi.stubGlobal("MediaRecorder", {
      isTypeSupported: (type: string) => type === "audio/mp4",
    });
    expect(getRecordingMimeType()).toBe("audio/mp4");
  });

  it('returns "" when no supported types are found', () => {
    vi.stubGlobal("MediaRecorder", {
      isTypeSupported: () => false,
    });
    expect(getRecordingMimeType()).toBe("");
  });

  it('returns "" when MediaRecorder is undefined', () => {
    vi.stubGlobal("MediaRecorder", undefined);
    expect(getRecordingMimeType()).toBe("");
  });
});
