import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ToastProvider, ToastViewport } from "../Toast/Toast";
import { UndoAlertPrompt } from "./UndoAlertPrompt";

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    {children}
    <ToastViewport />
  </ToastProvider>
);

describe("UndoAlertPrompt", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(
        <Wrapper>
          <UndoAlertPrompt open className="custom-class" title="Template Moved" onUndo={() => {}} />
        </Wrapper>,
      );
      expect(screen.getByTestId("undo-alert-prompt")).toHaveClass("custom-class");
    });

    it("renders the title and a default Undo button", () => {
      render(
        <Wrapper>
          <UndoAlertPrompt open title="Template Moved" onUndo={() => {}} />
        </Wrapper>,
      );
      expect(screen.getByText("Template Moved")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
    });

    it("renders whatever title the action passes, including rich content", () => {
      render(
        <Wrapper>
          <UndoAlertPrompt
            open
            title={
              <>
                <strong>Summer Shoot</strong> folder deleted
              </>
            }
            onUndo={() => {}}
          />
        </Wrapper>,
      );
      expect(screen.getByText("Summer Shoot").tagName).toBe("STRONG");
      expect(screen.getByText(/folder deleted/)).toBeInTheDocument();
    });

    it("renders a custom undo label", () => {
      render(
        <Wrapper>
          <UndoAlertPrompt open title="Message Unsent" undoLabel="Restore" onUndo={() => {}} />
        </Wrapper>,
      );
      expect(screen.getByRole("button", { name: "Restore" })).toBeInTheDocument();
    });

    it("calls onUndo and requests close when the undo button is clicked", () => {
      const onUndo = vi.fn();
      const onOpenChange = vi.fn();
      render(
        <Wrapper>
          <UndoAlertPrompt
            open
            title="Folder Deleted"
            type="removed"
            onUndo={onUndo}
            onOpenChange={onOpenChange}
          />
        </Wrapper>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Undo" }));
      expect(onUndo).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("forwards ref to the toast root", () => {
      const ref = { current: null as HTMLLIElement | null };
      render(
        <Wrapper>
          <UndoAlertPrompt ref={ref} open title="Template Moved" onUndo={() => {}} />
        </Wrapper>,
      );
      expect(ref.current).toBe(screen.getByTestId("undo-alert-prompt"));
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <Wrapper>
          <UndoAlertPrompt open title="Template Moved" onUndo={() => {}} />
        </Wrapper>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
