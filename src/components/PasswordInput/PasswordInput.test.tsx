import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { PasswordInput } from "./PasswordInput";

describe("PasswordInput", () => {
  describe("API", () => {
    it("applies custom className to container", () => {
      const { container } = render(<PasswordInput className="custom-class" />);
      const wrapper = container.querySelector('[class*="custom-class"]') as HTMLElement;
      expect(wrapper).toHaveClass("custom-class");
    });

    it("forwards ref to input element", () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<PasswordInput ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.tagName.toLowerCase()).toBe("input");
    });

    it("associates label with input using htmlFor", () => {
      render(<PasswordInput id="test-input" label="Password" />);
      const input = screen.getByLabelText("Password");
      const label = input.closest("label");
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute("for", "test-input");
      expect(input).toHaveAttribute("id", "test-input");
    });

    it("generates unique id when not provided", () => {
      render(<PasswordInput label="Password" />);
      const input = screen.getByLabelText("Password");
      expect(input).toHaveAttribute("id");
      expect(input.getAttribute("id")).toBeTruthy();
    });

    it("applies fullWidth className when fullWidth is true", () => {
      const { container } = render(<PasswordInput fullWidth />);
      const wrapper = container.querySelector('[class*="w-full"]') as HTMLElement;
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("sizes", () => {
    it("applies size 48 by default", () => {
      const { container } = render(<PasswordInput />);
      const inputContainer = container.querySelector('[class*="h-12"]');
      expect(inputContainer).toBeInTheDocument();
    });

    it("applies size 40 when specified", () => {
      const { container } = render(<PasswordInput size="40" />);
      const inputContainer = container.querySelector('[class*="h-10"]');
      expect(inputContainer).toBeInTheDocument();
    });

    it("applies size 32 when specified", () => {
      const { container } = render(<PasswordInput size="32" />);
      const inputContainer = container.querySelector('[class*="h-8"]');
      expect(inputContainer).toBeInTheDocument();
    });
  });

  describe("password visibility toggle", () => {
    it("renders with type password by default", () => {
      render(<PasswordInput />);
      const input = screen.getByLabelText("Password input");
      expect(input).toHaveAttribute("type", "password");
    });

    it("toggles password visibility when button is clicked", async () => {
      const user = userEvent.setup();
      render(<PasswordInput />);
      const input = screen.getByLabelText("Password input");
      const toggleButton = screen.getByRole("button", { name: "Show password" });

      expect(input).toHaveAttribute("type", "password");

      await user.click(toggleButton);
      expect(input).toHaveAttribute("type", "text");
      expect(screen.getByRole("button", { name: "Hide password" })).toBeInTheDocument();

      await user.click(toggleButton);
      expect(input).toHaveAttribute("type", "password");
      expect(screen.getByRole("button", { name: "Show password" })).toBeInTheDocument();
    });

    it("toggle button has tabIndex -1", () => {
      render(<PasswordInput />);
      const toggleButton = screen.getByRole("button", { name: "Show password" });
      expect(toggleButton).toHaveAttribute("tabIndex", "-1");
    });

    it("disables toggle button when input is disabled", () => {
      render(<PasswordInput disabled />);
      const toggleButton = screen.getByRole("button", { name: "Show password" });
      expect(toggleButton).toBeDisabled();
    });
  });

  describe("label and helper text", () => {
    it("renders without label text", () => {
      render(<PasswordInput placeholder="No label" />);
      const input = screen.getByPlaceholderText("No label");
      expect(input).toBeInTheDocument();
      const label = input.closest("label");
      expect(label).toBeInTheDocument();
      const labelSpan = label?.querySelector("span");
      expect(labelSpan).toBeNull();
    });

    it("renders with label", () => {
      render(<PasswordInput label="Password" />);
      expect(screen.getByText("Password")).toBeInTheDocument();
    });

    it("renders with helper text", () => {
      render(<PasswordInput helperText="Enter your password" />);
      expect(screen.getByText("Enter your password")).toBeInTheDocument();
    });

    it("associates helper text with input using aria-describedby", () => {
      render(<PasswordInput id="test-input" helperText="Helper description" />);
      const input = screen.getByLabelText("Password input");
      const helperText = screen.getByText("Helper description");

      expect(helperText).toHaveAttribute("id", "test-input-helper");
      expect(input).toHaveAttribute("aria-describedby", "test-input-helper");
    });

    it("does not set aria-describedby when helperText is not provided", () => {
      render(<PasswordInput />);
      const input = screen.getByLabelText("Password input");
      expect(input).not.toHaveAttribute("aria-describedby");
    });
  });

  describe("error state", () => {
    it("applies error state styling", () => {
      const { container } = render(<PasswordInput error />);
      const inputContainer = container.querySelector('div[class*="border-error-500"]');
      expect(inputContainer).toBeInTheDocument();
    });

    it("sets aria-invalid when error is true", () => {
      render(<PasswordInput error />);
      const input = screen.getByLabelText("Password input");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("displays error message when provided", () => {
      render(<PasswordInput error errorMessage="Password is required" />);
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });

    it("error message overrides helper text", () => {
      render(<PasswordInput error helperText="Helper text" errorMessage="Error message" />);
      expect(screen.getByText("Error message")).toBeInTheDocument();
      expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
    });

    it("shows helper text when error is true but no errorMessage", () => {
      render(<PasswordInput error helperText="Helper text" />);
      expect(screen.getByText("Helper text")).toBeInTheDocument();
    });

    it("applies error styling to helper text when error is true", () => {
      render(<PasswordInput error helperText="Helper text" />);
      const helperText = screen.getByText("Helper text");
      expect(helperText).toHaveClass("text-error-500");
    });

    it("supports disabled state", () => {
      render(<PasswordInput disabled />);
      const input = screen.getByLabelText("Password input");
      expect(input).toBeDisabled();
    });
  });

  describe("icons", () => {
    it("renders left icon", () => {
      render(<PasswordInput leftIcon={<span data-testid="left-icon">🔒</span>} />);
      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    });

    it("always renders toggle button as right icon", () => {
      render(<PasswordInput />);
      const toggleButton = screen.getByRole("button", { name: "Show password" });
      expect(toggleButton).toBeInTheDocument();
    });
  });

  describe("user interaction", () => {
    it("allows typing in the input", async () => {
      const user = userEvent.setup();
      render(<PasswordInput />);
      const input = screen.getByLabelText("Password input");
      await user.type(input, "secret");
      expect(input).toHaveValue("secret");
    });

    it("calls onChange when value changes", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<PasswordInput onChange={onChange} />);
      const input = screen.getByLabelText("Password input");
      await user.type(input, "s");
      expect(onChange).toHaveBeenCalled();
    });

    it("supports controlled input", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<PasswordInput value="test" onChange={onChange} />);
      const input = screen.getByLabelText("Password input");
      expect(input).toHaveValue("test");
      await user.type(input, "H");
      expect(onChange).toHaveBeenCalled();
    });

    it("focuses input when label area is clicked", async () => {
      const user = userEvent.setup();
      render(<PasswordInput id="test-input" label="Password" />);
      const input = screen.getByLabelText("Password");
      const label = input.closest("label");

      expect(label).toBeInTheDocument();
      if (label) {
        await user.click(label);
        expect(input).toHaveFocus();
      }
    });

    it("maintains input value when toggling visibility", async () => {
      const user = userEvent.setup();
      render(<PasswordInput />);
      const input = screen.getByLabelText("Password input");
      const toggleButton = screen.getByRole("button", { name: "Show password" });

      await user.type(input, "secret");
      expect(input).toHaveValue("secret");

      await user.click(toggleButton);
      expect(input).toHaveValue("secret");
      expect(input).toHaveAttribute("type", "text");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<PasswordInput label="Password" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("applies default aria-label when no label is provided", () => {
      render(<PasswordInput />);
      const input = screen.getByLabelText("Password input");
      expect(input).toHaveAttribute("aria-label", "Password input");
    });

    it("does not apply aria-label when label is provided", () => {
      render(<PasswordInput label="Password" />);
      const input = screen.getByLabelText("Password");
      expect(input).not.toHaveAttribute("aria-label");
    });

    it("allows custom aria-label to override default", () => {
      render(<PasswordInput aria-label="Custom password field" />);
      const input = screen.getByLabelText("Custom password field");
      expect(input).toHaveAttribute("aria-label", "Custom password field");
    });

    it("toggle button has accessible label", () => {
      render(<PasswordInput />);
      const toggleButton = screen.getByRole("button", { name: "Show password" });
      expect(toggleButton).toHaveAttribute("aria-label", "Show password");
    });
  });
});
