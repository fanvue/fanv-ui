import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { SearchField } from "./SearchField";

describe("SearchField", () => {
  describe("API", () => {
    it("applies custom className", () => {
      const { container } = render(<SearchField className="custom" placeholder="Search" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("custom");
    });

    it("renders with label", () => {
      render(<SearchField label="Search" />);
      expect(screen.getByLabelText("Search")).toBeInTheDocument();
    });

    it("renders with helper text", () => {
      render(<SearchField helperText="Enter search terms" placeholder="Search" />);
      expect(screen.getByText("Enter search terms")).toBeInTheDocument();
    });

    it("displays error message when error is true", () => {
      render(
        <SearchField
          error
          errorMessage="Search failed"
          helperText="Normal helper"
          placeholder="Search"
        />,
      );
      expect(screen.getByText("Search failed")).toBeInTheDocument();
      expect(screen.queryByText("Normal helper")).not.toBeInTheDocument();
    });

    it("renders search icon", () => {
      render(<SearchField placeholder="Search" />);
      const input = screen.getByPlaceholderText("Search");
      const container = input.closest("div");
      expect(container?.querySelector("svg")).toBeInTheDocument();
    });

    it("shows clear button when onClear is provided and field has value", () => {
      render(
        <SearchField value="test" onChange={vi.fn()} onClear={vi.fn()} placeholder="Search" />,
      );
      expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
    });

    it("hides clear button when field is empty", () => {
      render(<SearchField value="" onChange={vi.fn()} onClear={vi.fn()} placeholder="Search" />);
      expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();
    });

    it("hides clear button when onClear is not provided", () => {
      render(<SearchField value="test" onChange={vi.fn()} placeholder="Search" />);
      expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();
    });

    it("calls onClear when clear button is clicked", async () => {
      const user = userEvent.setup();
      const onClear = vi.fn();
      render(
        <SearchField value="test" onChange={vi.fn()} onClear={onClear} placeholder="Search" />,
      );

      const clearButton = screen.getByLabelText("Clear search");
      await user.click(clearButton);

      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it("disables clear button when field is disabled", () => {
      render(
        <SearchField
          value="test"
          onChange={vi.fn()}
          onClear={vi.fn()}
          disabled
          placeholder="Search"
        />,
      );
      const clearButton = screen.getByLabelText("Clear search");
      expect(clearButton).toBeDisabled();
    });

    it("sets type to search", () => {
      render(<SearchField placeholder="Search" />);
      const input = screen.getByPlaceholderText("Search");
      expect(input).toHaveAttribute("type", "search");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<SearchField label="Search" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations with clear button", async () => {
      const { container } = render(
        <SearchField label="Search" value="test" onChange={vi.fn()} onClear={vi.fn()} />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("provides accessible name via label", () => {
      render(<SearchField label="Search products" />);
      expect(screen.getByLabelText("Search products")).toBeInTheDocument();
    });

    it("provides default accessible name when no label is provided", () => {
      render(<SearchField placeholder="Search" />);
      const input = screen.getByPlaceholderText("Search");
      expect(input).toHaveAttribute("aria-label", "Search field");
    });
  });
});
