import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { TablePagination } from "./TablePagination";

describe("TablePagination", () => {
  describe("API", () => {
    it("renders summary text", () => {
      render(
        <TablePagination
          summary="1–10 of 50 rows"
          paginationSlot={<span data-testid="nav">nav</span>}
        />,
      );
      expect(screen.getByText("1–10 of 50 rows")).toBeInTheDocument();
      expect(screen.getByTestId("nav")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <TablePagination className="pagination-bar" summary="Summary" />,
      );
      expect(container.firstChild).toHaveClass("pagination-bar");
    });

    it("applies horizontal inset padding by default", () => {
      const { container } = render(<TablePagination summary="Summary" />);
      expect(container.firstChild).toHaveClass("px-4");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <TablePagination
          summary="1–10 of 50 rows"
          leadingSlot={<span>Rows</span>}
          paginationSlot={<nav aria-label="Pagination">pages</nav>}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
