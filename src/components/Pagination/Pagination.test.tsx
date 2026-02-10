import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(<Pagination totalPages={5} currentPage={1} className="custom" />);
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("custom");
    });

    it("forwards ref to nav element", () => {
      const ref = { current: null } as React.RefObject<HTMLElement | null>;
      render(<Pagination ref={ref} totalPages={5} currentPage={1} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe("NAV");
    });

    it("renders with aria-label", () => {
      render(<Pagination totalPages={5} currentPage={1} />);
      expect(screen.getByRole("navigation")).toHaveAttribute("aria-label", "Pagination");
    });

    it("accepts custom ariaLabel", () => {
      render(<Pagination totalPages={5} currentPage={1} ariaLabel="Navigación" />);
      expect(screen.getByRole("navigation")).toHaveAttribute("aria-label", "Navigación");
    });

    it("accepts custom previousLabel and nextLabel", () => {
      render(
        <Pagination
          totalPages={5}
          currentPage={3}
          previousLabel="Anterior"
          nextLabel="Siguiente"
        />,
      );
      expect(screen.getByRole("button", { name: "Anterior" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Siguiente" })).toBeInTheDocument();
    });

    it("accepts custom getPageLabel", () => {
      render(
        <Pagination totalPages={3} currentPage={1} getPageLabel={(page) => `Página ${page}`} />,
      );
      expect(screen.getByRole("button", { name: "Página 1" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Página 2" })).toBeInTheDocument();
    });
  });

  describe("default variant", () => {
    it("renders page buttons for small page counts", () => {
      render(<Pagination totalPages={5} currentPage={3} />);
      for (let i = 1; i <= 5; i++) {
        expect(screen.getByRole("button", { name: `Page ${i}` })).toBeInTheDocument();
      }
    });

    it("marks current page with aria-current", () => {
      render(<Pagination totalPages={5} currentPage={3} />);
      const currentButton = screen.getByRole("button", { name: "Page 3" });
      expect(currentButton).toHaveAttribute("aria-current", "page");
    });

    it("does not mark non-current pages with aria-current", () => {
      render(<Pagination totalPages={5} currentPage={3} />);
      const otherButton = screen.getByRole("button", { name: "Page 1" });
      expect(otherButton).not.toHaveAttribute("aria-current");
    });

    it("shows ellipsis for large page counts", () => {
      const { container } = render(<Pagination totalPages={20} currentPage={10} />);
      const ellipses = container.querySelectorAll('[aria-hidden="true"]');
      expect(ellipses.length).toBeGreaterThan(0);
    });

    it("calls onPageChange when a page button is clicked", () => {
      const onPageChange = vi.fn();
      render(<Pagination totalPages={5} currentPage={2} onPageChange={onPageChange} />);
      fireEvent.click(screen.getByRole("button", { name: "Page 4" }));
      expect(onPageChange).toHaveBeenCalledWith(4);
    });
  });

  describe("dots variant", () => {
    it("renders dot buttons for all pages", () => {
      render(<Pagination variant="dots" totalPages={10} currentPage={3} />);
      for (let i = 1; i <= 10; i++) {
        expect(screen.getByRole("button", { name: `Page ${i}` })).toBeInTheDocument();
      }
    });

    it("marks current dot with aria-current", () => {
      render(<Pagination variant="dots" totalPages={10} currentPage={5} />);
      const currentDot = screen.getByRole("button", { name: "Page 5" });
      expect(currentDot).toHaveAttribute("aria-current", "page");
    });

    it("calls onPageChange when a dot is clicked", () => {
      const onPageChange = vi.fn();
      render(
        <Pagination variant="dots" totalPages={10} currentPage={1} onPageChange={onPageChange} />,
      );
      fireEvent.click(screen.getByRole("button", { name: "Page 7" }));
      expect(onPageChange).toHaveBeenCalledWith(7);
    });
  });

  describe("navigation buttons", () => {
    it("disables previous button on first page", () => {
      render(<Pagination totalPages={5} currentPage={1} />);
      expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    });

    it("disables next button on last page", () => {
      render(<Pagination totalPages={5} currentPage={5} />);
      expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    });

    it("enables both buttons on middle pages", () => {
      render(<Pagination totalPages={5} currentPage={3} />);
      expect(screen.getByRole("button", { name: "Previous page" })).toBeEnabled();
      expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();
    });

    it("calls onPageChange with previous page on previous click", () => {
      const onPageChange = vi.fn();
      render(<Pagination totalPages={5} currentPage={3} onPageChange={onPageChange} />);
      fireEvent.click(screen.getByRole("button", { name: "Previous page" }));
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it("calls onPageChange with next page on next click", () => {
      const onPageChange = vi.fn();
      render(<Pagination totalPages={5} currentPage={3} onPageChange={onPageChange} />);
      fireEvent.click(screen.getByRole("button", { name: "Next page" }));
      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it("does not call onPageChange when clicking disabled previous button", () => {
      const onPageChange = vi.fn();
      render(<Pagination totalPages={5} currentPage={1} onPageChange={onPageChange} />);
      fireEvent.click(screen.getByRole("button", { name: "Previous page" }));
      expect(onPageChange).not.toHaveBeenCalled();
    });

    it("does not call onPageChange when clicking disabled next button", () => {
      const onPageChange = vi.fn();
      render(<Pagination totalPages={5} currentPage={5} onPageChange={onPageChange} />);
      fireEvent.click(screen.getByRole("button", { name: "Next page" }));
      expect(onPageChange).not.toHaveBeenCalled();
    });

    it("disables both buttons when there is only one page", () => {
      render(<Pagination totalPages={1} currentPage={1} />);
      expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations (default variant)", async () => {
      const { container } = render(<Pagination totalPages={5} currentPage={3} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations (dots variant)", async () => {
      const { container } = render(<Pagination variant="dots" totalPages={10} currentPage={5} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations when on first page", async () => {
      const { container } = render(<Pagination totalPages={5} currentPage={1} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations when on last page", async () => {
      const { container } = render(<Pagination totalPages={5} currentPage={5} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
