import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Accordion } from "./Accordion";
import { AccordionContent } from "./AccordionContent";
import { AccordionItem } from "./AccordionItem";
import { AccordionTrigger } from "./AccordionTrigger";

function renderAccordion(props?: {
  type?: "single" | "multiple";
  collapsible?: boolean;
  rootDisabled?: boolean;
  itemDisabled?: boolean;
  defaultValue?: string | string[];
}) {
  const type = props?.type ?? "single";
  const rootProps =
    type === "single"
      ? {
          type: "single" as const,
          collapsible: props?.collapsible ?? true,
          defaultValue: (props?.defaultValue as string) ?? undefined,
          disabled: props?.rootDisabled,
        }
      : {
          type: "multiple" as const,
          defaultValue: (props?.defaultValue as string[]) ?? undefined,
          disabled: props?.rootDisabled,
        };

  return render(
    <Accordion {...rootProps}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Section 1</AccordionTrigger>
        <AccordionContent>Content 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Section 2</AccordionTrigger>
        <AccordionContent>Content 2</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3" disabled={props?.itemDisabled}>
        <AccordionTrigger>Section 3</AccordionTrigger>
        <AccordionContent>Content 3</AccordionContent>
      </AccordionItem>
    </Accordion>,
  );
}

describe("Accordion", () => {
  describe("API", () => {
    it("renders all triggers", () => {
      renderAccordion();
      expect(screen.getByText("Section 1")).toBeInTheDocument();
      expect(screen.getByText("Section 2")).toBeInTheDocument();
      expect(screen.getByText("Section 3")).toBeInTheDocument();
    });

    it("expands content when clicking a trigger", async () => {
      const user = userEvent.setup();
      renderAccordion();
      await user.click(screen.getByRole("button", { name: "Section 1" }));
      expect(screen.getByText("Content 1")).toBeVisible();
    });

    it("collapses content when clicking the same trigger again (collapsible)", async () => {
      const user = userEvent.setup();
      renderAccordion({ collapsible: true });
      const trigger = screen.getByRole("button", { name: "Section 1" });
      await user.click(trigger);
      expect(screen.getByText("Content 1")).toBeVisible();
      await user.click(trigger);
      expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
    });

    it("only allows one item open at a time in single mode", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single" });
      await user.click(screen.getByRole("button", { name: "Section 1" }));
      expect(screen.getByText("Content 1")).toBeVisible();
      await user.click(screen.getByRole("button", { name: "Section 2" }));
      expect(screen.getByText("Content 2")).toBeVisible();
      expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
    });

    it("allows multiple items open in multiple mode", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "multiple" });
      await user.click(screen.getByRole("button", { name: "Section 1" }));
      await user.click(screen.getByRole("button", { name: "Section 2" }));
      expect(screen.getByText("Content 1")).toBeVisible();
      expect(screen.getByText("Content 2")).toBeVisible();
    });

    it("does not expand a disabled item", async () => {
      const user = userEvent.setup();
      renderAccordion({ itemDisabled: true });
      await user.click(screen.getByRole("button", { name: "Section 3" }));
      expect(screen.queryByText("Content 3")).not.toBeInTheDocument();
    });

    it("does not expand any item when root is disabled", async () => {
      const user = userEvent.setup();
      renderAccordion({ rootDisabled: true });
      await user.click(screen.getByRole("button", { name: "Section 1" }));
      expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Section 2" }));
      expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
    });

    it("renders with a default expanded value", () => {
      renderAccordion({ defaultValue: "item-2" });
      expect(screen.getByText("Content 2")).toBeVisible();
    });

    it("supports controlled mode", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Accordion type="single" collapsible value="" onValueChange={onValueChange}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Section 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      await user.click(screen.getByRole("button", { name: "Section 1" }));
      expect(onValueChange).toHaveBeenCalledWith("item-1");
    });

    it("applies custom className to AccordionItem", () => {
      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="custom-item">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      const item = container.querySelector("[data-state][data-orientation]");
      expect(item).toHaveClass("custom-item");
    });

    it("applies custom className to AccordionTrigger", () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="custom-trigger">Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      expect(screen.getByRole("button")).toHaveClass("custom-trigger");
    });

    it("applies custom className to AccordionContent", async () => {
      const user = userEvent.setup();
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent className="custom-content">Content</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      await user.click(screen.getByRole("button"));
      expect(screen.getByRole("region")).toHaveClass("custom-content");
    });

    it("forwards ref to AccordionItem", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" ref={ref}>
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("forwards ref to AccordionTrigger", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger ref={ref}>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("forwards ref to AccordionContent", async () => {
      const ref = React.createRef<HTMLDivElement>();
      const user = userEvent.setup();
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent ref={ref}>Content</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      await user.click(screen.getByRole("button"));
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = renderAccordion();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("supports keyboard navigation with ArrowDown between triggers", async () => {
      const user = userEvent.setup();
      renderAccordion();
      const trigger1 = screen.getByRole("button", { name: "Section 1" });
      trigger1.focus();
      await user.keyboard("{ArrowDown}");
      expect(screen.getByRole("button", { name: "Section 2" })).toHaveFocus();
    });

    it("supports keyboard navigation with ArrowUp between triggers", async () => {
      const user = userEvent.setup();
      renderAccordion();
      const trigger2 = screen.getByRole("button", { name: "Section 2" });
      trigger2.focus();
      await user.keyboard("{ArrowUp}");
      expect(screen.getByRole("button", { name: "Section 1" })).toHaveFocus();
    });

    it("expands content with Enter key", async () => {
      const user = userEvent.setup();
      renderAccordion();
      const trigger1 = screen.getByRole("button", { name: "Section 1" });
      trigger1.focus();
      await user.keyboard("{Enter}");
      expect(screen.getByText("Content 1")).toBeVisible();
    });

    it("expands content with Space key", async () => {
      const user = userEvent.setup();
      renderAccordion();
      const trigger1 = screen.getByRole("button", { name: "Section 1" });
      trigger1.focus();
      await user.keyboard(" ");
      expect(screen.getByText("Content 1")).toBeVisible();
    });
  });
});
