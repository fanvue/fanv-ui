import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Alert } from "./Alert";

describe("Alert", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(<Alert className="custom-class">Custom alert</Alert>);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("custom-class");
    });

    it("renders title when provided", () => {
      render(<Alert title="Alert Title">Alert body</Alert>);
      expect(screen.getByText("Alert Title")).toBeInTheDocument();
      expect(screen.getByText("Alert body")).toBeInTheDocument();
    });

    it("renders without title when not provided", () => {
      render(<Alert>Alert body only</Alert>);
      expect(screen.getByText("Alert body only")).toBeInTheDocument();
    });

    it("applies semibold font to title", () => {
      render(<Alert title="Bold Title">Body text</Alert>);
      const title = screen.getByText("Bold Title");
      expect(title).toHaveClass("typography-body-2-semibold");
    });

    it("applies normal font to body", () => {
      render(<Alert title="Title">Body text</Alert>);
      const body = screen.getByText("Body text");
      expect(body).toHaveClass("typography-body-2-regular");
    });
  });

  describe("closable behavior", () => {
    it("calls onClose when close button is clicked", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <Alert closable onClose={onClose}>
          Closable alert
        </Alert>,
      );
      const closeButton = screen.getByRole("button", { name: /close alert/i });
      await user.click(closeButton);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when close button is activated with keyboard", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <Alert closable onClose={onClose}>
          Closable alert
        </Alert>,
      );
      const closeButton = screen.getByRole("button", { name: /close alert/i });
      closeButton.focus();
      await user.keyboard("{Enter}");
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("has cursor pointer on close button", () => {
      render(
        <Alert closable onClose={vi.fn()}>
          Closable alert
        </Alert>,
      );
      const closeButton = screen.getByRole("button", { name: /close alert/i });
      expect(closeButton).toHaveClass("cursor-pointer");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<Alert>Accessible alert</Alert>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with icon and close button", async () => {
      const { container } = render(
        <Alert icon={<span>Icon</span>} closable>
          Alert with all features
        </Alert>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
