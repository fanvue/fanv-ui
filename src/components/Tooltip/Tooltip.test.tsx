import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./Tooltip";

function renderTooltip(contentProps?: React.ComponentPropsWithoutRef<typeof TooltipContent>) {
  return render(
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent {...contentProps}>Tooltip text</TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  );
}

describe("Tooltip", () => {
  describe("API", () => {
    it("renders tooltip content on hover", async () => {
      const user = userEvent.setup();
      renderTooltip();
      const trigger = screen.getByRole("button", { name: "Hover me" });
      await user.hover(trigger);
      expect(await screen.findByRole("tooltip")).toHaveTextContent("Tooltip text");
    });

    it("hides tooltip when not hovered", () => {
      renderTooltip();
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("applies custom className to content", async () => {
      const user = userEvent.setup();
      renderTooltip({ className: "custom-class" });
      await user.hover(screen.getByRole("button", { name: "Hover me" }));
      await screen.findByRole("tooltip");
      expect(document.querySelector(".custom-class")).toBeInTheDocument();
    });

    it("forwards ref to content", async () => {
      const ref = React.createRef<HTMLDivElement>();
      const user = userEvent.setup();
      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent ref={ref}>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      );
      await user.hover(screen.getByRole("button", { name: "Hover me" }));
      await screen.findByRole("tooltip");
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const user = userEvent.setup();
      const { container } = renderTooltip();
      await user.hover(screen.getByRole("button", { name: "Hover me" }));
      await screen.findByRole("tooltip");
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
