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

  describe("types", () => {
    const order = (container: HTMLElement) =>
      Array.from(container.querySelectorAll("p")).map((p) => p.textContent);

    it("renders the title above the label by default", () => {
      const { container } = render(<TableMobileRow title="Main" description="Primary" />);
      expect(order(container)).toEqual(["Main", "Primary"]);
      expect(screen.getByText("Main")).toHaveClass("typography-body-default-16px-semibold");
      const main = screen.getByText("Main").parentElement;
      expect(main).not.toHaveClass("flex-col-reverse");
    });

    it("renders the label above the title for base-text", () => {
      render(<TableMobileRow type="base-text" title="Main" description="Primary" />);
      const main = screen.getByText("Main").parentElement;
      expect(main).toHaveClass("flex-col-reverse");
      expect(screen.getByText("Main")).toHaveClass("typography-body-default-16px-regular");
      expect(screen.getByText("Primary")).toHaveClass("typography-body-small-14px-semibold");
    });

    it("renders the media slot with a chevron before the text for with-image", () => {
      const { container } = render(
        <TableMobileRow
          type="with-image"
          title="Main"
          description="Primary"
          media={<img src="/thumb.png" alt="" data-testid="thumb" />}
        />,
      );
      const row = screen.getByTestId("thumb").closest(".flex.items-center.gap-4");
      expect(row).not.toBeNull();
      expect(row?.querySelector("svg")).not.toBeNull();
      expect(screen.getByText("Main").parentElement).toHaveClass("flex-col-reverse");
      expect(container.firstChild?.childNodes).toHaveLength(1);
    });

    it("lays out avatar, text and actions as a profile row without a header", () => {
      const { container } = render(
        <TableMobileRow
          type="avatar"
          title="Jane Doe"
          description="@jane_doe"
          badge={<span>Hidden</span>}
          avatar={<span data-testid="avatar">JD</span>}
          actions={<input type="checkbox" aria-label="Select" />}
        />,
      );
      expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
      expect(container.firstChild?.childNodes).toHaveLength(1);
      const row = container.firstChild?.firstChild as HTMLElement;
      expect(row.children[0]).toContainElement(screen.getByTestId("avatar"));
      expect(row.children[1]).toContainElement(screen.getByText("Jane Doe"));
      expect(row.children[2]).toContainElement(screen.getByRole("checkbox", { name: "Select" }));
      expect(order(container)).toEqual(["Jane Doe", "@jane_doe"]);
    });
  });

  describe("subContent", () => {
    it("renders up to three label and value columns after the main content", () => {
      const { container } = render(
        <TableMobileRow
          title="Main"
          subContent={[
            { label: "Joined", value: "12 Jan" },
            { label: "Spent", value: "$10" },
            { label: "Status", value: <span data-testid="pill">Subscriber</span> },
            { label: "Dropped", value: "no" },
          ]}
        />,
      );
      const columns = container.firstChild?.lastChild as HTMLElement;
      expect(columns.children).toHaveLength(3);
      expect(screen.queryByText("Dropped")).not.toBeInTheDocument();
      expect(columns.children[0]?.textContent).toBe("Joined12 Jan");
      expect(columns.children[2]).toContainElement(screen.getByTestId("pill"));
      expect(screen.getByText("Joined")).toHaveClass("typography-body-small-14px-semibold");
      expect(screen.getByText("12 Jan")).toHaveClass("truncate");
    });

    it("renders nothing for an empty subContent list", () => {
      const { container } = render(<TableMobileRow title="Main" subContent={[]} />);
      expect(container.firstChild?.childNodes).toHaveLength(1);
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

    it("has no axe violations for the avatar type with sub content", async () => {
      const { container } = render(
        <TableMobileRow
          type="avatar"
          title="Jane Doe"
          description="@jane_doe"
          avatar={<span>JD</span>}
          actions={<input type="checkbox" aria-label="Select Jane Doe" />}
          subContent={[{ label: "Joined", value: "12 Jan" }]}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
