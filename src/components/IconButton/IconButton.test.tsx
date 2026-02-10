import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { HomeIcon } from "../Icons";
import { IconButton } from "./IconButton";

describe("IconButton", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(<IconButton icon={<HomeIcon />} className="custom-class" />);
      const button = screen.getByTestId("icon-button");
      expect(button).toHaveClass("custom-class");
    });

    it("renders with correct button type", () => {
      render(<IconButton icon={<HomeIcon />} aria-label="Home" />);
      const button = screen.getByTestId("icon-button");
      expect(button).toHaveAttribute("type", "button");
    });

    it("forwards ref correctly", () => {
      const ref = { current: null };
      render(<IconButton ref={ref} icon={<HomeIcon />} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("applies disabled attribute", () => {
      render(<IconButton icon={<HomeIcon />} disabled />);
      const button = screen.getByTestId("icon-button");
      expect(button).toBeDisabled();
    });
  });

  describe("counter badge", () => {
    it("shows counter badge when counterShow is true for Tertiary style", () => {
      const { container } = render(
        <IconButton icon={<HomeIcon />} variant="tertiary" counterValue={12} />,
      );
      expect(container.textContent).toContain("12");
    });

    it("does not show counter badge for Primary style even when counterShow is true", () => {
      const { container } = render(
        <IconButton icon={<HomeIcon />} variant="primary" counterValue={12} />,
      );
      expect(container.textContent).not.toContain("12");
    });

    it("does not show counter badge when counterValue is 0", () => {
      const { container } = render(
        <IconButton icon={<HomeIcon />} variant="tertiary" counterValue={0} />,
      );
      // Find the badge element
      const badge = container.querySelector(".bg-brand-green-500");
      expect(badge).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<IconButton icon={<HomeIcon />} aria-label="Home" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("marks icon as aria-hidden", () => {
      const { container } = render(<IconButton icon={<HomeIcon />} />);
      const iconWrapper = container.querySelector('[aria-hidden="true"]');
      expect(iconWrapper).toBeInTheDocument();
    });

    it("is keyboard accessible", () => {
      render(<IconButton icon={<HomeIcon />} aria-label="Home" />);
      const button = screen.getByTestId("icon-button");
      button.focus();
      expect(button).toHaveFocus();
    });
  });
});
