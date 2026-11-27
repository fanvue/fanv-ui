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
      fireEvent.keyDown(input(), { key: "Enter", isComposing: true, keyCode: 229 });
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
