import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "./Popover";

function renderPopover() {
  return render(
    <Popover>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent aria-label="Filters">
        <PopoverClose>Done</PopoverClose>
      </PopoverContent>
    </Popover>,
  );
}

describe("Popover", () => {
  describe("behavior", () => {
    it("opens on trigger click and moves focus into the content", async () => {
      const user = userEvent.setup();
      renderPopover();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Open" }));
      const dialog = await screen.findByRole("dialog", { name: "Filters" });
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    });

    it("closes on Escape and returns focus to the trigger", async () => {
      const user = userEvent.setup();
      renderPopover();
      const trigger = screen.getByRole("button", { name: "Open" });
      await user.click(trigger);
      await screen.findByRole("dialog");
      await user.keyboard("{Escape}");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });

    it("closes when PopoverClose is activated", async () => {
      const user = userEvent.setup();
      renderPopover();
      await user.click(screen.getByRole("button", { name: "Open" }));
      await user.click(await screen.findByRole("button", { name: "Done" }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("touch drag", () => {
    function touch(
      type: "pointerDown" | "pointerMove" | "pointerUp",
      target: HTMLElement,
      y: number,
    ) {
      fireEvent[type](target, { pointerType: "touch", pointerId: 1, clientX: 0, clientY: y });
    }

    it("does not open on the click that follows a drag starting on the trigger", () => {
      renderPopover();
      const trigger = screen.getByRole("button", { name: "Open" });
      touch("pointerDown", trigger, 0);
      touch("pointerMove", trigger, 100);
      touch("pointerUp", trigger, 100);
      fireEvent.click(trigger);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("opens on a stationary touch tap and still calls the caller's handlers", async () => {
      const onPointerDown = vi.fn();
      render(
        <Popover>
          <PopoverTrigger asChild onPointerDown={onPointerDown}>
            <button type="button">Open</button>
          </PopoverTrigger>
          <PopoverContent aria-label="Filters">Panel</PopoverContent>
        </Popover>,
      );
      const trigger = screen.getByRole("button", { name: "Open" });
      touch("pointerDown", trigger, 5);
      touch("pointerUp", trigger, 5);
      fireEvent.click(trigger);
      expect(await screen.findByRole("dialog")).toBeInTheDocument();
      expect(onPointerDown).toHaveBeenCalledOnce();
    });
  });

  describe("closed", () => {
    it("keeps the content out of the document and focus on the page", async () => {
      const user = userEvent.setup();
      renderPopover();
      await user.tab();
      expect(screen.getByRole("button", { name: "Open" })).toHaveFocus();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Done" })).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations when open", async () => {
      const user = userEvent.setup();
      const { container } = renderPopover();
      await user.click(screen.getByRole("button", { name: "Open" }));
      await screen.findByRole("dialog");
      expect(await axe(document.body)).toHaveNoViolations();
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
