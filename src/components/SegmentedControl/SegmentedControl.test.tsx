import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { GridViewIcon } from "../Icons/GridViewIcon";
import { ListViewIcon } from "../Icons/ListViewIcon";
import { SegmentedControl } from "./SegmentedControl";

const twoOptions = [
  { label: "Net", value: "net" },
  { label: "Gross", value: "gross" },
];

const threeOptions = [
  { label: "Net", value: "net" },
  { label: "Gross", value: "gross" },
  { label: "Total", value: "total" },
];

const iconOptions = [
  { label: "List view", value: "list", icon: <ListViewIcon size={16} aria-hidden="true" /> },
  { label: "Grid view", value: "grid", icon: <GridViewIcon size={16} aria-hidden="true" /> },
];

const threeIconOptions = [
  { label: "List view", value: "list", icon: <ListViewIcon size={16} aria-hidden="true" /> },
  { label: "Grid view", value: "grid", icon: <GridViewIcon size={16} aria-hidden="true" /> },
  { label: "Table view", value: "table", icon: <ListViewIcon size={16} aria-hidden="true" /> },
];

const aiOptions = [
  { label: "Home", value: "home", icon: <ListViewIcon size={16} aria-hidden="true" /> },
  { label: "Agent", value: "agent", icon: <GridViewIcon size={16} aria-hidden="true" /> },
];

