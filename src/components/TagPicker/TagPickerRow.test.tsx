import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { TagPickerOption } from "./TagField";
import { TagPickerRow } from "./TagPickerRow";

const WHALE: TagPickerOption = { value: "whale", label: "Whale", colour: "blue" };

const MENU = {
  editLabel: "Edit Whale",
  renameLabel: "Tag name",
  deleteLabel: "Delete",
  coloursLabel: "Colours",
  colourNames: {
    gray: "Gray",
    blue: "Blue",
    teal: "Teal",
    green: "Green",
    amber: "Amber",
    red: "Red",
    pink: "Pink",
    purple: "Purple",
  },
  onDelete: () => {},
};

function renderRow(props: Partial<Parameters<typeof TagPickerRow>[0]> = {}) {
  const handlers = { onChoose: vi.fn(), onHover: vi.fn(), onMenuOpenChange: vi.fn() };
  render(
    <div role="listbox" aria-label="Tags">
      <TagPickerRow
        id="row-0"
        row={{ kind: "option", option: WHALE }}
        isActive={false}
        isSheet={false}
        createLabel="Create"
        showHandle={false}
        reordering={false}
        onMenuClosed={() => {}}
        {...handlers}
        {...props}
      />
    </div>,
  );
  return handlers;
}

describe("TagPickerRow", () => {
  it("picks the tag on click", async () => {
    const { onChoose } = renderRow();
    await userEvent.setup().click(screen.getByRole("option", { name: "Whale" }));
    expect(onChoose).toHaveBeenCalledTimes(1);
  });

  it("shows the Create row with the new tag and no tag actions", () => {
    renderRow({ row: { kind: "create", name: { label: "Orca" } }, menu: MENU, showHandle: true });
    expect(screen.getByRole("option")).toHaveTextContent("CreateOrca");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("opens the tag menu from ⋯ without picking the tag", async () => {
    const { onChoose, onMenuOpenChange } = renderRow({ menu: MENU });
    await userEvent.setup().click(screen.getByRole("button", { name: "Edit Whale" }));
    expect(onMenuOpenChange).toHaveBeenCalledWith(true);
    expect(onChoose).not.toHaveBeenCalled();
  });

  it("in reorder mode, makes the handle a named button and stops picking", async () => {
    const onHandleKeyDown = vi.fn();
    const { onChoose } = renderRow({
      showHandle: true,
      reordering: true,
      handleLabel: "Move Whale",
      onHandleKeyDown,
      menu: MENU,
    });
    const handle = screen.getByRole("button", { name: "Move Whale" });
    expect(screen.queryByRole("button", { name: "Edit Whale" })).not.toBeInTheDocument();
    handle.focus();
    await userEvent.setup().keyboard("{ArrowDown}");
    expect(onHandleKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: "ArrowDown" }));
    await userEvent.setup().click(screen.getByRole("option"));
    expect(onChoose).not.toHaveBeenCalled();
  });

  it("hides the handle from assistive technology outside reorder mode", () => {
    renderRow({ showHandle: true });
    expect(screen.getByRole("option", { name: "Whale" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Move/ })).not.toBeInTheDocument();
  });
});
