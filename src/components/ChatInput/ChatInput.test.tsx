import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ChatInput } from "./ChatInput";

const SonnetIcon = () => <svg data-testid="sonnet-icon" />;
const OpusIcon = () => <svg data-testid="opus-icon" />;

const MODEL_OPTIONS = [
  { value: "sonnet", label: "Sonnet 4.6", icon: <SonnetIcon /> },
  { value: "opus", label: "Opus 4.6", icon: <OpusIcon /> },
];

describe("ChatInput", () => {
  describe("API", () => {
    it("applies custom className", () => {
      const { container } = render(<ChatInput className="custom-class" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("custom-class");
    });

    it("renders placeholder text", () => {
      render(<ChatInput placeholder="Type a message..." />);
      expect(screen.getByPlaceholderText("Type a message...")).toBeInTheDocument();
    });

    it("forwards ref to textarea element", () => {
      const ref = vi.fn();
      render(<ChatInput ref={ref} placeholder="Test" />);
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLTextAreaElement));
    });

    it("applies disabled attribute to textarea", () => {
      render(<ChatInput disabled placeholder="Test" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeDisabled();
    });

    it("applies maxLength attribute", () => {
      render(<ChatInput maxLength={100} placeholder="Test" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("maxLength", "100");
    });

    it("uses aria-label when provided", () => {
      render(<ChatInput aria-label="Chat input" />);
      expect(screen.getByLabelText("Chat input")).toBeInTheDocument();
    });

    it("falls back to placeholder for aria-label", () => {
      render(<ChatInput placeholder="Type here" />);
      expect(screen.getByLabelText("Type here")).toBeInTheDocument();
    });
  });

  describe("controlled mode", () => {
    it("displays the controlled value", () => {
      render(<ChatInput value="Hello world" onChange={() => {}} />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("Hello world");
    });

    it("calls onChange when typing", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<ChatInput value="" onChange={handleChange} />);
      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "a");
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe("uncontrolled mode", () => {
    it("allows typing without value prop", async () => {
      const user = userEvent.setup();
      render(<ChatInput placeholder="Test" />);
      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Hello");
      expect(textarea).toHaveValue("Hello");
    });
  });

  describe("submit", () => {
    it("calls onSubmit with trimmed value when clicking send button", async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      render(<ChatInput value="  Hello  " onChange={() => {}} onSubmit={handleSubmit} />);
      const submitButton = screen.getByLabelText("Send message");
      await user.click(submitButton);
      expect(handleSubmit).toHaveBeenCalledWith("Hello");
    });

    it("calls onSubmit on Enter key press", async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      render(<ChatInput value="Hello" onChange={() => {}} onSubmit={handleSubmit} />);
      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "{Enter}");
      expect(handleSubmit).toHaveBeenCalledWith("Hello");
    });

    it("does not submit on Shift+Enter", async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      render(<ChatInput value="Hello" onChange={() => {}} onSubmit={handleSubmit} />);
      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "{Shift>}{Enter}{/Shift}");
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it("disables send button when value is empty", () => {
      render(<ChatInput value="" onChange={() => {}} />);
      const submitButton = screen.getByLabelText("Send message");
      expect(submitButton).toBeDisabled();
    });

    it("disables send button when value is only whitespace", () => {
      render(<ChatInput value="   " onChange={() => {}} />);
      const submitButton = screen.getByLabelText("Send message");
      expect(submitButton).toBeDisabled();
    });

    it("disables send button when disabled prop is true", () => {
      render(<ChatInput value="Hello" onChange={() => {}} disabled />);
      const submitButton = screen.getByLabelText("Send message");
      expect(submitButton).toBeDisabled();
    });

    it("disables send button when loading prop is true", () => {
      render(<ChatInput value="Hello" onChange={() => {}} loading />);
      const submitButton = screen.getByLabelText("Send message");
      expect(submitButton).toBeDisabled();
    });

    it("does not call onSubmit when disabled", async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      render(<ChatInput value="Hello" onChange={() => {}} onSubmit={handleSubmit} disabled />);
      const submitButton = screen.getByLabelText("Send message");
      await user.click(submitButton);
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it("clears internal value after submit in uncontrolled mode", async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      render(<ChatInput placeholder="Test" onSubmit={handleSubmit} />);
      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Hello{Enter}");
      expect(handleSubmit).toHaveBeenCalledWith("Hello");
      expect(textarea).toHaveValue("");
    });

    it("calls onKeyDown in addition to internal handler", async () => {
      const user = userEvent.setup();
      const handleKeyDown = vi.fn();
      render(<ChatInput value="Hi" onChange={() => {}} onKeyDown={handleKeyDown} />);
      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "a");
      expect(handleKeyDown).toHaveBeenCalled();
    });
  });

  describe("file button", () => {
    it("does not show file button by default", () => {
      render(<ChatInput placeholder="Test" />);
      expect(screen.queryByLabelText("Attach file")).not.toBeInTheDocument();
    });

    it("shows file button when showFileButton is true", () => {
      render(<ChatInput placeholder="Test" showFileButton />);
      expect(screen.getByLabelText("Attach file")).toBeInTheDocument();
    });

    it("calls onFileClick when file button is clicked", async () => {
      const user = userEvent.setup();
      const handleFileClick = vi.fn();
      render(<ChatInput placeholder="Test" showFileButton onFileClick={handleFileClick} />);
      await user.click(screen.getByLabelText("Attach file"));
      expect(handleFileClick).toHaveBeenCalled();
    });

    it("uses custom fileButtonAriaLabel", () => {
      render(<ChatInput placeholder="Test" showFileButton fileButtonAriaLabel="Add attachment" />);
      expect(screen.getByLabelText("Add attachment")).toBeInTheDocument();
    });

    it("disables file button when disabled", () => {
      render(<ChatInput placeholder="Test" showFileButton disabled />);
      expect(screen.getByLabelText("Attach file")).toBeDisabled();
    });
  });

  describe("inline select", () => {
    it("renders the selected option label", () => {
      render(<ChatInput placeholder="Test" selectOptions={MODEL_OPTIONS} selectValue="sonnet" />);
      expect(screen.getByText("Sonnet 4.6")).toBeInTheDocument();
    });

    it("renders the selected option icon in the trigger", () => {
      render(<ChatInput placeholder="Test" selectOptions={MODEL_OPTIONS} selectValue="sonnet" />);
      expect(screen.getByTestId("sonnet-icon")).toBeInTheDocument();
    });

    it("renders per-option icons in the dropdown", async () => {
      const user = userEvent.setup();
      render(<ChatInput placeholder="Test" selectOptions={MODEL_OPTIONS} selectValue="sonnet" />);
      await user.click(screen.getByRole("combobox", { name: "Select model" }));
      expect(screen.getByTestId("opus-icon")).toBeInTheDocument();
    });

    it("opens dropdown on click and shows all options", async () => {
      const user = userEvent.setup();
      render(<ChatInput placeholder="Test" selectOptions={MODEL_OPTIONS} selectValue="sonnet" />);
      await user.click(screen.getByRole("combobox", { name: "Select model" }));
      expect(screen.getByRole("option", { name: "Sonnet 4.6" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Opus 4.6" })).toBeInTheDocument();
    });

    it("calls onSelectChange when an option is clicked", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <ChatInput
          placeholder="Test"
          selectOptions={MODEL_OPTIONS}
          selectValue="sonnet"
          onSelectChange={handleChange}
        />,
      );
      await user.click(screen.getByRole("combobox", { name: "Select model" }));
      await user.click(screen.getByRole("option", { name: "Opus 4.6" }));
      expect(handleChange).toHaveBeenCalledWith("opus");
    });

    it("closes dropdown after selecting an option", async () => {
      const user = userEvent.setup();
      render(<ChatInput placeholder="Test" selectOptions={MODEL_OPTIONS} selectValue="sonnet" />);
      await user.click(screen.getByRole("combobox", { name: "Select model" }));
      expect(screen.getByRole("listbox")).toBeInTheDocument();
      await user.click(screen.getByRole("option", { name: "Opus 4.6" }));
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("closes dropdown on Escape key", async () => {
      const user = userEvent.setup();
      render(<ChatInput placeholder="Test" selectOptions={MODEL_OPTIONS} selectValue="sonnet" />);
      await user.click(screen.getByRole("combobox", { name: "Select model" }));
      expect(screen.getByRole("listbox")).toBeInTheDocument();
      await user.keyboard("{Escape}");
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("is not rendered when toolbarRight is provided", () => {
      render(
        <ChatInput
          placeholder="Test"
          selectOptions={MODEL_OPTIONS}
          selectValue="sonnet"
          toolbarRight={<span data-testid="custom-toolbar">Custom</span>}
        />,
      );
      expect(screen.getByTestId("custom-toolbar")).toBeInTheDocument();
      expect(screen.queryByRole("combobox", { name: "Select model" })).not.toBeInTheDocument();
    });
  });

  describe("toolbar", () => {
    it("renders toolbarRight content", () => {
      render(
        <ChatInput
          placeholder="Test"
          toolbarRight={<span data-testid="model-selector">Sonnet</span>}
        />,
      );
      expect(screen.getByTestId("model-selector")).toBeInTheDocument();
    });

    it("uses custom submitAriaLabel", () => {
      render(<ChatInput placeholder="Test" submitAriaLabel="Submit query" />);
      expect(screen.getByLabelText("Submit query")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations (default)", async () => {
      const { container } = render(<ChatInput placeholder="Type a message..." />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations (with file button)", async () => {
      const { container } = render(<ChatInput placeholder="Type a message..." showFileButton />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations (with value)", async () => {
      const { container } = render(
        <ChatInput placeholder="Type a message..." value="Hello" onChange={() => {}} />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations (disabled)", async () => {
      const { container } = render(<ChatInput placeholder="Type a message..." disabled />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations (with select)", async () => {
      const { container } = render(
        <ChatInput
          placeholder="Type a message..."
          selectOptions={MODEL_OPTIONS}
          selectValue="sonnet"
        />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
