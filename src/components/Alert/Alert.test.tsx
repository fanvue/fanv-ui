import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Alert } from "./Alert";

describe("Alert", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(<Alert className="custom-class">Custom alert</Alert>);
      expect(screen.getByTestId("alert")).toHaveClass("custom-class");
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
      expect(title).toHaveClass("typography-body-small-14px-semibold");
    });

    it("applies normal font to body", () => {
      render(<Alert title="Title">Body text</Alert>);
      const body = screen.getByText("Body text");
      expect(body).toHaveClass("typography-body-small-14px-regular");
    });
  });

  describe("default icons", () => {
    it("renders a default icon for the info variant", () => {
      render(<Alert variant="info">Info</Alert>);
      expect(screen.getByTestId("alert").querySelector("svg")).toBeInTheDocument();
    });

    it("renders a default icon for the success variant", () => {
      render(<Alert variant="success">Success</Alert>);
      expect(screen.getByTestId("alert").querySelector("svg")).toBeInTheDocument();
    });

    it("renders a default icon for the warning variant", () => {
      render(<Alert variant="warning">Warning</Alert>);
      expect(screen.getByTestId("alert").querySelector("svg")).toBeInTheDocument();
    });

    it("renders a default icon for the error variant", () => {
      render(<Alert variant="error">Error</Alert>);
      expect(screen.getByTestId("alert").querySelector("svg")).toBeInTheDocument();
    });

    it("hides the icon when icon={null}", () => {
      render(
        <Alert variant="info" icon={null}>
          No icon
        </Alert>,
      );
      expect(screen.getByTestId("alert").querySelector("svg")).not.toBeInTheDocument();
    });

    it("renders a custom icon when provided", () => {
      render(<Alert icon={<span data-testid="custom-icon">★</span>}>Custom</Alert>);
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });
  });

  describe("neutral variant", () => {
    it("renders a default icon for the neutral variant", () => {
      render(<Alert variant="neutral">Neutral</Alert>);
      expect(screen.getByTestId("alert").querySelector("svg")).toBeInTheDocument();
    });

    it("applies the neutral background token", () => {
      render(<Alert variant="neutral">Neutral</Alert>);
      expect(screen.getByTestId("alert")).toHaveClass("bg-alerts-info-prompt-background-neutral");
    });
  });

  describe("action slot", () => {
    it("renders the passed element", () => {
      render(<Alert action={<a href="/details">Learn more</a>}>Alert with an action</Alert>);
      const link = screen.getByRole("link", { name: /learn more/i });
      expect(link).toHaveAttribute("href", "/details");
    });

    it("applies the variant link styling to the passed element", () => {
      render(<Alert action={<a href="/details">Learn more</a>}>Alert with an action</Alert>);
      const link = screen.getByRole("link", { name: /learn more/i });
      expect(link).toHaveClass("underline");
    });

    it("does not render an action when none is passed", () => {
      render(<Alert>No action</Alert>);
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("renders the action outside the alert live region", () => {
      render(<Alert action={<a href="/details">Learn more</a>}>Alert with an action</Alert>);
      const liveRegion = screen.getByRole("alert");
      expect(liveRegion.querySelector("a")).not.toBeInTheDocument();
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

    it("renders the close button outside the alert live region", () => {
      render(
        <Alert closable onClose={vi.fn()}>
          Closable alert
        </Alert>,
      );
      const liveRegion = screen.getByRole("alert");
      expect(liveRegion.querySelector("button")).not.toBeInTheDocument();
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

    it("has no accessibility violations for the neutral variant with an action", async () => {
      const { container } = render(
        <Alert variant="neutral" title="Heads up" action={<a href="/details">Learn more</a>}>
          Neutral alert with an action
        </Alert>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
