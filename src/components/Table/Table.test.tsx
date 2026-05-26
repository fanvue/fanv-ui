import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  Table,
  TableBody,
  TableCard,
  TableCell,
  TableCellContent,
  TableHead,
  TableHeader,
  TableRow,
  TableScrollArea,
  TableSortLabel,
} from "./Table";

describe("Table", () => {
  describe("API", () => {
    it("applies custom className on TableCard", () => {
      render(
        <TableCard className="table-surface" data-testid="card">
          <TableScrollArea>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>A</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableScrollArea>
        </TableCard>,
      );
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("table-surface");
      expect(card).toHaveClass("rounded-3xl");
      expect(card).toHaveClass("border-border-strong");
    });

    it("renders body cells at the v2 default 64px height", () => {
      const { container } = render(
        <TableCard>
          <TableScrollArea>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableScrollArea>
        </TableCard>,
      );
      const cell = container.querySelector("td");
      expect(cell).toHaveClass("h-16");
      expect(cell).toHaveClass("min-h-16");
    });

    it("renders body cells at 80px when TableCard size is lg", () => {
      const { container } = render(
        <TableCard size="lg">
          <TableScrollArea>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableScrollArea>
        </TableCard>,
      );
      const cell = container.querySelector("td");
      expect(cell).toHaveClass("h-20");
      expect(cell).toHaveClass("min-h-20");
    });

    it("uses a transparent, tertiary-text header in v2 (no surface fill)", () => {
      const { container } = render(
        <TableCard>
          <TableScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Column</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </TableScrollArea>
        </TableCard>,
      );
      const th = container.querySelector("th");
      expect(th).not.toHaveClass("bg-surface-secondary");
      expect(th).toHaveClass("text-content-tertiary");
      expect(th).toHaveClass("min-h-12");
    });

    it("zeroes the bottom border on cells in the final body row", () => {
      const { container } = render(
        <TableCard>
          <TableScrollArea>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>First</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Last</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableScrollArea>
        </TableCard>,
      );
      const tbody = container.querySelector("tbody");
      expect(tbody).toHaveClass("[&_tr:last-child_td]:border-b-0");
    });

    it("applies checkbox column preset on TableHead when intent is checkbox", () => {
      const { container } = render(
        <TableCard>
          <TableScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead intent="checkbox">x</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </TableScrollArea>
        </TableCard>,
      );
      const th = container.querySelector("th");
      expect(th).toHaveClass("w-12");
      expect(th).toHaveClass("text-center");
    });

    it("renders the underline accent only when TableSortLabel is sorted", () => {
      const { rerender } = render(<TableSortLabel>Title</TableSortLabel>);
      let label = screen.getByText("Title");
      expect(label).not.toHaveClass("border-b");

      rerender(<TableSortLabel direction="asc">Title</TableSortLabel>);
      label = screen.getByText("Title");
      expect(label).toHaveClass("border-b");
      expect(label).toHaveClass("border-content-primary");
    });

    it("renders TableCellContent primary + secondary lines", () => {
      render(<TableCellContent primary="Product Name" secondary="SKU-00321" />);
      expect(screen.getByText("Product Name")).toHaveClass("typography-semibold-body-sm");
      expect(screen.getByText("SKU-00321")).toHaveClass("typography-regular-body-sm");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <TableCard>
          <TableScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Column</TableHead>
                  <TableHead>
                    <TableSortLabel direction="asc">Sortable</TableSortLabel>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Cell A</TableCell>
                  <TableCell>Cell B</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableScrollArea>
        </TableCard>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
