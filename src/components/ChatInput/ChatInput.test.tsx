import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { AIIcon } from "../Icons/AIIcon";
import { BulbIcon } from "../Icons/BulbIcon";
import { ChatInput } from "./ChatInput";

const MODEL_OPTIONS = [
  {
    value: "fanvue-ai",
    label: "Fanvue AI",
    icon: <AIIcon className="size-4" data-testid="fanvue-ai-icon" />,
  },
  {
    value: "example",
    label: "Example",
    icon: <BulbIcon className="size-4" data-testid="example-icon" />,
  },
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

  describe("attachment previews", () => {
    it("renders attachment preview slot inside the container", () => {
      render(
        <ChatInput
          placeholder="Test"
          attachmentPreviews={<div data-testid="attachment-slot">Preview</div>}
        />,
      );
      expect(screen.getByTestId("attachment-slot")).toHaveTextContent("Preview");
    });

    it("fires remove handler from content inside attachment previews", async () => {
      const user = userEvent.setup();
      const handleRemove = vi.fn();
      render(
        <ChatInput
          placeholder="Test"
          attachmentPreviews={
            <button type="button" aria-label="Remove attachment" onClick={handleRemove}>
              Remove
            </button>
          }
        />,
      );
      await user.click(screen.getByLabelText("Remove attachment"));
      expect(handleRemove).toHaveBeenCalledTimes(1);
    });

    it("does not reserve preview layout when attachmentPreviews is an empty array", () => {
      render(<ChatInput placeholder="Test" attachmentPreviews={[]} />);
      expect(screen.getByRole("textbox")).toHaveClass("pt-4");
    });

    it("renders built-in thumbnails when attachments are provided", () => {
      const { container } = render(
        <ChatInput
          placeholder="Test"
          attachments={[{ id: "x", src: "https://example.com/a.png", name: "One" }]}
          onAttachmentRemove={() => {}}
        />,
      );
      const img = container.querySelector("img");
      expect(img).toBeTruthy();
      expect(img).toHaveAttribute("src", "https://example.com/a.png");
    });

    it("calls onAttachmentRemove when a built-in remove control is used", async () => {
      const user = userEvent.setup();
      const handleRemove = vi.fn();
      render(
        <ChatInput
          placeholder="Test"
          attachments={[{ id: "x", src: "https://example.com/a.png", name: "One" }]}
          onAttachmentRemove={handleRemove}
        />,
      );
      await user.click(screen.getByLabelText("Remove One"));
      expect(handleRemove).toHaveBeenCalledWith("x");
    });

    it("disables built-in remove controls when onAttachmentRemove is omitted", () => {
      render(
        <ChatInput
          placeholder="Test"
          attachments={[{ id: "x", src: "https://example.com/a.png" }]}
        />,
      );
      expect(screen.getByLabelText("Remove attachment")).toBeDisabled();
    });

    it("prefers attachmentPreviews over attachments when attachmentPreviews is defined", () => {
      render(
        <ChatInput
          placeholder="Test"
          attachments={[{ id: "x", src: "https://example.com/a.png" }]}
          onAttachmentRemove={() => {}}
          attachmentPreviews={<div data-testid="custom-strip">Custom</div>}
        />,
      );
      expect(screen.getByTestId("custom-strip")).toBeInTheDocument();
      expect(screen.queryByLabelText("Remove attachment")).not.toBeInTheDocument();
    });
  });

  describe("inline select", () => {
    it("renders the selected option label", () => {
      render(
        <ChatInput placeholder="Test" selectOptions={MODEL_OPTIONS} selectValue="fanvue-ai" />,
      );
      expect(screen.getByText("Fanvue AI")).toBeInTheDocument();
    });

    it("renders the selected option icon in the trigger", () => {
      render(
        <ChatInput placeholder="Test" selectOptions={MODEL_OPTIONS} selectValue="fanvue-ai" />,
      );
      expect(screen.getByTestId("fanvue-ai-icon")).toBeInTheDocument();
    });

    it("renders per-option icons in the dropdown", async () => {
      const user = userEvent.setup();
      render(
        <ChatInput placeholder="Test" selectOptions={MODEL_OPTIONS} selectValue="fanvue-ai" />,
      );
      await user.click(screen.getByRole("combobox", { name: "Select model" }));
      const listbox = screen.getByRole("listbox");
      expect(within(listbox).getByTestId("fanvue-ai-icon")).toBeInTheDocument();
      expect(within(listbox).getByTestId("example-icon")).toBeInTheDocument();
    });

    it("opens dropdown on click and shows all options", async () => {
      const user = userEvent.setup();
      render(
        <ChatInput placeholder="Test" selectOptions={MODEL_OPTIONS} selectValue="fanvue-ai" />,
      );
      await user.click(screen.getByRole("combobox", { name: "Select model" }));
      expect(screen.getByRole("option", { name: "Fanvue AI" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Example" })).toBeInTheDocument();
    });

    it("calls onSelectChange when an option is clicked", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <ChatInput
          placeholder="Test"
          selectOptions={MODEL_OPTIONS}
          selectValue="fanvue-ai"
          onSelectChange={handleChange}
        />,
      );
      await user.click(screen.getByRole("combobox", { name: "Select model" }));
      await user.click(screen.getByRole("option", { name: "Example" }));
      expect(handleChange).toHaveBeenCalledWith("example");
    });

    it("closes dropdown after selecting an option", async () => {
      const user = userEvent.setup();
      render(
        <ChatInput placeholder="Test" selectOptions={MODEL_OPTIONS} selectValue="fanvue-ai" />,
      );
      await user.click(screen.getByRole("combobox", { name: "Select model" }));
      expect(screen.getByRole("listbox")).toBeInTheDocument();
      await user.click(screen.getByRole("option", { name: "Example" }));
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("closes dropdown on Escape key", async () => {
      const user = userEvent.setup();
      render(
        <ChatInput placeholder="Test" selectOptions={MODEL_OPTIONS} selectValue="fanvue-ai" />,
      );
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
          selectValue="fanvue-ai"
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
          toolbarRight={<span data-testid="model-selector">Fanvue AI</span>}
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
          selectValue="fanvue-ai"
        />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations (with attachment previews)", async () => {
      const { container } = render(
        <ChatInput
          placeholder="Type a message..."
          attachmentPreviews={
            <div
              role="img"
              aria-label="Sample attachment"
              className="size-16 shrink-0 rounded-lg bg-neutral-alphas-100"
            />
          }
        />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations (with default attachments)", async () => {
      const { container } = render(
        <ChatInput
          placeholder="Type a message..."
          attachments={[
            {
              id: "a",
              src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
              name: "Sample",
            },
          ]}
          onAttachmentRemove={() => {}}
        />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
