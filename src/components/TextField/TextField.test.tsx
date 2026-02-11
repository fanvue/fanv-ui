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
      const label = screen.getByText("Test Label");
      const input = screen.getByLabelText("Test Label");
      expect(label).toHaveAttribute("for", "test-input");
      expect(input).toHaveAttribute("id", "test-input");
    });

    it("generates unique id when not provided", () => {
      render(<TextField label="Test" />);
      const input = screen.getByLabelText("Test");
      expect(input).toHaveAttribute("id");
      expect(input.getAttribute("id")).toBeTruthy();
    });
  });

  describe("label and helper text", () => {
    it("renders without label", () => {
      render(<TextField placeholder="No label" />);
      const input = screen.getByPlaceholderText("No label");
      expect(input).toBeInTheDocument();
      expect(screen.queryByRole("label")).not.toBeInTheDocument();
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

  describe("states", () => {
    it("applies error state styling", () => {
      const { container } = render(<TextField state="error" />);
      const inputContainer = container.querySelector('div[class*="border-error-500"]');
      expect(inputContainer).toBeInTheDocument();
    });

    it("sets aria-invalid when state is error", () => {
      render(<TextField state="error" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("applies error styling to helper text", () => {
      render(<TextField state="error" helperText="Error message" />);
      const helperText = screen.getByText("Error message");
      expect(helperText).toHaveClass("text-error-500");
    });

    it("shows validated icon when validated is true", () => {
      const { container } = render(<TextField validated />);
      const checkIcon = container.querySelector('svg[aria-hidden="true"]');
      expect(checkIcon).toBeInTheDocument();
    });

    it("supports disabled state", () => {
      render(<TextField disabled />);
      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });
  });

  describe("icons and prefix", () => {
    it("renders left icon", () => {
      render(<TextField leftIcon={<span data-testid="left-icon">🔍</span>} />);
      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    });

    it("renders right icon", () => {
      render(<TextField rightIcon={<span data-testid="right-icon">👁️</span>} />);
      expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    });

    it("renders prefix", () => {
      render(<TextField prefix="$" />);
      expect(screen.getByText("$")).toBeInTheDocument();
    });

    it("does not render right icon when validated is true", () => {
      render(<TextField validated rightIcon={<span data-testid="right-icon">👁️</span>} />);
      expect(screen.queryByTestId("right-icon")).not.toBeInTheDocument();
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
  });
});
