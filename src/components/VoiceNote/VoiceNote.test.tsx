import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { VoiceNote } from "./VoiceNote";

describe("VoiceNote", () => {
  describe("API", () => {
    it("applies a custom className", () => {
      render(<VoiceNote className="custom" time="0:05" />);
      expect(screen.getByRole("group")).toHaveClass("custom");
    });

    it("forwards the ref", () => {
      const ref = createRef<HTMLDivElement>();
      render(<VoiceNote ref={ref} time="0:05" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("renders one bar per waveform value", () => {
      render(<VoiceNote waveform={[0.2, 0.5, 1, 0.4]} time="0:05" />);
      expect(screen.getByTestId("voice-note-waveform").childElementCount).toBe(4);
    });

    it("shows the timestamp only when enabled and provided", () => {
      const { rerender } = render(<VoiceNote time="0:05" />);
      expect(screen.getByText("0:05")).toBeInTheDocument();

      rerender(<VoiceNote time="0:05" showTimestamp={false} />);
      expect(screen.queryByText("0:05")).not.toBeInTheDocument();
    });

    it("renders the file name when provided", () => {
      render(<VoiceNote fileName="audio_name.mp4" time="0:05" />);
      expect(screen.getByText("audio_name.mp4")).toBeInTheDocument();
    });

    it("hides the play control when showControls is false", () => {
      render(<VoiceNote showControls={false} time="0:05" />);
      expect(screen.queryByRole("button", { name: /play/i })).not.toBeInTheDocument();
    });
  });

  describe("playback control", () => {
    it("toggles the icon/label and calls onPlayPause when uncontrolled", () => {
      const onPlayPause = vi.fn();
      render(<VoiceNote time="0:05" onPlayPause={onPlayPause} />);

      const button = screen.getByRole("button", { name: "Play" });
      fireEvent.click(button);

      expect(onPlayPause).toHaveBeenCalledWith(true);
      expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
    });

    it("respects the controlled playing prop", () => {
      const onPlayPause = vi.fn();
      render(<VoiceNote time="0:05" playing onPlayPause={onPlayPause} />);

      const button = screen.getByRole("button", { name: "Pause" });
      fireEvent.click(button);

      expect(onPlayPause).toHaveBeenCalledWith(false);
      expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
    });
  });

  describe("remove control", () => {
    it("renders a remove button and calls onRemove", () => {
      const onRemove = vi.fn();
      render(<VoiceNote time="0:05" showRemove onRemove={onRemove} />);

      fireEvent.click(screen.getByRole("button", { name: "Remove" }));
      expect(onRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe("accessibility", () => {
    it.each([
      ["default resting", { time: "0:05" }],
      ["flat", { variant: "flat" as const, time: "0:05" }],
      ["listening", { progress: 0.4, playing: true, time: "0:02" }],
      ["negative", { negative: true, time: "0:05" }],
      ["with remove", { time: "0:05", showRemove: true }],
    ])("has no accessibility violations (%s)", async (_label, props) => {
      const { container } = render(<VoiceNote {...props} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
