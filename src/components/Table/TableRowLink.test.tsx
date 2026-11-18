import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { createPortal } from "react-dom";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Table, TableBody, TableCell, TableRow } from "./Table";
import { TableRowLink } from "./TableRowLink";

function renderRow({
  interactive = true,
  onOpen = vi.fn(),
  onAction = vi.fn(),
  onRowClick,
}: {
  interactive?: boolean;
  onOpen?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  onAction?: () => void;
  onRowClick?: (event: React.MouseEvent<HTMLTableRowElement>) => void;
} = {}) {
  const result = render(
    <Table>
      <TableBody>
        <TableRow interactive={interactive} onClick={onRowClick}>
          <TableCell>
            <TableRowLink
              href="#summer"
              onClick={(event) => {
                event.preventDefault();
                onOpen(event);
              }}
            >
              Summer launch
            </TableRowLink>
          </TableCell>
          <TableCell>1,204 clicks</TableCell>
          <TableCell>
            <button type="button" onClick={onAction}>
              Archive
            </button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  return { ...result, onOpen, onAction };
}

describe("TableRowLink", () => {
  describe("row click", () => {
    it("opens the link when another cell of an interactive row is clicked", async () => {
      const user = userEvent.setup();
      const { onOpen } = renderRow();

      await user.click(screen.getByText("1,204 clicks"));

      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it("opens the link once when the link itself is clicked", async () => {
      const user = userEvent.setup();
      const { onOpen } = renderRow();

      await user.click(screen.getByRole("link", { name: "Summer launch" }));

      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it("leaves a click on another control in the row to that control", async () => {
      const user = userEvent.setup();
      const { onOpen, onAction } = renderRow();

      await user.click(screen.getByRole("button", { name: "Archive" }));

      expect(onAction).toHaveBeenCalledTimes(1);
      expect(onOpen).not.toHaveBeenCalled();
    });

    it("does not open the link from a row that is not interactive", async () => {
      const user = userEvent.setup();
      const { onOpen } = renderRow({ interactive: false });

      await user.click(screen.getByText("1,204 clicks"));

      expect(onOpen).not.toHaveBeenCalled();
    });

    it("runs the row's own onClick first and lets it cancel the open", async () => {
      const user = userEvent.setup();
      const onRowClick = vi.fn((event: React.MouseEvent<HTMLTableRowElement>) =>
        event.preventDefault(),
      );
      const { onOpen } = renderRow({ onRowClick });

      await user.click(screen.getByText("1,204 clicks"));

      expect(onRowClick).toHaveBeenCalledTimes(1);
      expect(onOpen).not.toHaveBeenCalled();
    });

    it("runs the row's own onClick once for a click that opens the link", async () => {
      const user = userEvent.setup();
      const onRowClick = vi.fn();
      const { onOpen } = renderRow({ onRowClick });

      await user.click(screen.getByText("1,204 clicks"));

      expect(onOpen).toHaveBeenCalledTimes(1);
      expect(onRowClick).toHaveBeenCalledTimes(1);
    });

    it("sends a parent's click handler one click for a click that opens the link", async () => {
      const user = userEvent.setup();
      const onParentClick = vi.fn();
      render(
        <Table onClick={onParentClick}>
          <TableBody>
            <TableRow interactive>
              <TableCell>
                <TableRowLink href="/campaigns/summer" onClick={(event) => event.preventDefault()}>
                  Summer launch
                </TableRowLink>
              </TableCell>
              <TableCell>1,204 clicks</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );

      await user.click(screen.getByText("1,204 clicks"));

      expect(onParentClick).toHaveBeenCalledTimes(1);
    });

    it("leaves a click on a custom control in the row to that control", async () => {
      const user = userEvent.setup();
      const onOpen = vi.fn((event: React.MouseEvent) => event.preventDefault());
      render(
        <Table>
          <TableBody>
            <TableRow interactive>
              <TableCell>
                <TableRowLink href="/campaigns/summer" onClick={onOpen}>
                  Summer launch
                </TableRowLink>
              </TableCell>
              <TableCell>
                <div
                  role="slider"
                  tabIndex={0}
                  aria-label="Volume"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={40}
                >
                  Track
                </div>
                <span data-table-row-click-ignore>Opted out</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );

      await user.click(screen.getByRole("slider", { name: "Volume" }));
      await user.click(screen.getByText("Opted out"));

      expect(onOpen).not.toHaveBeenCalled();
    });

    it("leaves the click that ends a text selection alone", () => {
      const { onOpen } = renderRow();
      const cell = screen.getByText("1,204 clicks");
      const range = document.createRange();
      range.selectNodeContents(cell);
      window.getSelection()?.addRange(range);

      fireEvent.click(cell);

      expect(onOpen).not.toHaveBeenCalled();
      window.getSelection()?.removeAllRanges();
    });

    it("keeps opening its own link when another row link is portalled out of the row", async () => {
      const user = userEvent.setup();
      const onOpen = vi.fn((event: React.MouseEvent) => event.preventDefault());
      const onPortalledOpen = vi.fn((event: React.MouseEvent) => event.preventDefault());
      function Row() {
        const [showPopover, setShowPopover] = React.useState(true);
        return (
          <TableRow interactive>
            <TableCell>
              <TableRowLink href="/campaigns/summer" onClick={onOpen}>
                Summer launch
              </TableRowLink>
              {showPopover &&
                createPortal(
                  <TableRowLink href="/campaigns/other" onClick={onPortalledOpen}>
                    Other campaign
                  </TableRowLink>,
                  document.body,
                )}
            </TableCell>
            <TableCell>1,204 clicks</TableCell>
            <TableCell>
              <button type="button" onClick={() => setShowPopover(false)}>
                Close popover
              </button>
            </TableCell>
          </TableRow>
        );
      }
      render(
        <Table>
          <TableBody>
            <Row />
          </TableBody>
        </Table>,
      );

      await user.click(screen.getByText("1,204 clicks"));
      await user.click(screen.getByRole("button", { name: "Close popover" }));
      await user.click(screen.getByText("1,204 clicks"));

      expect(onOpen).toHaveBeenCalledTimes(2);
      expect(onPortalledOpen).not.toHaveBeenCalled();
    });

    it("leaves a click with a modifier key alone", async () => {
      const user = userEvent.setup();
      const { onOpen } = renderRow();

      await user.keyboard("{Meta>}");
      await user.click(screen.getByText("1,204 clicks"));
      await user.keyboard("{/Meta}");

      expect(onOpen).not.toHaveBeenCalled();
    });

    it("leaves a click in a text field in the row to the field", async () => {
      const user = userEvent.setup();
      const onOpen = vi.fn((event: React.MouseEvent) => event.preventDefault());
      render(
        <Table>
          <TableBody>
            <TableRow interactive>
              <TableCell>
                <TableRowLink href="/campaigns/summer" onClick={onOpen}>
                  Summer launch
                </TableRowLink>
              </TableCell>
              <TableCell>
                <textarea aria-label="Note" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );

      await user.click(screen.getByRole("textbox", { name: "Note" }));

      expect(onOpen).not.toHaveBeenCalled();
    });

    it("does not open the outer row's link from a row of a nested table", async () => {
      const user = userEvent.setup();
      const onOpen = vi.fn((event: React.MouseEvent) => event.preventDefault());
      render(
        <Table>
          <TableBody>
            <TableRow interactive>
              <TableCell>
                <TableRowLink href="/campaigns/summer" onClick={onOpen}>
                  Summer launch
                </TableRowLink>
              </TableCell>
              <TableCell>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Nested cell</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );

      await user.click(screen.getByText("Nested cell"));

      expect(onOpen).not.toHaveBeenCalled();
    });

    it("keeps the link as the row's one tab stop besides its controls", async () => {
      const user = userEvent.setup();
      renderRow();

      await user.tab();

      expect(screen.getByRole("link", { name: "Summer launch" })).toHaveFocus();
    });
  });

  describe("API", () => {
    it("applies custom className", () => {
      render(
        <TableRowLink href="#summer" className="custom">
          Summer launch
        </TableRowLink>,
      );
      expect(screen.getByRole("link", { name: "Summer launch" })).toHaveClass("custom");
    });

    it("forwards its ref to the anchor", () => {
      const ref = React.createRef<HTMLAnchorElement>();
      render(
        <TableRowLink ref={ref} href="#summer">
          Summer launch
        </TableRowLink>,
      );
      expect(ref.current).toBe(screen.getByRole("link", { name: "Summer launch" }));
    });

    it("opens a child link from a row click when asChild is true", async () => {
      const user = userEvent.setup();
      const onOpen = vi.fn((event: React.MouseEvent) => event.preventDefault());
      render(
        <Table>
          <TableBody>
            <TableRow interactive>
              <TableCell>
                <TableRowLink asChild>
                  <a href="/campaigns/summer" onClick={onOpen}>
                    Summer launch
                  </a>
                </TableRowLink>
              </TableCell>
              <TableCell>1,204 clicks</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );

      await user.click(screen.getByText("1,204 clicks"));

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
