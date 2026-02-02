import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Radio } from "../Radio/Radio";
import { RadioGroup } from "./RadioGroup";

describe("RadioGroup", () => {
  describe("API", () => {
    it("applies custom className", () => {
      const { container } = render(
        <RadioGroup className="custom-group">
          <Radio label="Test" value="test" />
        </RadioGroup>,
      );
      const group = container.querySelector('[role="radiogroup"]') as HTMLElement;
      expect(group).toHaveClass("custom-group");
    });

    it("forwards ref to radio group element", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <RadioGroup ref={ref}>
          <Radio label="Test" value="test" />
        </RadioGroup>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute("role", "radiogroup");
    });

    it("controls multiple Radio components", () => {
      render(
        <RadioGroup defaultValue="option1">
          <Radio label="Option 1" value="option1" />
          <Radio label="Option 2" value="option2" />
          <Radio label="Option 3" value="option3" />
        </RadioGroup>,
      );
      const radios = screen.getAllByRole("radio");
      expect(radios).toHaveLength(3);
      expect(radios[0]).toHaveAttribute("data-state", "checked");
      expect(radios[1]).toHaveAttribute("data-state", "unchecked");
      expect(radios[2]).toHaveAttribute("data-state", "unchecked");
    });
  });

  describe("value control", () => {
    it("supports controlled value", () => {
      const { rerender } = render(
        <RadioGroup value="option1">
          <Radio label="Option 1" value="option1" />
          <Radio label="Option 2" value="option2" />
        </RadioGroup>,
      );
      expect(screen.getByLabelText("Option 1")).toHaveAttribute("data-state", "checked");
      expect(screen.getByLabelText("Option 2")).toHaveAttribute("data-state", "unchecked");

      rerender(
        <RadioGroup value="option2">
          <Radio label="Option 1" value="option1" />
          <Radio label="Option 2" value="option2" />
        </RadioGroup>,
      );
      expect(screen.getByLabelText("Option 1")).toHaveAttribute("data-state", "unchecked");
      expect(screen.getByLabelText("Option 2")).toHaveAttribute("data-state", "checked");
    });

    it("supports defaultValue", () => {
      render(
        <RadioGroup defaultValue="option2">
          <Radio label="Option 1" value="option1" />
          <Radio label="Option 2" value="option2" />
        </RadioGroup>,
      );
      expect(screen.getByLabelText("Option 1")).toHaveAttribute("data-state", "unchecked");
      expect(screen.getByLabelText("Option 2")).toHaveAttribute("data-state", "checked");
    });
  });

  describe("disabled state", () => {
    it("disables all child Radio components", () => {
      render(
        <RadioGroup disabled>
          <Radio label="Option 1" value="option1" />
          <Radio label="Option 2" value="option2" />
        </RadioGroup>,
      );
      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).toBeDisabled();
      });
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <RadioGroup>
          <Radio label="Accessible Radio 1" value="test1" />
          <Radio label="Accessible Radio 2" value="test2" />
        </RadioGroup>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has proper radiogroup role", () => {
      const { container } = render(
        <RadioGroup>
          <Radio label="Test" value="test" />
        </RadioGroup>,
      );
      const group = container.querySelector('[role="radiogroup"]');
      expect(group).toBeInTheDocument();
    });
  });
});
