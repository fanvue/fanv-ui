import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Chip } from "./Chip";

describe("Chip", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(<Chip className="custom-class">Test</Chip>);
      const chip = screen.getByTestId("chip");
      expect(chip).toHaveClass("custom-class");
    });

    it("renders as a span by default (static)", () => {
      render(<Chip>Static</Chip>);
      const chip = screen.getByTestId("chip");
      expect(chip.tagName).toBe("SPAN");
    });

    it("renders as a button when onClick is provided", () => {
      render(<Chip onClick={() => {}}>Clickable</Chip>);
      const chip = screen.getByTestId("chip");
      expect(chip.tagName).toBe("BUTTON");
      expect(chip).toHaveAttribute("type", "button");
    });

    it("renders as Slot when asChild is true", () => {
      render(
        <Chip asChild>
          <a href="/test">Link Chip</a>
        </Chip>,
      );
      const link = screen.getByRole("link", { name: /Link Chip/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
    });

    it("forwards ref", () => {
      const ref = vi.fn();
      render(<Chip ref={ref}>Test</Chip>);
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLElement));
    });
  });

  describe("interaction", () => {
    it("calls onClick when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Chip onClick={handleClick}>Click me</Chip>);
      await user.click(screen.getByTestId("chip"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Chip onClick={handleClick} disabled>
          Disabled
        </Chip>,
      );
      await user.click(screen.getByTestId("chip"));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("sets aria-pressed when selected and interactive", () => {
      render(
        <Chip onClick={() => {}} selected>
          Selected
        </Chip>,
      );
      const chip = screen.getByTestId("chip");
      expect(chip).toHaveAttribute("aria-pressed", "true");
    });

    it("does not set aria-pressed on static chips", () => {
      render(<Chip selected>Selected</Chip>);
      const chip = screen.getByTestId("chip");
      expect(chip).not.toHaveAttribute("aria-pressed");
    });

    it("sets data-selected when selected", () => {
      render(<Chip selected>Selected</Chip>);
      const chip = screen.getByTestId("chip");
      expect(chip).toHaveAttribute("data-selected");
    });
  });

  describe("disabled", () => {
    it("sets disabled attribute on interactive chips", () => {
      render(
        <Chip onClick={() => {}} disabled>
          Disabled
        </Chip>,
      );
      const chip = screen.getByTestId("chip");
      expect(chip).toBeDisabled();
    });

    it("sets aria-disabled on static chips", () => {
      render(<Chip disabled>Disabled</Chip>);
      const chip = screen.getByTestId("chip");
      expect(chip).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("leftDot", () => {
    it("does not render dot by default", () => {
      const { container } = render(<Chip>No Dot</Chip>);
      const hiddenElements = container.querySelectorAll('[aria-hidden="true"]');
      expect(hiddenElements).toHaveLength(0);
    });

    it("renders dot when leftDot is true", () => {
      const { container } = render(<Chip leftDot>With Dot</Chip>);
      const hiddenElements = container.querySelectorAll('[aria-hidden="true"]');
      expect(hiddenElements).toHaveLength(1);
    });
  });

  describe("notificationLabel", () => {
    it("renders notification badge with label", () => {
      render(<Chip notificationLabel="99+">Test</Chip>);
      expect(screen.getByText("99+")).toBeInTheDocument();
    });

    it("does not render badge when notificationLabel is not provided", () => {
      render(<Chip>Test</Chip>);
      expect(screen.getByTestId("chip")).toHaveTextContent("Test");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations (static)", async () => {
      const { container } = render(<Chip>Accessible Chip</Chip>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations (interactive)", async () => {
      const { container } = render(<Chip onClick={() => {}}>Clickable</Chip>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations (selected)", async () => {
      const { container } = render(
        <Chip onClick={() => {}} selected>
          Selected
        </Chip>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("marks decorative elements as aria-hidden", () => {
      const { container } = render(
        <Chip leftDot leftIcon={<span>icon</span>} rightIcon={<span>icon</span>}>
          Chip
        </Chip>,
      );
      const hiddenElements = container.querySelectorAll('[aria-hidden="true"]');
      // dot + left icon wrapper + right icon wrapper
      expect(hiddenElements.length).toBe(3);
    });
  });
});
