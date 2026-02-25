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

  describe("default icons", () => {
    it("renders a default icon for the info variant", () => {
      render(<Alert variant="info">Info</Alert>);
      const alert = screen.getByRole("alert");
      expect(alert.querySelector("svg")).toBeInTheDocument();
    });

    it("renders a default icon for the success variant", () => {
      render(<Alert variant="success">Success</Alert>);
      const alert = screen.getByRole("alert");
      expect(alert.querySelector("svg")).toBeInTheDocument();
    });

    it("renders a default icon for the warning variant", () => {
      render(<Alert variant="warning">Warning</Alert>);
      const alert = screen.getByRole("alert");
      expect(alert.querySelector("svg")).toBeInTheDocument();
    });

    it("renders a default icon for the error variant", () => {
      render(<Alert variant="error">Error</Alert>);
      const alert = screen.getByRole("alert");
      expect(alert.querySelector("svg")).toBeInTheDocument();
    });

    it("hides the icon when icon={null}", () => {
      render(
        <Alert variant="info" icon={null}>
          No icon
        </Alert>,
      );
      const alert = screen.getByRole("alert");
      expect(alert.querySelector("svg")).not.toBeInTheDocument();
    });

    it("renders a custom icon when provided", () => {
      render(<Alert icon={<span data-testid="custom-icon">★</span>}>Custom</Alert>);
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
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
