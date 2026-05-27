import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { HomeIcon } from "../Icons/HomeIcon";
import { Autocomplete, type AutocompleteOption } from "./Autocomplete";

const options: AutocompleteOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
];

function renderAutocomplete(props: Partial<React.ComponentProps<typeof Autocomplete>> = {}) {
  const merged = { "aria-label": "Test autocomplete", options, ...props } as React.ComponentProps<
    typeof Autocomplete
  >;
  return render(<Autocomplete {...merged} />);
}

describe("Autocomplete", () => {
  describe("API", () => {
    it("applies custom className to container", () => {
      const { container } = renderAutocomplete({ className: "custom-class" });
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper).toHaveClass("custom-class");
    });

    it("forwards ref to input element", () => {
      const ref = React.createRef<HTMLInputElement>();
      renderAutocomplete({ ref });
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it("renders label element associated with input", () => {
      renderAutocomplete({ label: "Fruit", id: "fruit-input" });
      const label = screen.getByText("Fruit");
      expect(label.tagName.toLowerCase()).toBe("label");
      expect(label).toHaveAttribute("for", "fruit-input");
      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("id", "fruit-input");
    });

    it("renders without label when label prop is omitted", () => {
      const { container } = renderAutocomplete();
      expect(container.querySelector("label")).toBeNull();
    });

    it("renders helper text", () => {
      renderAutocomplete({ helperText: "Pick a fruit" });
      expect(screen.getByText("Pick a fruit")).toBeInTheDocument();
    });

    it("applies fullWidth class when fullWidth is true", () => {
      const { container } = renderAutocomplete({ fullWidth: true });
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper).toHaveClass("w-full");
    });

    it("auto-generates unique id when none provided", () => {
      renderAutocomplete({ label: "Test" });
      const input = screen.getByRole("combobox");
      expect(input.getAttribute("id")).toBeTruthy();
    });

    it("renders placeholder text", () => {
      renderAutocomplete({ placeholder: "Search..." });
      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });
  });

  describe("sizes", () => {
    it("applies size 48 by default", () => {
      const { container } = renderAutocomplete();
      expect(container.querySelector(".min-h-12")).toBeInTheDocument();
    });

    it("applies size 40", () => {
      const { container } = renderAutocomplete({ size: "40" });
      expect(container.querySelector(".min-h-10")).toBeInTheDocument();
    });

    it("applies size 32", () => {
      const { container } = renderAutocomplete({ size: "32" });
      expect(container.querySelector(".min-h-8")).toBeInTheDocument();
    });
  });

  describe("error state", () => {
    it("applies error border on container", () => {
      const { container } = renderAutocomplete({ error: true });
      const trigger = container.querySelector(".border-error-content");
      expect(trigger).toBeInTheDocument();
    });

    it("sets aria-invalid on input when error is true", () => {
      renderAutocomplete({ error: true });
      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("shows errorMessage instead of helperText when error", () => {
      renderAutocomplete({
        error: true,
        helperText: "Helper text",
        errorMessage: "This field is required",
      });
      expect(screen.getByText("This field is required")).toBeInTheDocument();
      expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
    });

    it("shows helperText when error is true but errorMessage is omitted", () => {
      renderAutocomplete({ error: true, helperText: "Still shown" });
      expect(screen.getByText("Still shown")).toBeInTheDocument();
    });

    it("applies error colour to helper text", () => {
      renderAutocomplete({ error: true, helperText: "Error helper" });
      expect(screen.getByText("Error helper")).toHaveClass("text-error-content");
    });
  });

  describe("disabled state", () => {
    it("disables the input", () => {
      renderAutocomplete({ disabled: true });
      const input = screen.getByRole("combobox");
      expect(input).toBeDisabled();
    });

    it("sets data-disabled on root container", () => {
      const { container } = renderAutocomplete({ disabled: true });
      expect(container.firstElementChild).toHaveAttribute("data-disabled");
    });
  });

  describe("left icon", () => {
    it("renders left icon", () => {
      const { container } = renderAutocomplete({
        leftIcon: <HomeIcon data-testid="left-icon" />,
      });
      expect(container.querySelector('[data-testid="left-icon"]')).toBeInTheDocument();
    });
  });

  describe("data attributes", () => {
    it("sets data-error on root when error is true", () => {
      const { container } = renderAutocomplete({ error: true });
      expect(container.firstElementChild).toHaveAttribute("data-error");
    });

    it("does not set data-error when error is false", () => {
      const { container } = renderAutocomplete();
      expect(container.firstElementChild).not.toHaveAttribute("data-error");
    });
  });

  describe("filtering", () => {
    it("filters options based on input text", async () => {
      const user = userEvent.setup();
      renderAutocomplete();
      const input = screen.getByRole("combobox");
      await user.type(input, "app");

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent("Apple");
    });

    it("shows empty text when no options match", async () => {
      const user = userEvent.setup();
      renderAutocomplete({ emptyText: "Nothing found" });
      const input = screen.getByRole("combobox");
      await user.type(input, "xyz");

      expect(screen.getByText("Nothing found")).toBeInTheDocument();
    });

    it("uses custom filterFn when provided", async () => {
      const user = userEvent.setup();
      const filterFn = vi.fn((option: AutocompleteOption, query: string) =>
        option.value.startsWith(query.toLowerCase()),
      );
      renderAutocomplete({ filterFn });
      const input = screen.getByRole("combobox");
      await user.type(input, "b");

      expect(filterFn).toHaveBeenCalled();
      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent("Banana");
    });
  });

  describe("single select", () => {
    it("selects an option on click", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderAutocomplete({ onChange });
      const input = screen.getByRole("combobox");

      await user.click(input);
      const listbox = screen.getByRole("listbox");
      const appleOption = within(listbox).getByText("Apple");
      await user.click(appleOption);

      expect(onChange).toHaveBeenCalledWith("apple");
    });

    it("supports controlled value", () => {
      renderAutocomplete({ value: "banana" });
      const input = screen.getByRole("combobox");
      expect(input).toHaveValue("Banana");
    });

    it("supports uncontrolled mode with defaultValue", () => {
      renderAutocomplete({ defaultValue: "cherry" });
      const input = screen.getByRole("combobox");
      expect(input).toHaveValue("Cherry");
    });
  });

  describe("multi select", () => {
    it("renders selected tags in multi-select mode", () => {
      renderAutocomplete({ multiple: true, value: ["apple", "banana"] });
      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Banana")).toBeInTheDocument();
    });

    it("calls onChange when toggling options", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderAutocomplete({ multiple: true, value: [], onChange });
      const input = screen.getByRole("combobox");

      await user.click(input);
      const listbox = screen.getByRole("listbox");
      await user.click(within(listbox).getByText("Apple"));

      expect(onChange).toHaveBeenCalledWith(["apple"]);
    });

    it("removes a tag when its remove button is clicked", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderAutocomplete({ multiple: true, value: ["apple", "banana"], onChange });

      const removeButton = screen.getByLabelText("Remove Apple");
      await user.click(removeButton);

      expect(onChange).toHaveBeenCalledWith(["banana"]);
    });

    it("removes last tag on backspace when input is empty", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderAutocomplete({ multiple: true, value: ["apple", "banana"], onChange });
      const input = screen.getByRole("combobox");

      await user.click(input);
      await user.keyboard("{Backspace}");

      expect(onChange).toHaveBeenCalledWith(["apple"]);
    });

    it("sets aria-multiselectable on listbox", async () => {
      const user = userEvent.setup();
      renderAutocomplete({ multiple: true, value: [] });
      const input = screen.getByRole("combobox");
      await user.click(input);

      const listbox = screen.getByRole("listbox");
      expect(listbox).toHaveAttribute("aria-multiselectable", "true");
    });
  });

  describe("keyboard navigation", () => {
    it("navigates options with arrow keys", async () => {
      const user = userEvent.setup();
      renderAutocomplete();
      const input = screen.getByRole("combobox");

      await user.click(input);
      await user.keyboard("{ArrowDown}");

      const listbox = screen.getByRole("listbox");
      const firstOption = within(listbox).getAllByRole("option")[0];
      expect(firstOption).toHaveAttribute("data-option-index", "0");
      expect(input).toHaveAttribute("aria-activedescendant", firstOption?.id);
    });

    it("selects option with Enter key", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderAutocomplete({ onChange });
      const input = screen.getByRole("combobox");

      await user.click(input);
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      expect(onChange).toHaveBeenCalledWith("apple");
    });

    it("closes dropdown with Escape key", async () => {
      const user = userEvent.setup();
      renderAutocomplete();
      const input = screen.getByRole("combobox");

      await user.click(input);
      expect(input).toHaveAttribute("aria-expanded", "true");

      await user.keyboard("{Escape}");
      expect(input).toHaveAttribute("aria-expanded", "false");
    });

    it("opens dropdown with ArrowDown when closed", async () => {
      const user = userEvent.setup();
      renderAutocomplete({ defaultOpen: false });
      const input = screen.getByRole("combobox");

      await user.tab();
      await user.keyboard("{Escape}");
      expect(input).toHaveAttribute("aria-expanded", "false");

      await user.keyboard("{ArrowDown}");
      expect(input).toHaveAttribute("aria-expanded", "true");
    });

    it("skips disabled options during navigation", async () => {
      const user = userEvent.setup();
      const optionsWithDisabled: AutocompleteOption[] = [
        { value: "a", label: "A" },
        { value: "b", label: "B", disabled: true },
        { value: "c", label: "C" },
      ];
      renderAutocomplete({ options: optionsWithDisabled });
      const input = screen.getByRole("combobox");

      await user.click(input);
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");

      const listbox = screen.getByRole("listbox");
      const opts = within(listbox).getAllByRole("option");
      expect(input).toHaveAttribute("aria-activedescendant", opts[2]?.id);
    });
  });

  describe("clearable", () => {
    it("shows clear button when value is selected and clearable is true", () => {
      renderAutocomplete({ value: "apple", clearable: true, clearAriaLabel: "Clear selection" });
      expect(screen.getByLabelText("Clear selection")).toBeInTheDocument();
    });

    it("clears value when clear button is clicked", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderAutocomplete({
        value: "apple",
        clearable: true,
        clearAriaLabel: "Clear selection",
        onChange,
      });

      await user.click(screen.getByLabelText("Clear selection"));
      expect(onChange).toHaveBeenCalledWith(null);
    });

    it("does not show clear button when disabled", () => {
      renderAutocomplete({
        value: "apple",
        clearable: true,
        clearAriaLabel: "Clear selection",
        disabled: true,
      });
      expect(screen.queryByLabelText("Clear selection")).not.toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("shows loading spinner in dropdown when loading", async () => {
      const user = userEvent.setup();
      renderAutocomplete({ loading: true });
      const input = screen.getByRole("combobox");
      await user.click(input);

      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("shows loading text when provided", async () => {
      const user = userEvent.setup();
      renderAutocomplete({ loading: true, loadingText: "Fetching..." });
      const input = screen.getByRole("combobox");
      await user.click(input);

      expect(screen.getByText("Fetching...")).toBeInTheDocument();
    });
  });

  describe("creatable", () => {
    it("shows create option when no match exists", async () => {
      const user = userEvent.setup();
      renderAutocomplete({ creatable: true, creatableLabel: (v) => `Create "${v}"` });
      const input = screen.getByRole("combobox");
      await user.type(input, "mango");

      const listbox = screen.getByRole("listbox");
      expect(within(listbox).getByText(/Create "mango"/)).toBeInTheDocument();
    });

    it("calls onCreate when create option is selected", async () => {
      const user = userEvent.setup();
      const onCreate = vi.fn();
      const onChange = vi.fn();
      renderAutocomplete({
        creatable: true,
        creatableLabel: (v) => `Create "${v}"`,
        onCreate,
        onChange,
      });
      const input = screen.getByRole("combobox");
      await user.type(input, "mango");

      const listbox = screen.getByRole("listbox");
      await user.click(within(listbox).getByText(/Create "mango"/));

      expect(onCreate).toHaveBeenCalledWith("mango");
      expect(onChange).toHaveBeenCalledWith("mango");
    });

    it("uses custom creatableLabel", async () => {
      const user = userEvent.setup();
      renderAutocomplete({
        creatable: true,
        creatableLabel: (val) => `Add new: ${val}`,
      });
      const input = screen.getByRole("combobox");
      await user.type(input, "mango");

      const listbox = screen.getByRole("listbox");
      expect(within(listbox).getByText("Add new: mango")).toBeInTheDocument();
    });

    it("does not show create option when an exact match exists", async () => {
      const user = userEvent.setup();
      renderAutocomplete({ creatable: true, creatableLabel: (v) => `Create "${v}"` });
      const input = screen.getByRole("combobox");
      await user.type(input, "Apple");

      const listbox = screen.getByRole("listbox");
      expect(within(listbox).queryByText(/Create/)).not.toBeInTheDocument();
    });

    it("shows create option even when creatableLabel does not contain the raw query", async () => {
      const user = userEvent.setup();
      renderAutocomplete({
        creatable: true,
        creatableLabel: () => "Add new item",
      });
      const input = screen.getByRole("combobox");
      await user.type(input, "zzz");

      const listbox = screen.getByRole("listbox");
      expect(within(listbox).getByText("Add new item")).toBeInTheDocument();
    });

    it("shows create option even when a custom filterFn rejects everything", async () => {
      const user = userEvent.setup();
      renderAutocomplete({
        creatable: true,
        creatableLabel: (v) => `Create "${v}"`,
        filterFn: () => false,
      });
      const input = screen.getByRole("combobox");
      await user.type(input, "mango");

      const listbox = screen.getByRole("listbox");
      expect(within(listbox).getByText(/Create "mango"/)).toBeInTheDocument();
    });

    it("renders the create option after grouped sections", async () => {
      const user = userEvent.setup();
      render(
        <Autocomplete
          aria-label="Product"
          options={[
            { value: "p1", label: "Price one", groupId: "demo" },
            { value: "p2", label: "Price two", groupId: "demo" },
          ]}
          groups={[{ id: "demo", label: "Demo Product" }]}
          creatable
          creatableLabel={(v) => `Create "${v}"`}
        />,
      );
      const input = screen.getByRole("combobox");
      await user.type(input, "demo");

      const listbox = screen.getByRole("listbox");
      const optionTexts = within(listbox)
        .getAllByRole("option")
        .map((el) => el.textContent);
      expect(optionTexts).toEqual(["Price one", "Price two", 'Create "demo"']);
    });
  });

  describe("controlled input value", () => {
    it("uses controlled inputValue", async () => {
      const onInputChange = vi.fn();
      renderAutocomplete({ inputValue: "ban", onInputChange });
      const input = screen.getByRole("combobox");
      expect(input).toHaveValue("ban");
    });

    it("calls onInputChange when typing", async () => {
      const user = userEvent.setup();
      const onInputChange = vi.fn();
      renderAutocomplete({ inputValue: "", onInputChange });
      const input = screen.getByRole("combobox");
      await user.type(input, "a");

      expect(onInputChange).toHaveBeenCalledWith("a");
    });
  });

  describe("accessibility", () => {
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it("has no accessibility violations", async () => {
      const { container } = renderAutocomplete({ label: "Accessible Autocomplete" });
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations with aria-label", async () => {
      const { container } = renderAutocomplete();
      expect(await axe(container)).toHaveNoViolations();
    });

    it("associates helper text with input via aria-describedby", () => {
      renderAutocomplete({ id: "my-ac", helperText: "Helper" });
      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("aria-describedby", "my-ac-helper");
    });

    it("does not set aria-describedby when no helper text", () => {
      renderAutocomplete();
      const input = screen.getByRole("combobox");
      expect(input).not.toHaveAttribute("aria-describedby");
    });

    it("input has combobox role", () => {
      renderAutocomplete();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("sets aria-expanded based on open state", async () => {
      const user = userEvent.setup();
      renderAutocomplete();
      const input = screen.getByRole("combobox");

      expect(input).toHaveAttribute("aria-expanded", "false");
      await user.click(input);
      expect(input).toHaveAttribute("aria-expanded", "true");
    });

    it("sets aria-controls to listbox id only when open", async () => {
      const user = userEvent.setup();
      renderAutocomplete({ id: "test-ac" });
      const input = screen.getByRole("combobox");

      expect(input).not.toHaveAttribute("aria-controls");

      await user.click(input);

      expect(input).toHaveAttribute("aria-controls", "test-ac-listbox");
      expect(screen.getByRole("listbox")).toHaveAttribute("id", "test-ac-listbox");
    });

    it("warns when no accessible name is provided", () => {
      render(<Autocomplete options={options} />);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("no accessible name provided"),
      );
    });

    it("does not warn when label is provided", () => {
      render(<Autocomplete options={options} label="Fruit" />);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it("does not warn when aria-label is provided", () => {
      render(<Autocomplete options={options} aria-label="Fruit" />);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it("options have correct aria-selected", async () => {
      const user = userEvent.setup();
      renderAutocomplete({ value: "apple" });
      const input = screen.getByRole("combobox");
      await user.click(input);

      const listbox = screen.getByRole("listbox");
      const opts = within(listbox).getAllByRole("option");
      expect(opts[0]).toHaveAttribute("aria-selected", "true");
      expect(opts[1]).toHaveAttribute("aria-selected", "false");
    });
  });

  describe("groups and pinned options", () => {
    const groupedOptions: AutocompleteOption[] = [
      { value: "__new__", label: "+ Create new product", pinned: true },
      { value: "product:abc", label: "Demo Product", groupId: "recent" },
      { value: "price:p1", label: "Demo Product — $19.99", groupId: "recent" },
      { value: "price:p2", label: "Demo Product — $9.99 / month", groupId: "recent" },
      { value: "product:def", label: "Other Product", groupId: "all" },
      { value: "product:ghi", label: "Yet Another", groupId: "all" },
    ];
    const groups = [
      { id: "recent", label: "Recent products" },
      { id: "all", label: "All products" },
    ];

    function renderGrouped(props: Partial<React.ComponentProps<typeof Autocomplete>> = {}) {
      const merged = {
        "aria-label": "Grouped",
        options: groupedOptions,
        groups,
        defaultOpen: true,
        ...props,
      } as React.ComponentProps<typeof Autocomplete>;
      return render(<Autocomplete {...merged} />);
    }

    it("back-compat: flat options without groups/groupId/pinned render no group wrappers, headings or dividers", () => {
      const flatOptions: AutocompleteOption[] = [
        { value: "a", label: "Apple" },
        { value: "b", label: "Banana" },
      ];
      const { container } = render(
        <Autocomplete aria-label="Flat" options={flatOptions} defaultOpen />,
      );
      const listbox = within(container.ownerDocument.body).getByRole("listbox");
      expect(within(listbox).queryAllByRole("group")).toHaveLength(0);
      expect(listbox.querySelector(".border-t")).toBeNull();
      expect(within(listbox).getAllByRole("option")).toHaveLength(2);
    });

    it("renders one role=group per declared group with aria-labelledby resolving to the heading text", () => {
      renderGrouped();
      const groupWrappers = screen.getAllByRole("group");
      expect(groupWrappers).toHaveLength(2);

      for (const wrapper of groupWrappers) {
        const labelledBy = wrapper.getAttribute("aria-labelledby");
        expect(labelledBy).toBeTruthy();
        const heading = document.getElementById(labelledBy as string);
        expect(heading).not.toBeNull();
        expect(heading?.textContent).toMatch(/Recent products|All products/);
      }
    });

    it("renders groups in declaration order regardless of options array order", () => {
      render(
        <Autocomplete
          aria-label="Reordered"
          options={groupedOptions}
          groups={[
            { id: "all", label: "All products" },
            { id: "recent", label: "Recent products" },
          ]}
          defaultOpen
        />,
      );
      const groupWrappers = screen.getAllByRole("group");
      const firstHeading = document.getElementById(
        groupWrappers[0]?.getAttribute("aria-labelledby") ?? "",
      );
      const secondHeading = document.getElementById(
        groupWrappers[1]?.getAttribute("aria-labelledby") ?? "",
      );
      expect(firstHeading?.textContent).toMatch(/All products/);
      expect(secondHeading?.textContent).toMatch(/Recent products/);
    });

    it("collapses an empty group's heading when its options are filtered out", async () => {
      const user = userEvent.setup();
      renderGrouped();
      const input = screen.getByRole("combobox");
      await user.type(input, "demo");

      expect(screen.queryByText("All products")).not.toBeInTheDocument();
      expect(screen.getByText("Recent products")).toBeInTheDocument();
    });

    it("shows only emptyText (no headings) when all non-pinned options are filtered out and there are no pinned", () => {
      render(
        <Autocomplete
          aria-label="Empty"
          options={[
            { value: "a", label: "Apple", groupId: "recent" },
            { value: "b", label: "Banana", groupId: "all" },
          ]}
          groups={groups}
          inputValue="zzz"
          defaultOpen
          emptyText="Nothing here"
        />,
      );
      expect(screen.getByText("Nothing here")).toBeInTheDocument();
      expect(screen.queryByRole("group")).not.toBeInTheDocument();
      expect(screen.queryByText("Recent products")).not.toBeInTheDocument();
    });

    it("keeps pinned options visible regardless of query", () => {
      renderGrouped({ inputValue: "no-match-at-all" });
      expect(screen.getByText("+ Create new product")).toBeInTheDocument();
    });

    it("renders pinned options AND emptyText when only pinned survive a search", () => {
      renderGrouped({ inputValue: "no-match-at-all", emptyText: "No products match" });
      expect(screen.getByText("+ Create new product")).toBeInTheDocument();
      expect(screen.getByText("No products match")).toBeInTheDocument();
    });

    it("renders ungrouped options above the first group without a heading", () => {
      const opts: AutocompleteOption[] = [
        { value: "ungrouped-1", label: "Ungrouped one" },
        { value: "a", label: "Alpha", groupId: "recent" },
      ];
      render(
        <Autocomplete
          aria-label="Mixed"
          options={opts}
          groups={[{ id: "recent", label: "Recent products" }]}
          defaultOpen
        />,
      );
      const listbox = screen.getByRole("listbox");
      const renderedOptions = within(listbox).getAllByRole("option");
      expect(renderedOptions[0]).toHaveTextContent("Ungrouped one");
      expect(within(listbox).getAllByRole("group")).toHaveLength(1);
    });

    it("ArrowDown traversal lands on options only, never on a heading", async () => {
      const user = userEvent.setup();
      renderGrouped();
      const input = screen.getByRole("combobox");
      await user.click(input);

      await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");

      const activeId = input.getAttribute("aria-activedescendant");
      expect(activeId).toBeTruthy();
      const active = document.getElementById(activeId as string);
      expect(active).toHaveAttribute("role", "option");
    });

    it("aria-activedescendant always points at an option id, never at a heading id", async () => {
      const user = userEvent.setup();
      renderGrouped();
      const input = screen.getByRole("combobox");
      await user.click(input);

      const headings = screen.getAllByRole("group").map((g) => g.getAttribute("aria-labelledby"));

      for (let i = 0; i < 6; i++) {
        await user.keyboard("{ArrowDown}");
        const activeId = input.getAttribute("aria-activedescendant");
        expect(headings).not.toContain(activeId);
      }
    });

    it("End lands on the last visible option, Home on the first", async () => {
      const user = userEvent.setup();
      renderGrouped();
      const input = screen.getByRole("combobox");
      await user.click(input);

      await user.keyboard("{End}");
      const lastActiveId = input.getAttribute("aria-activedescendant");
      const lastActive = document.getElementById(lastActiveId ?? "");
      expect(lastActive).toHaveAttribute("role", "option");
      expect(lastActive?.textContent).toMatch(/Yet Another/);

      await user.keyboard("{Home}");
      const firstActiveId = input.getAttribute("aria-activedescendant");
      const firstActive = document.getElementById(firstActiveId ?? "");
      expect(firstActive).toHaveAttribute("role", "option");
      expect(firstActive?.textContent).toMatch(/Create new product/);
    });

    it("calls renderGroupHeading with the group descriptor; component still wraps it with role=presentation and id", () => {
      const renderGroupHeading = vi.fn((group: { id: string; label: string }) => (
        <span data-testid={`heading-${group.id}`}>{group.label.toUpperCase()}</span>
      ));
      renderGrouped({ renderGroupHeading });
      expect(renderGroupHeading).toHaveBeenCalledWith(
        expect.objectContaining({ id: "recent", label: "Recent products" }),
      );

      const customHeading = screen.getByTestId("heading-recent");
      expect(customHeading).toHaveTextContent("RECENT PRODUCTS");

      const groupWrapper = customHeading.closest('[role="group"]');
      expect(groupWrapper).not.toBeNull();
      const headingWrapper = document.getElementById(
        groupWrapper?.getAttribute("aria-labelledby") ?? "",
      );
      expect(headingWrapper).toHaveAttribute("role", "presentation");
      expect(headingWrapper).toContainElement(customHeading);
    });

    it("renderOption signature is unchanged with groups", () => {
      const renderOption = vi.fn(
        (opt: AutocompleteOption, _state: { selected: boolean; active: boolean }) => (
          <span>RO:{opt.value}</span>
        ),
      );
      renderGrouped({ renderOption });

      expect(renderOption).toHaveBeenCalled();
      const call = renderOption.mock.calls[0];
      expect(call?.[0]).toHaveProperty("value");
      expect(call?.[1]).toHaveProperty("selected");
      expect(call?.[1]).toHaveProperty("active");
      expect(screen.getAllByText(/^RO:/).length).toBeGreaterThan(0);
    });

    it("renders divider between pinned/ungrouped block and the first group", () => {
      renderGrouped();
      const groupWrappers = screen.getAllByRole("group");
      const first = groupWrappers[0] as HTMLElement;
      expect(first.className).toContain("border-t");
    });

    it("omits the divider when there is no top block (only groups)", () => {
      render(
        <Autocomplete
          aria-label="Groups only"
          options={[
            { value: "a", label: "Alpha", groupId: "recent" },
            { value: "b", label: "Beta", groupId: "all" },
          ]}
          groups={groups}
          defaultOpen
        />,
      );
      const groupWrappers = screen.getAllByRole("group");
      const first = groupWrappers[0] as HTMLElement;
      expect(first.className).not.toContain("border-t");
    });

    it("has no accessibility violations with groups + pinned", async () => {
      const { container } = renderGrouped({ label: "Product" });
      expect(await axe(container)).toHaveNoViolations();
    });

    describe("group-heading matching", () => {
      const productPriceGroups = [
        { id: "demo-product", label: "Demo Product" },
        { id: "pro-plan", label: "Pro Plan" },
      ];
      const productPriceOptions: AutocompleteOption[] = [
        { value: "price:demo-1", label: "$19.99 (one-off)", groupId: "demo-product" },
        { value: "price:demo-2", label: "$9.99 / month", groupId: "demo-product" },
        { value: "price:pro-1", label: "$99.00 / year", groupId: "pro-plan" },
        { value: "price:pro-2", label: "$29.00 / month", groupId: "pro-plan" },
      ];

      it("keeps every option under a group whose heading matches the query, even when no item label matches", () => {
        render(
          <Autocomplete
            aria-label="Product"
            options={productPriceOptions}
            groups={productPriceGroups}
            inputValue="demo"
            defaultOpen
          />,
        );
        expect(screen.getByText("Demo Product")).toBeInTheDocument();
        expect(screen.getByText("$19.99 (one-off)")).toBeInTheDocument();
        expect(screen.getByText("$9.99 / month")).toBeInTheDocument();
        expect(screen.queryByText("Pro Plan")).not.toBeInTheDocument();
        expect(screen.queryByText("$99.00 / year")).not.toBeInTheDocument();
      });

      it("falls back to per-option filter when the heading doesn't match", () => {
        render(
          <Autocomplete
            aria-label="Product"
            options={productPriceOptions}
            groups={productPriceGroups}
            inputValue="19.99"
            defaultOpen
          />,
        );
        expect(screen.getByText("Demo Product")).toBeInTheDocument();
        expect(screen.getByText("$19.99 (one-off)")).toBeInTheDocument();
        expect(screen.queryByText("$9.99 / month")).not.toBeInTheDocument();
        expect(screen.queryByText("Pro Plan")).not.toBeInTheDocument();
      });

      it("a query that matches one group's heading AND an item in another group keeps both groups visible", () => {
        render(
          <Autocomplete
            aria-label="Product"
            options={[
              ...productPriceOptions,
              { value: "price:legacy", label: "Demo legacy bundle", groupId: "pro-plan" },
            ]}
            groups={productPriceGroups}
            inputValue="demo"
            defaultOpen
          />,
        );
        expect(screen.getByText("Demo Product")).toBeInTheDocument();
        expect(screen.getByText("$19.99 (one-off)")).toBeInTheDocument();
        expect(screen.getByText("$9.99 / month")).toBeInTheDocument();
        expect(screen.getByText("Pro Plan")).toBeInTheDocument();
        expect(screen.getByText("Demo legacy bundle")).toBeInTheDocument();
        expect(screen.queryByText("$99.00 / year")).not.toBeInTheDocument();
        expect(screen.queryByText("$29.00 / month")).not.toBeInTheDocument();
      });
    });
  });
});
