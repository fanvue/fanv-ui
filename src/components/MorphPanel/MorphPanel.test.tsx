import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { MorphPanel } from "./MorphPanel";

let height = 100;

function mockReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

const panel = () => document.querySelector<HTMLElement>("[data-morph-panel]");
const view = () => document.querySelector<HTMLElement>("[data-morph-panel] > div");

function renderAt(step: number, label = `View ${step}`) {
  return <MorphPanel step={step}>{label}</MorphPanel>;
}

beforeEach(() => {
  height = 100;
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    () =>
      ({ height, width: 300, top: 0, left: 0, bottom: height, right: 300, x: 0, y: 0 }) as DOMRect,
  );
});

afterEach(() => {
  Reflect.deleteProperty(window, "matchMedia");
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("MorphPanel", () => {
  describe("views", () => {
    it("shows the first view without a transition", () => {
      render(renderAt(0));
      expect(screen.getByText("View 0")).toBeInTheDocument();
      expect(view()).not.toHaveAttribute("data-direction");
      expect(view()).not.toHaveClass("animate-in");
      expect(panel()?.style.height).toBe("");
    });

    it("slides a deeper view in from the right and a shallower one in from the left", () => {
      const { rerender } = render(renderAt(0));
      rerender(renderAt(1));
      expect(screen.getByText("View 1")).toBeInTheDocument();
      expect(view()).toHaveAttribute("data-direction", "forward");
      expect(view()).toHaveClass("animate-in", "slide-in-from-right-8");
      rerender(renderAt(0));
      expect(screen.getByText("View 0")).toBeInTheDocument();
      expect(view()).toHaveAttribute("data-direction", "back");
      expect(view()).toHaveClass("animate-in", "slide-in-from-left-8");
    });

    it("forwards className and ref to the panel", () => {
      const ref = { current: null as HTMLDivElement | null };
      render(
        <MorphPanel ref={ref} step={0} className="custom">
          View
        </MorphPanel>,
      );
      expect(ref.current).toBe(panel());
      expect(panel()).toHaveClass("custom");
    });
  });

  describe("height", () => {
    it("morphs from the old view's height to the new one's, then lets go", () => {
      vi.useFakeTimers();
      const { rerender } = render(renderAt(0));
      height = 240;
      rerender(renderAt(1));
      expect(panel()?.style.height).toBe("240px");
      expect(panel()?.style.transition).toBe("height 300ms cubic-bezier(0.32, 0.72, 0, 1)");
      expect(panel()?.style.overflow).toBe("hidden");
      act(() => {
        vi.advanceTimersByTime(350);
      });
      expect(panel()?.style.height).toBe("");
      expect(panel()?.style.transition).toBe("");
      expect(panel()?.style.overflow).toBe("");
    });

    it("does not morph when the view's own content changes", () => {
      const { rerender } = render(renderAt(0, "Short"));
      height = 240;
      rerender(renderAt(0, "Much longer content"));
      expect(screen.getByText("Much longer content")).toBeInTheDocument();
      expect(panel()?.style.transition).toBe("");
      expect(view()).not.toHaveAttribute("data-direction");
    });
  });

  describe("reduced motion", () => {
    it("swaps views instantly", () => {
      mockReducedMotion(true);
      const { rerender } = render(renderAt(0));
      height = 240;
      rerender(renderAt(1));
      expect(screen.getByText("View 1")).toBeInTheDocument();
      expect(view()).toHaveAttribute("data-direction", "forward");
      expect(view()).not.toHaveClass("animate-in");
      expect(panel()?.style.transition).toBe("");
      expect(panel()?.style.height).toBe("");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(renderAt(0));
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
