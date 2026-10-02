import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Chip } from "../Chip/Chip";
import { ChipGroup } from "./ChipGroup";

describe("ChipGroup", () => {
  describe("API", () => {
    it("renders a group with the provided accessible name", () => {
      render(
        <ChipGroup aria-label="Categories">
          <Chip>Music</Chip>
          <Chip>Fitness</Chip>
        </ChipGroup>,
      );
      expect(screen.getByRole("group", { name: "Categories" })).toBeInTheDocument();
    });

    it("supports aria-labelledby", () => {
      render(
        <>
          <span id="chip-group-label">Timeframe</span>
          <ChipGroup aria-labelledby="chip-group-label">
            <Chip>7 days</Chip>
            <Chip>30 days</Chip>
          </ChipGroup>
        </>,
      );
      expect(screen.getByRole("group", { name: "Timeframe" })).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <ChipGroup aria-label="Categories" className="custom">
          <Chip>Music</Chip>
        </ChipGroup>,
      );
      expect(screen.getByRole("group")).toHaveClass("custom");
    });

    it("keeps chips on a single scrollable line by default", () => {
      render(
        <ChipGroup aria-label="Categories">
          <Chip>Music</Chip>
        </ChipGroup>,
      );
      const group = screen.getByRole("group");
      expect(group).toHaveClass("flex-nowrap", "overflow-x-auto");
      expect(group).not.toHaveClass("flex-wrap");
    });

    it("wraps chips when wrapped is true", () => {
      render(
        <ChipGroup aria-label="Categories" wrapped>
          <Chip>Music</Chip>
        </ChipGroup>,
      );
      const group = screen.getByRole("group");
      expect(group).toHaveClass("flex-wrap");
      expect(group).not.toHaveClass("overflow-x-auto");
    });

    it("forwards its ref to the underlying element", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(
        <ChipGroup ref={ref} aria-label="Categories">
          <Chip>Music</Chip>
        </ChipGroup>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <ChipGroup aria-label="Categories">
          <Chip selected onClick={() => {}}>
            Music
          </Chip>
          <Chip onClick={() => {}}>Fitness</Chip>
        </ChipGroup>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations when wrapped", async () => {
      const { container } = render(
        <ChipGroup aria-label="Categories" wrapped>
          <Chip>Music</Chip>
          <Chip>Fitness</Chip>
        </ChipGroup>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
