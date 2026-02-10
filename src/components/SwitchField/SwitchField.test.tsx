import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { SwitchField } from "./SwitchField";

describe("SwitchField", () => {
  describe("API", () => {
    it("applies custom className to wrapper", () => {
      const { container } = render(<SwitchField className="custom-class" label="Toggle" />);
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("renders label and links it to switch", () => {
      render(<SwitchField label="Notifications" />);
      const label = screen.getByText("Notifications");
      const switchEl = screen.getByRole("switch");
      expect(label).toHaveAttribute("for");
      expect(switchEl).toHaveAttribute("id");
      expect(label.getAttribute("for")).toBe(switchEl.getAttribute("id"));
    });

    it("uses explicit id for both switch and label when provided", () => {
      render(<SwitchField id="custom-id" label="Notifications" />);
      const label = screen.getByText("Notifications");
      const switchEl = screen.getByRole("switch");
      expect(switchEl).toHaveAttribute("id", "custom-id");
      expect(label).toHaveAttribute("for", "custom-id");
    });

    it("renders helper text and associates via aria-describedby", () => {
      render(<SwitchField label="Notifications" helperText="Get notified" />);
      const switchEl = screen.getByRole("switch");
      const helperText = screen.getByText("Get notified");
      expect(switchEl).toHaveAttribute("aria-describedby");
      expect(helperText).toHaveAttribute("id");
      expect(switchEl.getAttribute("aria-describedby")).toBe(helperText.getAttribute("id"));
    });

    it("forwards ref", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<SwitchField ref={ref} label="Toggle" />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<SwitchField label="Accessible switch" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with helper text", async () => {
      const { container } = render(<SwitchField label="Notifications" helperText="Get notified" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
