import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { AudioPlayer } from "./AudioPlayer";

function getAudioElement(container: HTMLElement): HTMLAudioElement {
  const audio = container.querySelector("audio");
  if (!audio) throw new Error("Expected an <audio> element to be rendered");
  return audio;
}

function setMediaProperty(
  element: HTMLMediaElement,
  property: "duration" | "currentTime",
  value: number,
) {
  Object.defineProperty(element, property, { value, configurable: true });
}

beforeEach(() => {
  HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  HTMLMediaElement.prototype.pause = vi.fn();
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("no network access in tests")));
  Element.prototype.getBoundingClientRect = vi.fn(() => ({
    width: 100,
    height: 40,
    top: 0,
    left: 0,
    right: 100,
    bottom: 40,
    x: 0,
    y: 0,
    toJSON: () => {},
  }));
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("AudioPlayer", () => {
  describe("idle rendering", () => {
    it("shows only the total duration and a Play button before playback starts", () => {
      render(<AudioPlayer src="https://example.com/clip.mp3" duration={5} />);
      expect(screen.getByText("0:05")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
      expect(screen.queryByText("/0:05")).not.toBeInTheDocument();
    });

    it("shows a placeholder when no duration is known yet", () => {
      render(<AudioPlayer src="https://example.com/clip.mp3" />);
      expect(screen.getByText("--:--")).toBeInTheDocument();
    });

    it("exposes the waveform as a slider with correct aria attributes", () => {
      render(<AudioPlayer src="https://example.com/clip.mp3" duration={5} />);
      const slider = screen.getByRole("slider", { name: "Seek" });
      expect(slider).toHaveAttribute("aria-valuemin", "0");
      expect(slider).toHaveAttribute("aria-valuemax", "5");
      expect(slider).toHaveAttribute("aria-valuenow", "0");
      expect(slider).toHaveAttribute("aria-valuetext", "0:00 of 0:05");
    });

    it("applies custom className to the root element", () => {
      const { container } = render(
        <AudioPlayer src="https://example.com/clip.mp3" duration={5} className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("play/pause", () => {
    it("toggles play state, calls onPlay/onPause, and drives the media element (uncontrolled)", async () => {
      const user = userEvent.setup();
      const onPlay = vi.fn();
      const onPause = vi.fn();
      const { container } = render(
        <AudioPlayer
          src="https://example.com/clip.mp3"
          duration={5}
          onPlay={onPlay}
          onPause={onPause}
        />,
      );
      const audio = getAudioElement(container);
      // The sync effect calls pause() once on mount (playing starts false); ignore that baseline call.
      vi.mocked(audio.pause).mockClear();

      await user.click(screen.getByRole("button", { name: "Play" }));
      expect(onPlay).toHaveBeenCalledTimes(1);
      expect(audio.play).toHaveBeenCalledTimes(1);
      expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Pause" }));
      expect(onPause).toHaveBeenCalledTimes(1);
      expect(audio.pause).toHaveBeenCalledTimes(1);
      expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    });

    it("respects a controlled `playing` prop", async () => {
      const user = userEvent.setup();
      const onPlay = vi.fn();
      const { rerender } = render(
        <AudioPlayer
          src="https://example.com/clip.mp3"
          duration={5}
          playing={false}
          onPlay={onPlay}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Play" }));
      expect(onPlay).toHaveBeenCalledTimes(1);
      // Still "Play" because the parent hasn't updated the controlled prop yet.
      expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();

      rerender(
        <AudioPlayer
          src="https://example.com/clip.mp3"
          duration={5}
          playing={true}
          onPlay={onPlay}
        />,
      );
      expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
    });

    it("honors defaultPlaying for uncontrolled usage", () => {
      render(<AudioPlayer src="https://example.com/clip.mp3" duration={5} defaultPlaying />);
      expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
    });
  });

  describe("progress", () => {
    it("switches to the elapsed/total format once playback has progressed", () => {
      const { container } = render(<AudioPlayer src="https://example.com/clip.mp3" duration={5} />);
      const audio = getAudioElement(container);
      setMediaProperty(audio, "currentTime", 2);
      fireEvent.timeUpdate(audio);

      expect(screen.getByText("0:02")).toBeInTheDocument();
      expect(screen.getByText("/0:05")).toBeInTheDocument();
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "2");
    });

    it("adopts the media's own duration once metadata loads", () => {
      const { container } = render(<AudioPlayer src="https://example.com/clip.mp3" />);
      const audio = getAudioElement(container);
      setMediaProperty(audio, "duration", 12);
      fireEvent.loadedMetadata(audio);

      expect(screen.getByText("0:12")).toBeInTheDocument();
    });
  });

  describe("seeking", () => {
    it("seeks on click via waveform position math", () => {
      const { container } = render(
        <AudioPlayer src="https://example.com/clip.mp3" duration={10} />,
      );
      const audio = getAudioElement(container);
      const slider = screen.getByRole("slider");

      // getBoundingClientRect is mocked to { left: 0, width: 100 }; clicking at
      // clientX=40 is 40% across the track => 40% of a 10s clip = 4s.
      fireEvent.pointerDown(slider, { clientX: 40 });

      expect(slider).toHaveAttribute("aria-valuenow", "4");
      expect(audio.currentTime).toBe(4);
    });

    it("supports full keyboard seeking", () => {
      const { container } = render(
        <AudioPlayer src="https://example.com/clip.mp3" duration={10} />,
      );
      const audio = getAudioElement(container);
      const slider = screen.getByRole("slider");
      slider.focus();

      fireEvent.keyDown(slider, { key: "ArrowRight" });
      expect(slider).toHaveAttribute("aria-valuenow", "1");
      expect(audio.currentTime).toBe(1);

      fireEvent.keyDown(slider, { key: "ArrowLeft" });
      expect(slider).toHaveAttribute("aria-valuenow", "0");

      fireEvent.keyDown(slider, { key: "PageUp" });
      expect(slider).toHaveAttribute("aria-valuenow", "5");

      fireEvent.keyDown(slider, { key: "End" });
      expect(slider).toHaveAttribute("aria-valuenow", "10");
      expect(audio.currentTime).toBe(10);

      fireEvent.keyDown(slider, { key: "PageDown" });
      expect(slider).toHaveAttribute("aria-valuenow", "5");

      fireEvent.keyDown(slider, { key: "Home" });
      expect(slider).toHaveAttribute("aria-valuenow", "0");
      expect(audio.currentTime).toBe(0);
    });

    it("clamps seeking to the track bounds", () => {
      render(<AudioPlayer src="https://example.com/clip.mp3" duration={10} />);
      const slider = screen.getByRole("slider");
      slider.focus();

      fireEvent.keyDown(slider, { key: "ArrowLeft" });
      expect(slider).toHaveAttribute("aria-valuenow", "0");

      fireEvent.keyDown(slider, { key: "End" });
      fireEvent.keyDown(slider, { key: "ArrowRight" });
      expect(slider).toHaveAttribute("aria-valuenow", "10");
    });
  });

  describe("ended", () => {
    it("resets to the idle state and calls onEnded", () => {
      const onEnded = vi.fn();
      const { container } = render(
        <AudioPlayer
          src="https://example.com/clip.mp3"
          duration={5}
          defaultPlaying
          onEnded={onEnded}
        />,
      );
      const audio = getAudioElement(container);
      setMediaProperty(audio, "currentTime", 5);
      fireEvent.timeUpdate(audio);

      fireEvent.ended(audio);

      expect(onEnded).toHaveBeenCalledTimes(1);
      expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
      expect(screen.getByText("0:05")).toBeInTheDocument();
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "0");
    });
  });

  describe("fallback waveform", () => {
    it("derives deterministic bars from `src` (same src => same bars)", () => {
      const { container: containerA } = render(
        <AudioPlayer src="https://example.com/same-clip.mp3" duration={5} />,
      );
      const { container: containerB } = render(
        <AudioPlayer src="https://example.com/same-clip.mp3" duration={5} />,
      );

      const heightsA = Array.from(containerA.querySelectorAll('[role="slider"] > span')).map(
        (bar) => (bar as HTMLElement).style.height,
      );
      const heightsB = Array.from(containerB.querySelectorAll('[role="slider"] > span')).map(
        (bar) => (bar as HTMLElement).style.height,
      );

      expect(heightsA.length).toBeGreaterThan(0);
      expect(heightsA).toEqual(heightsB);
    });

    it("derives different bars for a different `src`", () => {
      const { container: containerA } = render(
        <AudioPlayer src="https://example.com/clip-a.mp3" duration={5} />,
      );
      const { container: containerB } = render(
        <AudioPlayer src="https://example.com/clip-b.mp3" duration={5} />,
      );

      const heightsA = Array.from(containerA.querySelectorAll('[role="slider"] > span')).map(
        (bar) => (bar as HTMLElement).style.height,
      );
      const heightsB = Array.from(containerB.querySelectorAll('[role="slider"] > span')).map(
        (bar) => (bar as HTMLElement).style.height,
      );

      expect(heightsA).not.toEqual(heightsB);
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = render(<AudioPlayer src="https://example.com/clip.mp3" duration={5} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
