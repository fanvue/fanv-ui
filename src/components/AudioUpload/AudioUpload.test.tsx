import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { axe } from "vitest-axe";
import { AudioUpload } from "./AudioUpload";
import { useAudioRecorder } from "./useAudioRecorder";

// Mock useAudioRecorder to avoid MediaRecorder dependency in tests
vi.mock("./useAudioRecorder", () => ({
  useAudioRecorder: vi.fn(),
}));

const mockUseAudioRecorder = useAudioRecorder as Mock;

const defaultRecorderReturn = {
  isRecording: false,
  elapsedMs: 0,
  startRecording: vi.fn(),
  stopRecording: vi.fn(),
  analyserNode: null,
  isSupported: true,
};

beforeEach(() => {
  mockUseAudioRecorder.mockReturnValue({ ...defaultRecorderReturn });
});

describe("AudioUpload", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(<AudioUpload className="custom-class" />);
      const el = screen.getByTestId("audio-upload");
      expect(el).toHaveClass("custom-class");
    });

    it("forwards ref correctly", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(<AudioUpload ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("renders dropzone in default state", () => {
      render(<AudioUpload />);
      const el = screen.getByTestId("audio-upload");
      expect(el).toHaveAttribute("data-state", "idle");
    });

    it("renders upload title and description", () => {
      render(<AudioUpload />);
      expect(screen.getByText("Click to upload, or drag & drop")).toBeInTheDocument();
      expect(screen.getByText("Audio files only, up to 10MB each")).toBeInTheDocument();
    });

    it("renders record button when allowRecording is true", () => {
      render(<AudioUpload />);
      expect(screen.getByText("Record audio")).toBeInTheDocument();
    });

    it("hides record button when allowRecording is false", () => {
      render(<AudioUpload allowRecording={false} />);
      expect(screen.queryByText("Record audio")).not.toBeInTheDocument();
      expect(screen.queryByText("or")).not.toBeInTheDocument();
    });

    it("applies custom label props", () => {
      render(
        <AudioUpload
          uploadTitle="Custom title"
          uploadDescription="Custom description"
          separatorText="---"
          recordButtonLabel="Start mic"
        />,
      );
      expect(screen.getByText("Custom title")).toBeInTheDocument();
      expect(screen.getByText("Custom description")).toBeInTheDocument();
      expect(screen.getByText("---")).toBeInTheDocument();
      expect(screen.getByText("Start mic")).toBeInTheDocument();
    });

    it("renders disabled state when disabled prop is true", () => {
      render(<AudioUpload disabled />);
      const el = screen.getByTestId("audio-upload");
      expect(el).toHaveAttribute("aria-disabled", "true");
    });

    it("disables the file input when disabled prop is true", () => {
      render(<AudioUpload disabled />);
      const el = screen.getByTestId("audio-upload");
      const input = el.querySelector('input[type="file"]');
      expect(input).toBeDisabled();
    });

    it("calls onFilesAccepted when valid file is dropped", () => {
      const onFilesAccepted = vi.fn();
      render(<AudioUpload onFilesAccepted={onFilesAccepted} />);
      const el = screen.getByTestId("audio-upload");

      const file = new File(["audio"], "test.mp3", { type: "audio/mpeg" });
      fireEvent.drop(el, {
        dataTransfer: { files: [file] },
      });

      expect(onFilesAccepted).toHaveBeenCalledWith([file]);
    });

    it("calls onFilesRejected when file type is invalid", () => {
      const onFilesRejected = vi.fn();
      render(<AudioUpload onFilesRejected={onFilesRejected} />);
      const el = screen.getByTestId("audio-upload");

      const file = new File(["text"], "test.txt", { type: "text/plain" });
      fireEvent.drop(el, {
        dataTransfer: { files: [file] },
      });

      expect(onFilesRejected).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            file,
            errors: expect.arrayContaining([
              expect.objectContaining({ code: "file-invalid-type" }),
            ]),
          }),
        ]),
      );
    });

    it("calls onFilesRejected when file is too large", () => {
      const onFilesRejected = vi.fn();
      render(<AudioUpload maxFileSize={100} onFilesRejected={onFilesRejected} />);
      const el = screen.getByTestId("audio-upload");

      const file = new File(["x".repeat(200)], "big.mp3", { type: "audio/mpeg" });
      fireEvent.drop(el, {
        dataTransfer: { files: [file] },
      });

      expect(onFilesRejected).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            errors: expect.arrayContaining([expect.objectContaining({ code: "file-too-large" })]),
          }),
        ]),
      );
    });

    it("associates the label with the file input", () => {
      render(<AudioUpload />);
      const el = screen.getByTestId("audio-upload");
      const input = el.querySelector('input[type="file"]') as HTMLInputElement;
      const label = el.querySelector("label") as HTMLLabelElement;

      expect(input).toBeInTheDocument();
      expect(label).toBeInTheDocument();
      expect(input.id).toBeTruthy();
      expect(label.htmlFor).toBe(input.id);
    });

    it("file input is keyboard-accessible", () => {
      render(<AudioUpload />);
      const el = screen.getByTestId("audio-upload");
      const input = el.querySelector('input[type="file"]') as HTMLInputElement;

      // Input should be focusable (not tabIndex={-1} or aria-hidden)
      expect(input).not.toHaveAttribute("aria-hidden", "true");
      expect(input).not.toHaveAttribute("tabindex", "-1");
    });

    it("does not respond to drop when disabled", () => {
      const onFilesAccepted = vi.fn();
      render(<AudioUpload disabled onFilesAccepted={onFilesAccepted} />);
      const el = screen.getByTestId("audio-upload");

      const file = new File(["audio"], "test.mp3", { type: "audio/mpeg" });
      fireEvent.drop(el, {
        dataTransfer: { files: [file] },
      });

      expect(onFilesAccepted).not.toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations in default state", async () => {
      const { container } = render(<AudioUpload />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations when disabled", async () => {
      const { container } = render(<AudioUpload disabled />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations without recording", async () => {
      const { container } = render(<AudioUpload allowRecording={false} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has role='group' with an accessible label", () => {
      render(<AudioUpload />);
      const group = screen.getByRole("group", { name: /audio upload/i });
      expect(group).toBeInTheDocument();
    });

    it("shows focus ring on the label when file input is focused", () => {
      render(<AudioUpload />);
      const el = screen.getByTestId("audio-upload");
      const input = el.querySelector('input[type="file"]') as HTMLInputElement;

      // Input should have the peer class for Tailwind peer-focus-visible on the label
      expect(input.className).toContain("peer");
    });
  });

  describe("recording state", () => {
    beforeEach(() => {
      mockUseAudioRecorder.mockReturnValue({
        ...defaultRecorderReturn,
        isRecording: true,
        elapsedMs: 5000,
      });
    });

    it("renders recording UI when isRecording is true", () => {
      render(<AudioUpload />);
      const el = screen.getByTestId("audio-upload");
      expect(el).toHaveAttribute("data-state", "recording");
    });

    it("shows recording timer with elapsed time", () => {
      render(<AudioUpload />);
      const timer = screen.getByRole("timer", { name: /recording time/i });
      expect(timer).toBeInTheDocument();
      expect(timer).toHaveTextContent("0:05");
    });

    it("shows max duration in the timer display", () => {
      render(<AudioUpload maxRecordingDuration={30} />);
      const timer = screen.getByRole("timer");
      expect(timer).toHaveTextContent("0:30");
    });

    it("renders the stop button with correct aria-label", () => {
      render(<AudioUpload />);
      const stopBtn = screen.getByRole("button", { name: /stop recording/i });
      expect(stopBtn).toBeInTheDocument();
    });

    it("renders custom stop button aria-label", () => {
      render(<AudioUpload stopButtonAriaLabel="End recording" />);
      const stopBtn = screen.getByRole("button", { name: /end recording/i });
      expect(stopBtn).toBeInTheDocument();
    });

    it("calls stopRecording when stop button is clicked", () => {
      const stopRecording = vi.fn();
      mockUseAudioRecorder.mockReturnValue({
        ...defaultRecorderReturn,
        isRecording: true,
        elapsedMs: 5000,
        stopRecording,
      });

      render(<AudioUpload />);
      const stopBtn = screen.getByRole("button", { name: /stop recording/i });
      fireEvent.click(stopBtn);

      expect(stopRecording).toHaveBeenCalled();
    });

    it("applies custom className in recording state", () => {
      render(<AudioUpload className="custom-class" />);
      const el = screen.getByTestId("audio-upload");
      expect(el).toHaveClass("custom-class");
    });

    it("has role='group' with recording label", () => {
      render(<AudioUpload />);
      const group = screen.getByRole("group", { name: /audio recording in progress/i });
      expect(group).toBeInTheDocument();
    });

    it("has no accessibility violations in recording state", async () => {
      const { container } = render(<AudioUpload />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
