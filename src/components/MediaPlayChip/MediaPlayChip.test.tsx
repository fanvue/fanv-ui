import { render } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { formatPlayChipDuration, MediaPlayChip } from "./MediaPlayChip";

describe("MediaPlayChip", () => {
  describe("API", () => {
    it("uses the dark status-property surface", () => {
      const { container } = render(<MediaPlayChip />);
      expect(container.firstElementChild).toHaveClass(
        "dark",
        "h-8",
        "rounded-full",
        "bg-buttons-status-property-default",
        "text-icons-primary",
        "backdrop-blur-[20px]",
      );
    });

    it("shows only the icon, in a 32px circle, without a duration", () => {
      const { container } = render(<MediaPlayChip />);
      expect(container.textContent).toBe("");
      expect(container.firstElementChild).toHaveClass("h-8", "w-8");
      expect(container.firstElementChild?.className).not.toMatch(/\b(px|pl|pr)-/);
    });

    it("pads the pill around the icon and length", () => {
      const { container } = render(<MediaPlayChip duration={42} />);
      expect(container.firstElementChild).toHaveClass("px-3");
      expect(container.firstElementChild).not.toHaveClass("w-8");
      expect(container).toHaveTextContent("00:42");
    });

    it("merges className and passes rest props through", () => {
      const { container } = render(<MediaPlayChip className="absolute top-2" data-testid="chip" />);
      expect(container.firstElementChild).toHaveClass("absolute", "top-2", "rounded-full");
      expect(container.firstElementChild).toHaveAttribute("data-testid", "chip");
    });

    it("forwards its ref to the chip", () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<MediaPlayChip ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe("accessibility", () => {
    it("is hidden from assistive tech", () => {
      const { container } = render(<MediaPlayChip duration={42} />);
      expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    });

    it("has no accessibility violations", async () => {
      const { container } = render(<MediaPlayChip duration={42} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});

describe("formatPlayChipDuration", () => {
  it.each([
    [42, "00:42"],
    [5, "00:05"],
    [61, "01:01"],
    [600, "10:00"],
  ])("formats %ss as %s", (duration, expected) => {
    expect(formatPlayChipDuration(duration)).toBe(expected);
  });

  it("returns nothing without a length", () => {
    expect(formatPlayChipDuration(undefined)).toBeUndefined();
    expect(formatPlayChipDuration(0)).toBeUndefined();
  });
});
