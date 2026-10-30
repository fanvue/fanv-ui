import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  Table,
  TableBody,
  TableCard,
  TableCell,
  TableCellContent,
  TableHead,
  TableHeader,
  TableMediaThumbnail,
  TableMediaTile,
  TableRow,
  TableScrollArea,
  TableSortLabel,
  TableToolbar,
  TableToolbarAction,
  TableToolbarSearch,
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
      expect(card).toHaveClass("rounded-sm");
      expect(card).toHaveClass("border-[0.5px]");
      expect(card).toHaveClass("border-border-primary");
    });

    it("renders body cells at the default 40px height with 12px type", () => {
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
      expect(cell).toHaveClass("h-10");
      expect(cell).toHaveClass("typography-description-12px-regular");
      expect(cell).toHaveClass("border-b-[0.5px]");
    });

    it("renders body cells at 56px when TableCard size is lg", () => {
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
      expect(cell).toHaveClass("h-14");
    });

    it("keeps body cells at 40px when TableCard size is condensed", () => {
      const { container } = render(
        <TableCard size="condensed">
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
      expect(cell).toHaveClass("h-10");
    });

    it("uses 12px header typography at every size", () => {
      const { container } = render(
        <TableCard size="condensed">
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
      expect(th).toHaveClass("typography-description-12px-regular");
    });

    it("styles the scrollport scrollbar when showScrollbar is set", () => {
      const { container } = render(
        <TableScrollArea showScrollbar>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableScrollArea>,
      );
      const scrollport = container.querySelector(".overflow-x-auto");
      expect(scrollport).toHaveClass("[scrollbar-width:thin]");
      expect(scrollport).toHaveClass("pb-3");
    });

    it("fills the 32px header with the table row surface and secondary text", () => {
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
      expect(th).toHaveClass("bg-surface-table-row");
      expect(th).toHaveClass("text-content-secondary");
      expect(th).toHaveClass("h-8");
    });

    it("wraps cell text by default and keeps it on one line with nowrap", () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow>
              <TableCell>Long reason text</TableCell>
              <TableCell nowrap>Jun 11, 2026</TableCell>
            </TableRow>
          </tbody>
        </table>,
      );
      const [wrapping, single] = Array.from(container.querySelectorAll("td"));
      expect(wrapping).not.toHaveClass("whitespace-nowrap");
      expect(single).toHaveClass("whitespace-nowrap");
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
      expect(th).toHaveClass("w-px");
      expect(th).toHaveClass("pr-0");
    });

    it("shows the sort arrows, active direction highlighted, only when sorted", () => {
      const { container, rerender } = render(<TableSortLabel>Title</TableSortLabel>);
      expect(screen.getByText("Title")).not.toHaveClass("text-content-primary");
      expect(container.querySelector("svg")).toBeNull();

      rerender(<TableSortLabel direction="desc">Title</TableSortLabel>);
      expect(screen.getByText("Title")).toHaveClass("text-content-primary");
      const [up, down] = Array.from(container.querySelectorAll("path"));
      expect(up).toHaveClass("stroke-icons-tertiary");
      expect(down).toHaveClass("stroke-current");
    });

    it("renders TableCellContent primary + secondary lines", () => {
      render(<TableCellContent primary="Product Name" secondary="SKU-00321" />);
      expect(screen.getByText("Product Name")).toHaveClass("typography-description-12px-semibold");
      expect(screen.getByText("SKU-00321")).toHaveClass("typography-description-12px-regular");
    });

    it("marks media so its row grows, at 40px by default", () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow>
              <TableCell>
                <TableMediaThumbnail src="https://example.com/image.jpg" alt="" />
              </TableCell>
              <TableCell>
                <TableMediaTile>X</TableMediaTile>
              </TableCell>
            </TableRow>
          </tbody>
        </table>,
      );
      expect(container.querySelectorAll("[data-table-media]")).toHaveLength(2);
      expect(container.querySelector(".size-10.rounded-xs img")).not.toBeNull();
      expect(container.querySelector("tr")).toHaveClass("[&:has([data-table-media])>td]:h-14");
    });

    it("drops the tile border and fill when TableMediaTile fills", () => {
      const { rerender } = render(<TableMediaTile>X</TableMediaTile>);
      expect(screen.getByText("X")).toHaveClass("bg-surface-table-row");

      rerender(<TableMediaTile fill>X</TableMediaTile>);
      expect(screen.getByText("X")).not.toHaveClass("bg-surface-table-row");
      expect(screen.getByText("X")).toHaveClass("[&>*]:size-full");
    });

    it("renders TableMediaThumbnail at 32px with the small radius", () => {
      const { container } = render(
        <TableMediaThumbnail size="32" src="https://example.com/image.jpg" alt="" />,
      );
      const frame = container.querySelector(".size-8");
      expect(frame).not.toBeNull();
      expect(frame).toHaveClass("rounded-xs");
    });
  });

  describe("TableToolbar", () => {
    it("puts search on the left and the actions in the right group", () => {
      render(
        <TableToolbar
          search={
            <TableToolbarSearch
              value=""
              onValueChange={() => {}}
              placeholder="Search"
              clearLabel="Clear search"
            />
          }
        >
          <TableToolbarAction>Filters</TableToolbarAction>
        </TableToolbar>,
      );
      const search = screen.getByRole("searchbox", { name: "Search" });
      const action = screen.getByRole("button", { name: "Filters" });
      expect(search.closest("label")?.parentElement?.nextElementSibling).toContainElement(action);
      expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
    });

    it("reports typing and clearing through onValueChange", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { rerender } = render(
        <TableToolbarSearch
          value=""
          onValueChange={onValueChange}
          placeholder="Search"
          clearLabel="Clear search"
        />,
      );
      await user.type(screen.getByRole("searchbox", { name: "Search" }), "a");
      expect(onValueChange).toHaveBeenCalledWith("a");

      rerender(
        <TableToolbarSearch
          value="abc"
          onValueChange={onValueChange}
          placeholder="Search"
          clearLabel="Clear search"
        />,
      );
      await user.click(screen.getByRole("button", { name: "Clear search" }));
      expect(onValueChange).toHaveBeenLastCalledWith("");
    });

    it("keeps the action label as its name while hiding it below md", () => {
      render(<TableToolbarAction>Filters</TableToolbarAction>);
      expect(screen.getByText("Filters")).toHaveClass("max-md:sr-only");
      expect(screen.getByRole("button", { name: "Filters" })).toBeInTheDocument();
    });

    it("tints the action icon only while active", () => {
      const { rerender } = render(<TableToolbarAction>Advanced</TableToolbarAction>);
      const icon = () =>
        screen.getByRole("button", { name: "Advanced" }).querySelector("span[aria-hidden]");
      expect(icon()).toHaveClass("text-icons-secondary");

      rerender(<TableToolbarAction active>Advanced</TableToolbarAction>);
      expect(icon()).toHaveClass("text-brand-primary-default");
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
