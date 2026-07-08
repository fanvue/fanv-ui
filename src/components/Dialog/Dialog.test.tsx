import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "../Button/Button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog";

function renderDialog(
  contentProps?: Partial<React.ComponentPropsWithoutRef<typeof DialogContent>>,
  headerProps?: Partial<React.ComponentPropsWithoutRef<typeof DialogHeader>>,
) {
  return render(
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent {...contentProps}>
        <DialogHeader {...headerProps}>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>Dialog description text</DialogDescription>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>,
  );
}

describe("Dialog", () => {
  describe("API", () => {
    it("renders dialog content when defaultOpen", () => {
      renderDialog();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Test Dialog")).toBeInTheDocument();
    });

    it("renders description text", () => {
      renderDialog();
      expect(screen.getByText("Dialog description text")).toBeInTheDocument();
    });

    it("closes when close button is clicked", async () => {
      const user = userEvent.setup();
      renderDialog();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Close" }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("closes when Cancel button is clicked", async () => {
      const user = userEvent.setup();
      renderDialog();
      await user.click(screen.getByRole("button", { name: "Cancel" }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("opens when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Trigger Test</DialogTitle>
            </DialogHeader>
            <DialogBody>Content</DialogBody>
          </DialogContent>
        </Dialog>,
      );
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("calls onBack when back button is clicked", async () => {
      const onBack = vi.fn();
      const user = userEvent.setup();
      renderDialog({}, { onBack });
      await user.click(screen.getByRole("button", { name: "Go back" }));
      expect(onBack).toHaveBeenCalledOnce();
    });

    it("hides close button when showClose is false", () => {
      renderDialog({}, { showClose: false });
      expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
    });

    it("applies custom className to content", () => {
      renderDialog({ className: "custom-dialog" });
      expect(document.querySelector(".custom-dialog")).toBeInTheDocument();
    });

    it("forwards ref to content", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Dialog defaultOpen>
          <DialogContent ref={ref}>
            <DialogHeader>
              <DialogTitle>Ref Test</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("applies size classes", () => {
      const { rerender } = render(
        <Dialog defaultOpen>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>Small</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>,
      );
      expect(screen.getByRole("dialog").className).toContain("sm:max-w-[400px]");

      rerender(
        <Dialog defaultOpen>
          <DialogContent size="lg">
            <DialogHeader>
              <DialogTitle>Large</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>,
      );
      expect(screen.getByRole("dialog").className).toContain("sm:max-w-[600px]");
    });

    it("applies v2 surface treatment", () => {
      renderDialog();
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("rounded-t-xl");
      expect(dialog).toHaveClass("sm:rounded-lg");
      expect(dialog).toHaveClass("inset-x-0");
      expect(dialog).toHaveClass("w-full");
      expect(dialog).toHaveClass("border-modal-stroke");
      expect(dialog).toHaveClass("bg-modal-background");
      expect(dialog).toHaveClass("shadow-blur-menu");
      expect(dialog).toHaveClass("backdrop-blur-[4px]");
    });

    it("renders the mobile sheet handle by default", () => {
      renderDialog();
      expect(document.querySelector(".bg-icons-tertiary")).toBeInTheDocument();
    });

    it("hides the mobile sheet handle when showMobileHandle is false", () => {
      renderDialog({ showMobileHandle: false });
      expect(document.querySelector(".bg-icons-tertiary")).not.toBeInTheDocument();
    });

    it("renders as a floating card on mobile when mobilePresentation is card", () => {
      renderDialog({ mobilePresentation: "card" });
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("inset-x-4");
      expect(dialog).toHaveClass("rounded-xl");
      expect(dialog).toHaveClass("p-6");
      expect(dialog).not.toHaveClass("bottom-0");
      expect(dialog).not.toHaveClass("rounded-t-xl");
      expect(document.querySelector(".bg-icons-tertiary")).not.toBeInTheDocument();
    });

    it("supports controlled open state", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Dialog open onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Controlled</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>,
      );
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Close" }));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("suppresses overlay when overlay={false}", () => {
      const { baseElement } = renderDialog({ overlay: false });
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(baseElement.querySelector(".bg-background-overlay-default")).not.toBeInTheDocument();
    });

    it("forwards overlayProps to the overlay", () => {
      const { baseElement } = renderDialog({
        overlayProps: { className: "backdrop-blur-xl" },
      });
      const overlay = baseElement.querySelector(".bg-background-overlay-default");
      expect(overlay).toHaveClass("backdrop-blur-xl");
    });

    it("renders inline when portal is false", () => {
      render(
        <div data-testid="dialog-host">
          <Dialog defaultOpen>
            <DialogContent portal={false}>
              <DialogHeader>
                <DialogTitle>Inline Dialog</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>,
      );
      const host = screen.getByTestId("dialog-host");
      expect(host).toContainElement(screen.getByRole("dialog"));
    });

    it("portals to document body by default", () => {
      render(
        <div data-testid="dialog-host">
          <Dialog defaultOpen>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Portaled Dialog</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>,
      );
      const host = screen.getByTestId("dialog-host");
      expect(host).not.toContainElement(screen.getByRole("dialog"));
    });

    it("shows back button automatically when onBack is provided", () => {
      renderDialog({}, { onBack: vi.fn() });
      expect(screen.getByRole("button", { name: "Go back" })).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = renderDialog();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has accessible dialog role", () => {
      renderDialog();
      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
    });

    it("labels dialog with title", () => {
      renderDialog();
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAccessibleName("Test Dialog");
    });

    it("describes dialog with description", () => {
      renderDialog();
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAccessibleDescription("Dialog description text");
    });

    it("closes on Escape key", async () => {
      const user = userEvent.setup();
      renderDialog();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      await user.keyboard("{Escape}");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("traps focus within the dialog", async () => {
      const user = userEvent.setup();
      renderDialog();
      const dialog = screen.getByRole("dialog");
      // Tab through interactive elements and verify focus stays within the dialog
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
      // After cycling through all focusable elements, focus should still be inside
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    });
  });

  // Defends against the Android Chrome synthetic-click that can land on a
  // click-based Radix trigger at the end of a scroll-drag.
  describe("touch tap gate", () => {
    it("does not open on a drag-end synthetic click", () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>,
      );
      const trigger = screen.getByRole("button", { name: "Open" });
      fireEvent.pointerDown(trigger, {
        pointerType: "touch",
        pointerId: 1,
        clientX: 0,
        clientY: 0,
      });
      fireEvent.pointerMove(trigger, {
        pointerType: "touch",
        pointerId: 1,
        clientX: 0,
        clientY: 100,
      });
      fireEvent.pointerUp(trigger, {
        pointerType: "touch",
        pointerId: 1,
        clientX: 0,
        clientY: 100,
      });
      fireEvent.click(trigger);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
