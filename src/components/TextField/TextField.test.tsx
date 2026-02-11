import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { TextField } from "./TextField";

describe("TextField", () => {
  describe("API", () => {
    it("applies custom className to container", () => {
      const { container } = render(<TextField className="custom-class" />);
      const wrapper = container.querySelector('[class*="custom-class"]') as HTMLElement;
      expect(wrapper).toHaveClass("custom-class");
    });

    it("forwards ref to input element", () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<TextField ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.tagName.toLowerCase()).toBe("input");
    });

    it("associates label with input using htmlFor", () => {
      render(<TextField id="test-input" label="Test Label" />);
      const input = screen.getByRole("textbox");
      const label = input.closest("label");
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute("for", "test-input");
      expect(input).toHaveAttribute("id", "test-input");
      expect(screen.getByText("Test Label")).toBeInTheDocument();
    });

    it("generates unique id when not provided", () => {
      render(<TextField label="Test" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("id");
      expect(input.getAttribute("id")).toBeTruthy();
    });

    it("applies fullWidth className when fullWidth is true", () => {
      const { container } = render(<TextField fullWidth />);
      const wrapper = container.querySelector('[class*="w-full"]') as HTMLElement;
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("sizes", () => {
    it("applies size 48 by default", () => {
      const { container } = render(<TextField />);
      const inputContainer = container.querySelector('[class*="h-12"]');
      expect(inputContainer).toBeInTheDocument();
    });

    it("applies size 40 when specified", () => {
      const { container } = render(<TextField size="40" />);
      const inputContainer = container.querySelector('[class*="h-10"]');
      expect(inputContainer).toBeInTheDocument();
    });

    it("applies size 32 when specified", () => {
      const { container } = render(<TextField size="32" />);
      const inputContainer = container.querySelector('[class*="h-8"]');
      expect(inputContainer).toBeInTheDocument();
    });
  });

  describe("label and helper text", () => {
    it("renders without label text", () => {
      render(<TextField placeholder="No label" />);
      const input = screen.getByPlaceholderText("No label");
      expect(input).toBeInTheDocument();
      const label = input.closest("label");
      expect(label).toBeInTheDocument();
      const labelSpan = label?.querySelector("span");
      expect(labelSpan).toBeNull();
    });

    it("renders with label", () => {
      render(<TextField label="Username" />);
      expect(screen.getByText("Username")).toBeInTheDocument();
    });

    it("renders with helper text", () => {
      render(<TextField helperText="Enter your username" />);
      expect(screen.getByText("Enter your username")).toBeInTheDocument();
    });

    it("associates helper text with input using aria-describedby", () => {
      render(<TextField id="test-input" helperText="Helper description" />);
      const input = screen.getByRole("textbox");
      const helperText = screen.getByText("Helper description");

      expect(helperText).toHaveAttribute("id", "test-input-helper");
      expect(input).toHaveAttribute("aria-describedby", "test-input-helper");
    });

    it("does not set aria-describedby when helperText is not provided", () => {
      render(<TextField />);
      const input = screen.getByRole("textbox");
      expect(input).not.toHaveAttribute("aria-describedby");
    });
  });

  describe("error state", () => {
    it("applies error state styling", () => {
      const { container } = render(<TextField error />);
      const inputContainer = container.querySelector('div[class*="border-error-500"]');
      expect(inputContainer).toBeInTheDocument();
    });

    it("sets aria-invalid when error is true", () => {
      render(<TextField error />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("displays error message when provided", () => {
      render(<TextField error errorMessage="This field is required" />);
      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });

    it("error message overrides helper text", () => {
      render(<TextField error helperText="Helper text" errorMessage="Error message" />);
      expect(screen.getByText("Error message")).toBeInTheDocument();
      expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
    });

    it("shows helper text when error is true but no errorMessage", () => {
      render(<TextField error helperText="Helper text" />);
      expect(screen.getByText("Helper text")).toBeInTheDocument();
    });

    it("applies error styling to helper text when error is true", () => {
      render(<TextField error helperText="Helper text" />);
      const helperText = screen.getByText("Helper text");
      expect(helperText).toHaveClass("text-error-500");
    });

    it("supports disabled state", () => {
      render(<TextField disabled />);
      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });
  });

  describe("icons", () => {
    it("renders left icon", () => {
      render(<TextField leftIcon={<span data-testid="left-icon">🔍</span>} />);
      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    });

    it("renders right icon", () => {
      render(<TextField rightIcon={<span data-testid="right-icon">👁️</span>} />);
      expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    });

    it("renders both left and right icons", () => {
      render(
        <TextField
          leftIcon={<span data-testid="left-icon">🔍</span>}
          rightIcon={<span data-testid="right-icon">👁️</span>}
        />,
      );
      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
      expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    });
  });

  describe("user interaction", () => {
    it("allows typing in the input", async () => {
      const user = userEvent.setup();
      render(<TextField />);
      const input = screen.getByRole("textbox");
      await user.type(input, "Hello");
      expect(input).toHaveValue("Hello");
    });

    it("calls onChange when value changes", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TextField onChange={onChange} />);
      const input = screen.getByRole("textbox");
      await user.type(input, "H");
      expect(onChange).toHaveBeenCalled();
    });

    it("supports controlled input", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TextField value="test" onChange={onChange} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("test");
      await user.type(input, "H");
      expect(onChange).toHaveBeenCalled();
    });

    it("focuses input when label area is clicked", async () => {
      const user = userEvent.setup();
      render(<TextField id="test-input" />);
      const input = screen.getByRole("textbox");
      const label = input.closest("label");

      expect(label).toBeInTheDocument();
      if (label) {
        await user.click(label);
        expect(input).toHaveFocus();
      }
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<TextField label="Accessible Input" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has proper role", () => {
      render(<TextField />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("applies default aria-label when no label is provided", () => {
      render(<TextField />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-label", "Text field");
    });

    it("does not apply aria-label when label is provided", () => {
      render(<TextField label="Username" />);
      const input = screen.getByRole("textbox");
      expect(input).not.toHaveAttribute("aria-label");
    });

    it("allows custom aria-label to override default", () => {
      render(<TextField aria-label="Custom label" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-label", "Custom label");
    });
  });
});
