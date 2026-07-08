import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { AddIcon } from "../Icons/AddIcon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../Tooltip/Tooltip";
import { FloatingActionButton } from "./FloatingActionButton";

describe("FloatingActionButton", () => {
  describe("API", () => {
    it("renders a button with the given accessible name", () => {
      render(
        <FloatingActionButton aria-label="Add content">
          <AddIcon />
        </FloatingActionButton>,
      );
      expect(screen.getByRole("button", { name: "Add content" })).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <FloatingActionButton aria-label="Add content" className="custom-class">
          <AddIcon />
        </FloatingActionButton>,
      );
      expect(screen.getByRole("button", { name: "Add content" })).toHaveClass("custom-class");
    });

    it("defaults to type=button", () => {
      render(
        <FloatingActionButton aria-label="Add content">
          <AddIcon />
        </FloatingActionButton>,
      );
      expect(screen.getByRole("button", { name: "Add content" })).toHaveAttribute("type", "button");
    });

    it("forwards ref to the button element", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <FloatingActionButton ref={ref} aria-label="Add content">
          <AddIcon />
        </FloatingActionButton>,
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("spreads additional props onto the button", () => {
      render(
        <FloatingActionButton aria-label="Add content" data-testid="fab">
          <AddIcon />
        </FloatingActionButton>,
      );
      expect(screen.getByTestId("fab")).toBeInTheDocument();
    });

    it("calls onClick when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <FloatingActionButton aria-label="Add content" onClick={handleClick}>
          <AddIcon />
        </FloatingActionButton>,
      );
      await user.click(screen.getByRole("button", { name: "Add content" }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <FloatingActionButton aria-label="Add content" disabled onClick={handleClick}>
          <AddIcon />
        </FloatingActionButton>,
      );
      await user.click(screen.getByRole("button", { name: "Add content" }));
      expect(handleClick).not.toHaveBeenCalled();
      expect(screen.getByRole("button", { name: "Add content" })).toBeDisabled();
    });
  });

  describe("tooltip composition", () => {
    it("wires up as a Radix TooltipTrigger via asChild", async () => {
      const user = userEvent.setup();
      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <FloatingActionButton aria-label="Add content">
                <AddIcon />
              </FloatingActionButton>
            </TooltipTrigger>
            <TooltipContent>Add a media</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      );

      const trigger = screen.getByRole("button", { name: "Add content" });
      await user.hover(trigger);
      expect(await screen.findByRole("tooltip")).toHaveTextContent("Add a media");
    });
  });

  describe("accessibility", () => {
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it("has no accessibility violations", async () => {
      const { container } = render(
        <FloatingActionButton aria-label="Add content">
          <AddIcon />
        </FloatingActionButton>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("warns in dev when no accessible name is provided", () => {
      render(
        <FloatingActionButton>
          <AddIcon />
        </FloatingActionButton>,
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("no accessible name provided"),
      );
    });

    it("does not warn when aria-label is provided", () => {
      render(
        <FloatingActionButton aria-label="Add content">
          <AddIcon />
        </FloatingActionButton>,
      );
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it("does not warn when aria-labelledby is provided", () => {
      render(
        <FloatingActionButton aria-labelledby="external-label">
          <AddIcon />
        </FloatingActionButton>,
      );
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it("marks the icon wrapper as aria-hidden", () => {
      const { container } = render(
        <FloatingActionButton aria-label="Add content">
          <AddIcon />
        </FloatingActionButton>,
      );
      expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    });
  });
});
