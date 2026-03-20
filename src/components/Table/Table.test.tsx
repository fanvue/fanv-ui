import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  Table,
  TableBody,
  TableCard,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableScrollArea,
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
      expect(screen.getByTestId("card")).toHaveClass("table-surface");
    });

    it("applies lg min-height class to body cells when TableCard size is lg", () => {
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
      expect(cell).toHaveClass("min-h-[80px]");
    });

    it("applies chip cell border preset when cellVariant is chip", () => {
      const { container } = render(
        <TableCard>
          <TableScrollArea>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell cellVariant="chip">Chip row</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableScrollArea>
        </TableCard>,
      );
      const cell = container.querySelector("td");
      expect(cell).toHaveClass("border-border-primary");
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
      expect(th).toHaveClass("w-8");
      expect(th).toHaveClass("text-center");
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
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Cell</TableCell>
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
