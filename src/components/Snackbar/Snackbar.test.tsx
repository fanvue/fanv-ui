import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "../Button/Button";
import { Snackbar } from "./Snackbar";

describe("Snackbar", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(<Snackbar className="custom-class">Message</Snackbar>);
      const snackbar = screen.getByRole("status");
      expect(snackbar).toHaveClass("custom-class");
    });

    it("hides actions when showActions is false", () => {
      render(
        <Snackbar showActions={false} primaryLabel="Accept" secondaryLabel="Dismiss">
          Message
        </Snackbar>,
      );
      expect(screen.queryByRole("button", { name: "Accept" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Dismiss" })).not.toBeInTheDocument();
    });

    it("hides vipEarn action when showActions is false", () => {
      render(
        <Snackbar variant="vipEarn" title="Title" showActions={false} primaryLabel="Redeem" />,
      );
      expect(screen.queryByRole("button", { name: "Redeem" })).not.toBeInTheDocument();
    });

    it("renders primary and secondary buttons from labels", () => {
      render(
        <Snackbar primaryLabel="Accept" secondaryLabel="Dismiss">
          Message
        </Snackbar>,
      );
      expect(screen.getByRole("button", { name: "Accept" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
    });

    it("renders custom primarySlot over primaryLabel", () => {
      render(
        <Snackbar primaryLabel="Accept" primarySlot={<a href="#custom">Custom link</a>}>
          Message
        </Snackbar>,
      );
      expect(screen.queryByRole("button", { name: "Accept" })).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Custom link" })).toBeInTheDocument();
    });

    it("renders custom secondarySlot over secondaryLabel", () => {
      render(
        <Snackbar secondaryLabel="Dismiss" secondarySlot={<a href="#custom">Custom secondary</a>}>
          Message
        </Snackbar>,
      );
      expect(screen.queryByRole("button", { name: "Dismiss" })).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Custom secondary" })).toBeInTheDocument();
    });
  });

  describe("closable behavior", () => {
    it("shows close button when closable is true", () => {
      render(
        <Snackbar variant="vipEarn" title="Title" closable>
          Message
        </Snackbar>,
      );
      expect(screen.getByRole("button", { name: /close snackbar/i })).toBeInTheDocument();
    });

    it("does not show close button when closable is false", () => {
      render(<Snackbar>Message</Snackbar>);
      expect(screen.queryByRole("button", { name: /close snackbar/i })).not.toBeInTheDocument();
    });

    it("calls onClose when close button is clicked", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <Snackbar variant="vipEarn" title="Title" closable onClose={onClose}>
          Message
        </Snackbar>,
      );
      const closeButton = screen.getByRole("button", { name: /close snackbar/i });
      await user.click(closeButton);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when close button is activated with keyboard", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <Snackbar variant="vipEarn" title="Title" closable onClose={onClose}>
          Message
        </Snackbar>,
      );
      const closeButton = screen.getByRole("button", { name: /close snackbar/i });
      closeButton.focus();
      await user.keyboard("{Enter}");
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("action callbacks", () => {
    it("calls primaryOnClick when default primary button is clicked", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Snackbar primaryLabel="Accept" primaryOnClick={onClick}>
          Message
        </Snackbar>,
      );
      await user.click(screen.getByRole("button", { name: "Accept" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("calls secondaryOnClick when default secondary button is clicked", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Snackbar secondaryLabel="Dismiss" secondaryOnClick={onClick}>
          Message
        </Snackbar>,
      );
      await user.click(screen.getByRole("button", { name: "Dismiss" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("calls primaryOnClick for vipEarn primary button", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Snackbar variant="vipEarn" title="Title" primaryLabel="Redeem" primaryOnClick={onClick} />,
      );
      await user.click(screen.getByRole("button", { name: "Redeem" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations (default variant)", async () => {
      const { container } = render(
        <Snackbar primaryLabel="Accept" secondaryLabel="Dismiss">
          Notification message
        </Snackbar>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations (default variant with slots)", async () => {
      const { container } = render(
        <Snackbar
          primarySlot={<Button>Accept</Button>}
          secondarySlot={<Button variant="tertiary">Dismiss</Button>}
        >
          Notification message
        </Snackbar>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations (vipEarn variant)", async () => {
      const { container } = render(
        <Snackbar
          variant="vipEarn"
          title="Earned points"
          description="Find out how to redeem"
          icon={<span>Icon</span>}
          primaryLabel="Redeem"
          closable
        />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations (welcome variant)", async () => {
      const { container } = render(
        <Snackbar
          variant="welcome"
          title="Welcome!"
          description="Get started"
          primaryLabel="Primary"
          secondaryLabel="Secondary"
        />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has role status", () => {
      render(<Snackbar>Message</Snackbar>);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("close button has accessible label", () => {
      render(<Snackbar closable>Message</Snackbar>);
      expect(screen.getByLabelText("Close snackbar")).toBeInTheDocument();
    });
  });
});
