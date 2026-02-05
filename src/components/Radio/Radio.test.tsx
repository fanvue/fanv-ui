import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { RadioGroup } from "../RadioGroup/RadioGroup";
import { Radio } from "./Radio";

describe("Radio", () => {
  describe("API", () => {
    it("applies custom className to container", () => {
      const { container } = render(
        <RadioGroup>
          <Radio className="custom-class" label="Test" value="test" />
        </RadioGroup>,
      );
      const wrapper = container.querySelector('[class*="custom-class"]') as HTMLElement;
      expect(wrapper).toHaveClass("custom-class");
    });

    it("forwards ref to radio button element", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <RadioGroup>
          <Radio ref={ref} label="Test" value="test" />
        </RadioGroup>,
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toHaveAttribute("role", "radio");
    });

    it("associates label with radio button using htmlFor", () => {
      render(
        <RadioGroup>
          <Radio id="test-radio" label="Test Label" value="test" />
        </RadioGroup>,
      );
      const label = screen.getByText("Test Label");
      const input = screen.getByRole("radio");
      expect(label).toHaveAttribute("for", "test-radio");
      expect(input).toHaveAttribute("id", "test-radio");
    });
  });

  describe("sizes", () => {
    it("applies default size by default", () => {
      render(
        <RadioGroup>
          <Radio label="Test" value="test" />
        </RadioGroup>,
      );
      const label = screen.getByText("Test");
      expect(label).toHaveClass("text-base", "leading-normal");
    });

    it("applies small size when specified", () => {
      render(
        <RadioGroup>
          <Radio size="small" label="Test" value="test" />
        </RadioGroup>,
      );
      const label = screen.getByText("Test");
      expect(label).toHaveClass("text-sm", "leading-snug");
    });
  });

  describe("states", () => {
    it("supports checked state", () => {
      render(
        <RadioGroup defaultValue="test">
          <Radio label="Test" value="test" />
        </RadioGroup>,
      );
      const input = screen.getByRole("radio");
      expect(input).toHaveAttribute("data-state", "checked");
    });

    it("works uncontrolled with defaultValue", () => {
      render(
        <RadioGroup defaultValue="b">
          <Radio label="A" value="a" />
          <Radio label="B" value="b" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radio", { name: "B" })).toHaveAttribute("data-state", "checked");
    });

    it("works controlled with value and onValueChange", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <RadioGroup value="a" onValueChange={onValueChange}>
          <Radio label="A" value="a" />
          <Radio label="B" value="b" />
        </RadioGroup>,
      );
      await user.click(screen.getByRole("radio", { name: "B" }));
      expect(onValueChange).toHaveBeenCalledWith("b");
    });

    it("supports disabled state", () => {
      render(
        <RadioGroup>
          <Radio label="Test" value="test" disabled />
        </RadioGroup>,
      );
      const input = screen.getByRole("radio");
      expect(input).toBeDisabled();
    });
  });

  describe("label and helper text", () => {
    it("renders without label", () => {
      render(
        <RadioGroup>
          <Radio value="test" />
        </RadioGroup>,
      );
      const input = screen.getByRole("radio");
      expect(input).toBeInTheDocument();
    });

    it("renders with helper text", () => {
      render(
        <RadioGroup>
          <Radio label="Test Label" helperText="Helper description" value="test" />
        </RadioGroup>,
      );
      expect(screen.getByText("Test Label")).toBeInTheDocument();
      expect(screen.getByText("Helper description")).toBeInTheDocument();
    });

    it("associates helper text with radio button using aria-describedby", () => {
      render(
        <RadioGroup>
          <Radio id="test-radio" label="Test" helperText="Helper description" value="test" />
        </RadioGroup>,
      );
      const input = screen.getByRole("radio");
      const helperText = screen.getByText("Helper description");

      expect(helperText).toHaveAttribute("id", "test-radio-helper");
      expect(input).toHaveAttribute("aria-describedby", "test-radio-helper");
    });

    it("does not set aria-describedby when helperText is not provided", () => {
      render(
        <RadioGroup>
          <Radio label="Test" value="test" />
        </RadioGroup>,
      );
      const input = screen.getByRole("radio");
      expect(input).not.toHaveAttribute("aria-describedby");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <RadioGroup>
          <Radio label="Accessible Radio" value="test" />
        </RadioGroup>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has proper role", () => {
      render(
        <RadioGroup>
          <Radio label="Test" value="test" />
        </RadioGroup>,
      );
      const input = screen.getByRole("radio");
      expect(input).toBeInTheDocument();
    });
  });
});
