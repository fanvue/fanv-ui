import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { RadioGroup } from "../RadioGroup/RadioGroup";
import { SettingsCard } from "./SettingsCard";

function renderGroup(props: { onValueChange?: (value: string) => void; disabled?: boolean } = {}) {
  return render(
    <RadioGroup defaultValue="dynamic" onValueChange={props.onValueChange}>
      <SettingsCard
        value="dynamic"
        icon={<svg data-testid="icon" />}
        title="Dynamic Logic"
        description="Define rules which automatically update"
      />
      <SettingsCard value="manual" title="Manual" disabled={props.disabled} />
    </RadioGroup>,
  );
}

describe("SettingsCard", () => {
  describe("API", () => {
    it("exposes each card as a radio named by its title", () => {
      renderGroup();
      expect(screen.getByRole("radio", { name: /Dynamic Logic/ })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "Manual" })).toBeInTheDocument();
    });

    it("renders the description and the icon", () => {
      renderGroup();
      expect(screen.getByText("Define rules which automatically update")).toBeInTheDocument();
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("marks the selected card as checked and the other as unchecked", () => {
      renderGroup();
      expect(screen.getByRole("radio", { name: /Dynamic Logic/ })).toBeChecked();
      expect(screen.getByRole("radio", { name: "Manual" })).not.toBeChecked();
    });

    it("reports the chosen value when another card is clicked", () => {
      const onValueChange = vi.fn();
      renderGroup({ onValueChange });
      fireEvent.click(screen.getByRole("radio", { name: "Manual" }));
      expect(onValueChange).toHaveBeenCalledWith("manual");
    });

    it("does not select a disabled card", () => {
      const onValueChange = vi.fn();
      renderGroup({ onValueChange, disabled: true });
      fireEvent.click(screen.getByRole("radio", { name: "Manual" }));
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("applies a custom className", () => {
      render(
        <RadioGroup>
          <SettingsCard value="a" title="A" className="custom" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radio", { name: "A" })).toHaveClass("custom");
    });

    it("forwards the ref to the card button", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <RadioGroup>
          <SettingsCard ref={ref} value="a" title="A" />
        </RadioGroup>,
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe("Accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderGroup();
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
