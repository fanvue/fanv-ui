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
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";
import { SettingsIcon } from "../Icons/SettingsIcon";
import { TableTabActionButton, TableTabActionSearch, TableTabActions } from "./TableTabActions";

function renderRow() {
  return render(
    <TableTabActions aria-label="Table actions" className="custom-row">
      <TableTabActionSearch />
      <TableTabActionButton rightIcon={<SettingsIcon />}>Filter</TableTabActionButton>
      <TableTabActionButton rightIcon={<ChevronDownIcon />}>Sort By</TableTabActionButton>
    </TableTabActions>,
  );
}

describe("TableTabActions", () => {
  describe("API", () => {
    it("renders a labelled group and merges className", () => {
      renderRow();
      const group = screen.getByRole("group", { name: "Table actions" });
      expect(group).toHaveClass("custom-row", "gap-2");
    });

    it("forwards refs", () => {
      const groupRef = { current: null as HTMLDivElement | null };
      const inputRef = { current: null as HTMLInputElement | null };
      const buttonRef = { current: null as HTMLButtonElement | null };
      render(
        <TableTabActions ref={groupRef}>
          <TableTabActionSearch ref={inputRef} />
          <TableTabActionButton ref={buttonRef}>Filter</TableTabActionButton>
        </TableTabActions>,
      );
      expect(groupRef.current?.tagName).toBe("DIV");
      expect(inputRef.current?.tagName).toBe("INPUT");
      expect(buttonRef.current?.tagName).toBe("BUTTON");
    });
  });

  describe("search", () => {
    it("has a default placeholder and accessible name", () => {
      render(<TableTabActionSearch />);
      expect(screen.getByRole("searchbox", { name: "Search" })).toHaveAttribute(
        "placeholder",
        "Search",
      );
    });

    it("fires onChange when typing", async () => {
      const onChange = vi.fn();
      render(<TableTabActionSearch onChange={onChange} />);
      await userEvent.type(screen.getByRole("searchbox"), "ab");
      expect(onChange).toHaveBeenCalledTimes(2);
    });

    it("applies className to the container, not the input", () => {
      render(<TableTabActionSearch className="custom-search" />);
      expect(screen.getByRole("searchbox").parentElement).toHaveClass("custom-search", "h-8");
      expect(screen.getByRole("searchbox")).not.toHaveClass("custom-search");
    });
  });

  describe("button", () => {
    it("renders a type=button with its label and trailing icon", () => {
      render(<TableTabActionButton rightIcon={<SettingsIcon />}>Filter</TableTabActionButton>);
      const button = screen.getByRole("button", { name: "Filter" });
      expect(button).toHaveAttribute("type", "button");
      expect(button.querySelector("svg")).not.toBeNull();
    });

    it("applies position corner classes", () => {
      const { rerender } = render(<TableTabActionButton>Filter</TableTabActionButton>);
      expect(screen.getByRole("button")).toHaveClass("rounded-sm");
      rerender(<TableTabActionButton position="left">Filter</TableTabActionButton>);
      expect(screen.getByRole("button")).toHaveClass("rounded-l-sm", "rounded-r-none");
      rerender(<TableTabActionButton position="right">Filter</TableTabActionButton>);
      expect(screen.getByRole("button")).toHaveClass("rounded-r-sm", "rounded-l-none");
    });

    it("tints the surface for the highlight status", () => {
      const { rerender } = render(<TableTabActionButton>Filter</TableTabActionButton>);
      expect(screen.getByRole("button")).toHaveAttribute("data-status", "placeholder");
      rerender(<TableTabActionButton status="highlight">Filter</TableTabActionButton>);
      expect(screen.getByRole("button")).toHaveClass("bg-neutral-alphas-100");
    });

    it("calls onClick and respects disabled", async () => {
      const onClick = vi.fn();
      const { rerender } = render(
        <TableTabActionButton onClick={onClick}>Filter</TableTabActionButton>,
      );
      await userEvent.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);
      rerender(
        <TableTabActionButton disabled onClick={onClick}>
          Filter
        </TableTabActionButton>,
      );
      await userEvent.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("works as a DropdownMenuTrigger child", async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <TableTabActionButton rightIcon={<ChevronDownIcon />}>Sort By</TableTabActionButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Newest</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      const trigger = screen.getByRole("button", { name: "Sort By" });
      await userEvent.click(trigger);
      expect(trigger).toHaveAttribute("data-state", "open");
      expect(await screen.findByRole("menuitem", { name: "Newest" })).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = renderRow();
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
