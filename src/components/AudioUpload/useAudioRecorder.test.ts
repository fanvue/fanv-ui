import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAudioRecorder } from "./useAudioRecorder";

// Mock MediaRecorder
class MockMediaRecorder {
  state = "inactive";
  mimeType = "audio/webm";
  ondataavailable: ((event: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  onerror: (() => void) | null = null;

  static isTypeSupported(type: string) {
    return type === "audio/webm";
  }

  constructor(_stream: MediaStream, options?: { mimeType?: string }) {
    if (options?.mimeType) {
      this.mimeType = options.mimeType;
    }
  }

  start() {
    this.state = "recording";
  }

  stop() {
    this.state = "inactive";
    // Real MediaRecorder fires ondataavailable with final data before onstop
    this.ondataavailable?.({ data: new Blob(["audio-data"], { type: this.mimeType }) });
    this.onstop?.();
  }
}

const mockGetUserMedia = vi.fn();
const mockTrackStop = vi.fn();

function createMockStream() {
  return {
    getTracks: () => [{ stop: mockTrackStop }],
  } as unknown as MediaStream;
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.stubGlobal("MediaRecorder", MockMediaRecorder);
  vi.stubGlobal(
    "AudioContext",
    class {
      createMediaStreamSource() {
        return { connect: vi.fn(), disconnect: vi.fn() };
      }
      createAnalyser() {
        return { fftSize: 0 } as unknown as AnalyserNode;
      }
      close() {}
      state = "running";
    },
  );
  Object.defineProperty(navigator, "mediaDevices", {
    value: { getUserMedia: mockGetUserMedia },
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("useAudioRecorder", () => {
  it("returns isRecording=false initially", () => {
    const { result } = renderHook(() => useAudioRecorder());
    expect(result.current.isRecording).toBe(false);
  });

  it("returns isSupported=true when browser APIs are available", () => {
    const { result } = renderHook(() => useAudioRecorder());
    expect(result.current.isSupported).toBe(true);
  });

  it("returns elapsedMs=0 initially", () => {
    const { result } = renderHook(() => useAudioRecorder());
    expect(result.current.elapsedMs).toBe(0);
  });

  it("returns analyserNode=null initially", () => {
    const { result } = renderHook(() => useAudioRecorder());
    expect(result.current.analyserNode).toBeNull();
  });

  it("startRecording requests microphone permission", async () => {
    mockGetUserMedia.mockResolvedValue(createMockStream());
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    expect(mockGetUserMedia).toHaveBeenCalledWith({ audio: true });
  });

  it("calls onPermissionError when permission is denied", async () => {
    mockGetUserMedia.mockRejectedValue(new DOMException("Permission denied", "NotAllowedError"));
    const onPermissionError = vi.fn();

    const { result } = renderHook(() => useAudioRecorder({ onPermissionError }));

    await act(async () => {
      await result.current.startRecording();
    });

    expect(mockGetUserMedia).toHaveBeenCalledWith({ audio: true });
    expect(onPermissionError).toHaveBeenCalled();
    expect(result.current.isRecording).toBe(false);
  });

  it("sets isRecording=true after successful start", async () => {
    mockGetUserMedia.mockResolvedValue(createMockStream());
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.isRecording).toBe(true);
  });

  it("stopRecording sets isRecording=false", async () => {
    mockGetUserMedia.mockResolvedValue(createMockStream());
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    act(() => {
      result.current.stopRecording();
    });

    expect(result.current.isRecording).toBe(false);
  });

  it("calls onComplete with blob and duration on stop when recording is long enough", async () => {
    mockGetUserMedia.mockResolvedValue(createMockStream());
    const onComplete = vi.fn();

    const { result } = renderHook(() => useAudioRecorder({ onComplete, minDuration: 0 }));

    await act(async () => {
      await result.current.startRecording();
    });

    act(() => {
      result.current.stopRecording();
    });

    expect(onComplete).toHaveBeenCalledWith(expect.any(Blob), expect.any(Number));
  });

  it("calls onTooShort when recording is too short", async () => {
    mockGetUserMedia.mockResolvedValue(createMockStream());
    const onTooShort = vi.fn();

    const { result } = renderHook(() => useAudioRecorder({ onTooShort, minDuration: 999 }));

    await act(async () => {
      await result.current.startRecording();
    });

    act(() => {
      result.current.stopRecording();
    });

    expect(onTooShort).toHaveBeenCalled();
  });

  it("cleans up media tracks on unmount", async () => {
    mockGetUserMedia.mockResolvedValue(createMockStream());
    const { result, unmount } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    unmount();

    expect(mockTrackStop).toHaveBeenCalled();
  });
});
