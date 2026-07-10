import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { VoiceNote } from "./VoiceNote";

function getAudioElement(container: HTMLElement): HTMLAudioElement {
  const audio = container.querySelector("audio");
  if (!audio) throw new Error("Expected an <audio> element to be rendered");
  return audio;
}

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

  describe("player mode (src)", () => {
    beforeEach(() => {
      HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
      HTMLMediaElement.prototype.pause = vi.fn();
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("no network access in tests")));
      Element.prototype.getBoundingClientRect = vi.fn(
        () =>
          ({
            width: 100,
            height: 48,
            top: 0,
            left: 0,
            right: 100,
            bottom: 48,
            x: 0,
            y: 0,
            toJSON: () => {},
          }) as DOMRect,
      );
    });

    afterEach(() => {
      vi.unstubAllGlobals();
      vi.restoreAllMocks();
    });

    it("exposes a seekable slider with duration-based aria", () => {
      render(<VoiceNote src="https://example.com/note.mp3" duration={10} />);
      const slider = screen.getByRole("slider", { name: "Seek" });
      expect(slider).toHaveAttribute("aria-valuemin", "0");
      expect(slider).toHaveAttribute("aria-valuemax", "10");
      expect(slider).toHaveAttribute("aria-valuenow", "0");
    });

    it("derives the timestamp from the duration and shows a Play button when idle", () => {
      render(<VoiceNote src="https://example.com/note.mp3" duration={5} />);
      expect(screen.getByText("0:05")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    });

    it("drives the media element and fires onPlayPause (uncontrolled)", async () => {
      const user = userEvent.setup();
      const onPlayPause = vi.fn();
      const { container } = render(
        <VoiceNote src="https://example.com/note.mp3" duration={5} onPlayPause={onPlayPause} />,
      );
      const audio = getAudioElement(container);
      vi.mocked(audio.pause).mockClear();

      await user.click(screen.getByRole("button", { name: "Play" }));
      expect(onPlayPause).toHaveBeenCalledWith(true);
      expect(audio.play).toHaveBeenCalledTimes(1);
      expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Pause" }));
      expect(onPlayPause).toHaveBeenLastCalledWith(false);
    });

    it("seeks on click via track position math", () => {
      const { container } = render(<VoiceNote src="https://example.com/note.mp3" duration={10} />);
      const audio = getAudioElement(container);
      const slider = screen.getByRole("slider");

      fireEvent.pointerDown(slider, { clientX: 40 });

      expect(slider).toHaveAttribute("aria-valuenow", "4");
      expect(audio.currentTime).toBe(4);
    });

    it("supports keyboard seeking", () => {
      render(<VoiceNote src="https://example.com/note.mp3" duration={10} />);
      const slider = screen.getByRole("slider");
      slider.focus();

      fireEvent.keyDown(slider, { key: "ArrowRight" });
      expect(slider).toHaveAttribute("aria-valuenow", "1");

      fireEvent.keyDown(slider, { key: "End" });
      expect(slider).toHaveAttribute("aria-valuenow", "10");
    });

    it("resets and calls onEnded when playback finishes", () => {
      const onEnded = vi.fn();
      const { container } = render(
        <VoiceNote
          src="https://example.com/note.mp3"
          duration={5}
          defaultPlaying
          onEnded={onEnded}
        />,
      );
      const audio = getAudioElement(container);
      fireEvent.ended(audio);

      expect(onEnded).toHaveBeenCalledTimes(1);
      expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    });

    it("has no accessibility violations", async () => {
      const { container } = render(<VoiceNote src="https://example.com/note.mp3" duration={10} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
