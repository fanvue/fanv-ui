import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Banner } from "./Banner";

describe("Banner", () => {
  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <Banner
          badgeLabel="New"
          heading="Title"
          description="Description"
          cta={{ label: "Go", onClick: () => {} }}
        />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("API", () => {
    it("applies custom className", () => {
      const { container } = render(<Banner className="custom-class" heading="Test" />);
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("renders badge when badgeLabel is provided", () => {
      render(<Banner badgeLabel="Promo" />);
      expect(screen.getByText("Promo")).toBeInTheDocument();
    });

    it("renders heading as h3 and description", () => {
      render(<Banner heading="Heading" description="Body text" />);
      const h3 = screen.getByRole("heading", { level: 3 });
      expect(h3).toHaveTextContent("Heading");
      expect(screen.getByText("Body text")).toBeInTheDocument();
    });

    it("renders CTA button when cta is provided", () => {
      const onClick = vi.fn();
      render(<Banner cta={{ label: "Click me", onClick }} />);
      expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
    });

    it("does not render CTA when cta is omitted", () => {
      render(<Banner heading="Test" />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("fires cta.onClick when CTA button is clicked", () => {
      const onClick = vi.fn();
      render(<Banner cta={{ label: "Go", onClick }} />);
      fireEvent.click(screen.getByRole("button", { name: /go/i }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("applies primary variant gradient by default", () => {
      const { container } = render(<Banner heading="Test" />);
      expect(container.firstChild).toHaveClass("bg-gradient-to-br");
    });

    it("applies different gradient for each variant", () => {
      const { container: c1 } = render(<Banner variant="primary" heading="1" />);
      const { container: c2 } = render(<Banner variant="secondary" heading="2" />);
      const { container: c3 } = render(<Banner variant="tertiary" heading="3" />);
      const classes1 = (c1.firstChild as HTMLElement).className;
      const classes2 = (c2.firstChild as HTMLElement).className;
      const classes3 = (c3.firstChild as HTMLElement).className;
      expect(classes1).not.toBe(classes2);
      expect(classes2).not.toBe(classes3);
    });

    it("forwards ref", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Banner ref={ref} heading="Test" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("applies width via style prop", () => {
      const { container } = render(<Banner heading="Test" style={{ width: "320px" }} />);
      expect((container.firstChild as HTMLElement).style.width).toBe("320px");
    });
  });
});
