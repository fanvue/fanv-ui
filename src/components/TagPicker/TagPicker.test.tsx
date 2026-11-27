import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import type { TagPickerOption } from "./TagField";
import { TagField } from "./TagField";
import { TagPicker, type TagPickerProps } from "./TagPicker";

const OPTIONS: TagPickerOption[] = [
  { value: "whale", label: "Whale", emoji: "🐳", colour: "blue" },
  { value: "top", label: "Top spender", emoji: "💎", colour: "purple" },
  { value: "owl", label: "Night owl" },
  { value: "tipper", label: "Big tipper", emoji: "💰", colour: "amber" },
];

function Harness(props: Partial<TagPickerProps> & { initial?: string[] }) {
  const { initial = [], onValueChange, ...rest } = props;
  const [value, setValue] = React.useState(initial);
  return (
    <TagPicker
      label="Tags"
      options={OPTIONS}
      {...rest}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange?.(next);
      }}
    />
  );
}

async function openPicker(props: Partial<TagPickerProps> & { initial?: string[] } = {}) {
  const user = userEvent.setup();
  render(<Harness {...props} />);
  await user.click(screen.getByRole("button", { name: /^Tags/ }));
  return user;
}

const input = () => screen.getByRole("combobox", { name: "Tags" });
const listbox = () => screen.getByRole("listbox");
const options = () => within(listbox()).getAllByRole("option");
const pickedTags = () =>
  within(screen.getByRole("dialog"))
    .getAllByTestId("tag")
    .filter((tag) => tag.closest("[role=listbox]") === null);
const activeOption = () => {
  const id = input().getAttribute("aria-activedescendant");
  return id ? document.getElementById(id) : null;
};

describe("TagField", () => {
  it("names the field with the picked tags", async () => {
    await openPicker({ initial: ["whale", "top"] });
    await userEvent.setup().keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Tags: Whale, Top spender" })).toBeInTheDocument();
  });

  it("shows the placeholder when there are no tags", () => {
    render(<TagField tags={[]} aria-label="Tags" />);
    expect(screen.getByRole("button", { name: /^Tags/ })).toHaveTextContent("Add tags");
  });

  it("shows tags without a remove button", () => {
    render(<TagField tags={OPTIONS.slice(0, 2)} aria-label="Tags" />);
    const field = screen.getByRole("button", { name: /^Tags/ });
    expect(field).toHaveTextContent("Whale");
    expect(field).toHaveTextContent("Top spender");
    expect(within(field).queryByRole("button")).not.toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<TagField ref={ref} tags={[]} aria-label="Tags" />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });
});

