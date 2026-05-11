import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { InlineEdit } from "./InlineEdit";

function ControlledInlineEdit({
  initialValue = "Folder",
  ...rest
}: { initialValue?: string } & Omit<Parameters<typeof InlineEdit>[0], "value" | "onCommit"> & {
    onCommit?: (value: string) => void;
  }) {
  const [value, setValue] = useState(initialValue);
  return (
    <InlineEdit
      {...rest}
      value={value}
      onCommit={(next) => {
        setValue(next);
        rest.onCommit?.(next);
      }}
    />
  );
}

describe("InlineEdit", () => {
  describe("API", () => {
    it("applies custom className to the root element", () => {
      render(<InlineEdit value="Folder" onCommit={() => {}} className="custom-class" />);
      expect(screen.getByTestId("inline-edit")).toHaveClass("custom-class");
    });

    it("renders as a button by default", () => {
      render(<InlineEdit value="Folder" onCommit={() => {}} />);
      const trigger = screen.getByTestId("inline-edit-trigger");
      expect(trigger.tagName).toBe("BUTTON");
      expect(trigger).toHaveAttribute("type", "button");
    });

    it("forwards ref to the input when editing", async () => {
      const user = userEvent.setup();
      const ref = vi.fn();
      render(<InlineEdit ref={ref} value="Folder" onCommit={() => {}} />);
      await user.click(screen.getByTestId("inline-edit-trigger"));
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
    });
  });

  describe("interaction", () => {
    it("enters edit mode on click and selects the current value", async () => {
      const user = userEvent.setup();
      render(<InlineEdit value="Folder" onCommit={() => {}} />);
      await user.click(screen.getByTestId("inline-edit-trigger"));
      const input = screen.getByTestId("inline-edit-input") as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue("Folder");
      expect(input.selectionStart).toBe(0);
      expect(input.selectionEnd).toBe("Folder".length);
    });

    it("commits a new value on Enter", async () => {
      const user = userEvent.setup();
      const handleCommit = vi.fn();
      render(<ControlledInlineEdit onCommit={handleCommit} />);
      await user.click(screen.getByTestId("inline-edit-trigger"));
      await user.clear(screen.getByTestId("inline-edit-input"));
      await user.type(screen.getByTestId("inline-edit-input"), "Renamed{Enter}");
      expect(handleCommit).toHaveBeenCalledWith("Renamed");
      expect(screen.getByTestId("inline-edit-trigger")).toHaveTextContent("Renamed");
    });

    it("commits a new value on blur", async () => {
      const user = userEvent.setup();
      const handleCommit = vi.fn();
      render(
        <>
          <ControlledInlineEdit onCommit={handleCommit} />
          <button type="button">elsewhere</button>
        </>,
      );
      await user.click(screen.getByTestId("inline-edit-trigger"));
      await user.clear(screen.getByTestId("inline-edit-input"));
      await user.type(screen.getByTestId("inline-edit-input"), "Blurred");
      await user.click(screen.getByRole("button", { name: "elsewhere" }));
      expect(handleCommit).toHaveBeenCalledWith("Blurred");
    });

    it("cancels and reverts on Escape", async () => {
      const user = userEvent.setup();
      const handleCommit = vi.fn();
      const handleCancel = vi.fn();
      render(<ControlledInlineEdit onCommit={handleCommit} onCancel={handleCancel} />);
      await user.click(screen.getByTestId("inline-edit-trigger"));
      await user.clear(screen.getByTestId("inline-edit-input"));
      await user.type(screen.getByTestId("inline-edit-input"), "Discarded{Escape}");
      expect(handleCommit).not.toHaveBeenCalled();
      expect(handleCancel).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId("inline-edit-trigger")).toHaveTextContent("Folder");
    });

    it("rejects empty drafts and reverts to the previous value", async () => {
      const user = userEvent.setup();
      const handleCommit = vi.fn();
      render(<ControlledInlineEdit onCommit={handleCommit} />);
      await user.click(screen.getByTestId("inline-edit-trigger"));
      await user.clear(screen.getByTestId("inline-edit-input"));
      await user.type(screen.getByTestId("inline-edit-input"), "   {Enter}");
      expect(handleCommit).not.toHaveBeenCalled();
      expect(screen.getByTestId("inline-edit-trigger")).toHaveTextContent("Folder");
    });

    it("does not commit when the value is unchanged", async () => {
      const user = userEvent.setup();
      const handleCommit = vi.fn();
      render(<ControlledInlineEdit onCommit={handleCommit} />);
      await user.click(screen.getByTestId("inline-edit-trigger"));
      await user.keyboard("{Enter}");
      expect(handleCommit).not.toHaveBeenCalled();
    });

    it("does not enter edit mode when disabled", async () => {
      const user = userEvent.setup();
      render(<InlineEdit value="Folder" onCommit={() => {}} disabled />);
      const trigger = screen.getByTestId("inline-edit-trigger");
      await user.click(trigger);
      expect(screen.queryByTestId("inline-edit-input")).not.toBeInTheDocument();
      expect(trigger).toBeDisabled();
    });
  });

  describe("leftIcon", () => {
    it("renders the icon in display mode", () => {
      render(
        <InlineEdit
          value="Folder"
          onCommit={() => {}}
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
          onCommit={() => {}}
          leftIcon={<span data-testid="icon">+</span>}
        />,
      );
      await user.click(screen.getByTestId("inline-edit-trigger"));
      expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no violations in display mode", async () => {
      const { container } = render(<InlineEdit value="Folder" onCommit={() => {}} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no violations in edit mode", async () => {
      const user = userEvent.setup();
      const { container } = render(<InlineEdit value="Folder" onCommit={() => {}} />);
      await user.click(screen.getByTestId("inline-edit-trigger"));
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
