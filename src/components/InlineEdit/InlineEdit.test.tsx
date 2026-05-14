import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as React from "react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { InlineEdit } from "./InlineEdit";

function ControlledInlineEdit({
  initialValue = "Folder",
  ...rest
}: { initialValue?: string } & Omit<Parameters<typeof InlineEdit>[0], "value" | "onSubmit"> & {
    onSubmit?: (value: string) => void;
  }) {
  const [value, setValue] = useState(initialValue);
  return (
    <InlineEdit
      {...rest}
      value={value}
      onSubmit={(next) => {
        setValue(next);
        rest.onSubmit?.(next);
      }}
    />
  );
}

describe("InlineEdit", () => {
  describe("API", () => {
    it("applies custom className to the root element", () => {
      render(<InlineEdit value="Folder" onSubmit={() => {}} className="custom-class" />);
      expect(screen.getByTestId("inline-edit")).toHaveClass("custom-class");
    });

    it("renders as a button by default", () => {
      render(<InlineEdit value="Folder" onSubmit={() => {}} />);
      const trigger = screen.getByTestId("inline-edit-trigger");
      expect(trigger.tagName).toBe("BUTTON");
      expect(trigger).toHaveAttribute("type", "button");
    });

    it("forwards ref to the input when editing", async () => {
      const user = userEvent.setup();
      const ref = vi.fn();
      render(<InlineEdit ref={ref} value="Folder" onSubmit={() => {}} />);
      await user.click(screen.getByTestId("inline-edit-trigger"));
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
    });

    it("uses the visible value as the trigger's accessible name", () => {
      render(<InlineEdit value="My folder" onSubmit={() => {}} />);
      expect(screen.getByRole("button", { name: "My folder" })).toBeInTheDocument();
    });
  });

  describe("interaction", () => {
    it("enters edit mode on click and selects the current value", async () => {
      const user = userEvent.setup();
      render(<InlineEdit value="Folder" onSubmit={() => {}} />);
      await user.click(screen.getByTestId("inline-edit-trigger"));
      const input = screen.getByTestId("inline-edit-input") as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue("Folder");
      expect(input.selectionStart).toBe(0);
      expect(input.selectionEnd).toBe("Folder".length);
    });

    it("commits a new value on Enter", async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      render(<ControlledInlineEdit onSubmit={handleSubmit} />);
      await user.click(screen.getByTestId("inline-edit-trigger"));
      await user.clear(screen.getByTestId("inline-edit-input"));
      await user.type(screen.getByTestId("inline-edit-input"), "Renamed{Enter}");
      expect(handleSubmit).toHaveBeenCalledWith("Renamed");
      expect(screen.getByTestId("inline-edit-trigger")).toHaveTextContent("Renamed");
    });

    it("commits a new value on blur", async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      render(
        <>
          <ControlledInlineEdit onSubmit={handleSubmit} />
          <button type="button">elsewhere</button>
        </>,
      );
      await user.click(screen.getByTestId("inline-edit-trigger"));
      await user.clear(screen.getByTestId("inline-edit-input"));
      await user.type(screen.getByTestId("inline-edit-input"), "Blurred");
      await user.click(screen.getByRole("button", { name: "elsewhere" }));
      expect(handleSubmit).toHaveBeenCalledWith("Blurred");
    });

    it("cancels and reverts on Escape", async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      const handleCancel = vi.fn();
      render(<ControlledInlineEdit onSubmit={handleSubmit} onCancel={handleCancel} />);
      await user.click(screen.getByTestId("inline-edit-trigger"));
      await user.clear(screen.getByTestId("inline-edit-input"));
      await user.type(screen.getByTestId("inline-edit-input"), "Discarded{Escape}");
      expect(handleSubmit).not.toHaveBeenCalled();
      expect(handleCancel).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId("inline-edit-trigger")).toHaveTextContent("Folder");
    });

    it("rejects empty drafts and reverts to the previous value", async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      render(<ControlledInlineEdit onSubmit={handleSubmit} />);
      await user.click(screen.getByTestId("inline-edit-trigger"));
      await user.clear(screen.getByTestId("inline-edit-input"));
      await user.type(screen.getByTestId("inline-edit-input"), "   {Enter}");
      expect(handleSubmit).not.toHaveBeenCalled();
      expect(screen.getByTestId("inline-edit-trigger")).toHaveTextContent("Folder");
    });

    it("does not commit when the value is unchanged", async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      render(<ControlledInlineEdit onSubmit={handleSubmit} />);
      await user.click(screen.getByTestId("inline-edit-trigger"));
      await user.keyboard("{Enter}");
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it("does not enter edit mode when disabled", async () => {
      const user = userEvent.setup();
      render(<InlineEdit value="Folder" onSubmit={() => {}} disabled />);
      const trigger = screen.getByTestId("inline-edit-trigger");
      await user.click(trigger);
      expect(screen.queryByTestId("inline-edit-input")).not.toBeInTheDocument();
      expect(trigger).toBeDisabled();
    });
  });

  describe("validate", () => {
    it("reverts the draft when validate returns false", async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      const validate = (draft: string) => draft.length >= 3;
      render(<ControlledInlineEdit onSubmit={handleSubmit} validate={validate} />);
      await user.click(screen.getByTestId("inline-edit-trigger"));
      await user.clear(screen.getByTestId("inline-edit-input"));
      await user.type(screen.getByTestId("inline-edit-input"), "ab{Enter}");
      expect(handleSubmit).not.toHaveBeenCalled();
      expect(screen.getByTestId("inline-edit-trigger")).toHaveTextContent("Folder");
    });

    it("commits when validate returns true", async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      const validate = (draft: string) => draft.length >= 3;
      render(<ControlledInlineEdit onSubmit={handleSubmit} validate={validate} />);
      await user.click(screen.getByTestId("inline-edit-trigger"));
      await user.clear(screen.getByTestId("inline-edit-input"));
      await user.type(screen.getByTestId("inline-edit-input"), "abcd{Enter}");
      expect(handleSubmit).toHaveBeenCalledWith("abcd");
    });
  });

  describe("forwarded handlers", () => {
    it("calls a consumer onChange before updating the draft", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<InlineEdit value="Folder" onSubmit={() => {}} onChange={handleChange} />);
      await user.click(screen.getByTestId("inline-edit-trigger"));
      await user.type(screen.getByTestId("inline-edit-input"), "!");
      expect(handleChange).toHaveBeenCalled();
    });

    it("lets a consumer onKeyDown suppress Enter handling", async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") event.preventDefault();
      };
      render(<ControlledInlineEdit onSubmit={handleSubmit} onKeyDown={handleKeyDown} />);
      await user.click(screen.getByTestId("inline-edit-trigger"));
      await user.clear(screen.getByTestId("inline-edit-input"));
      await user.type(screen.getByTestId("inline-edit-input"), "Renamed{Enter}");
      expect(handleSubmit).not.toHaveBeenCalled();
      expect(screen.getByTestId("inline-edit-input")).toBeInTheDocument();
    });
  });

  describe("leftIcon", () => {
    it("renders the icon in display mode", () => {
      render(
        <InlineEdit
          value="Folder"
          onSubmit={() => {}}
          leftIcon={<span data-testid="icon">+</span>}
        />,
      );
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("hides the icon while editing", async () => {
      const user = userEvent.setup();
      render(
        <InlineEdit
          value="Folder"
          onSubmit={() => {}}
          leftIcon={<span data-testid="icon">+</span>}
        />,
      );
      await user.click(screen.getByTestId("inline-edit-trigger"));
      expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no violations in display mode", async () => {
      const { container } = render(<InlineEdit value="Folder" onSubmit={() => {}} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no violations in edit mode", async () => {
      const user = userEvent.setup();
      const { container } = render(<InlineEdit value="Folder" onSubmit={() => {}} />);
      await user.click(screen.getByTestId("inline-edit-trigger"));
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
