import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { HomeIcon } from "../Icons/HomeIcon";
import { Select, SelectContent, SelectItem } from "./Select";

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
      const trigger = container.querySelector(".border-error-500");
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
      expect(screen.getByText("Error helper")).toHaveClass("text-error-500");
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
});
