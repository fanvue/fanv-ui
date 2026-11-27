import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import type { TagPickerOption } from "./TagField";
import { TagMenu, type TagMenuProps } from "./TagMenu";

const WHALE: TagPickerOption = { value: "whale", label: "Whale", emoji: "🐳", colour: "blue" };

const LABELS = {
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
};

function Harness(props: Partial<TagMenuProps>) {
  const [open, setOpen] = React.useState(true);
  if (!open) return <p>closed</p>;
  return <TagMenu {...LABELS} option={WHALE} onClose={() => setOpen(false)} {...props} />;
}

describe("TagMenu", () => {
  it("starts the rename field with the emoji and label", () => {
    render(<Harness onRename={vi.fn()} />);
    expect(screen.getByRole("textbox", { name: "Tag name" })).toHaveValue("🐳 Whale");
  });

  it("renames when the menu closes after an edit", async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    render(<Harness onRename={onRename} onColourChange={vi.fn()} />);
    const field = screen.getByRole("textbox", { name: "Tag name" });
    await user.clear(field);
    await user.type(field, "Orca");
    await user.click(screen.getByRole("button", { name: "Purple" }));
    expect(screen.getByText("closed")).toBeInTheDocument();
    expect(onRename).toHaveBeenCalledWith({ label: "Orca" });
  });

  it("does not rename a tag that was deleted", async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    const onDelete = vi.fn();
    render(<Harness onRename={onRename} onDelete={onDelete} />);
    const field = screen.getByRole("textbox", { name: "Tag name" });
    await user.clear(field);
    await user.type(field, "Orca");
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onRename).not.toHaveBeenCalled();
  });

  it("does not rename to an empty name", async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    render(<Harness onRename={onRename} />);
    const field = screen.getByRole("textbox", { name: "Tag name" });
    await user.clear(field);
    await user.keyboard("{Enter}");
    expect(screen.getByText("closed")).toBeInTheDocument();
    expect(onRename).not.toHaveBeenCalled();
  });

  it("marks the current colour and changes it", async () => {
    const user = userEvent.setup();
    const onColourChange = vi.fn();
    render(<Harness onColourChange={onColourChange} />);
    expect(screen.getByRole("button", { name: "Blue" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Teal" })).toHaveAttribute("aria-pressed", "false");
    await user.click(screen.getByRole("button", { name: "Teal" }));
    expect(onColourChange).toHaveBeenCalledWith("teal");
  });

  it("shows only the sections it has callbacks for", () => {
    render(<Harness onDelete={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Colours" })).not.toBeInTheDocument();
  });
});
