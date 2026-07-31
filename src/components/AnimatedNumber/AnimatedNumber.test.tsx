import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AnimatedNumber } from "./AnimatedNumber";

const formatPrice = (value: number) => `$${Math.round(value).toLocaleString("en-US")}`;

describe("AnimatedNumber", () => {
  describe("count variant", () => {
    beforeEach(() => {
      // Drive requestAnimationFrame off fake timers so the tween can be stepped
      // deterministically instead of waiting on real frames.
      vi.useFakeTimers();
      vi.stubGlobal(
        "requestAnimationFrame",
        (cb: FrameRequestCallback) =>
          setTimeout(() => cb(performance.now()), 16) as unknown as number,
      );
      vi.stubGlobal("cancelAnimationFrame", (id: number) => clearTimeout(id));
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.unstubAllGlobals();
    });

    it("renders the formatted value on first paint without animating in", () => {
      render(<AnimatedNumber value={1234} format={formatPrice} />);
      expect(screen.getByText("$1,234")).toBeInTheDocument();
    });

    it("settles on the new value once the tween completes", () => {
      const { rerender } = render(<AnimatedNumber value={100} format={formatPrice} />);
      rerender(<AnimatedNumber value={200} format={formatPrice} />);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.getByText("$200")).toBeInTheDocument();
    });

    it("swaps instantly when the duration is zero", () => {
      const { rerender } = render(
        <AnimatedNumber value={100} format={formatPrice} durationMs={0} />,
      );
      rerender(<AnimatedNumber value={200} format={formatPrice} durationMs={0} />);
      expect(screen.getByText("$200")).toBeInTheDocument();
    });
  });

  describe("roll variant", () => {
    it("exposes the formatted value once as text", () => {
      render(<AnimatedNumber value={1234} format={formatPrice} variant="roll" />);
      expect(screen.getByText("$1,234")).toBeInTheDocument();
    });

    it("hides the digit columns from assistive technology", () => {
      const { container } = render(<AnimatedNumber value={12} format={String} variant="roll" />);
      // Without this the ten stacked digits in every column would be read out.
      expect(container.querySelector("[aria-hidden]")).toBeInTheDocument();
    });

    it("renders one column per digit, each listing all ten digits", () => {
      const { container } = render(<AnimatedNumber value={12} format={String} variant="roll" />);
      const strips = container.querySelectorAll('[style*="translateY"]');
      expect(strips).toHaveLength(2);
      expect(strips[0]).toHaveTextContent("0123456789");
    });

    it("offsets each column to its own digit", () => {
      const { container } = render(<AnimatedNumber value={12} format={String} variant="roll" />);
      const strips = container.querySelectorAll('[style*="translateY"]');
      expect(strips[0]).toHaveAttribute("style", expect.stringContaining("translateY(-10%)"));
      expect(strips[1]).toHaveAttribute("style", expect.stringContaining("translateY(-20%)"));
    });

    it("leaves separators as static characters rather than columns", () => {
      const { container } = render(
        <AnimatedNumber value={1234} format={formatPrice} variant="roll" />,
      );
      // 4 digits roll; "$" and "," do not.
      expect(container.querySelectorAll('[style*="translateY"]')).toHaveLength(4);
    });
  });
});
