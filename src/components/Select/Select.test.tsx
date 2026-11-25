import { render, screen, within } from "@testing-library/react";
import * as React from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { HomeIcon } from "../Icons/HomeIcon";
import { Select, SelectContent, SelectGroup, SelectItem } from "./Select";

function renderSelect(props: Partial<React.ComponentProps<typeof Select>> = {}) {
  return render(
    <Select aria-label="Test select" {...props}>
      <SelectContent>
        <SelectItem value="a">Option A</SelectItem>
        <SelectItem value="b">Option B</SelectItem>
      </SelectContent>
    </Select>,
  );
}

describe("Select", () => {
  describe("API", () => {
    it("applies custom className to container", () => {
      const { container } = renderSelect({ className: "custom-class" });
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper).toHaveClass("custom-class");
    });

    it("forwards ref to trigger button", () => {
      const ref = React.createRef<HTMLButtonElement>();
      renderSelect({ ref });
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("renders label element associated with trigger", () => {
      renderSelect({ label: "Country", id: "country-select" });
      const label = screen.getByText("Country");
      expect(label.tagName.toLowerCase()).toBe("label");
      expect(label).toHaveAttribute("for", "country-select");
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("id", "country-select");
    });

    it("renders without label when label prop is omitted", () => {
      const { container } = renderSelect();
      expect(container.querySelector("label")).toBeNull();
    });

    it("renders helper text", () => {
      renderSelect({ helperText: "Pick one option" });
      expect(screen.getByText("Pick one option")).toBeInTheDocument();
    });

    it("applies fullWidth class when fullWidth is true", () => {
      const { container } = renderSelect({ fullWidth: true });
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper).toHaveClass("w-full");
    });

    it("auto-generates unique id when none provided", () => {
      renderSelect({ label: "Test" });
      const trigger = screen.getByRole("combobox");
      expect(trigger.getAttribute("id")).toBeTruthy();
    });
  });

  describe("sizes", () => {
    it("applies size 48 by default", () => {
      const { container } = renderSelect();
      expect(container.querySelector(".h-12")).toBeInTheDocument();
    });

    it("applies size 40", () => {
      const { container } = renderSelect({ size: "40" });
      expect(container.querySelector(".h-10")).toBeInTheDocument();
    });

    it("applies size 32", () => {
      const { container } = renderSelect({ size: "32" });
      expect(container.querySelector(".h-8")).toBeInTheDocument();
    });
  });

  describe("error state", () => {
    it("applies error border on trigger", () => {
      const { container } = renderSelect({ error: true });
      const trigger = container.querySelector(".border-error-content");
      expect(trigger).toBeInTheDocument();
    });

    it("sets aria-invalid on trigger when error is true", () => {
      renderSelect({ error: true });
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-invalid", "true");
    });

    it("shows errorMessage instead of helperText when error", () => {
      renderSelect({
        error: true,
        helperText: "Helper text",
        errorMessage: "This field is required",
      });
      expect(screen.getByText("This field is required")).toBeInTheDocument();
      expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
    });

    it("shows helperText when error is true but errorMessage is omitted", () => {
      renderSelect({ error: true, helperText: "Still shown" });
      expect(screen.getByText("Still shown")).toBeInTheDocument();
    });

    it("applies error colour to helper text", () => {
      renderSelect({ error: true, helperText: "Error helper" });
      expect(screen.getByText("Error helper")).toHaveClass("text-error-content");
    });
  });

  describe("disabled state", () => {
    it("disables the trigger", () => {
      renderSelect({ disabled: true });
      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeDisabled();
    });

    it("sets data-disabled on root container", () => {
      const { container } = renderSelect({ disabled: true });
      expect(container.firstElementChild).toHaveAttribute("data-disabled");
    });
  });

  describe("left icon", () => {
    it("renders left icon", () => {
      const { container } = renderSelect({ leftIcon: <HomeIcon data-testid="left-icon" /> });
      expect(container.querySelector('[data-testid="left-icon"]')).toBeInTheDocument();
    });
  });

  describe("data attributes", () => {
    it("sets data-error on root when error is true", () => {
      const { container } = renderSelect({ error: true });
      expect(container.firstElementChild).toHaveAttribute("data-error");
    });

    it("does not set data-error when error is false", () => {
      const { container } = renderSelect();
      expect(container.firstElementChild).not.toHaveAttribute("data-error");
    });
  });

  describe("variant", () => {
    it("draws the bordered input field by default", () => {
      renderSelect();
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveClass(
        "bg-inputs-inputs-primary",
        "border-border-input",
        "hover:border-border-input-hover",
        "data-[state=open]:border-border-input-hover",
        "focus-visible:shadow-focus-ring",
        "justify-between",
      );
    });

    it("strokes the focused or open trigger with Border/Selected and drops the ring under the v2 palette only", () => {
      renderSelect();
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveClass(
        "theme-v2:focus-visible:border-border-selected",
        "theme-v2:focus-visible:shadow-none",
        "theme-v2:data-[state=open]:border-border-selected",
      );
      expect(trigger).not.toHaveClass("focus-visible:border-border-selected");
    });

    it("keeps the error border and focus ring on an errored trigger under the v2 palette", () => {
      renderSelect({ error: true });
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveClass("border-error-content", "focus-visible:shadow-focus-ring");
      expect(trigger).not.toHaveClass("theme-v2:focus-visible:shadow-none");
    });

    it("draws the filled pill without a border and with a centred label", () => {
      renderSelect({ variant: "filled", size: "32" });
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveClass(
        "bg-background-secondary",
        "border-transparent",
        "justify-center",
        "px-2",
      );
      expect(trigger).not.toHaveClass("bg-inputs-inputs-primary");
      expect(trigger.querySelector("svg")).toHaveClass("size-4");
    });

    it("keeps the error border on the filled pill", () => {
      renderSelect({ variant: "filled", error: true });
      expect(screen.getByRole("combobox")).toHaveClass("border-error-content");
    });

    it("has no accessibility violations when filled", async () => {
      const { container } = renderSelect({ variant: "filled" });
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = renderSelect({ label: "Accessible Select" });
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations with aria-label", async () => {
      const { container } = render(
        <Select aria-label="Country">
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
          </SelectContent>
        </Select>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("associates helper text with trigger via aria-describedby", () => {
      renderSelect({ id: "my-select", helperText: "Helper" });
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-describedby", "my-select-helper");
    });

    it("does not set aria-describedby when no helper text", () => {
      renderSelect();
      const trigger = screen.getByRole("combobox");
      expect(trigger).not.toHaveAttribute("aria-describedby");
    });
  });

  describe("SelectItem (v2 menu item)", () => {
    beforeAll(() => {
      Element.prototype.scrollIntoView = vi.fn();
      Element.prototype.hasPointerCapture = vi.fn(() => false);
      Element.prototype.releasePointerCapture = vi.fn();
      Element.prototype.setPointerCapture = vi.fn();
    });

    function renderOpen(item: React.ReactNode, size?: React.ComponentProps<typeof Select>["size"]) {
      return render(
        <Select aria-label="Test" defaultOpen size={size}>
          <SelectContent>{item}</SelectContent>
        </Select>,
      );
    }

    it("renders a leading icon inside the option", () => {
      renderOpen(
        <SelectItem value="a" leadingIcon={<HomeIcon data-testid="lead" />}>
          Option A
        </SelectItem>,
      );
      expect(screen.getByTestId("lead")).toBeInTheDocument();
    });

    it("renders the avatar in place of the leading icon", () => {
      renderOpen(
        <SelectItem
          value="a"
          avatar={<span data-testid="avatar">A</span>}
          leadingIcon={<HomeIcon data-testid="lead" />}
        >
          Option A
        </SelectItem>,
      );
      expect(screen.getByTestId("avatar")).toBeInTheDocument();
      expect(screen.queryByTestId("lead")).not.toBeInTheDocument();
    });

    it("renders a description under the label", () => {
      renderOpen(
        <SelectItem value="a" description="Secondary line">
          Option A
        </SelectItem>,
      );
      expect(screen.getByText("Secondary line")).toBeInTheDocument();
    });

    it("sets a two-line option's title in 14px semibold over the regular description", () => {
      renderOpen(
        <SelectItem value="a" description="Secondary line">
          Option A
        </SelectItem>,
      );
      expect(screen.getByText("Option A").closest("span.truncate")).toHaveClass(
        "typography-body-small-14px-semibold",
      );
      expect(screen.getByText("Secondary line")).toHaveClass("typography-body-small-14px-regular");
    });

    it("greys a disabled option's icon with the disabled icon colour", () => {
      renderOpen(
        <SelectItem value="a" disabled leadingIcon={<HomeIcon data-testid="lead" />}>
          Option A
        </SelectItem>,
      );
      expect(screen.getByTestId("lead").parentElement).toHaveClass(
        "group-data-[disabled]:text-icons-disabled",
      );
    });

    it("treats a false avatar as absent and keeps the leading icon", () => {
      renderOpen(
        <SelectItem value="a" avatar={false} leadingIcon={<HomeIcon data-testid="lead" />}>
          Option A
        </SelectItem>,
      );
      expect(screen.getByTestId("lead")).toBeInTheDocument();
    });

    it("treats a false description as absent (stays single-line)", () => {
      renderOpen(
        <SelectItem value="a" description={false}>
          Option A
        </SelectItem>,
      );
      expect(screen.getByRole("option", { name: "Option A" })).toHaveClass("items-center");
    });

    it("propagates the disabled state to the description and check indicator", () => {
      render(
        <Select aria-label="Test" defaultOpen defaultValue="a">
          <SelectContent>
            <SelectItem value="a" disabled description="Secondary line">
              Option A
            </SelectItem>
          </SelectContent>
        </Select>,
      );
      expect(screen.getByText("Secondary line")).toHaveClass(
        "group-data-[disabled]:text-content-disabled",
      );
    });

    it("marks the selected row with its own fill and a semibold title, apart from hover", () => {
      render(
        <Select aria-label="Test" defaultOpen defaultValue="a">
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>,
      );
      const selected = screen.getByRole("option", { name: "Option A" });
      expect(selected).toHaveAttribute("data-state", "checked");
      expect(selected).toHaveClass(
        "data-[state=checked]:bg-menu-item-selected",
        "data-[state=checked]:data-highlighted:bg-interaction-hover",
      );
      expect(within(selected).getByText("Option A").parentElement).toHaveClass(
        "group-data-[state=checked]:font-semibold",
      );
      expect(screen.getByRole("option", { name: "Option B" })).toHaveAttribute(
        "data-state",
        "unchecked",
      );
    });

    it("inverts the selected row, its check and description under the v2 palette, hover included", () => {
      render(
        <Select aria-label="Test" defaultOpen defaultValue="a">
          <SelectContent>
            <SelectItem value="a" description="Secondary line" leadingIcon={<HomeIcon />}>
              Option A
            </SelectItem>
          </SelectContent>
        </Select>,
      );
      const selected = screen.getByRole("option", { name: /Option A/ });
      expect(selected).toHaveClass(
        "data-[state=checked]:bg-menu-item-selected",
        "theme-v2:data-[state=checked]:text-content-primary-inverted",
        "theme-v2:data-[state=checked]:focus:bg-menu-item-selected",
        "theme-v2:data-[state=checked]:data-highlighted:bg-menu-item-selected",
      );
      expect(selected.className).not.toContain("surface-primary-inverted");
      const svgs = selected.querySelectorAll("svg");
      expect(svgs[0]?.parentElement).toHaveClass(
        "theme-v2:group-data-[state=checked]:text-icons-primary-inverted",
      );
      expect(svgs[svgs.length - 1]).toHaveClass(
        "text-content-primary",
        "theme-v2:text-icons-primary-inverted",
      );
      expect(screen.getByText("Secondary line")).toHaveClass(
        "theme-v2:group-data-[state=checked]:text-content-secondary-inverted",
      );
    });

    it("follows the library's Disabled state under the v2 palette when selected", () => {
      render(
        <Select aria-label="Test" defaultOpen defaultValue="a">
          <SelectContent>
            <SelectItem
              value="a"
              disabled
              description="Secondary line"
              avatar={<span data-testid="avatar" />}
            >
              Option A
            </SelectItem>
            <SelectItem value="b" disabled leadingIcon={<HomeIcon />}>
              Option B
            </SelectItem>
          </SelectContent>
        </Select>,
      );
      const selected = screen.getByRole("option", { name: /Option A/ });
      expect(selected).toHaveAttribute("data-state", "checked");
      expect(selected).toHaveAttribute("data-disabled");
      expect(selected).toHaveClass(
        "data-[state=checked]:bg-menu-item-selected",
        "theme-v2:data-[state=checked]:bg-transparent",
      );
      expect(selected.className).not.toContain("inverted");
      expect(selected).not.toHaveClass(
        "theme-v2:data-[state=checked]:data-highlighted:bg-menu-item-selected",
      );
      const check = selected.querySelector("svg");
      expect(check).toHaveClass("group-data-[disabled]:text-content-disabled");
      expect(check?.getAttribute("class")).not.toContain("inverted");
      expect(screen.getByText("Secondary line").className).not.toContain("inverted");
      expect(screen.getByTestId("avatar").parentElement).toHaveClass("theme-v2:opacity-60");
      const other = screen.getByRole("option", { name: /Option B/ });
      expect(other.querySelector("svg")?.parentElement?.className).not.toContain("inverted");
    });

    it("draws the panel on Modal/Background with Modal/Stroke under the v2 palette only", () => {
      renderSelect({ defaultOpen: true });
      const panel = screen.getByRole("listbox");
      expect(panel).toHaveClass(
        "bg-modal-background",
        "border-border-strong",
        "theme-v2:border-modal-stroke",
      );
    });

    it("spaces rows 3px apart inside a group", () => {
      render(
        <Select aria-label="Test" defaultOpen defaultValue="a">
          <SelectContent>
            <SelectGroup data-testid="group">
              <SelectItem value="a">Option A</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>,
      );
      const group = screen.getByTestId("group");
      expect(group).toContainElement(screen.getByRole("option", { name: "Option A" }));
      expect(group).toHaveClass("flex", "flex-col", "gap-[3px]");
    });

    it("derives a 32px row from the size-32 trigger", () => {
      renderOpen(<SelectItem value="a">Option A</SelectItem>, "32");
      expect(screen.getByRole("option", { name: "Option A" })).toHaveClass("min-h-8");
    });

    it("keeps 40px rows for the larger trigger sizes", () => {
      renderOpen(<SelectItem value="a">Option A</SelectItem>, "48");
      expect(screen.getByRole("option", { name: "Option A" })).toHaveClass("min-h-10");
    });

    it("has no accessibility violations for a feature row", async () => {
      const { container } = renderOpen(
        <SelectItem
          value="jane"
          avatar={<span aria-hidden="true">JD</span>}
          description="Product designer"
        >
          Jane Doe
        </SelectItem>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
