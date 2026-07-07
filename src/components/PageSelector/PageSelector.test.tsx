import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { PageSelector } from "./PageSelector";

describe("PageSelector", () => {
  describe("API", () => {
    it("applies custom className", () => {
      const { container } = render(
        <PageSelector className="custom-class" totalPages={3} currentPage={1} />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("renders the current-of-total indicator", () => {
      render(<PageSelector totalPages={3} currentPage={2} />);
      expect(screen.getByText("2 of 3")).toBeInTheDocument();
    });

    it("supports a custom label formatter", () => {
      render(
        <PageSelector totalPages={3} currentPage={2} formatLabel={(c, t) => `Page ${c} / ${t}`} />,
      );
      expect(screen.getByText("Page 2 / 3")).toBeInTheDocument();
    });

    it("advances with the next button", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<PageSelector totalPages={3} currentPage={1} onPageChange={handleChange} />);
      await user.click(screen.getByRole("button", { name: "Next page" }));
      expect(handleChange).toHaveBeenCalledWith(2);
    });

    it("goes back with the previous button", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<PageSelector totalPages={3} currentPage={2} onPageChange={handleChange} />);
      await user.click(screen.getByRole("button", { name: "Previous page" }));
      expect(handleChange).toHaveBeenCalledWith(1);
    });

    it("forwards ref", () => {
      const ref = React.createRef<HTMLElement>();
      render(<PageSelector ref={ref} totalPages={3} currentPage={1} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });

  describe("bounds", () => {
    it("disables previous on the first page", () => {
      render(<PageSelector totalPages={3} currentPage={1} />);
      expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();
    });

    it("disables next on the last page", () => {
      render(<PageSelector totalPages={3} currentPage={3} />);
      expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Previous page" })).toBeEnabled();
    });

    it("does not fire onPageChange past the bounds", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<PageSelector totalPages={3} currentPage={1} onPageChange={handleChange} />);
      await user.click(screen.getByRole("button", { name: "Previous page" }));
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("loop", () => {
    it("wraps from the last page to the first", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<PageSelector loop totalPages={3} currentPage={3} onPageChange={handleChange} />);
      await user.click(screen.getByRole("button", { name: "Next page" }));
      expect(handleChange).toHaveBeenCalledWith(1);
    });

    it("wraps from the first page to the last", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<PageSelector loop totalPages={3} currentPage={1} onPageChange={handleChange} />);
      await user.click(screen.getByRole("button", { name: "Previous page" }));
      expect(handleChange).toHaveBeenCalledWith(3);
    });

    it("keeps both arrows enabled at the bounds when looping", () => {
      render(<PageSelector loop totalPages={3} currentPage={1} />);
      expect(screen.getByRole("button", { name: "Previous page" })).toBeEnabled();
      expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();
    });
  });

  describe("disabled", () => {
    it("disables both arrows", () => {
      render(<PageSelector disabled totalPages={3} currentPage={2} />);
      expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    });

    it("does not fire onPageChange when disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<PageSelector disabled totalPages={3} currentPage={2} onPageChange={handleChange} />);
      await user.click(screen.getByRole("button", { name: "Next page" }));
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<PageSelector totalPages={3} currentPage={2} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("exposes a navigation landmark with the default label", () => {
      render(<PageSelector totalPages={3} currentPage={1} />);
      expect(screen.getByRole("navigation", { name: "Page selector" })).toBeInTheDocument();
    });
  });
});
