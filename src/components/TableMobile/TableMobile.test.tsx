import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Checkbox } from "../Checkbox/Checkbox";
import { Pill } from "../Pill/Pill";
import { TableMobileField, TableMobileList, TableMobileRow } from "./TableMobile";

function renderRows() {
  return render(
    <TableMobileList aria-label="Fans" className="custom-list">
      <TableMobileRow
        header={<Pill variant="green">Active</Pill>}
        actions={<button type="button">Open</button>}
        title="Weekend offers"
        label="320 members"
        className="custom-row"
      >
        <TableMobileField label="Spend" value="$120" />
        <TableMobileField label="Status" value={<Pill variant="green">Subscriber</Pill>} />
      </TableMobileRow>
      <TableMobileRow
        actions={<Checkbox aria-label="Select Jane Doe" />}
        title="Jane Doe"
        label="@jane_doe"
      />
    </TableMobileList>,
  );
}

describe("TableMobile", () => {
  describe("API", () => {
    it("renders list semantics", () => {
      renderRows();
      const list = screen.getByRole("list", { name: "Fans" });
      expect(list).toHaveClass("custom-list");
      expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    });

    it("applies className and the divider to rows", () => {
      renderRows();
      const [row] = screen.getAllByRole("listitem");
      expect(row).toHaveClass("custom-row", "border-b", "border-border-primary");
    });

    it("renders secondary fields as a description list", () => {
      renderRows();
      expect(screen.getAllByRole("term").map((el) => el.textContent)).toEqual(["Spend", "Status"]);
      expect(screen.getAllByRole("definition")[0]).toHaveTextContent("$120");
    });

    it("orders title and label by labelPosition", () => {
      const { rerender } = render(
        <TableMobileList>
          <TableMobileRow title="Title" label="Label" />
        </TableMobileList>,
      );
      expect(screen.getByRole("listitem")).toHaveTextContent(/^TitleLabel$/);
      expect(screen.getByText("Title")).toHaveClass("typography-body-default-16px-semibold");

      rerender(
        <TableMobileList>
          <TableMobileRow title="Title" label="Label" labelPosition="above" />
        </TableMobileList>,
      );
      expect(screen.getByRole("listitem")).toHaveTextContent(/^LabelTitle$/);
      expect(screen.getByText("Label")).toHaveClass("typography-body-small-14px-semibold");
      expect(screen.getByText("Title")).toHaveClass("typography-body-default-16px-regular");
    });

    it("forwards refs", () => {
      const listRef = { current: null as HTMLUListElement | null };
      const rowRef = { current: null as HTMLLIElement | null };
      const fieldRef = { current: null as HTMLDivElement | null };
      render(
        <TableMobileList ref={listRef}>
          <TableMobileRow ref={rowRef}>
            <TableMobileField ref={fieldRef} label="A" value="B" />
          </TableMobileRow>
        </TableMobileList>,
      );
      expect(listRef.current?.tagName).toBe("UL");
      expect(rowRef.current?.tagName).toBe("LI");
      expect(fieldRef.current?.tagName).toBe("DIV");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = renderRows();
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
