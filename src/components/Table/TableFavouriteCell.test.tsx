import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Table, TableBody, TableCard, TableRow, TableScrollArea } from "./Table";
import { TableFavouriteCell, type TableFavouriteCellProps } from "./TableFavouriteCell";

function renderCell(
  props: Partial<TableFavouriteCellProps> & { ref?: React.Ref<HTMLTableCellElement> } = {},
) {
  const onToggle = vi.fn();
  const utils = render(
    <TableCard>
      <TableScrollArea>
        <Table>
          <TableBody>
            <TableRow>
              <TableFavouriteCell
                favourite={false}
                onToggle={onToggle}
                label="Favourite"
                {...props}
              />
            </TableRow>
          </TableBody>
        </Table>
      </TableScrollArea>
    </TableCard>,
  );
  return { onToggle, ...utils };
}

describe("TableFavouriteCell", () => {
  describe("API", () => {
    it("renders a td holding a toggle button with the accessible name", () => {
      renderCell();
      expect(screen.getByRole("button", { name: "Favourite" })).toBeInTheDocument();
      expect(screen.getByRole("cell")).toBeInTheDocument();
    });

    it("uses the 48px column width and merges className", () => {
      renderCell({ className: "extra" });
      const cell = screen.getByRole("cell");
      expect(cell).toHaveClass("w-12", "max-w-12", "extra");
    });

    it("forwards the ref to the td", () => {
      const ref = { current: null as HTMLTableCellElement | null };
      renderCell({ ref });
      expect(ref.current).toBeInstanceOf(HTMLTableCellElement);
    });

    it("renders the filled star when favourite", () => {
      const { container } = renderCell({ favourite: true });
      const layers = container.querySelectorAll("button svg:not([class*='size-0']) > g");
      expect(layers[1]).toHaveClass("opacity-100");
      expect(screen.getByRole("button")).toHaveClass(
        "[&_svg>g:last-child_path]:[fill:var(--table-favourite-fill)]",
      );
    });

    it("renders the outlined star when not favourite", () => {
      const { container } = renderCell({ favourite: false });
      const layers = container.querySelectorAll("button svg:not([class*='size-0']) > g");
      expect(layers[0]).toHaveClass("opacity-100");
      expect(screen.getByRole("button").className).not.toContain("table-favourite-fill");
    });
  });

  describe("Behaviour", () => {
    it("calls onToggle with the next state on click", async () => {
      const user = userEvent.setup();
      const { onToggle } = renderCell({ favourite: false });
      await user.click(screen.getByRole("button"));
      expect(onToggle).toHaveBeenCalledWith(true);
    });

    it("calls onToggle with false when currently a favourite", async () => {
      const user = userEvent.setup();
      const { onToggle } = renderCell({ favourite: true });
      await user.click(screen.getByRole("button"));
      expect(onToggle).toHaveBeenCalledWith(false);
    });

    it("toggles with Enter and Space", async () => {
      const user = userEvent.setup();
      const { onToggle } = renderCell();
      await user.tab();
      expect(screen.getByRole("button")).toHaveFocus();
      await user.keyboard("{Enter}");
      await user.keyboard(" ");
      expect(onToggle).toHaveBeenCalledTimes(2);
    });

    it("does not call onToggle when disabled", async () => {
      const user = userEvent.setup();
      const { onToggle } = renderCell({ disabled: true });
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      await user.click(button);
      expect(onToggle).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("reflects state in aria-pressed", () => {
      const { rerender } = renderCell({ favourite: false });
      expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
      rerender(
        <TableCard>
          <TableScrollArea>
            <Table>
              <TableBody>
                <TableRow>
                  <TableFavouriteCell favourite onToggle={() => {}} label="Favourite" />
                </TableRow>
              </TableBody>
            </Table>
          </TableScrollArea>
        </TableCard>,
      );
      expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    });

    it("has no accessibility violations", async () => {
      const { container } = renderCell({ favourite: true });
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations when disabled", async () => {
      const { container } = renderCell({ disabled: true });
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
