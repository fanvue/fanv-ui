import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { AnimatedNumber } from "./AnimatedNumber";

const formatPrice = (value: number) => `$${Math.round(value).toLocaleString("en-US")}`;

describe("AnimatedNumber", () => {
  describe("count variant", () => {
    beforeEach(() => {
      // Vitest fakes requestAnimationFrame itself, so the tween can be stepped
      // deterministically. Hand-stubbing it over setTimeout instead would create
      // timers that `cancelAnimationFrame` cannot clear, which only shows up once
      // a test interrupts a tween while a frame is still pending.
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
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

    it("resumes an interrupted tween from what is on screen, not the abandoned target", () => {
      const plain = (value: number) => String(Math.round(value));
      const read = () => Number(screen.getByTestId("n").textContent);

      const { rerender } = render(<AnimatedNumber value={0} format={plain} data-testid="n" />);
      rerender(<AnimatedNumber value={100} format={plain} data-testid="n" />);
      act(() => {
        vi.advanceTimersByTime(100);
      });

      const mid = read();
      expect(mid).toBeGreaterThan(0);
      expect(mid).toBeLessThan(100);

      // Retarget mid-flight, as a refetch or filter change would.
      rerender(<AnimatedNumber value={200} format={plain} data-testid="n" />);
      act(() => {
        vi.advanceTimersByTime(16);
      });

      // Carries on from `mid`. Resuming from the abandoned 100 would overshoot it.
      expect(read()).toBeGreaterThanOrEqual(mid);
      expect(read()).toBeLessThan(100);
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
  describe("accessibility", () => {
    it("has no accessibility violations in the count variant", async () => {
      const { container } = render(<AnimatedNumber value={1234} format={formatPrice} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    // The roll variant stacks ten digits per column, so the run is hidden and the
    // value exposed once as text. axe cannot see that distinction — it is covered
    // by "exposes the formatted value once as text" above — but it does catch the
    // markup being invalid.
    it("has no accessibility violations in the roll variant", async () => {
      const { container } = render(
        <AnimatedNumber value={1234} format={formatPrice} variant="roll" />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