describe("TagPicker", () => {
  describe("opening", () => {
    it("opens from anywhere on the field and focuses the search input", async () => {
      await openPicker();
      expect(input()).toHaveFocus();
      expect(options()).toHaveLength(4);
    });

    it("closes on Escape", async () => {
      const user = await openPicker();
      await user.keyboard("{Escape}");
      expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: /^Tags/ })).toBeInTheDocument();
    });

    it("opens as a sheet with a title and close button", async () => {
      const user = await openPicker({ variant: "sheet" });
      const dialog = screen.getByRole("dialog");
      expect(within(dialog).getByText("Tags")).toBeInTheDocument();
      expect(input()).toHaveFocus();
      await user.click(within(dialog).getByRole("button", { name: "Close" }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("searching", () => {
    it("filters options by label, ignoring case", async () => {
      const user = await openPicker({ onCreate: vi.fn() });
      await user.keyboard("TIP");
      expect(options().map((o) => o.textContent)).toEqual(["💰Big tipper", "CreateTIP"]);
    });

    it("shows the search placeholder only when no tags are picked", async () => {
      await openPicker();
      expect(input()).toHaveAttribute("placeholder", "Search or create a tag");
    });

    it("drops the placeholder once tags are picked", async () => {
      await openPicker({ initial: ["whale"] });
      expect(input()).toHaveValue("");
      expect(input()).not.toHaveAttribute("placeholder");
    });
  });

  describe("keyboard", () => {
    it("makes the first row active", async () => {
      await openPicker();
      expect(activeOption()).toHaveTextContent("Whale");
    });

    it("moves the active row with the arrow keys and wraps at both ends", async () => {
      const user = await openPicker();
      await user.keyboard("{ArrowDown}");
      expect(activeOption()).toHaveTextContent("Top spender");
      await user.keyboard("{ArrowUp}{ArrowUp}");
      expect(activeOption()).toHaveTextContent("Big tipper");
      await user.keyboard("{ArrowDown}");
      expect(activeOption()).toHaveTextContent("Whale");
    });

    it("picks the active row with Enter and clears the query", async () => {
      const onValueChange = vi.fn();
      const user = await openPicker({ onValueChange });
      await user.keyboard("owl{Enter}");
      expect(onValueChange).toHaveBeenCalledWith(["owl"]);
      expect(input()).toHaveValue("");
    });

    it("selects the last picked tag on Backspace, then removes it on a second Backspace", async () => {
      const onValueChange = vi.fn();
      const user = await openPicker({ initial: ["whale", "top"], onValueChange });
      await user.keyboard("{Backspace}");
      expect(pickedTags()[1]).toHaveAttribute("data-selected", "true");
      expect(pickedTags()[0]).not.toHaveAttribute("data-selected");
      expect(onValueChange).not.toHaveBeenCalled();
      await user.keyboard("{Backspace}");
      expect(onValueChange).toHaveBeenCalledWith(["whale"]);
    });

    it("clears the Backspace selection when the user types", async () => {
      const onValueChange = vi.fn();
      const user = await openPicker({ initial: ["whale"], onValueChange });
      await user.keyboard("{Backspace}a{Backspace}{Backspace}");
      expect(onValueChange).not.toHaveBeenCalled();
      expect(pickedTags()[0]).toHaveAttribute("data-selected", "true");
    });
  });

  describe("picking", () => {
    it("adds a tag on click and takes it out of the list", async () => {
      const onValueChange = vi.fn();
      const user = await openPicker({ onValueChange });
      await user.click(options()[1] as HTMLElement);
      expect(onValueChange).toHaveBeenCalledWith(["top"]);
      expect(options().map((o) => o.textContent)).toEqual(["🐳Whale", "Night owl", "💰Big tipper"]);
    });

    it("lists only the tags that are not picked", async () => {
      await openPicker({ initial: ["whale", "top"] });
      expect(options().map((o) => o.textContent)).toEqual(["Night owl", "💰Big tipper"]);
      expect(pickedTags().map((t) => t.textContent)).toEqual(["🐳Whale", "💎Top spender"]);
    });

    it("puts a tag back in the list when its chip is removed", async () => {
      const user = await openPicker({ initial: ["whale"] });
      expect(options()).toHaveLength(3);
      await user.click(screen.getByRole("button", { name: "Remove Whale" }));
      expect(options()).toHaveLength(4);
    });

    it("removes a picked tag with its ×", async () => {
      const onValueChange = vi.fn();
      const user = await openPicker({ initial: ["whale", "top"], onValueChange });
      await user.click(screen.getByRole("button", { name: "Remove Whale" }));
      expect(onValueChange).toHaveBeenCalledWith(["top"]);
      expect(input()).toHaveFocus();
    });

    it("shows picked tags in the field after closing", async () => {
      const user = await openPicker();
      await user.keyboard("{Enter}{Escape}");
      expect(screen.getByRole("button", { name: /^Tags/ })).toHaveTextContent("Whale");
    });
  });

  describe("creating", () => {
    it("offers Create when no tag has the typed name", async () => {
      const user = await openPicker({ onCreate: vi.fn() });
      await user.keyboard("Regulars");
      expect(options()).toHaveLength(1);
      expect(options()[0]).toHaveTextContent("CreateRegulars");
    });

    it("hides Create when a tag already has the name, ignoring case", async () => {
      const user = await openPicker({ onCreate: vi.fn() });
      await user.keyboard("whale");
      expect(options().map((o) => o.textContent)).toEqual(["🐳Whale"]);
    });

    it("hides Create when a picked tag already has the name", async () => {
      const user = await openPicker({ initial: ["whale"], onCreate: vi.fn() });
      await user.keyboard("Whale");
      expect(screen.queryAllByRole("option")).toHaveLength(0);
      expect(screen.getByText("No tags found")).toBeInTheDocument();
    });

    it("hides Create without onCreate", async () => {
      const user = await openPicker();
      await user.keyboard("Regulars");
      expect(screen.queryAllByRole("option")).toHaveLength(0);
      expect(screen.getByText("No tags found")).toBeInTheDocument();
    });

    it("creates with Enter, splitting a leading emoji from the label", async () => {
      const onCreate = vi.fn();
      const user = await openPicker({ onCreate });
      await user.keyboard("🦄 Unicorn{Enter}");
      expect(onCreate).toHaveBeenCalledWith({ emoji: "🦄", label: "Unicorn" });
      expect(input()).toHaveValue("");
    });

    it("creates a label-only tag when the name has no leading emoji", async () => {
      const onCreate = vi.fn();
      const user = await openPicker({ onCreate });
      await user.keyboard("Regulars");
      await user.click(options()[0] as HTMLElement);
      expect(onCreate).toHaveBeenCalledWith({ label: "Regulars" });
    });
  });

  describe("guards", () => {
    it("ignores Enter while an IME is composing", async () => {
      const onCreate = vi.fn();
      await openPicker({ onCreate });
      fireEvent.change(input(), { target: { value: "にほ" } });
      fireEvent.keyDown(input(), { key: "Enter", isComposing: true });
      expect(onCreate).not.toHaveBeenCalled();
      fireEvent.keyDown(input(), { key: "Enter", keyCode: 229 });
      expect(onCreate).not.toHaveBeenCalled();
      fireEvent.keyDown(input(), { key: "Enter" });
      expect(onCreate).toHaveBeenCalledWith({ label: "にほ" });
    });

    it("does not remove tags while Backspace is held", async () => {
      const onValueChange = vi.fn();
      await openPicker({ initial: ["whale"], onValueChange });
      fireEvent.keyDown(input(), { key: "Backspace" });
      fireEvent.keyDown(input(), { key: "Backspace", repeat: true });
      expect(onValueChange).not.toHaveBeenCalled();
      expect(pickedTags()[0]).toHaveAttribute("data-selected", "true");
    });

    it("offers Create for a name that differs only by an accent", async () => {
      const user = await openPicker({ onCreate: vi.fn() });
      await user.keyboard("Whalé");
      expect(options().map((o) => o.textContent)).toEqual(["CreateWhalé"]);
    });
  });

  describe("accessibility", () => {
    it("links the input to the list and marks it multi-select", async () => {
      await openPicker();
      expect(input()).toHaveAttribute("aria-controls", listbox().id);
      expect(listbox()).toHaveAttribute("aria-multiselectable", "true");
    });

    it("has no accessibility violations when nothing matches", async () => {
      const user = await openPicker();
      await user.keyboard("zzz");
      expect(screen.getByText("No tags found")).toBeInTheDocument();
      expect(await axe(document.body)).toHaveNoViolations();
    });

    it("has no accessibility violations when open", async () => {
      await openPicker({ initial: ["whale"], onCreate: vi.fn() });
      expect(await axe(document.body)).toHaveNoViolations();
    });
  });
});

function mockRect(element: Element, top: number, height = 32) {
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
    top,
    bottom: top + height,
    height,
    left: 0,
    right: 300,
    width: 300,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as DOMRect);
}

const reorderRows = () =>
  Array.from(listbox().querySelectorAll<HTMLElement>("[data-reorder-value]"));

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
