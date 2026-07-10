import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { SubscribeButton } from "./SubscribeButton";

describe("SubscribeButton", () => {
  describe("API", () => {
    it("renders the label, price, and struck-through discount", () => {
      render(
        <SubscribeButton price="$9.99/mo" discount="$19.99">
          Join now
        </SubscribeButton>,
      );
      expect(screen.getByText("Join now")).toBeInTheDocument();
      expect(screen.getByText("$9.99/mo")).toBeInTheDocument();
      expect(screen.getByText("$19.99")).toHaveClass("line-through");
    });

    it('defaults the label to "Join now"', () => {
      render(<SubscribeButton price="$9.99/mo" />);
      expect(screen.getByText("Join now")).toBeInTheDocument();
    });

    it("applies a custom className", () => {
      render(
        <SubscribeButton className="custom" price="$9.99/mo">
          Subscribe
        </SubscribeButton>,
      );
      expect(screen.getByRole("button")).toHaveClass("custom");
    });

    it("forwards ref to the underlying button", () => {
      const ref = { current: null as HTMLButtonElement | null };
      render(
        <SubscribeButton ref={ref} price="$9.99/mo">
          Subscribe
        </SubscribeButton>,
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("fires onClick", async () => {
      const onClick = vi.fn();
      render(
        <SubscribeButton price="$9.99/mo" onClick={onClick}>
          Subscribe
        </SubscribeButton>,
      );
      screen.getByRole("button").click();
      expect(onClick).toHaveBeenCalledOnce();
    });

    it("disables interaction when disabled", () => {
      render(
        <SubscribeButton disabled price="$9.99/mo">
          Subscribe
        </SubscribeButton>,
      );
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  describe("accessible name", () => {
    it("derives the name from the label and pricing", () => {
      render(
        <SubscribeButton price="$9.99/mo" discount="$19.99">
          Join now
        </SubscribeButton>,
      );
      expect(
        screen.getByRole("button", { name: "Join now, $9.99/mo, was $19.99" }),
      ).toBeInTheDocument();
    });

    it("respects a caller-provided aria-label", () => {
      render(
        <SubscribeButton aria-label="Start membership" price="$9.99/mo">
          Join now
        </SubscribeButton>,
      );
      expect(screen.getByRole("button", { name: "Start membership" })).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <SubscribeButton price="$9.99/mo" discount="$19.99">
          Join now
        </SubscribeButton>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
