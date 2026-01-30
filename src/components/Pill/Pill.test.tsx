import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Pill } from "./Pill";

describe("Pill", () => {
  it("renders children correctly", () => {
    render(<Pill>Test Pill</Pill>);
    expect(screen.getByText("Test Pill")).toBeInTheDocument();
  });

  it("renders with Green style by default", () => {
    render(<Pill>Subscriber</Pill>);
    const pill = screen.getByText("Subscriber").closest("span");
    expect(pill).toHaveClass("bg-success-50");
    expect(pill).toHaveClass("text-success-500");
  });

  it("renders with Grey variant", () => {
    render(<Pill variant="Grey">Expired</Pill>);
    const pill = screen.getByText("Expired").closest("span");
    expect(pill).toHaveClass("bg-neutral-100");
  });

  it("renders with Blue variant", () => {
    render(<Pill variant="Blue">Follower</Pill>);
    const pill = screen.getByText("Follower").closest("span");
    expect(pill).toHaveClass("bg-info-50");
    expect(pill).toHaveClass("text-info-500");
  });

  it("renders with Gold variant", () => {
    render(<Pill variant="Gold">VIP</Pill>);
    const pill = screen.getByText("VIP").closest("span");
    expect(pill).toHaveClass("bg-warning-50");
    expect(pill).toHaveClass("text-warning-500");
  });

  it("renders with Base variant", () => {
    render(<Pill variant="Base">Example</Pill>);
    const pill = screen.getByText("Example").closest("span");
    expect(pill).toHaveClass("bg-neutral-400");
    expect(pill).toHaveClass("text-body-300");
  });

  it("renders with Brand variant", () => {
    render(<Pill variant="Brand">Discount</Pill>);
    const pill = screen.getByText("Discount").closest("span");
    expect(pill).toHaveClass("bg-brand-green-500");
  });

  it("renders with Beta variant", () => {
    render(<Pill variant="Beta">Beta</Pill>);
    const pill = screen.getByText("Beta").closest("span");
    expect(pill).toHaveClass("bg-brand-pink-500");
  });

  it("renders with Error variant", () => {
    render(<Pill variant="Error">Errors</Pill>);
    const pill = screen.getByText("Errors").closest("span");
    expect(pill).toHaveClass("bg-error-500");
    expect(pill).toHaveClass("text-error-50");
  });

  it("renders left icon when provided", () => {
    render(<Pill leftIcon={<span data-testid="left-icon">L</span>}>With Icon</Pill>);
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("renders right icon when provided", () => {
    render(<Pill rightIcon={<span data-testid="right-icon">R</span>}>With Icon</Pill>);
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Pill className="custom-class">Custom</Pill>);
    const pill = screen.getByText("Custom").closest("span");
    expect(pill).toHaveClass("custom-class");
  });

  describe("asChild", () => {
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

  describe("all variant options", () => {
    const variants = [
      "Green",
      "Grey",
      "Blue",
      "Gold",
      "Pink Light",
      "Base",
      "Brand",
      "Brand light",
      "Beta",
      "Error",
    ] as const;

    it.each(variants)("renders %s variant without errors", (variant) => {
      render(<Pill variant={variant}>{variant}</Pill>);
      expect(screen.getByText(variant)).toBeInTheDocument();
    });
  });
});
