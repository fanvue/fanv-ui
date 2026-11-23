import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../DropdownMenu/DropdownMenu";
import { AddIcon } from "../Icons/AddIcon";
import { ActionInput } from "./ActionInput";

describe("ActionInput", () => {
  describe("API", () => {
    it("renders a button with type button by default", () => {
      render(<ActionInput>Last 30d</ActionInput>);
      expect(screen.getByRole("button", { name: "Last 30d" })).toHaveAttribute("type", "button");
    });

    it("allows overriding the button type", () => {
      render(<ActionInput type="submit">Apply</ActionInput>);
      expect(screen.getByRole("button", { name: "Apply" })).toHaveAttribute("type", "submit");
    });

    it("applies custom className", () => {
      render(<ActionInput className="custom-class">Any</ActionInput>);
      expect(screen.getByRole("button", { name: "Any" })).toHaveClass("custom-class");
    });

    it("forwards ref to the button", () => {
      const ref = vi.fn();
      render(<ActionInput ref={ref}>Any</ActionInput>);
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
    });

    it("spreads button props", () => {
      render(
        <ActionInput aria-label="Choose period" data-custom="yes">
          Last 30d
        </ActionInput>,
      );
      expect(screen.getByRole("button", { name: "Choose period" })).toHaveAttribute(
        "data-custom",
        "yes",
      );
    });

    it("renders a trailing chevron by default", () => {
      const { container } = render(<ActionInput>Any</ActionInput>);
      expect(container.querySelectorAll("svg")).toHaveLength(1);
    });

    it("hides the trailing icon when trailingIcon is null", () => {
      const { container } = render(<ActionInput trailingIcon={null}>Any</ActionInput>);
      expect(container.querySelector("svg")).toBeNull();
    });

    it("uses the dashed border for the add variant", () => {
      render(
        <ActionInput variant="add" leadingIcon={<AddIcon size={16} />}>
          Add condition
        </ActionInput>,
      );
      const button = screen.getByRole("button", { name: "Add condition" });
      expect(button).toHaveClass("border-dashed", "border-border-strong");
    });

    it("uses the selected border when filled", () => {
      render(<ActionInput filled>Total spent</ActionInput>);
      const button = screen.getByRole("button", { name: "Total spent" });
      expect(button).toHaveClass("border-border-selected");
      expect(button).toHaveAttribute("data-filled");
    });

    it("sets aria-invalid and the error border when error is true", () => {
      render(
        <ActionInput error filled>
          Any
        </ActionInput>,
      );
      const button = screen.getByRole("button", { name: "Any" });
      expect(button).toHaveAttribute("aria-invalid", "true");
      expect(button).toHaveClass("border-border-error");
      expect(button).not.toHaveClass("border-border-selected");
    });

    it("does not set aria-invalid by default", () => {
      render(<ActionInput>Any</ActionInput>);
      expect(screen.getByRole("button", { name: "Any" })).not.toHaveAttribute("aria-invalid");
    });
  });

  describe("interaction", () => {
    it("does not call onClick when disabled", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <ActionInput disabled onClick={handleClick}>
          Any
        </ActionInput>,
      );
      await user.click(screen.getByRole("button", { name: "Any" }));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("works as a DropdownMenuTrigger and reflects the open state", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ActionInput>Last 30d</ActionInput>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Last 7d</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      const trigger = screen.getByRole("button", { name: "Last 30d" });
      expect(trigger).toHaveAttribute("data-state", "closed");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("data-state", "open");
      expect(screen.getByRole("menuitem", { name: "Last 7d" })).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <ActionInput variant="add" leadingIcon={<AddIcon size={16} />}>
          Add condition
        </ActionInput>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations in the error state", async () => {
      const { container } = render(<ActionInput error>Any</ActionInput>);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
