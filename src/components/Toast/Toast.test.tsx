import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Toast, ToastProvider, ToastViewport } from "./Toast";

const ToastWrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    {children}
    <ToastViewport />
  </ToastProvider>
);

describe("Toast", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(
        <ToastWrapper>
          <Toast className="custom-class" open title="Test">
            Test Toast
          </Toast>
        </ToastWrapper>,
      );
      const toast = screen.getByTestId("toast");
      expect(toast).toHaveClass("custom-class");
    });

    it("renders title when provided", () => {
      render(
        <ToastWrapper>
          <Toast open title="Test Title">
            Test
          </Toast>
        </ToastWrapper>,
      );
      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("renders description when provided", () => {
      render(
        <ToastWrapper>
          <Toast open description="Test Description">
            Test
          </Toast>
        </ToastWrapper>,
      );
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    it("shows close button by default", () => {
      render(
        <ToastWrapper>
          <Toast open title="Test">
            Test
          </Toast>
        </ToastWrapper>,
      );
      expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
    });

    it("hides close button when showClose is false", () => {
      render(
        <ToastWrapper>
          <Toast open showClose={false} title="Test">
            Test
          </Toast>
        </ToastWrapper>,
      );
      expect(screen.queryByRole("button", { name: /close/i })).not.toBeInTheDocument();
    });

    it("renders action when provided", () => {
      render(
        <ToastWrapper>
          <Toast open title="Test" action={<span>Action Button</span>} />
        </ToastWrapper>,
      );
      expect(screen.getByText("Action Button")).toBeInTheDocument();
    });
  });

  describe("state variants", () => {
    it("renders Info state correctly", () => {
      render(
        <ToastWrapper>
          <Toast open state="Info" title="Info">
            Info
          </Toast>
        </ToastWrapper>,
      );
      const toast = screen.getByTestId("toast");
      expect(toast).toHaveClass("border-info-500");
    });

    it("renders Warning state correctly", () => {
      render(
        <ToastWrapper>
          <Toast open state="Warning" title="Warning">
            Warning
          </Toast>
        </ToastWrapper>,
      );
      const toast = screen.getByTestId("toast");
      expect(toast).toHaveClass("border-warning-500");
    });

    it("renders Success state correctly", () => {
      render(
        <ToastWrapper>
          <Toast open state="Success" title="Success">
            Success
          </Toast>
        </ToastWrapper>,
      );
      const toast = screen.getByTestId("toast");
      expect(toast).toHaveClass("border-success-500");
    });

    it("renders Error state correctly", () => {
      render(
        <ToastWrapper>
          <Toast open state="Error" title="Error">
            Error
          </Toast>
        </ToastWrapper>,
      );
      const toast = screen.getByTestId("toast");
      expect(toast).toHaveClass("border-error-500");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <ToastWrapper>
          <Toast open title="Accessible Toast" description="This is a test">
            Test
          </Toast>
        </ToastWrapper>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has accessible close button label", () => {
      render(
        <ToastWrapper>
          <Toast open title="Test">
            Test
          </Toast>
        </ToastWrapper>,
      );
      const closeButton = screen.getByRole("button", { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });

    it("marks decorative icons as aria-hidden", () => {
      const { container } = render(
        <ToastWrapper>
          <Toast open state="Info" title="Test">
            Test
          </Toast>
        </ToastWrapper>,
      );
      const icons = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });
});
