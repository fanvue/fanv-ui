import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./Drawer";

function renderPageDrawer() {
  return render(
    <Drawer>
      <DrawerTrigger>Open page</DrawerTrigger>
      <DrawerContent variant="page">
        <DrawerHeader>
          <DrawerTitle>Summer launch</DrawerTitle>
          <DrawerDescription>1 Jun to 31 Aug</DrawerDescription>
        </DrawerHeader>
        <p>Page body</p>
      </DrawerContent>
    </Drawer>,
  );
}

describe("Drawer page variant", () => {
  it("opens as a dialog named by its title and described by its description", async () => {
    const user = userEvent.setup();
    renderPageDrawer();

    await user.click(screen.getByRole("button", { name: "Open page" }));

    const dialog = await screen.findByRole("dialog", { name: "Summer launch" });
    expect(dialog).toHaveAccessibleDescription("1 Jun to 31 Aug");
  });

  it("closes from its close button and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    renderPageDrawer();
    const trigger = screen.getByRole("button", { name: "Open page" });

    await user.click(trigger);
    await user.click(await screen.findByRole("button", { name: "Close drawer" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("does not close on a downward drag", () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer open onOpenChange={onOpenChange}>
        <DrawerContent variant="page" aria-describedby={undefined}>
          <DrawerTitle>Summer launch</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );
    const dialog = screen.getByRole("dialog");
    vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue({ height: 400 } as DOMRect);
    vi.useFakeTimers();
    fireEvent.pointerDown(dialog, { pointerId: 1, button: 0, clientX: 0, clientY: 0 });
    vi.advanceTimersByTime(200);
    fireEvent.pointerMove(dialog, { pointerId: 1, clientX: 0, clientY: 150 });
    vi.advanceTimersByTime(200);
    fireEvent.pointerUp(dialog, { pointerId: 1, clientX: 0, clientY: 150 });
    vi.useRealTimers();

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("has no accessibility violations when open", async () => {
    const user = userEvent.setup();
    const { baseElement } = renderPageDrawer();

    await user.click(screen.getByRole("button", { name: "Open page" }));
    await screen.findByRole("dialog");

    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
