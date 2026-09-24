import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { RadioGroup } from "../RadioGroup/RadioGroup";
import { RadioCard } from "./RadioCard";

function renderCards(props: React.ComponentProps<typeof RadioGroup> = {}) {
  return render(
    <RadioGroup aria-label="List type" {...props}>
      <RadioCard
        value="dynamic"
        title="Dynamic list"
        description="Updates automatically"
        icon={<svg data-testid="dynamic-icon" />}
      />
      <RadioCard value="specific" title="Specific fans" description="A fixed set you pick" />
    </RadioGroup>,
  );
}

describe("RadioCard", () => {
  describe("API", () => {
    it("forwards ref to the radio element", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <RadioGroup aria-label="List type">
          <RadioCard ref={ref} value="dynamic" title="Dynamic list" />
        </RadioGroup>,
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toHaveAttribute("role", "radio");
    });

    it("applies custom className to the card", () => {
      render(
        <RadioGroup aria-label="List type">
          <RadioCard className="custom-class" value="dynamic" title="Dynamic list" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radio")).toHaveClass("custom-class");
    });

    it("renders the icon slot", () => {
      renderCards();
      expect(screen.getByTestId("dynamic-icon")).toBeInTheDocument();
    });

    it("reserves a transparent border and applies the selected border when checked", () => {
      renderCards({ defaultValue: "dynamic" });
      const selected = screen.getByRole("radio", { name: "Dynamic list" });
      const unselected = screen.getByRole("radio", { name: "Specific fans" });
      expect(selected).toHaveAttribute("data-state", "checked");
      expect(unselected).toHaveAttribute("data-state", "unchecked");
      expect(unselected).toHaveClass("border", "border-transparent");
      expect(selected).toHaveClass("data-[state=checked]:border-border-selected");
    });
  });

  describe("selection", () => {
    it("selects when any part of the card is clicked", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderCards({ onValueChange });
      await user.click(screen.getByText("A fixed set you pick"));
      expect(onValueChange).toHaveBeenCalledWith("specific");
    });

    it("moves selection with arrow keys", async () => {
      const user = userEvent.setup();
      renderCards({ defaultValue: "dynamic" });
      const dynamic = screen.getByRole("radio", { name: "Dynamic list" });
      const specific = screen.getByRole("radio", { name: "Specific fans" });

      await user.tab();
      expect(dynamic).toHaveFocus();
      // Radix only checks on focus while the arrow key is held, and moves focus asynchronously.
      await user.keyboard("{ArrowDown>}");
      await waitFor(() => expect(specific).toHaveFocus());
      await user.keyboard("{/ArrowDown}");
      expect(specific).toHaveAttribute("data-state", "checked");
      expect(dynamic).toHaveAttribute("data-state", "unchecked");
    });

    it("does not select when disabled", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <RadioGroup aria-label="List type" onValueChange={onValueChange}>
          <RadioCard value="dynamic" title="Dynamic list" disabled />
        </RadioGroup>,
      );
      const radio = screen.getByRole("radio", { name: "Dynamic list" });
      expect(radio).toBeDisabled();
      await user.click(radio);
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("uses the title as the accessible name and links the description", () => {
      renderCards();
      const radio = screen.getByRole("radio", { name: "Dynamic list" });
      expect(radio).toHaveAccessibleDescription("Updates automatically");
    });

    it("omits aria-describedby without a description", () => {
      render(
        <RadioGroup aria-label="List type">
          <RadioCard value="dynamic" title="Dynamic list" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radio")).not.toHaveAttribute("aria-describedby");
    });

    it("has no accessibility violations", async () => {
      const { container } = renderCards({ defaultValue: "dynamic" });
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
