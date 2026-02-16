import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { TextArea } from "./TextArea";

describe("TextArea", () => {
  describe("API", () => {
    it("applies custom className", () => {
      const { container } = render(<TextArea label="Test" className="custom" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("custom");
    });

    it("renders label when provided", () => {
      render(<TextArea label="Description" />);
      expect(screen.getByText("Description")).toBeInTheDocument();
    });

    it("renders helper text when provided", () => {
      render(<TextArea label="Test" helperText="Helper text" />);
      expect(screen.getByText("Helper text")).toBeInTheDocument();
    });

    it("renders error message instead of helper text when error is true", () => {
      render(<TextArea label="Test" helperText="Helper text" error errorMessage="Error message" />);
      expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
      expect(screen.getByText("Error message")).toBeInTheDocument();
    });

    it("applies fullWidth className when fullWidth is true", () => {
      const { container } = render(<TextArea label="Test" fullWidth />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("w-full");
    });

    it("forwards ref to textarea element", () => {
      const ref = vi.fn();
      render(<TextArea label="Test" ref={ref} />);
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLTextAreaElement));
    });

    it("applies disabled attribute", () => {
      render(<TextArea label="Test" disabled />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeDisabled();
    });

    it("applies custom id", () => {
      render(<TextArea label="Test" id="custom-id" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("id", "custom-id");
    });

    it("generates unique id when not provided", () => {
      render(
        <>
          <TextArea label="First" />
          <TextArea label="Second" />
        </>,
      );
      const textareas = screen.getAllByRole("textbox");
      expect(textareas[0]?.id).toBeTruthy();
      expect(textareas[1]?.id).toBeTruthy();
      expect(textareas[0]?.id).not.toBe(textareas[1]?.id);
    });

    it("links label to textarea via htmlFor", () => {
      render(<TextArea label="Test" />);
      const label = screen.getByText("Test");
      const textarea = screen.getByRole("textbox");
      expect(label).toHaveAttribute("for", textarea.id);
    });

    it("links helper text via aria-describedby", () => {
      render(<TextArea label="Test" helperText="Helper" />);
      const textarea = screen.getByRole("textbox");
      const helperText = screen.getByText("Helper");
      expect(textarea).toHaveAttribute("aria-describedby", helperText.id);
    });

    it("sets aria-invalid when error is true", () => {
      render(<TextArea label="Test" error />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("validated state", () => {
    it("shows validation icon when validated is true", () => {
      const { container } = render(<TextArea label="Test" validated defaultValue="Valid text" />);
      const icon = container.querySelector(".text-success-500");
      expect(icon).toBeInTheDocument();
    });

    it("does not show validation icon when validated is false", () => {
      const { container } = render(<TextArea label="Test" defaultValue="Text" />);
      const icon = container.querySelector(".text-success-500");
      expect(icon).not.toBeInTheDocument();
    });

    it("hides validation icon when clear button is visible", () => {
      const { container } = render(
        <TextArea label="Test" validated showClearButton value="Text" />,
      );
      const validationIcon = container.querySelector(".text-success-500");
      const clearButton = screen.getByLabelText("Clear text");
      expect(clearButton).toBeInTheDocument();
      expect(validationIcon).not.toBeInTheDocument();
    });
  });

  describe("clear button", () => {
    it("does not show clear button by default", () => {
      render(<TextArea label="Test" value="Some text" />);
      expect(screen.queryByLabelText("Clear text")).not.toBeInTheDocument();
    });

    it("shows clear button when showClearButton is true and has value", () => {
      render(<TextArea label="Test" showClearButton value="Some text" />);
      expect(screen.getByLabelText("Clear text")).toBeInTheDocument();
    });

    it("does not show clear button when value is empty", () => {
      render(<TextArea label="Test" showClearButton value="" />);
      expect(screen.queryByLabelText("Clear text")).not.toBeInTheDocument();
    });

    it("does not show clear button when disabled", () => {
      render(<TextArea label="Test" showClearButton value="Text" disabled />);
      expect(screen.queryByLabelText("Clear text")).not.toBeInTheDocument();
    });

    it("calls onClear when clear button is clicked", async () => {
      const user = userEvent.setup();
      const onClear = vi.fn();
      render(<TextArea label="Test" showClearButton value="Text" onClear={onClear} />);

      const clearButton = screen.getByLabelText("Clear text");
      await user.click(clearButton);

      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it("calls onChange with empty value when clear button is clicked", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TextArea label="Test" showClearButton value="Text" onChange={onChange} />);

      const clearButton = screen.getByLabelText("Clear text");
      await user.click(clearButton);

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: "" }),
        }),
      );
    });
  });

  describe("size variants", () => {
    it('applies correct classes for size="48"', () => {
      render(<TextArea label="Test" size="48" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("py-3");
    });

    it('applies correct classes for size="40"', () => {
      render(<TextArea label="Test" size="40" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("py-2");
    });

    it('applies correct classes for size="32"', () => {
      render(<TextArea label="Test" size="32" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("py-2");
    });
  });

  describe("rows props", () => {
    it("applies minRows as rows attribute", () => {
      render(<TextArea label="Test" minRows={5} />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("rows", "5");
    });

    it("does not apply rows attribute when minRows is not provided", () => {
      render(<TextArea label="Test" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).not.toHaveAttribute("rows");
    });

    it("applies maxHeight style when maxRows is provided", () => {
      render(<TextArea label="Test" maxRows={10} size="48" />);
      const textarea = screen.getByRole("textbox");
      // size 48: line-height 24px * 10 rows + padding 12px * 2 = 264px
      expect(textarea).toHaveAttribute("style", "max-height: 264px;");
    });

    it("calculates maxHeight correctly for size 40", () => {
      render(<TextArea label="Test" maxRows={8} size="40" />);
      const textarea = screen.getByRole("textbox");
      // size 40: line-height 24px * 8 rows + padding 8px * 2 = 208px
      expect(textarea).toHaveAttribute("style", "max-height: 208px;");
    });

    it("calculates maxHeight correctly for size 32", () => {
      render(<TextArea label="Test" maxRows={6} size="32" />);
      const textarea = screen.getByRole("textbox");
      // size 32: line-height 20px * 6 rows + padding 8px * 2 = 136px
      expect(textarea).toHaveAttribute("style", "max-height: 136px;");
    });

    it("does not apply style when maxRows is not provided", () => {
      render(<TextArea label="Test" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).not.toHaveAttribute("style");
    });

    it("removes default min-height when minRows is provided", () => {
      render(<TextArea label="Test" minRows={3} />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).not.toHaveClass("min-h-[80px]");
    });

    it("keeps default min-height when minRows is not provided", () => {
      render(<TextArea label="Test" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("min-h-[80px]");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<TextArea label="Description" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations with error", async () => {
      const { container } = render(<TextArea label="Description" error errorMessage="Required" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations with clear button", async () => {
      const { container } = render(<TextArea label="Description" showClearButton value="Text" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("warns in development when no accessible name is provided", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<TextArea />);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("TextArea: no accessible name provided"),
      );
      consoleSpy.mockRestore();
    });

    it("does not warn when label is provided", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<TextArea label="Test" />);
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("does not warn when aria-label is provided", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<TextArea aria-label="Test" />);
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
