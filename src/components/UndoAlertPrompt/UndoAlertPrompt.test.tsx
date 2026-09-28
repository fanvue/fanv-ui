import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
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
  afterEach(() => {
    vi.useRealTimers();
  });

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

    it("confirms with a tick and Undone, calls onUndo once, then closes after undoneDuration", () => {
      vi.useFakeTimers();
      const onUndo = vi.fn();
      const onOpenChange = vi.fn();
      render(
        <Wrapper>
          <UndoAlertPrompt
            open
            title="Folder Deleted"
            type="removed"
            undoneDuration={1000}
            onUndo={onUndo}
            onOpenChange={onOpenChange}
          />
        </Wrapper>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Undo" }));
      const undoneButton = screen.getByRole("button", { name: "Undone" });
      expect(onUndo).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId("undone-tick")).toBeInTheDocument();
      expect(undoneButton).toHaveAttribute("aria-disabled", "true");
      expect(screen.getByTestId("undone-announcement")).toHaveTextContent("Undone");
      expect(onOpenChange).not.toHaveBeenCalled();

      fireEvent.click(undoneButton);
      expect(onUndo).toHaveBeenCalledTimes(1);

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("renders a custom undone label", () => {
      render(
        <Wrapper>
          <UndoAlertPrompt open title="Message Unsent" undoneLabel="Restored" onUndo={() => {}} />
        </Wrapper>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Undo" }));
      expect(screen.getByRole("button", { name: "Restored" })).toBeInTheDocument();
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
