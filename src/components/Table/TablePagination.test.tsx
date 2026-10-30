import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { TableCardPagination } from "./TablePagination";

describe("TableCardPagination", () => {
  const renderPagination = (page: number, onPageChange = vi.fn(), onPageSizeChange = vi.fn()) =>
    render(
      <TableCardPagination
        page={page}
        pageCount={3}
        onPageChange={onPageChange}
        pageSize={10}
        pageSizeOptions={[10, 25]}
        onPageSizeChange={onPageSizeChange}
      />,
    );

  it("shows the page out of the total and steps one page at a time", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    renderPagination(2, onPageChange);

    expect(screen.getByRole("navigation", { name: "Pagination" })).toHaveTextContent("2 of 3");
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    await user.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onPageChange).toHaveBeenLastCalledWith(1);
  });

  it("disables stepping past either end", () => {
    const { rerender } = renderPagination(1);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();

    rerender(
      <TableCardPagination
        page={3}
        pageCount={3}
        onPageChange={vi.fn()}
        pageSize={10}
        pageSizeOptions={[10, 25]}
        onPageSizeChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Previous page" })).toBeEnabled();
  });

  it("picks a rows-per-page option from the menu", async () => {
    const user = userEvent.setup();
    const onPageSizeChange = vi.fn();
    renderPagination(1, vi.fn(), onPageSizeChange);

    await user.click(screen.getByRole("button", { name: "Rows per page, 10 rows" }));
    await user.click(await screen.findByRole("menuitem", { name: "25 rows" }));
    expect(onPageSizeChange).toHaveBeenCalledWith(25);
  });

  it("has no accessibility violations", async () => {
    const { container } = renderPagination(2);
    expect(await axe(container)).toHaveNoViolations();
  });
});
