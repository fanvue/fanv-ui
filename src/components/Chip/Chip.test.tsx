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

  describe("dotted", () => {
    it("renders a dashed svg border when dotted is true", () => {
      render(<Chip dotted>New folder</Chip>);
      const rect = screen.getByTestId("chip").querySelector("rect");
      expect(rect).not.toBeNull();
      expect(rect).toHaveAttribute("stroke-dasharray", "6 6");
    });

    it("uses an 8/8 dash pattern for the 40px square chip", () => {
      render(
        <Chip dotted variant="square" size="40">
          New folder
        </Chip>,
      );
      const rect = screen.getByTestId("chip").querySelector("rect");
      expect(rect).toHaveAttribute("stroke-dasharray", "8 8");
    });

    it("does not render a dashed border by default", () => {
      render(<Chip>Chip</Chip>);
      const chip = screen.getByTestId("chip");
      expect(chip).not.toHaveClass("border-dashed");
      expect(chip.querySelector("rect")).toBeNull();
    });
  });

  describe("notification badge", () => {
    it("renders notification badge with label", () => {
      render(<Chip notificationLabel="99+">Test</Chip>);
      expect(screen.getByText("99+")).toBeInTheDocument();
    });

    it("renders notification badge with notificationCount", () => {
      render(<Chip notificationCount={5}>Test</Chip>);
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("renders overflow format when notificationCount exceeds notificationMax", () => {
      render(
        <Chip notificationCount={12} notificationMax={9}>
          Test
        </Chip>,
      );
      expect(screen.getByText("9+")).toBeInTheDocument();
    });

    it("does not render badge when no notification props are provided", () => {
      render(<Chip>Test</Chip>);
      expect(screen.getByTestId("chip")).toHaveTextContent("Test");
    });

    it("uses brand variant by default", () => {
      render(<Chip notificationCount={3}>Test</Chip>);
      const badge = screen.getByText("3");
      expect(badge).toHaveClass("bg-brand-primary-default");
      expect(badge).toHaveClass("text-content-always-black");
    });

    it("uses Figma V2 notification geometry without changing shared Count sizes", () => {
      render(<Chip notificationCount={3}>Test</Chip>);
      const badge = screen.getByText("3");
      expect(badge).toHaveClass("h-5");
      expect(badge).toHaveClass("min-w-5");
      expect(badge).toHaveClass("rounded-md");
      expect(badge).toHaveClass("px-1");
      expect(badge).toHaveClass("py-0.5");
    });

    it("does not change chip padding when a badge is present", () => {
      const { container } = render(<Chip notificationCount={99}>Chip</Chip>);
      const inner = container.querySelector('[data-testid="chip"] > span');
      expect(inner).toHaveClass("px-3");
      expect(inner).not.toHaveClass("pr-6");
    });

    it("anchors the badge leading edge for size 32 chips", () => {
      render(
        <Chip size="32" notificationCount={3}>
          Test
        </Chip>,
      );
      const badge = screen.getByText("3");
      expect(badge).toHaveClass("top-[-4px]");
      expect(badge).toHaveClass("left-[calc(100%_-_11px)]");
    });

    it("anchors the badge leading edge for size 40 chips", () => {
      render(
        <Chip size="40" notificationCount={3}>
          Test
        </Chip>,
      );
      const badge = screen.getByText("3");
      expect(badge).toHaveClass("top-[-4px]");
      expect(badge).toHaveClass("left-[calc(100%_-_16px)]");
    });

    it("applies custom notificationVariant", () => {
      render(
        <Chip notificationCount={3} notificationVariant="alert">
          Test
        </Chip>,
      );
      const badge = screen.getByText("3");
      expect(badge).toHaveClass("bg-error-content");
    });
  });

  describe("truncation", () => {
    it("wraps content in an overflow-hidden container to preserve padding during truncation", () => {
      const { container } = render(<Chip>Label</Chip>);
      const inner = container.querySelector('[data-testid="chip"] > span');
      expect(inner).toHaveClass("overflow-hidden");
      expect(inner).toHaveClass("px-3");
    });

    it("applies truncate on the label span for text overflow", () => {
      const { container } = render(<Chip>Label</Chip>);
      const labelSpan = container.querySelector('[data-testid="chip"] span.truncate');
      expect(labelSpan).toBeInTheDocument();
      expect(labelSpan).toHaveClass("truncate");
      expect(labelSpan).toHaveClass("min-w-0");
    });

    it("does not apply truncation classes when using asChild", () => {
      const { container } = render(
        <Chip asChild>
          <a href="/test">Link Chip</a>
        </Chip>,
      );
      const truncateSpan = container.querySelector("span.truncate");
      expect(truncateSpan).not.toBeInTheDocument();
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
