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
      expect(screen.getByRole("button", { name: /close notification/i })).toBeInTheDocument();
    });

    it("hides close button when showClose is false", () => {
      render(
        <ToastWrapper>
          <Toast open showClose={false} title="Test">
            Test
          </Toast>
        </ToastWrapper>,
      );
      expect(screen.queryByRole("button", { name: /close notification/i })).not.toBeInTheDocument();
    });

    it("renders action when provided", () => {
      render(
        <ToastWrapper>
          <Toast open title="Test" actionLabel="Action Button" onActionClick={() => {}} />
        </ToastWrapper>,
      );
      expect(screen.getByText("Action Button")).toBeInTheDocument();
    });
  });

  describe("variant", () => {
    it("renders info variant correctly", () => {
      render(
        <ToastWrapper>
          <Toast open variant="info" title="Info">
            Info
          </Toast>
        </ToastWrapper>,
      );
      const toast = screen.getByTestId("toast");
      expect(toast).toHaveClass("border-none");
      expect(toast).toHaveClass("text-background-inverse-solid");
    });

    it("renders warning variant correctly", () => {
      render(
        <ToastWrapper>
          <Toast open variant="warning" title="Warning">
            Warning
          </Toast>
        </ToastWrapper>,
      );
      const toast = screen.getByTestId("toast");
      expect(toast).toHaveClass("border-none");
      expect(toast).toHaveClass("text-background-inverse-solid");
    });

    it("renders success variant correctly", () => {
      render(
        <ToastWrapper>
          <Toast open variant="success" title="Success">
            Success
          </Toast>
        </ToastWrapper>,
      );
      const toast = screen.getByTestId("toast");
      expect(toast).toHaveClass("border-none");
      expect(toast).toHaveClass("text-background-inverse-solid");
    });

    it("renders error variant correctly", () => {
      render(
        <ToastWrapper>
          <Toast open variant="error" title="Error">
            Error
          </Toast>
        </ToastWrapper>,
      );
      const toast = screen.getByTestId("toast");
      expect(toast).toHaveClass("border-none");
      expect(toast).toHaveClass("text-background-inverse-solid");
    });

    it("renders messageToast variant correctly", () => {
      render(
        <ToastWrapper>
          <Toast
            open
            variant="messageToast"
            title="Message"
            avatarSrc="https://via.placeholder.com/150"
            avatarAlt="Avatar"
            avatarFallback="AV"
          >
            Message
          </Toast>
        </ToastWrapper>,
      );
      const toast = screen.getByTestId("toast");
      expect(toast).toHaveClass("bg-background-solid");
      expect(toast).toHaveClass("text-background-inverse-solid");
      expect(screen.getByTestId("avatar")).toBeInTheDocument();
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
      const closeButton = screen.getByRole("button", { name: /close notification/i });
      expect(closeButton).toBeInTheDocument();
    });

    it("marks decorative icons as aria-hidden", () => {
      const { container } = render(
        <ToastWrapper>
          <Toast open variant="info" title="Test">
            Test
          </Toast>
        </ToastWrapper>,
      );
      const icons = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });
});
