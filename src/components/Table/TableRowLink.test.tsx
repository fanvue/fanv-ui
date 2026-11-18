import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { createPortal } from "react-dom";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Table, TableBody, TableCell, TableRow } from "./Table";
import { TableRowLink } from "./TableRowLink";

type OpenHandler = (event: React.MouseEvent) => void;

function renderRow({
  interactive = true,
  onRowClick,
  onTableClick,
  link,
  extra,
}: {
  interactive?: boolean;
  onRowClick?: React.MouseEventHandler<HTMLTableRowElement>;
  onTableClick?: React.MouseEventHandler<HTMLTableElement>;
  link?: (onOpen: OpenHandler) => React.ReactNode;
  extra?: React.ReactNode;
} = {}) {
  const user = userEvent.setup();
  const onOpen = vi.fn<OpenHandler>((event) => event.preventDefault());
  const view = render(
    <Table onClick={onTableClick}>
      <TableBody>
        <TableRow interactive={interactive} onClick={onRowClick}>
          <TableCell>
            {link ? (
              link(onOpen)
            ) : (
              <TableRowLink href="/campaigns/summer" onClick={onOpen}>
                Summer launch
              </TableRowLink>
            )}
          </TableCell>
          <TableCell>1,204 clicks</TableCell>
          <TableCell>{extra}</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  const clickCell = () => user.click(screen.getByText("1,204 clicks"));
  return { ...view, user, onOpen, clickCell };
}

describe("TableRowLink", () => {
  describe("row click", () => {
    it("opens the link when another cell of an interactive row is clicked", async () => {
      const { onOpen, clickCell } = renderRow();
      await clickCell();
      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it("opens the link once when the link itself is clicked", async () => {
      const { user, onOpen } = renderRow();
      await user.click(screen.getByRole("link", { name: "Summer launch" }));
      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it("does not open the link from a row that is not interactive", async () => {
      const { onOpen, clickCell } = renderRow({ interactive: false });
      await clickCell();
      expect(onOpen).not.toHaveBeenCalled();
    });

    it.each([
      ["a button", () => <button type="button">Control</button>],
      ["a text field", () => <textarea aria-label="Control" defaultValue="Control" />],
      [
        "a slider",
        () => (
          <div role="slider" tabIndex={0} aria-valuemin={0} aria-valuemax={9} aria-valuenow={4}>
            Control
          </div>
        ),
      ],
      ["an opted-out element", () => <span data-table-row-click-ignore>Control</span>],
    ])("leaves a click on %s in the row to that control", async (_name, control) => {
      const { user, onOpen } = renderRow({ extra: control() });
      await user.click(screen.getByText("Control"));
      expect(onOpen).not.toHaveBeenCalled();
    });

    it("runs the row's own onClick first and lets it cancel the open", async () => {
      const onRowClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
      const { onOpen, clickCell } = renderRow({ onRowClick });
      await clickCell();
      expect(onRowClick).toHaveBeenCalledTimes(1);
      expect(onOpen).not.toHaveBeenCalled();
    });

    it("sends the row's and a parent's click handler one click each for an open", async () => {
      const onRowClick = vi.fn();
      const onTableClick = vi.fn();
      const { onOpen, clickCell } = renderRow({ onRowClick, onTableClick });
      await clickCell();
      expect(onOpen).toHaveBeenCalledTimes(1);
      expect(onRowClick).toHaveBeenCalledTimes(1);
      expect(onTableClick).toHaveBeenCalledTimes(1);
    });

    it("leaves a click with a modifier key alone", async () => {
      const { user, onOpen, clickCell } = renderRow();
      await user.keyboard("{Meta>}");
      await clickCell();
      await user.keyboard("{/Meta}");
      expect(onOpen).not.toHaveBeenCalled();
    });

    it("leaves the click that ends a text selection alone", async () => {
      const { onOpen, clickCell } = renderRow();
      const selection = vi
        .spyOn(window, "getSelection")
        .mockReturnValue({ isCollapsed: false } as Selection);

      await clickCell();

      expect(onOpen).not.toHaveBeenCalled();
      selection.mockRestore();
    });

    it("does not open the outer row's link from a row of a nested table", async () => {
      const { user, onOpen } = renderRow({
        extra: (
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Nested cell</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ),
      });
      await user.click(screen.getByText("Nested cell"));
      expect(onOpen).not.toHaveBeenCalled();
    });

    it("opens its own link, not one portalled out of the row", async () => {
      const onPortalledOpen = vi.fn<OpenHandler>((event) => event.preventDefault());
      const { onOpen, clickCell } = renderRow({
        extra: createPortal(
          <TableRowLink href="/campaigns/other" onClick={onPortalledOpen}>
            Other campaign
          </TableRowLink>,
          document.body,
        ),
      });
      await clickCell();
      expect(onOpen).toHaveBeenCalledTimes(1);
      expect(onPortalledOpen).not.toHaveBeenCalled();
    });

    it("keeps the link as the row's tab stop", async () => {
      const { user } = renderRow();
      await user.tab();
      expect(screen.getByRole("link", { name: "Summer launch" })).toHaveFocus();
    });
  });

  describe("API", () => {
    it("applies custom className", () => {
      render(
        <TableRowLink href="/campaigns/summer" className="custom">
          Summer launch
        </TableRowLink>,
      );
      expect(screen.getByRole("link", { name: "Summer launch" })).toHaveClass("custom");
    });

    it("forwards its ref to the anchor", () => {
      const ref = React.createRef<HTMLAnchorElement>();
      render(
        <TableRowLink ref={ref} href="/campaigns/summer">
          Summer launch
        </TableRowLink>,
      );
      expect(ref.current).toBe(screen.getByRole("link", { name: "Summer launch" }));
    });

    it("opens a child link from a row click when asChild is true", async () => {
      const { onOpen, clickCell } = renderRow({
        link: (open) => (
          <TableRowLink asChild>
            <a href="/campaigns/summer" onClick={open}>
              Summer launch
            </a>
          </TableRowLink>
        ),
      });
      await clickCell();
      expect(onOpen).toHaveBeenCalledTimes(1);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = renderRow();
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
