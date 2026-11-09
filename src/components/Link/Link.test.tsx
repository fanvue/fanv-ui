import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Link } from "./Link";

describe("Link", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(
        <Link href="#" className="custom">
          Label
        </Link>,
      );
      expect(screen.getByRole("link", { name: /Label/i })).toHaveClass("custom");
    });

    it("renders the provided href", () => {
      render(<Link href="/pricing">Pricing</Link>);
      expect(screen.getByRole("link", { name: /Pricing/i })).toHaveAttribute("href", "/pricing");
    });

    it("renders as the child element when asChild is true", () => {
      render(
        <Link asChild>
          <button type="button">Action</button>
        </Link>,
      );
      expect(screen.getByRole("button", { name: /Action/i })).toBeInTheDocument();
    });

    it("renders icons around the slotted child when asChild is true", () => {
      render(
        <Link asChild leftIcon={<svg data-testid="left" />} rightIcon={<svg data-testid="right" />}>
          <a href="/pricing">Pricing</a>
        </Link>,
      );
      const link = screen.getByRole("link", { name: /Pricing/i });
      expect(link).toContainElement(screen.getByTestId("left"));
      expect(link).toContainElement(screen.getByTestId("right"));
    });

    it("strips the child href for a disabled asChild link", () => {
      render(
        <Link asChild disabled>
          <a href="/pricing">Pricing</a>
        </Link>,
      );
      const link = screen.getByText("Pricing").closest("a");
      expect(link).not.toHaveAttribute("href");
      expect(link).toHaveAttribute("aria-disabled", "true");
      expect(link).toHaveAttribute("tabindex", "-1");
    });

    it("removes href and marks aria-disabled when disabled", () => {
      render(
        <Link href="/pricing" disabled>
          Pricing
        </Link>,
      );
      const link = screen.getByText("Pricing").closest("a");
      expect(link).not.toHaveAttribute("href");
      expect(link).toHaveAttribute("aria-disabled", "true");
      expect(link).toHaveAttribute("tabindex", "-1");
    });

    it("hides decorative icons from assistive tech", () => {
      render(
        <Link href="#" rightIcon={<svg data-testid="icon" />}>
          Wallet
        </Link>,
      );
      expect(screen.getByTestId("icon").parentElement).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("accessibility", () => {
    it("inherits colour and type from its surroundings with the inherit variant and size", () => {
      render(
        <Link href="#" variant="inherit" size="inherit">
          Label
        </Link>,
      );
      const link = screen.getByRole("link", { name: /Label/i });
      expect(link).toHaveClass("text-inherit");
      expect(link).not.toHaveClass("text-buttons-link-primary-default");
      expect(link.firstElementChild).toHaveClass("underline");
      expect(link.firstElementChild?.className).not.toMatch(/typography-/);
    });

    it("renders inline so it wraps with the sentence when size is inherit", () => {
      render(
        <Link href="#" variant="inherit" size="inherit">
          Label
        </Link>,
      );
      const link = screen.getByRole("link", { name: /Label/i });
      expect(link).toHaveClass("inline", "transition-opacity");
      expect(link).not.toHaveClass("inline-flex");
    });

    it("keeps the flex layout for icons when size is inherit", () => {
      render(
        <Link href="#" size="inherit" leftIcon={<svg />}>
          Label
        </Link>,
      );
      const link = screen.getByRole("link", { name: /Label/i });
      expect(link).toHaveClass("inline-flex", "transition-colors");
    });

    it("has no accessibility violations", async () => {
      const { container } = render(<Link href="/pricing">Pricing</Link>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations when disabled", async () => {
      const { container } = render(
        <Link href="/pricing" disabled>
          Pricing
        </Link>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
