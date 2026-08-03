import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
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
  afterEach(() => {
    vi.useRealTimers();
  });

  describe("delayDuration", () => {
    function hoverWithFakeTimers() {
      vi.useFakeTimers();
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      );
      fireEvent.pointerMove(screen.getByRole("button", { name: "Hover me" }));
    }

    it("keeps the tooltip closed until 200ms after hover", () => {
      hoverWithFakeTimers();
      act(() => {
        vi.advanceTimersByTime(199);
      });
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("opens at 200ms without waiting for Radix's 700ms default", () => {
      hoverWithFakeTimers();
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(screen.getByRole("tooltip")).toHaveTextContent("Tooltip text");
    });
  });

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

    it("fades the content in and out rather than blinking it on", async () => {
      const user = userEvent.setup();
      renderTooltip({ className: "styled-content" });
      await user.hover(screen.getByRole("button", { name: "Hover me" }));
      await screen.findByRole("tooltip");
      expect(document.querySelector(".styled-content")).toHaveClass(
        "data-[state=delayed-open]:[animation:fv-tooltip-in_150ms_ease-out]",
        "data-[state=instant-open]:[animation:fv-tooltip-in_150ms_ease-out]",
        "data-[state=closed]:[animation:fv-tooltip-out_120ms_ease-in]",
      );
    });

    it("renders the v2 surface: tight radius, visible border, light shadow", async () => {
      const user = userEvent.setup();
      renderTooltip({ className: "styled-content" });
      await user.hover(screen.getByRole("button", { name: "Hover me" }));
      await screen.findByRole("tooltip");
      const content = document.querySelector(".styled-content");
      expect(content).toHaveClass("rounded-xs", "border", "border-border-selected", "shadow-sm");
      expect(content).not.toHaveClass("rounded-sm");
    });

    it("drops the animation when the viewer asks for reduced motion", async () => {
      const user = userEvent.setup();
      renderTooltip({ className: "styled-content" });
      await user.hover(screen.getByRole("button", { name: "Hover me" }));
      await screen.findByRole("tooltip");
      expect(document.querySelector(".styled-content")).toHaveClass(
        "motion-reduce:[animation:none]",
      );
    });

    it("lets a consumer override the exit animation, since its own class comes last", async () => {
      const user = userEvent.setup();
      renderTooltip({
        className: "styled-content data-[state=closed]:[animation:none]",
      });
      await user.hover(screen.getByRole("button", { name: "Hover me" }));
      await screen.findByRole("tooltip");
      const content = document.querySelector(".styled-content");
      expect(content).toHaveClass("data-[state=closed]:[animation:none]");
      expect(content).not.toHaveClass(
        "data-[state=closed]:[animation:fv-tooltip-out_120ms_ease-in]",
      );
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

    it("renders with placement prop without errors", async () => {
      const user = userEvent.setup();
      renderTooltip({ placement: "bottom-start" });
      await user.hover(screen.getByRole("button", { name: "Hover me" }));
      expect(await screen.findByRole("tooltip")).toHaveTextContent("Tooltip text");
    });

    it("renders with a placement that has no alignment suffix", async () => {
      const user = userEvent.setup();
      renderTooltip({ placement: "right" });
      await user.hover(screen.getByRole("button", { name: "Hover me" }));
      expect(await screen.findByRole("tooltip")).toHaveTextContent("Tooltip text");
    });

    it("still accepts side and align directly when placement is not provided", async () => {
      const user = userEvent.setup();
      renderTooltip({ side: "left", align: "end" });
      await user.hover(screen.getByRole("button", { name: "Hover me" }));
      expect(await screen.findByRole("tooltip")).toHaveTextContent("Tooltip text");
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
