import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { CyclingText } from "./CyclingText";

const ITEMS = ["Alpha", "Beta", "Gamma"];

const installMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: () =>
      ({
        matches,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
        addListener: () => undefined,
        removeListener: () => undefined,
      }) as unknown as MediaQueryList,
  });
};

const getVisibleLabel = () => {
  const root = screen.getByTestId("cycling-text");
  const live = root.querySelector('[aria-live="polite"]');
  if (!live) throw new Error("No visible label found");
  return live;
};

const getSizingLabel = () => {
  const root = screen.getByTestId("cycling-text");
  const sizing = root.querySelector('[aria-hidden="true"]');
  if (!sizing) throw new Error("No sizing label found");
  return sizing;
};

const getIncomingLabel = () => {
  const root = screen.getByTestId("cycling-text");
  // Two aria-hidden spans during a transition — the second is the incoming layer.
  const hidden = root.querySelectorAll('[aria-hidden="true"]');
  return hidden.length > 1 ? hidden[1] : null;
};

describe("CyclingText", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    installMatchMedia(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("API", () => {
    it("renders the first item initially in the live layer", () => {
      render(<CyclingText items={ITEMS} />);
      expect(getVisibleLabel().textContent).toBe("Alpha");
    });

    it("returns null when items is empty", () => {
      const { container } = render(<CyclingText items={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it("applies custom className to the wrapper", () => {
      render(<CyclingText items={ITEMS} className="custom-class" />);
      const root = screen.getByTestId("cycling-text");
      expect(root).toHaveClass("custom-class");
    });

    it("applies labelClassName to the visible layer", () => {
      render(<CyclingText items={ITEMS} labelClassName="shimmer" />);
      expect(getVisibleLabel()).toHaveClass("shimmer");
    });

    it("uses the longest item to size the wrapper by default", () => {
      render(<CyclingText items={["Hi", "Hello there", "Yo"]} />);
      expect(getSizingLabel().textContent).toBe("Hello there");
    });
  });

  describe("cycling", () => {
    it("advances to the next item across an interval + transition", () => {
      render(<CyclingText items={ITEMS} intervalMs={1000} transitionMs={200} />);

      expect(getVisibleLabel().textContent).toBe("Alpha");

      // Tick: incoming is mounted with the next item; current is still the old one.
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(getIncomingLabel()?.textContent).toBe("Beta");

      // Finish the slide — incoming becomes current.
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(getVisibleLabel().textContent).toBe("Beta");
      expect(getIncomingLabel()).toBeNull();
    });

    it("wraps back to the first item after the last", () => {
      render(<CyclingText items={ITEMS} intervalMs={500} transitionMs={100} />);

      // Alpha -> Beta
      act(() => vi.advanceTimersByTime(600));
      expect(getVisibleLabel().textContent).toBe("Beta");

      // Beta -> Gamma
      act(() => vi.advanceTimersByTime(600));
      expect(getVisibleLabel().textContent).toBe("Gamma");

      // Gamma -> Alpha (wrap)
      act(() => vi.advanceTimersByTime(600));
      expect(getVisibleLabel().textContent).toBe("Alpha");
    });

    it("does not cycle when paused", () => {
      render(<CyclingText items={ITEMS} intervalMs={500} paused />);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(getVisibleLabel().textContent).toBe("Alpha");
    });

    it("does not cycle with a single item", () => {
      render(<CyclingText items={["Solo"]} intervalMs={300} />);
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(getVisibleLabel().textContent).toBe("Solo");
    });

    it("cleans up timers on unmount", () => {
      const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
      const { unmount } = render(<CyclingText items={ITEMS} intervalMs={500} />);
      unmount();
      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });
  });

  describe("reduced motion", () => {
    it("hard-swaps items with no incoming layer when prefers-reduced-motion is set", () => {
      installMatchMedia(true);
      render(<CyclingText items={ITEMS} intervalMs={500} transitionMs={200} />);

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(getVisibleLabel().textContent).toBe("Beta");
      expect(getIncomingLabel()).toBeNull();
    });
  });

  describe("accessibility", () => {
    beforeEach(() => {
      vi.useRealTimers();
    });

    it("has no accessibility violations", async () => {
      const { container } = render(<CyclingText items={ITEMS} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("marks the sizing layer as aria-hidden and the visible layer as aria-live", () => {
      render(<CyclingText items={ITEMS} />);
      expect(getSizingLabel()).toHaveAttribute("aria-hidden", "true");
      expect(getVisibleLabel()).toHaveAttribute("aria-live", "polite");
    });
  });
});
