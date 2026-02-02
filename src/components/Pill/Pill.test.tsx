import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Pill } from "./Pill";

describe("Pill", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(<Pill className="custom-class">Custom</Pill>);
      const pill = screen.getByText("Custom").closest("span");
      expect(pill).toHaveClass("custom-class");
    });

    it("renders as a Slot when asChild is true", () => {
      render(
        <Pill asChild>
          <a href="/test">Link Pill</a>
        </Pill>,
      );
      const link = screen.getByRole("link", { name: /Link Pill/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<Pill>Accessible Pill</Pill>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("marks icon wrappers as aria-hidden", () => {
      const { container } = render(
        <Pill leftIcon={<span>icon</span>} rightIcon={<span>icon</span>}>
          Pill
        </Pill>,
      );
      const hiddenElements = container.querySelectorAll('[aria-hidden="true"]');
      expect(hiddenElements.length).toBe(2);
    });
  });
});
