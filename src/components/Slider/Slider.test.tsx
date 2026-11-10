import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Slider } from "./Slider";

function stubPointerCapture(el: HTMLElement) {
  el.setPointerCapture = vi.fn();
  el.releasePointerCapture = vi.fn();
  el.hasPointerCapture = vi.fn().mockReturnValue(false);
}

describe("Slider", () => {
  describe("API", () => {
    it("applies custom className to the root slider element", () => {
      const { container } = render(<Slider defaultValue={[50]} className="custom-class" />);
      const root = container
        .querySelector("[data-radix-collection-item]")
        ?.closest("[role='slider']")?.parentElement?.parentElement;
      expect(root).toBeTruthy();
    });

    it("calls onValueChange when value changes", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Slider defaultValue={[50]} max={100} step={1} onValueChange={onValueChange} />);
      const thumb = screen.getByRole("slider");
      stubPointerCapture(thumb);

      thumb.focus();
      await user.keyboard("{ArrowRight}");
      expect(onValueChange).toHaveBeenCalled();
    });

    it("supports disabled state", () => {
      render(<Slider defaultValue={[50]} disabled aria-label="Test" />);
      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("data-disabled");
    });

    it.each([
      ["sm", "h-2", "size-4"],
      ["md", "h-3", "size-6"],
      ["lg", "h-4", "size-8"],
    ] as const)("sizes the track and thumb for size %s", (size, trackClass, thumbClass) => {
      const { container } = render(<Slider defaultValue={[50]} size={size} aria-label="Test" />);
      const track = container.firstElementChild?.firstElementChild;
      expect(track).toHaveClass(trackClass);
      expect(screen.getByRole("slider")).toHaveClass(thumbClass);
    });

    it("uses the brand range and a dotted thumb by default", () => {
      const { container } = render(<Slider defaultValue={[50]} aria-label="Test" />);
      const track = container.firstElementChild?.firstElementChild;
      expect(track?.firstElementChild).toHaveClass("bg-brand-primary-default");
      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveClass("bg-background-primary");
      expect(thumb.firstElementChild).toHaveClass("bg-brand-primary-default");
    });

    it("renders a neutral range and a solid thumb when tone is neutral", () => {
      const { container } = render(<Slider defaultValue={[50]} tone="neutral" aria-label="Test" />);
      const track = container.firstElementChild?.firstElementChild;
      expect(track).toHaveClass("bg-[var(--primitives-color-gray-200)]");
      expect(track?.firstElementChild).toHaveClass("bg-inputs-slider-active");
      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveClass("bg-inputs-slider-active", "border-transparent");
      expect(thumb.firstElementChild).toBeNull();
    });

    it("forwards ref", () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Slider ref={ref} defaultValue={[50]} />);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<Slider defaultValue={[50]} label="Volume" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with range slider", async () => {
      const { container } = render(<Slider defaultValue={[20, 80]} aria-label="Price range" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
