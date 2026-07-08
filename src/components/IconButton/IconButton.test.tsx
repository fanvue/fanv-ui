import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { HomeIcon } from "../Icons/HomeIcon";
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

  describe("V2 variants", () => {
    it("squares the 24 size (rounded-xs) for V2 variants", () => {
      render(<IconButton icon={<HomeIcon />} variant="primary" size="24" aria-label="Home" />);
      const button = screen.getByTestId("icon-button");
      expect(button).toHaveClass("rounded-xs");
      expect(button).not.toHaveClass("rounded-full");
    });

    it("keeps larger V2 sizes circular (rounded-full)", () => {
      render(<IconButton icon={<HomeIcon />} variant="primary" size="40" aria-label="Home" />);
      const button = screen.getByTestId("icon-button");
      expect(button).toHaveClass("rounded-full");
      expect(button).not.toHaveClass("rounded-xs");
    });

    it("keeps legacy variants circular at every size", () => {
      render(<IconButton icon={<HomeIcon />} variant="microphone" size="24" aria-label="Mic" />);
      expect(screen.getByTestId("icon-button")).toHaveClass("rounded-full");
    });

    it("applies the negative treatment on negative-aware variants", () => {
      render(<IconButton icon={<HomeIcon />} variant="primary" negative aria-label="Home" />);
      expect(screen.getByTestId("icon-button")).toHaveClass("bg-buttons-primary-negative-default");
    });

    it("ignores negative on variants that are not negative-aware", () => {
      render(<IconButton icon={<HomeIcon />} variant="error" negative aria-label="Delete" />);
      expect(screen.getByTestId("icon-button")).toHaveClass("bg-buttons-error-default");
    });

    it("carries a disabled: fallback so fieldset-disabled buttons are styled", () => {
      render(<IconButton icon={<HomeIcon />} variant="primary" aria-label="Home" />);
      expect(screen.getByTestId("icon-button")).toHaveClass("disabled:bg-buttons-disabled-default");
    });
  });

  describe("counter badge", () => {
    it("shows counter badge when counterShow is true for Tertiary style", () => {
      const { container } = render(
        <IconButton icon={<HomeIcon />} variant="tertiary" counterValue={12} />,
      );
      expect(container.textContent).toContain("12");
    });

    it("does not show counter badge when counterValue is 0", () => {
      const { container } = render(
        <IconButton icon={<HomeIcon />} variant="tertiary" counterValue={0} />,
      );
      // Find the badge element
      const badge = container.querySelector(".bg-brand-primary-default");
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
