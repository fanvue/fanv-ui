import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import type { TagPickerOption } from "./TagField";
import { TagPicker } from "./TagPicker";
import {
  input,
  listbox,
  mockRect,
  OPTIONS,
  openPicker,
  options,
  reorderRows,
} from "./TagPicker.testUtils";

describe("TagPicker editing", () => {
  it("shows a ⋯ button on each tag only when an edit callback is set", async () => {
    await openPicker();
    expect(options()).toHaveLength(4);
    expect(screen.queryByRole("button", { name: "Edit Whale" })).not.toBeInTheDocument();
  });

  it("opens the tag menu from ⋯ without picking the tag", async () => {
    const onValueChange = vi.fn();
    const user = await openPicker({ onValueChange, onColourChange: vi.fn() });
    await user.click(screen.getByRole("button", { name: "Edit Whale" }));
    expect(screen.getByRole("dialog", { name: "Edit Whale" })).toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("renames on Enter, splitting a leading emoji from the label", async () => {
    const onRename = vi.fn();
    const user = await openPicker({ onRename });
    await user.click(screen.getByRole("button", { name: "Edit Whale" }));
    const rename = screen.getByRole("textbox", { name: "Tag name" });
    expect(rename).toHaveValue("🐳 Whale");
    await user.clear(rename);
    await user.type(rename, "🐋 Big whale{Enter}");
    expect(onRename).toHaveBeenCalledWith("whale", { emoji: "🐋", label: "Big whale" });
    expect(screen.queryByRole("dialog", { name: "Edit Whale" })).not.toBeInTheDocument();
  });

  it("does not rename when the name is unchanged", async () => {
    const onRename = vi.fn();
    const user = await openPicker({ onRename });
    await user.click(screen.getByRole("button", { name: "Edit Whale" }));
    expect(screen.getByRole("textbox", { name: "Tag name" })).toHaveValue("🐳 Whale");
    await user.keyboard("{Enter}");
    expect(onRename).not.toHaveBeenCalled();
  });

  it("changes the colour and marks the current one", async () => {
    const onColourChange = vi.fn();
    const user = await openPicker({ onColourChange });
    await user.click(screen.getByRole("button", { name: "Edit Whale" }));
    expect(screen.getByRole("button", { name: "Blue" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Purple" })).toHaveAttribute("aria-pressed", "false");
    await user.click(screen.getByRole("button", { name: "Purple" }));
    expect(onColourChange).toHaveBeenCalledWith("whale", "purple");
  });

  it("puts Delete last, after the colours", async () => {
    const user = await openPicker({
      onRename: vi.fn(),
      onColourChange: vi.fn(),
      onDelete: vi.fn(),
    });
    await user.click(screen.getByRole("button", { name: "Edit Whale" }));
    const menu = screen.getByRole("dialog", { name: "Edit Whale" });
    const names = within(menu)
      .getAllByRole("button")
      .map((button) => button.textContent);
    expect(names.at(-1)).toBe("Delete");
    expect(names).toContain("Purple");
  });

  it("styles Delete as the error menu item, with the error hover", async () => {
    const user = await openPicker({ onColourChange: vi.fn(), onDelete: vi.fn() });
    await user.click(screen.getByRole("button", { name: "Edit Whale" }));
    expect(screen.getByRole("button", { name: "Delete" })).toHaveClass(
      "text-error-content",
      "hover:bg-interaction-hover-error",
    );
    expect(screen.getByRole("button", { name: "Blue" })).toHaveClass("hover:bg-interaction-hover");
  });

  it("deletes the tag and closes the menu", async () => {
    const onDelete = vi.fn();
    const user = await openPicker({ initial: ["top"], onDelete });
    await user.click(screen.getByRole("button", { name: "Edit Whale" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledWith("whale");
    expect(screen.queryByRole("dialog", { name: "Edit Whale" })).not.toBeInTheDocument();
    expect(input()).toHaveFocus();
  });

  it("opens the active tag's menu with → from the search input", async () => {
    const user = await openPicker({ onDelete: vi.fn() });
    await user.keyboard("{ArrowDown}{ArrowRight}");
    expect(screen.getByRole("dialog", { name: "Edit Top spender" })).toBeInTheDocument();
  });

  it("keeps → for the caret while the query has text after it", async () => {
    const user = await openPicker({ onDelete: vi.fn() });
    await user.keyboard("wh{ArrowLeft}{ArrowRight}");
    expect(screen.queryByRole("dialog", { name: "Edit Whale" })).not.toBeInTheDocument();
    expect(input()).toHaveValue("wh");
  });
});

describe("TagPicker reordering", () => {
  it("offers no reorder action without onReorder", async () => {
    await openPicker();
    expect(options()).toHaveLength(4);
    expect(screen.queryByRole("button", { name: "Tag options" })).not.toBeInTheDocument();
  });

  async function startReorder(onReorder = vi.fn()) {
    function Ordered() {
      const [order, setOrder] = React.useState(OPTIONS);
      const [value, setValue] = React.useState<string[]>(["whale"]);
      return (
        <TagPicker
          label="Tags"
          options={order}
          value={value}
          onValueChange={setValue}
          onReorder={(next) => {
            onReorder(next);
            setOrder(next.map((v) => OPTIONS.find((o) => o.value === v) as TagPickerOption));
          }}
        />
      );
    }
    const user = userEvent.setup();
    render(<Ordered />);
    await user.click(screen.getByRole("button", { name: /^Tags/ }));
    await user.click(screen.getByRole("button", { name: "Tag options" }));
    await user.click(await screen.findByRole("menuitem", { name: "Reorder tags" }));
    return { user, onReorder };
  }

  it("keeps rows flush at rest and only nudges them on hover", async () => {
    await openPicker({ onReorder: vi.fn() });
    const row = reorderRows()[0] as HTMLElement;
    expect(row).toHaveClass("ps-3", "[@media(hover:hover)]:hover:ps-7");
    expect(row).not.toHaveClass("ps-7");
  });

  it("nudges every row to show its handle in reorder mode", async () => {
    await startReorder();
    for (const row of reorderRows()) expect(row).toHaveClass("ps-7");
    expect(reorderRows()).toHaveLength(4);
  });

  it("moves focus to the first handle when reorder mode starts", async () => {
    await startReorder();
    await vi.waitFor(() =>
      expect(screen.getByRole("button", { name: "Move Whale" })).toHaveFocus(),
    );
  });

  it("switches to reorder mode with a handle per tag", async () => {
    await startReorder();
    expect(screen.getByText("Drag tags to reorder")).toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Move Whale" })).toHaveAccessibleDescription(
      "Press the up and down arrow keys to move this tag.",
    );
  });

  it("moves a tag with the arrow keys and announces its position", async () => {
    const { user, onReorder } = await startReorder();
    screen.getByRole("button", { name: "Move Whale" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(onReorder).toHaveBeenCalledWith(["top", "whale", "owl", "tipper"]);
    expect(screen.getByText("Whale, position 2 of 4")).toBeInTheDocument();
  });

  it("does not move past the ends", async () => {
    const { user, onReorder } = await startReorder();
    screen.getByRole("button", { name: "Move Whale" }).focus();
    await user.keyboard("{ArrowUp}");
    expect(onReorder).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Move Whale" })).toHaveFocus();
  });

  it("lists picked tags too and does not pick a tag when its row is clicked", async () => {
    const { user } = await startReorder();
    expect(options()).toHaveLength(4);
    await user.click(options()[1] as HTMLElement);
    expect(options()).toHaveLength(4);
    expect(screen.getByRole("button", { name: /^Tags/ })).toHaveTextContent("Whale");
    expect(screen.getByRole("button", { name: /^Tags/ })).not.toHaveTextContent("Top spender");
  });

  it("leaves reorder mode with Done", async () => {
    const { user } = await startReorder();
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(input()).toBeInTheDocument();
    expect(screen.queryByText("Drag tags to reorder")).not.toBeInTheDocument();
  });

  function layoutRows() {
    mockRect(listbox(), 0, 200);
    const rows = reorderRows();
    for (const [index, row] of rows.entries()) mockRect(row, index * 32);
    return rows;
  }

  it("lifts a floating copy and shows the drop line without moving the list", async () => {
    const onReorder = vi.fn();
    await openPicker({ onReorder });
    const handle = layoutRows()[0]?.firstElementChild as HTMLElement;
    fireEvent.pointerDown(handle, { pointerId: 1, button: 0, clientY: 10 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientY: 60 });
    expect(document.querySelector("[data-reorder-ghost]")).toHaveTextContent("Whale");
    expect(document.querySelector("[data-reorder-indicator]")).toHaveStyle({ top: "64px" });
    expect(options().map((o) => o.textContent)).toEqual([
      "🐳Whale",
      "💎Top spender",
      "Night owl",
      "💰Big tipper",
    ]);
    expect(onReorder).not.toHaveBeenCalled();
  });

  it("moves the tag to the drop line on release and clears the drag", async () => {
    const onReorder = vi.fn();
    await openPicker({ onReorder });
    const handle = layoutRows()[0]?.firstElementChild as HTMLElement;
    fireEvent.pointerDown(handle, { pointerId: 1, button: 0, clientY: 10 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientY: 60 });
    fireEvent.pointerUp(handle, { pointerId: 1, clientY: 60 });
    expect(onReorder).toHaveBeenCalledWith(["top", "whale", "owl", "tipper"]);
    expect(document.querySelector("[data-reorder-ghost]")).not.toBeInTheDocument();
    expect(document.querySelector("[data-reorder-indicator]")).not.toBeInTheDocument();
  });

  it("does not reorder when dropped back where it started", async () => {
    const onReorder = vi.fn();
    await openPicker({ onReorder });
    const handle = layoutRows()[1]?.firstElementChild as HTMLElement;
    fireEvent.pointerDown(handle, { pointerId: 1, button: 0, clientY: 40 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientY: 50 });
    expect(document.querySelector("[data-reorder-indicator]")).toBeInTheDocument();
    fireEvent.pointerUp(handle, { pointerId: 1, clientY: 50 });
    expect(onReorder).not.toHaveBeenCalled();
  });

  it("keeps hidden picked tags in place when reordering the rest", async () => {
    const onReorder = vi.fn();
    await openPicker({ initial: ["top"], onReorder });
    const rows = layoutRows();
    expect(rows.map((row) => row.textContent)).toEqual(["🐳Whale", "Night owl", "💰Big tipper"]);
    const handle = rows[0]?.firstElementChild as HTMLElement;
    fireEvent.pointerDown(handle, { pointerId: 1, button: 0, clientY: 10 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientY: 60 });
    fireEvent.pointerUp(handle, { pointerId: 1, clientY: 60 });
    expect(onReorder).toHaveBeenCalledWith(["top", "owl", "whale", "tipper"]);
  });

  it("does not pick the tag when its handle is pressed without dragging", async () => {
    const onReorder = vi.fn();
    const onValueChange = vi.fn();
    await openPicker({ onReorder, onValueChange });
    const rows = reorderRows();
    expect(rows).toHaveLength(4);
    const handle = rows[0]?.firstElementChild as HTMLElement;
    fireEvent.pointerDown(handle, { pointerId: 1, button: 0, clientY: 10 });
    fireEvent.pointerUp(handle, { pointerId: 1, clientY: 10 });
    fireEvent.click(handle);
    expect(onReorder).not.toHaveBeenCalled();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("hides the handles while searching", async () => {
    const user = await openPicker({ onReorder: vi.fn() });
    expect(reorderRows()).toHaveLength(4);
    await user.keyboard("wh");
    expect(options()).toHaveLength(1);
    expect(reorderRows()).toHaveLength(0);
  });
});

describe("TagPicker on mobile", () => {
  it("turns the sheet into an Edit tag view with back, saving a rename on the way back", async () => {
    const onRename = vi.fn();
    const user = await openPicker({ variant: "sheet", onRename, onDelete: vi.fn() });
    await user.click(screen.getByRole("button", { name: "Edit Whale" }));
    const sheet = screen.getByRole("dialog", { name: "Edit tag" });
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(within(sheet).getByRole("button", { name: "Delete" })).toBeInTheDocument();
    const rename = within(sheet).getByRole("textbox", { name: "Tag name" });
    await user.clear(rename);
    await user.type(rename, "Big whale");
    await user.click(within(sheet).getByRole("button", { name: "Back" }));
    expect(onRename).toHaveBeenCalledWith("whale", { label: "Big whale" });
    expect(screen.getByRole("dialog", { name: "Tags" })).toBeInTheDocument();
  });

  it("keeps row ⋯ buttons at 24px and makes only the header ⋯ 32px", async () => {
    await openPicker({ variant: "sheet", onDelete: vi.fn(), onReorder: vi.fn() });
    expect(screen.getByRole("button", { name: "Edit Whale" })).toHaveClass("size-6");
    expect(screen.getByRole("button", { name: "Tag options" })).toHaveClass("size-8");
  });

  it("turns the sheet into a Tag options view with a back button", async () => {
    const user = await openPicker({ variant: "sheet", onReorder: vi.fn() });
    await user.click(screen.getByRole("button", { name: "Tag options" }));
    const sheet = screen.getByRole("dialog", { name: "Tag options" });
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(within(sheet).queryByRole("combobox")).not.toBeInTheDocument();
    expect(within(sheet).getByRole("button", { name: "Reorder tags" })).toBeInTheDocument();
    await user.click(within(sheet).getByRole("button", { name: "Back" }));
    expect(screen.getByRole("dialog", { name: "Tags" })).toBeInTheDocument();
    expect(input()).toBeInTheDocument();
  });

  it("puts a full-width Done at the very bottom of the reorder sheet", async () => {
    const user = await openPicker({ variant: "sheet", onReorder: vi.fn() });
    await user.click(screen.getByRole("button", { name: "Tag options" }));
    await user.click(screen.getByRole("button", { name: "Reorder tags" }));
    const sheet = screen.getByRole("dialog", { name: "Reorder tags" });
    const buttons = within(sheet).getAllByRole("button");
    expect(buttons.at(-1)).toHaveTextContent("Done");
    expect(within(sheet).getAllByRole("button", { name: "Done" })).toHaveLength(1);
    expect(listbox().compareDocumentPosition(buttons.at(-1) as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    await user.click(buttons.at(-1) as HTMLElement);
    expect(screen.getByRole("dialog", { name: "Tags" })).toBeInTheDocument();
  });

  it("slides deeper views in from the right and back views in from the left", async () => {
    const user = await openPicker({ variant: "sheet", onReorder: vi.fn() });
    const view = () => document.querySelector("[data-morph-panel] > [data-direction]");
    await user.click(screen.getByRole("button", { name: "Tag options" }));
    expect(view()).toHaveAttribute("data-direction", "forward");
    expect(view()).toHaveClass("slide-in-from-right-8");
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(view()).toHaveAttribute("data-direction", "back");
    expect(view()).toHaveClass("slide-in-from-left-8");
    expect(input()).toBeInTheDocument();
  });

  it("goes from Tag options straight into reorder mode", async () => {
    const user = await openPicker({ variant: "sheet", onReorder: vi.fn() });
    await user.click(screen.getByRole("button", { name: "Tag options" }));
    await user.click(screen.getByRole("button", { name: "Reorder tags" }));
    expect(screen.getByRole("dialog", { name: "Reorder tags" })).toBeInTheDocument();
    expect(screen.getByText("Drag tags to reorder")).toBeInTheDocument();
  });
});
