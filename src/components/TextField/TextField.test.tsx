import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { EyeIcon } from "../Icons/EyeIcon";
import { HomeIcon } from "../Icons/HomeIcon";
import { InfoCircleIcon } from "../Icons/InfoCircleIcon";
import { TextField } from "./TextField";

describe("TextField", () => {
  describe("API", () => {
    it("applies custom className to container", () => {
      const { container } = render(<TextField aria-label="Test" className="custom-class" />);
      const wrapper = container.querySelector('[class*="custom-class"]') as HTMLElement;
      expect(wrapper).toHaveClass("custom-class");
    });

    it("forwards ref to input element", () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<TextField aria-label="Test" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.tagName.toLowerCase()).toBe("input");
    });

    it("associates label with input using htmlFor", () => {
      render(<TextField id="test-input" label="Test Label" />);
      const input = screen.getByRole("textbox");
      const label = screen.getByText("Test Label");
      expect(label.tagName.toLowerCase()).toBe("label");
      expect(label).toHaveAttribute("for", "test-input");
      expect(input).toHaveAttribute("id", "test-input");
    });

    it("generates unique id when not provided", () => {
      render(<TextField label="Test" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("id");
      expect(input.getAttribute("id")).toBeTruthy();
    });

    it("applies fullWidth className when fullWidth is true", () => {
      const { container } = render(<TextField aria-label="Test" fullWidth />);
      const wrapper = container.querySelector('[class*="w-full"]') as HTMLElement;
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("sizes", () => {
    it("applies size 48 by default", () => {
      const { container } = render(<TextField aria-label="Test" />);
      const inputContainer = container.querySelector('[class*="h-12"]');
      expect(inputContainer).toBeInTheDocument();
    });

    it("applies size 40 when specified", () => {
      const { container } = render(<TextField aria-label="Test" size="40" />);
      const inputContainer = container.querySelector('[class*="h-10"]');
      expect(inputContainer).toBeInTheDocument();
    });

    it("applies size 32 when specified", () => {
      const { container } = render(<TextField aria-label="Test" size="32" />);
      const inputContainer = container.querySelector('[class*="h-8"]');
      expect(inputContainer).toBeInTheDocument();
    });
  });

  describe("label and helper text", () => {
    it("renders without label text when no label prop", () => {
      const { container } = render(<TextField aria-label="Test" placeholder="No label" />);
      const input = screen.getByPlaceholderText("No label");
      expect(input).toBeInTheDocument();
      const textLabel = container.querySelector("label.typography-caption-semibold");
      expect(textLabel).toBeNull();
    });

    it("renders with label", () => {
      render(<TextField label="Username" />);
      expect(screen.getByText("Username")).toBeInTheDocument();
    });

    it("renders with helper text", () => {
      render(<TextField aria-label="Test" helperText="Enter your username" />);
      expect(screen.getByText("Enter your username")).toBeInTheDocument();
    });

    it("associates helper text with input using aria-describedby", () => {
      render(<TextField id="test-input" aria-label="Test" helperText="Helper description" />);
      const input = screen.getByRole("textbox");
      const helperText = screen.getByText("Helper description");

      expect(helperText).toHaveAttribute("id", "test-input-helper");
      expect(input).toHaveAttribute("aria-describedby", "test-input-helper");
    });

    it("does not set aria-describedby when helperText is not provided", () => {
      render(<TextField aria-label="Test" />);
      const input = screen.getByRole("textbox");
      expect(input).not.toHaveAttribute("aria-describedby");
    });
  });

  describe("error state", () => {
    it("applies error state styling", () => {
      const { container } = render(<TextField aria-label="Test" error />);
      const inputContainer = container.querySelector('[class*="border-error-500"]');
      expect(inputContainer).toBeInTheDocument();
    });

    it("sets aria-invalid when error is true", () => {
      render(<TextField aria-label="Test" error />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("displays error message when provided", () => {
      render(<TextField aria-label="Test" error errorMessage="This field is required" />);
      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });

    it("error message overrides helper text", () => {
      render(
        <TextField aria-label="Test" error helperText="Helper text" errorMessage="Error message" />,
      );
      expect(screen.getByText("Error message")).toBeInTheDocument();
      expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
    });

    it("shows helper text when error is true but no errorMessage", () => {
      render(<TextField aria-label="Test" error helperText="Helper text" />);
      expect(screen.getByText("Helper text")).toBeInTheDocument();
    });

    it("applies error styling to helper text when error is true", () => {
      render(<TextField aria-label="Test" error helperText="Helper text" />);
      const helperText = screen.getByText("Helper text");
      expect(helperText).toHaveClass("text-error-500");
    });

    it("supports disabled state", () => {
      render(<TextField aria-label="Test" disabled />);
      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });
  });

  describe("icons", () => {
    it("renders left icon", () => {
      const { container } = render(<TextField aria-label="Test" leftIcon={<HomeIcon />} />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("renders right icon", () => {
      const { container } = render(<TextField aria-label="Test" rightIcon={<EyeIcon />} />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("renders both left and right icons", () => {
      const { container } = render(
        <TextField aria-label="Test" leftIcon={<HomeIcon />} rightIcon={<InfoCircleIcon />} />,
      );
      const svgs = container.querySelectorAll("svg");
      expect(svgs).toHaveLength(2);
    });
  });

  describe("user interaction", () => {
    it("allows typing in the input", async () => {
      const user = userEvent.setup();
      render(<TextField aria-label="Test" />);
      const input = screen.getByRole("textbox");
      await user.type(input, "Hello");
      expect(input).toHaveValue("Hello");
    });

    it("calls onChange when value changes", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TextField aria-label="Test" onChange={onChange} />);
      const input = screen.getByRole("textbox");
      await user.type(input, "H");
      expect(onChange).toHaveBeenCalled();
    });

    it("supports controlled input", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TextField aria-label="Test" value="test" onChange={onChange} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("test");
      await user.type(input, "H");
      expect(onChange).toHaveBeenCalled();
    });

    it("focuses input when clicking the label", async () => {
      const user = userEvent.setup();
      render(<TextField label="Test" />);
      const input = screen.getByRole("textbox");
      const label = screen.getByText("Test");

      await user.click(label);
      expect(input).toHaveFocus();
    });
  });

  describe("data attributes", () => {
    it("sets data-disabled on root when disabled", () => {
      const { container } = render(<TextField aria-label="Test" disabled />);
      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-disabled");
    });

    it("does not set data-disabled when not disabled", () => {
      const { container } = render(<TextField aria-label="Test" />);
      const root = container.firstElementChild;
      expect(root).not.toHaveAttribute("data-disabled");
    });

    it("sets data-error on root when error is true", () => {
      const { container } = render(<TextField aria-label="Test" error />);
      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-error");
    });

    it("does not set data-error when error is false", () => {
      const { container } = render(<TextField aria-label="Test" />);
      const root = container.firstElementChild;
      expect(root).not.toHaveAttribute("data-error");
    });
  });

  describe("border stability", () => {
    it("always renders a border class on the input container", () => {
      const { container } = render(<TextField aria-label="Test" />);
      const inputContainer = container.querySelector('[class*="border"]');
      expect(inputContainer).toBeInTheDocument();
      expect(inputContainer).toHaveClass("border");
      expect(inputContainer).toHaveClass("border-transparent");
    });

    it("renders border-error-500 instead of border-transparent when error", () => {
      const { container } = render(<TextField aria-label="Test" error />);
      const inputContainer = container.querySelector('[class*="border-error-500"]');
      expect(inputContainer).toBeInTheDocument();
      expect(inputContainer).toHaveClass("border");
      expect(inputContainer).not.toHaveClass("border-transparent");
    });

    it("renders focus ring class on input container", () => {
      const { container } = render(<TextField aria-label="Test" />);
      const inputContainer = container.querySelector('[class*="has-focus-visible"]');
      expect(inputContainer).toBeInTheDocument();
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
      const { container } = render(<TextField label="Accessible Input" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with aria-label instead of label", async () => {
      const { container } = render(<TextField aria-label="Search" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has proper role", () => {
      render(<TextField label="Test" />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("does not render duplicate labels for the same input", () => {
      const { container } = render(<TextField label="Username" />);
      const labels = container.querySelectorAll("label");
      expect(labels).toHaveLength(1);
    });

    it("allows custom aria-label via props", () => {
      render(<TextField aria-label="Custom label" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-label", "Custom label");
    });

    it("warns in dev when no accessible name is provided", () => {
      render(<TextField />);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("no accessible name provided"),
      );
    });

    it("does not warn when label is provided", () => {
      render(<TextField label="Username" />);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it("does not warn when aria-label is provided", () => {
      render(<TextField aria-label="Search" />);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it("does not warn when aria-labelledby is provided", () => {
      render(<TextField aria-labelledby="external-label" />);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });
});