describe("SegmentedControl", () => {
  describe("API", () => {
    it("applies custom className", () => {
      const { container } = render(
        <SegmentedControl className="custom-class" options={twoOptions} aria-label="Amount" />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("renders one radio per option", () => {
      render(<SegmentedControl options={threeOptions} aria-label="Amount" />);
      expect(screen.getAllByRole("radio")).toHaveLength(3);
    });

    it("selects first option by default (uncontrolled)", () => {
      render(<SegmentedControl options={twoOptions} aria-label="Amount" />);
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveAttribute("aria-checked", "true");
      expect(radios[1]).toHaveAttribute("aria-checked", "false");
    });

    it("supports defaultValue", () => {
      render(<SegmentedControl options={twoOptions} defaultValue="gross" aria-label="Amount" />);
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveAttribute("aria-checked", "false");
      expect(radios[1]).toHaveAttribute("aria-checked", "true");
    });

    it("can be controlled", () => {
      const { rerender } = render(
        <SegmentedControl options={twoOptions} value="net" aria-label="Amount" />,
      );
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveAttribute("aria-checked", "true");

      rerender(<SegmentedControl options={twoOptions} value="gross" aria-label="Amount" />);
      expect(radios[0]).toHaveAttribute("aria-checked", "false");
      expect(radios[1]).toHaveAttribute("aria-checked", "true");
    });

    it("calls onChange when a segment is selected", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<SegmentedControl options={twoOptions} onChange={handleChange} aria-label="Amount" />);
      await user.click(screen.getByText("Gross"));
      expect(handleChange).toHaveBeenCalledWith("gross");
    });

    it("does not fire onChange when clicking the already-selected segment", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<SegmentedControl options={twoOptions} onChange={handleChange} aria-label="Amount" />);
      await user.click(screen.getByText("Net"));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("disables interaction when disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <SegmentedControl
          disabled
          options={twoOptions}
          onChange={handleChange}
          aria-label="Amount"
        />,
      );
      await user.click(screen.getByText("Gross"));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("forwards ref", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<SegmentedControl ref={ref} options={twoOptions} aria-label="Amount" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("variants", () => {
    it("applies fill layout to segments", () => {
      render(<SegmentedControl variant="fill" options={twoOptions} aria-label="Amount" />);
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveClass("flex-1");
    });

    it("applies hug layout to segments by default", () => {
      render(<SegmentedControl options={twoOptions} aria-label="Amount" />);
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveClass("shrink-0");
    });

    it("applies the typography class for the given size", () => {
      render(<SegmentedControl size="48" options={twoOptions} aria-label="Amount" />);
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveClass("typography-body-default-16px-semibold");
    });
  });

  describe("icon-only segments", () => {
    it("renders icon-only segments with no visible label text", () => {
      render(<SegmentedControl appearance="plain" options={iconOptions} aria-label="View" />);
      expect(screen.queryByText("List view")).not.toBeInTheDocument();
      expect(screen.queryByText("Grid view")).not.toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "List view" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "Grid view" })).toBeInTheDocument();
    });

    it("uses the label as the aria-label accessible name", () => {
      render(<SegmentedControl appearance="plain" options={iconOptions} aria-label="View" />);
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveAttribute("aria-label", "List view");
      expect(radios[1]).toHaveAttribute("aria-label", "Grid view");
    });

    it("renders label segments unaffected when mixed with icon segments", () => {
      render(
        <SegmentedControl
          options={[{ label: "Net", value: "net" }, ...iconOptions]}
          aria-label="Mixed"
        />,
      );
      expect(screen.getByText("Net")).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "List view" })).toBeInTheDocument();
    });

    it("supports uncontrolled selection across icon segments", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <SegmentedControl
          appearance="plain"
          options={iconOptions}
          onChange={handleChange}
          aria-label="View"
        />,
      );
      await user.click(screen.getByRole("radio", { name: "Grid view" }));
      expect(handleChange).toHaveBeenCalledWith("grid");
    });

    it("supports controlled selection across icon segments", () => {
      const { rerender } = render(
        <SegmentedControl
          appearance="plain"
          options={iconOptions}
          value="list"
          aria-label="View"
        />,
      );
      expect(screen.getByRole("radio", { name: "List view" })).toHaveAttribute(
        "aria-checked",
        "true",
      );

      rerender(
        <SegmentedControl
          appearance="plain"
          options={iconOptions}
          value="grid"
          aria-label="View"
        />,
      );
      expect(screen.getByRole("radio", { name: "Grid view" })).toHaveAttribute(
        "aria-checked",
        "true",
      );
    });

    it("navigates icon segments with the keyboard", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <SegmentedControl
          appearance="plain"
          options={iconOptions}
          onChange={handleChange}
          aria-label="View"
        />,
      );
      const radios = screen.getAllByRole("radio");

      radios[0]?.focus();
      await user.keyboard("{ArrowRight}");

      expect(handleChange).toHaveBeenCalledWith("grid");
      expect(radios[1]).toHaveFocus();
    });

    it("applies plain appearance without the pill container background", () => {
      const { container } = render(
        <SegmentedControl appearance="plain" options={iconOptions} aria-label="View" />,
      );
      expect(container.firstChild).not.toHaveClass("bg-surface-tertiary");
    });
  });

  describe("brand appearance", () => {
    it("is a deprecated alias of ai and renders the same pill", () => {
      render(
        <SegmentedControl
          appearance="brand"
          options={aiOptions}
          defaultValue="agent"
          aria-label="Mode"
        />,
      );
      const selected = screen.getByRole("radio", { name: "Agent" });
      expect(selected).toHaveClass("bg-buttons-ai-background-gradient-default-start");
      expect(selected).not.toHaveClass("bg-brand-primary-muted");
    });

    it("renders icon alongside visible label, as ai does", () => {
      render(<SegmentedControl appearance="brand" options={aiOptions} aria-label="Mode" />);
      expect(screen.getByRole("radio", { name: "Agent" })).toHaveTextContent("Agent");
    });
  });

  describe("ai appearance", () => {
    it("renders both the icon and the visible label for each segment", () => {
      render(<SegmentedControl appearance="ai" options={aiOptions} aria-label="Mode" />);
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Agent")).toBeInTheDocument();
      // Accessible name comes from the visible text, not an aria-label override.
      expect(screen.getByRole("radio", { name: "Home" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "Agent" })).toBeInTheDocument();
    });

    it("does not override the accessible name with aria-label when the label is visible", () => {
      render(<SegmentedControl appearance="ai" options={aiOptions} aria-label="Mode" />);
      expect(screen.getByRole("radio", { name: "Home" })).not.toHaveAttribute("aria-label");
    });

    it("applies the ai pill to the selected segment", () => {
      render(
        <SegmentedControl
          appearance="ai"
          options={aiOptions}
          defaultValue="agent"
          aria-label="Mode"
        />,
      );
      expect(screen.getByRole("radio", { name: "Agent" })).toHaveClass(
        "bg-buttons-ai-background-gradient-default-start",
      );
    });

    it("keeps the pill container background", () => {
      const { container } = render(
        <SegmentedControl appearance="ai" options={aiOptions} aria-label="Mode" />,
      );
      expect(container.firstChild).toHaveClass("bg-surface-tertiary");
    });

    it("selects via click and reports the value", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <SegmentedControl
          appearance="ai"
          options={aiOptions}
          onChange={handleChange}
          aria-label="Mode"
        />,
      );
      await user.click(screen.getByRole("radio", { name: "Agent" }));
      expect(handleChange).toHaveBeenCalledWith("agent");
    });

    it("has no accessibility violations", async () => {
      const { container } = render(
        <SegmentedControl appearance="ai" options={aiOptions} aria-label="Mode" />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("keyboard navigation", () => {
    it("moves focus and selects with ArrowRight", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<SegmentedControl options={twoOptions} onChange={handleChange} aria-label="Amount" />);
      const radios = screen.getAllByRole("radio");

      radios[0]?.focus();
      await user.keyboard("{ArrowRight}");

      expect(handleChange).toHaveBeenCalledWith("gross");
      expect(radios[1]).toHaveFocus();
    });

    it("moves focus and selects with ArrowLeft", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <SegmentedControl
          options={twoOptions}
          defaultValue="gross"
          onChange={handleChange}
          aria-label="Amount"
        />,
      );
      const radios = screen.getAllByRole("radio");

      radios[1]?.focus();
      await user.keyboard("{ArrowLeft}");

      expect(handleChange).toHaveBeenCalledWith("net");
      expect(radios[0]).toHaveFocus();
    });

    it("wraps to the first option from the last with ArrowRight (three options)", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <SegmentedControl
          options={threeOptions}
          defaultValue="total"
          onChange={handleChange}
          aria-label="Amount"
        />,
      );
      const radios = screen.getAllByRole("radio");

      radios[2]?.focus();
      await user.keyboard("{ArrowRight}");

      expect(handleChange).toHaveBeenCalledWith("net");
      expect(radios[0]).toHaveFocus();
    });

    it("does not navigate when disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <SegmentedControl
          disabled
          options={twoOptions}
          onChange={handleChange}
          aria-label="Amount"
        />,
      );
      const radios = screen.getAllByRole("radio");

      radios[0]?.focus();
      await user.keyboard("{ArrowRight}");

      expect(handleChange).not.toHaveBeenCalled();
      expect(radios[0]).toHaveAttribute("aria-checked", "true");
    });

    it("sets tabIndex={0} on selected and tabIndex={-1} on unselected", () => {
      render(<SegmentedControl options={threeOptions} aria-label="Amount" />);
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveAttribute("tabIndex", "0");
      expect(radios[1]).toHaveAttribute("tabIndex", "-1");
      expect(radios[2]).toHaveAttribute("tabIndex", "-1");
    });

    it("falls back to first option tabbable when value matches no option", () => {
      render(<SegmentedControl options={twoOptions} value="stale" aria-label="Amount" />);
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveAttribute("tabIndex", "0");
      expect(radios[1]).toHaveAttribute("tabIndex", "-1");
    });
  });

  describe("collapsible", () => {
    /**
     * jsdom has no layout, so drive the auto-collapse measurement directly: the off-screen
     * replica is the only `aria-hidden="true"` element the hook measures, so return the
     * "required" width for it and the "available" width for everything else (notably the
     * root's parent). A controllable ResizeObserver lets tests re-evaluate after changing
     * the widths, standing in for a real resize.
     */
    let rectSpy: ReturnType<typeof vi.spyOn> | undefined;
    const resizeCallbacks: ResizeObserverCallback[] = [];

    const setWidths = ({ available, required }: { available: number; required: number }) => {
      rectSpy?.mockRestore();
      rectSpy = vi
        .spyOn(HTMLElement.prototype, "getBoundingClientRect")
        .mockImplementation(function (this: HTMLElement) {
          const width = this.getAttribute("aria-hidden") === "true" ? required : available;
          return {
            width,
            height: 0,
            top: 0,
            left: 0,
            right: width,
            bottom: 0,
            x: 0,
            y: 0,
          } as DOMRect;
        });
    };

    const fireResize = () => {
      act(() => {
        for (const cb of resizeCallbacks) {
          cb([], {} as ResizeObserver);
        }
      });
    };

    beforeEach(() => {
      resizeCallbacks.length = 0;
      vi.stubGlobal(
        "ResizeObserver",
        class {
          constructor(cb: ResizeObserverCallback) {
            resizeCallbacks.push(cb);
          }
          observe() {}
          unobserve() {}
          disconnect() {}
        },
      );
    });

    afterEach(() => {
      rectSpy?.mockRestore();
      rectSpy = undefined;
      vi.unstubAllGlobals();
    });

    it("collapses to a single icon toggle when the container is too narrow", () => {
      setWidths({ available: 100, required: 300 });
      render(
        <SegmentedControl appearance="plain" collapsible options={iconOptions} aria-label="View" />,
      );

      // No radiogroup semantics while collapsed — a single button that cycles.
      expect(screen.queryAllByRole("radio")).toHaveLength(0);
      const toggle = screen.getByRole("button", { name: "List view" });
      expect(toggle).toBeInTheDocument();
      expect(toggle).not.toHaveAttribute("role", "radio");
    });

    it("stays expanded when the container has room", () => {
      setWidths({ available: 300, required: 100 });
      render(
        <SegmentedControl appearance="plain" collapsible options={iconOptions} aria-label="View" />,
      );
      expect(screen.getAllByRole("radio")).toHaveLength(2);
    });

    it("cycles to the next option when the collapsed toggle is clicked", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      setWidths({ available: 100, required: 300 });
      render(
        <SegmentedControl
          appearance="plain"
          collapsible
          options={iconOptions}
          onChange={handleChange}
          aria-label="View"
        />,
      );
      await user.click(screen.getByRole("button", { name: "List view" }));
      expect(handleChange).toHaveBeenCalledWith("grid");
      // Uncontrolled: the toggle now reflects the new selection.
      expect(screen.getByRole("button", { name: "Grid view" })).toBeInTheDocument();
    });

    it("wraps from the last option back to the first (three options)", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      setWidths({ available: 100, required: 300 });
      render(
        <SegmentedControl
          appearance="plain"
          collapsible
          options={threeIconOptions}
          defaultValue="table"
          onChange={handleChange}
          aria-label="View"
        />,
      );
      await user.click(screen.getByRole("button", { name: "Table view" }));
      expect(handleChange).toHaveBeenCalledWith("list");
    });

    it("cycles with the keyboard (Enter)", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      setWidths({ available: 100, required: 300 });
      render(
        <SegmentedControl
          appearance="plain"
          collapsible
          options={iconOptions}
          onChange={handleChange}
          aria-label="View"
        />,
      );
      screen.getByRole("button", { name: "List view" }).focus();
      await user.keyboard("{Enter}");
      expect(handleChange).toHaveBeenCalledWith("grid");
    });

    it("does not cycle when disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      setWidths({ available: 100, required: 300 });
      render(
        <SegmentedControl
          appearance="plain"
          collapsible
          disabled
          options={iconOptions}
          onChange={handleChange}
          aria-label="View"
        />,
      );
      await user.click(screen.getByRole("button", { name: "List view" }));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("expands again when the container grows", () => {
      setWidths({ available: 100, required: 300 });
      render(
        <SegmentedControl appearance="plain" collapsible options={iconOptions} aria-label="View" />,
      );
      expect(screen.queryAllByRole("radio")).toHaveLength(0);

      setWidths({ available: 400, required: 300 });
      fireResize();
      expect(screen.getAllByRole("radio")).toHaveLength(2);
    });

    it("supports the ai appearance", () => {
      setWidths({ available: 100, required: 300 });
      render(
        <SegmentedControl appearance="ai" collapsible options={aiOptions} aria-label="Mode" />,
      );
      // Collapsed ai shows the selected icon only: the visible toggle has no label text
      // (the off-screen measurement replica still carries it, so assert on the toggle itself).
      const toggle = screen.getByRole("button", { name: "Home" });
      expect(toggle).toBeInTheDocument();
      expect(toggle.textContent).toBe("");
    });

    it("renders the collapsed ai toggle as a square (circular once rounded)", () => {
      setWidths({ available: 100, required: 300 });
      render(
        <SegmentedControl appearance="ai" collapsible options={aiOptions} aria-label="Mode" />,
      );
      const toggle = screen.getByRole("button", { name: "Home" });
      // Symmetric padding + aspect-square give a circle rather than the wider-than-tall pill.
      expect(toggle).toHaveClass("aspect-square");
      expect(toggle).toHaveClass("rounded-full");
      // Neutral surface, not the ai pill (Color/Surface/Secondary in the rail design).
      expect(toggle).toHaveClass("bg-surface-secondary");
    });

    it("shows the collapsedIcon in place of the selected option's icon", () => {
      setWidths({ available: 100, required: 300 });
      render(
        <SegmentedControl
          appearance="ai"
          collapsible
          collapsedIcon={<span data-testid="toggle-glyph" />}
          options={[
            {
              label: "Home",
              value: "home",
              icon: <ListViewIcon size={16} data-testid="home-icon" aria-hidden="true" />,
            },
            {
              label: "Agent",
              value: "agent",
              icon: <GridViewIcon size={16} aria-hidden="true" />,
            },
          ]}
          aria-label="Mode"
        />,
      );

      const toggle = screen.getByRole("button", { name: "Home" });
      expect(toggle).toContainElement(screen.getByTestId("toggle-glyph"));
      // The selected option's own icon survives only in the off-screen measurement replica.
      expect(toggle.querySelector("[data-testid='home-icon']")).toBeNull();
    });

    it("still announces the selected option as the collapsed toggle's name", () => {
      setWidths({ available: 100, required: 300 });
      render(
        <SegmentedControl
          appearance="ai"
          collapsible
          collapsedIcon={<span data-testid="toggle-glyph" />}
          options={aiOptions}
          value="agent"
          aria-label="Mode"
        />,
      );

      expect(screen.getByRole("button", { name: "Agent" })).toBeInTheDocument();
    });

    it("collapses without per-option icons when a collapsedIcon is given", () => {
      setWidths({ available: 100, required: 300 });
      render(
        <SegmentedControl
          appearance="ai"
          collapsible
          collapsedIcon={<span data-testid="toggle-glyph" />}
          options={twoOptions}
          aria-label="Amount"
        />,
      );

      expect(screen.queryAllByRole("radio")).toHaveLength(0);
      expect(screen.getByTestId("toggle-glyph")).toBeInTheDocument();
    });

    it("centres the collapsed toggle and drops the container chrome", () => {
      setWidths({ available: 100, required: 300 });
      const { container } = render(
        <SegmentedControl
          appearance="ai"
          variant="fill"
          collapsible
          options={aiOptions}
          aria-label="Mode"
        />,
      );

      const root = container.firstElementChild as HTMLElement;
      // Otherwise the toggle sits at the start of a full-width row, off the rail's centre line.
      expect(root).toHaveClass("justify-center");
      expect(root).not.toHaveClass("bg-surface-tertiary");
    });

    it("has no accessibility violations while collapsed", async () => {
      setWidths({ available: 100, required: 300 });
      const { container } = render(
        <SegmentedControl appearance="plain" collapsible options={iconOptions} aria-label="View" />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    describe("dev warnings", () => {
      let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

      beforeEach(() => {
        consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      });

      afterEach(() => {
        consoleWarnSpy.mockRestore();
      });

      it("warns and does not collapse for the pill appearance", () => {
        setWidths({ available: 100, required: 300 });
        render(<SegmentedControl collapsible options={twoOptions} aria-label="Amount" />);
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          expect.stringContaining('`collapsible` is only supported for the "plain" and "ai"'),
        );
        expect(screen.getAllByRole("radio")).toHaveLength(2);
      });

      it("warns and does not collapse when an option is missing an icon", () => {
        setWidths({ available: 100, required: 300 });
        render(
          <SegmentedControl
            appearance="plain"
            collapsible
            options={[
              {
                label: "List view",
                value: "list",
                icon: <ListViewIcon size={16} aria-hidden="true" />,
              },
              { label: "Grid view", value: "grid" },
            ]}
            aria-label="View"
          />,
        );
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          expect.stringContaining("`collapsible` requires every option to define an `icon`"),
        );
        expect(screen.getAllByRole("radio")).toHaveLength(2);
      });

      it("does not warn when options lack icons but a collapsedIcon is given", () => {
        setWidths({ available: 100, required: 300 });
        render(
          <SegmentedControl
            appearance="ai"
            collapsible
            collapsedIcon={<span data-testid="toggle-glyph" />}
            options={twoOptions}
            aria-label="Amount"
          />,
        );
        expect(consoleWarnSpy).not.toHaveBeenCalled();
      });

      it("does not warn for a valid collapsible plain control", () => {
        setWidths({ available: 300, required: 100 });
        render(
          <SegmentedControl
            appearance="plain"
            collapsible
            options={iconOptions}
            aria-label="View"
          />,
        );
        expect(consoleWarnSpy).not.toHaveBeenCalled();
      });
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
        <SegmentedControl options={threeOptions} aria-label="Amount type" />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with icon-only segments", async () => {
      const { container } = render(
        <SegmentedControl appearance="plain" options={iconOptions} aria-label="View" />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("warns in dev when an icon-only segment is missing a label", () => {
      render(
        <SegmentedControl
          appearance="plain"
          options={[
            { label: "", value: "list", icon: <ListViewIcon size={16} aria-hidden="true" /> },
          ]}
          aria-label="View"
        />,
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('icon-only segment "list" is missing a non-empty `label`'),
      );
    });

    it("does not warn when an icon-only segment has a label", () => {
      render(<SegmentedControl appearance="plain" options={iconOptions} aria-label="View" />);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it("warns in dev when no accessible name is provided", () => {
      render(<SegmentedControl options={twoOptions} />);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("no accessible name provided"),
      );
    });

    it("does not warn when aria-label is provided", () => {
      render(<SegmentedControl options={twoOptions} aria-label="Amount" />);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it("does not warn when aria-labelledby is provided", () => {
      render(<SegmentedControl options={twoOptions} aria-labelledby="external-label" />);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });
});
