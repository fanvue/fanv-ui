import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { vi } from "vitest";
import type { TagPickerOption } from "./TagField";
import { TagPicker, type TagPickerProps } from "./TagPicker";

export const OPTIONS: TagPickerOption[] = [
  { value: "whale", label: "Whale", emoji: "🐳", colour: "blue" },
  { value: "top", label: "Top spender", emoji: "💎", colour: "purple" },
  { value: "owl", label: "Night owl" },
  { value: "tipper", label: "Big tipper", emoji: "💰", colour: "amber" },
];

export function Harness(props: Partial<TagPickerProps> & { initial?: string[] }) {
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

export async function openPicker(props: Partial<TagPickerProps> & { initial?: string[] } = {}) {
  const user = userEvent.setup();
  render(<Harness {...props} />);
  await user.click(screen.getByRole("button", { name: /^Tags/ }));
  return user;
}

export const input = () => screen.getByRole("combobox", { name: "Tags" });
export const listbox = () => screen.getByRole("listbox");
export const options = () => within(listbox()).getAllByRole("option");
export const pickedTags = () =>
  within(screen.getByRole("dialog"))
    .getAllByTestId("tag")
    .filter((tag) => tag.closest("[role=listbox]") === null);
export const activeOption = () => {
  const id = input().getAttribute("aria-activedescendant");
  return id ? document.getElementById(id) : null;
};

export function mockRect(element: Element, top: number, height = 32) {
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

export const reorderRows = () =>
  Array.from(listbox().querySelectorAll<HTMLElement>("[data-reorder-value]"));
