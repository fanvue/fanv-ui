import { render } from "@testing-library/react";
import type * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { SpinnerIcon } from "./SpinnerIcon";

const renderSpinner = (props: React.ComponentProps<typeof SpinnerIcon> = {}) => {
  const { container } = render(<SpinnerIcon {...props} />);
  return container.querySelector("svg") as SVGSVGElement;
};

describe("SpinnerIcon", () => {
  describe("API", () => {
    it("is a still icon unless spin is set", () => {
      expect(renderSpinner().getAttribute("class")).not.toMatch(/animate-/);
    });

    it("spins with motion allowed and pulses under reduced motion when spin is set", () => {
      expect(renderSpinner({ spin: true })).toHaveClass(
        "motion-safe:animate-spin",
        "motion-reduce:animate-pulse",
      );
    });

    it("keeps the 20px box when no size is given", () => {
      expect(renderSpinner()).toHaveClass("size-5");
    });

    it.each([
      [16, "size-4"],
      [24, "size-6"],
      [32, "size-8"],
    ] as const)("renders at %ipx with the icon size prop", (size, className) => {
      const svg = renderSpinner({ size });
      expect(svg).toHaveClass(className);
      expect(svg).not.toHaveClass("size-5");
    });

    it("lets a className size win, as call sites that size it by hand expect", () => {
      const svg = renderSpinner({ size: 16, className: "size-10" });
      expect(svg).toHaveClass("size-10");
      expect(svg).not.toHaveClass("size-4");
    });
  });

  describe("accessibility", () => {
    it("is hidden from assistive tech and has no axe violations", async () => {
      const { container } = render(<SpinnerIcon spin />);
      expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
