import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { TableMobileRow } from "./TableMobileRow";

describe("TableMobileRow", () => {
  describe("API", () => {
    it("renders the title and description", () => {
      render(<TableMobileRow title="Top Spenders" description="320 members" />);
      expect(screen.getByText("Top Spenders")).toBeInTheDocument();
      expect(screen.getByText("320 members")).toBeInTheDocument();
    });

    it("renders the badge and actions on the first line", () => {
      render(
        <TableMobileRow
          title="Top Spenders"
          badge={<span>Dynamic</span>}
          actions={<button type="button">Open</button>}
        />,
      );
      expect(screen.getByText("Dynamic")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
    });

    it("omits the first line when there is no badge or actions", () => {
      const { container } = render(<TableMobileRow title="Top Spenders" />);
      expect(container.firstChild?.childNodes).toHaveLength(1);
    });

    it("omits the description when it is not given", () => {
      const { container } = render(<TableMobileRow title="Top Spenders" />);
      expect(container.querySelectorAll("p")).toHaveLength(1);
    });

    it("applies a custom className", () => {
      const { container } = render(<TableMobileRow title="Top Spenders" className="custom" />);
      expect(container.firstChild).toHaveClass("custom");
    });

    it("forwards the ref to the root element", () => {
      const ref = { current: null as HTMLDivElement | null };
      render(<TableMobileRow ref={ref} title="Top Spenders" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("Accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = render(
        <TableMobileRow
          title="Top Spenders"
          description="320 members"
          badge={<span>Dynamic</span>}
          actions={<button type="button">Open list</button>}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
