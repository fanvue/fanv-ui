import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  describe("API", () => {
    it("forwards ref to the native input (for react-hook-form register)", () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Checkbox ref={ref} name="agree" />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.getAttribute("type")).toBe("checkbox");
      expect(ref.current?.getAttribute("name")).toBe("agree");
    });

    it("applies custom className", () => {
      const { container } = render(<Checkbox className="custom-class" />);
      const checkbox = container.querySelector('[data-testid="checkbox"]');
      expect(checkbox).toHaveClass("custom-class");
    });

    it("can be controlled", () => {
      const { rerender } = render(<Checkbox checked={false} />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();

      rerender(<Checkbox checked={true} />);
      expect(checkbox).toBeChecked();
    });

    it("works uncontrolled when checked is not passed", async () => {
      const user = userEvent.setup();
      render(<Checkbox label="Uncontrolled" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it("calls onCheckedChange when toggled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Checkbox onCheckedChange={handleChange} />);
      await user.click(screen.getByRole("checkbox"));
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it("supports indeterminate state", () => {
      render(<Checkbox checked="indeterminate" />);
      expect(screen.getByRole("checkbox")).toHaveAttribute("data-state", "indeterminate");
    });

    it("disables interaction when disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Checkbox disabled onCheckedChange={handleChange} />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeDisabled();
      await user.click(checkbox);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<Checkbox label="Accessible checkbox" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("links label with checkbox via htmlFor", () => {
      render(<Checkbox label="Click me" />);
      const label = screen.getByText("Click me");
      const checkbox = screen.getByRole("checkbox");

      expect(label).toHaveAttribute("for");
      expect(checkbox).toHaveAttribute("id");
      expect(label.getAttribute("for")).toBe(checkbox.getAttribute("id"));
    });

    it("associates helper text with checkbox via aria-describedby", () => {
      render(<Checkbox label="Terms" helperText="Read the terms" />);
      const checkbox = screen.getByRole("checkbox");
      const helperText = screen.getByText("Read the terms");

      expect(checkbox).toHaveAttribute("aria-describedby");
      expect(helperText).toHaveAttribute("id");
      expect(checkbox.getAttribute("aria-describedby")).toBe(helperText.getAttribute("id"));
    });

    it("is keyboard accessible", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Checkbox label="Keyboard test" onCheckedChange={handleChange} />);
      const checkbox = screen.getByRole("checkbox");

      checkbox.focus();
      expect(checkbox).toHaveFocus();

      await user.keyboard(" ");
      expect(handleChange).toHaveBeenCalledWith(true);
    });
  });
});
