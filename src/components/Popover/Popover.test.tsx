import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
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
