import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ProfileStatus } from "./ProfileStatus";

describe("ProfileStatus", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(<ProfileStatus data-testid="status" className="custom" />);
      expect(screen.getByTestId("status")).toHaveClass("custom");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<ProfileStatus ref={ref} data-testid="status" />);
      expect(ref.current).toBe(screen.getByTestId("status"));
    });

    it("renders the active state with a pulsing overlay by default", () => {
      const { container } = render(<ProfileStatus data-testid="status" />);
      expect(screen.getByTestId("status")).toHaveClass("bg-messages-status-active");
      expect(container.querySelector(".animate-ping")).toBeInTheDocument();
    });

    it("renders the inactive state without a pulsing overlay", () => {
      const { container } = render(<ProfileStatus data-testid="status" active={false} />);
      expect(screen.getByTestId("status")).toHaveClass("bg-messages-status-inactive");
      expect(container.querySelector(".animate-ping")).not.toBeInTheDocument();
    });

    it("renders sm size by default", () => {
      render(<ProfileStatus data-testid="status" />);
      expect(screen.getByTestId("status")).toHaveClass("size-2");
    });

    it("renders md size", () => {
      render(<ProfileStatus data-testid="status" size="md" />);
      expect(screen.getByTestId("status")).toHaveClass("size-3");
    });

    it("is decorative (aria-hidden) when no accessible label is provided", () => {
      render(<ProfileStatus data-testid="status" />);
      const status = screen.getByTestId("status");
      expect(status).toHaveAttribute("aria-hidden", "true");
      expect(status).not.toHaveAttribute("role");
    });

    it("exposes an image role when an aria-label is provided", () => {
      render(<ProfileStatus aria-label="Online" />);
      const status = screen.getByRole("img", { name: "Online" });
      expect(status).not.toHaveAttribute("aria-hidden");
    });

    it("spreads additional HTML attributes", () => {
      render(<ProfileStatus data-testid="status" data-custom="value" />);
      expect(screen.getByTestId("status")).toHaveAttribute("data-custom", "value");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations when decorative", async () => {
      const { container } = render(<ProfileStatus />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations when labelled", async () => {
      const { container } = render(<ProfileStatus aria-label="Online" />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
