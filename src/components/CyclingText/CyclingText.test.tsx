import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { CyclingText } from "./CyclingText";

const ITEMS = ["Alpha", "Beta", "Gamma"];

const getVisibleLabel = () => {
  const root = screen.getByTestId("cycling-text");
  const layer = root.querySelector('[data-layer="current"]');
  if (!layer) throw new Error("No visible label found");
  return layer;
};

const getSizingLabel = () => {
  const root = screen.getByTestId("cycling-text");
  const sizing = root.querySelector('[aria-hidden="true"]');
  if (!sizing) throw new Error("No sizing label found");
  return sizing;
};

const getIncomingLabel = () => {
  const root = screen.getByTestId("cycling-text");
  const incoming = root.querySelector('[data-layer="incoming"]');
  return incoming;
};

describe("CyclingText", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("API", () => {
    it("renders the first item initially in the current layer", () => {
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

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(getIncomingLabel()?.textContent).toBe("Beta");

      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(getVisibleLabel().textContent).toBe("Beta");
      expect(getIncomingLabel()).toBeNull();
    });

    it("wraps back to the first item after the last", () => {
      render(<CyclingText items={ITEMS} intervalMs={500} transitionMs={100} />);

      act(() => vi.advanceTimersByTime(500));
      act(() => vi.advanceTimersByTime(100));
      expect(getVisibleLabel().textContent).toBe("Beta");

      act(() => vi.advanceTimersByTime(500));
      act(() => vi.advanceTimersByTime(100));
      expect(getVisibleLabel().textContent).toBe("Gamma");

      act(() => vi.advanceTimersByTime(500));
      act(() => vi.advanceTimersByTime(100));
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
      const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
      const { unmount } = render(<CyclingText items={ITEMS} intervalMs={500} />);
      unmount();
      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });

    it("completes a transition step without relying on matchMedia", () => {
      render(<CyclingText items={ITEMS} intervalMs={500} transitionMs={200} />);

      act(() => vi.advanceTimersByTime(500));
      act(() => vi.advanceTimersByTime(200));
      expect(getVisibleLabel().textContent).toBe("Beta");
      expect(getIncomingLabel()).toBeNull();
    });

    it("does not queue a second tick while a long transition is still running", () => {
      render(<CyclingText items={ITEMS} intervalMs={1000} transitionMs={4000} />);

      act(() => vi.advanceTimersByTime(1000));
      expect(getIncomingLabel()?.textContent).toBe("Beta");

      act(() => vi.advanceTimersByTime(1000));
      expect(getIncomingLabel()?.textContent).toBe("Beta");

      act(() => vi.advanceTimersByTime(3000));
      expect(getVisibleLabel().textContent).toBe("Beta");
      expect(getIncomingLabel()).toBeNull();
    });
  });

  describe("onActiveIndexChange", () => {
    it("reports the initial index on mount", () => {
      const onActiveIndexChange = vi.fn();
      render(<CyclingText items={ITEMS} onActiveIndexChange={onActiveIndexChange} />);
      expect(onActiveIndexChange).toHaveBeenCalledWith(0);
    });

    it("reports each settled index as the visible item changes, wrapping around", () => {
      const onActiveIndexChange = vi.fn();
      render(
        <CyclingText
          items={ITEMS}
          intervalMs={500}
          transitionMs={100}
          onActiveIndexChange={onActiveIndexChange}
        />,
      );

      expect(onActiveIndexChange).toHaveBeenLastCalledWith(0);

      act(() => vi.advanceTimersByTime(500));
      act(() => vi.advanceTimersByTime(100));
      expect(getVisibleLabel().textContent).toBe("Beta");
      expect(onActiveIndexChange).toHaveBeenLastCalledWith(1);

      act(() => vi.advanceTimersByTime(500));
      act(() => vi.advanceTimersByTime(100));
      expect(onActiveIndexChange).toHaveBeenLastCalledWith(2);

      act(() => vi.advanceTimersByTime(500));
      act(() => vi.advanceTimersByTime(100));
      expect(onActiveIndexChange).toHaveBeenLastCalledWith(0);
    });

    it("does not report the next index until the transition settles", () => {
      const onActiveIndexChange = vi.fn();
      render(
        <CyclingText
          items={ITEMS}
          intervalMs={500}
          transitionMs={1000}
          onActiveIndexChange={onActiveIndexChange}
        />,
      );
      onActiveIndexChange.mockClear();

      act(() => vi.advanceTimersByTime(500));
      expect(onActiveIndexChange).not.toHaveBeenCalled();

      act(() => vi.advanceTimersByTime(1000));
      expect(onActiveIndexChange).toHaveBeenCalledWith(1);
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

    it("marks the sizing layer as aria-hidden", () => {
      render(<CyclingText items={ITEMS} />);
      expect(getSizingLabel()).toHaveAttribute("aria-hidden", "true");
    });

    it("does not set aria-live by default", () => {
      render(<CyclingText items={ITEMS} />);
      expect(getVisibleLabel()).not.toHaveAttribute("aria-live");
    });

    it("sets aria-live polite when announceChanges is true", () => {
      render(<CyclingText items={ITEMS} announceChanges />);
      expect(getVisibleLabel()).toHaveAttribute("aria-live", "polite");
    });
  });
});
