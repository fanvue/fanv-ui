import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./Card";

describe("Card", () => {
  describe("API", () => {
    it("renders with default props", () => {
      render(<Card data-testid="card">Content</Card>);
      const el = screen.getByTestId("card");
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe("DIV");
    });

    it("applies custom className", () => {
      render(
        <Card data-testid="card" className="custom">
          Content
        </Card>,
      );
      expect(screen.getByTestId("card")).toHaveClass("custom");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Content</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("renders outlined variant by default", () => {
      render(<Card data-testid="card">Content</Card>);
      const el = screen.getByTestId("card");
      expect(el).toHaveClass("border");
      expect(el).toHaveClass("shadow-sm");
    });

    it("renders elevated variant", () => {
      render(
        <Card data-testid="card" variant="elevated">
          Content
        </Card>,
      );
      const el = screen.getByTestId("card");
      expect(el).toHaveClass("border");
      expect(el).toHaveClass("shadow-md");
    });

    it("renders filled variant", () => {
      render(
        <Card data-testid="card" variant="filled">
          Content
        </Card>,
      );
      const el = screen.getByTestId("card");
      expect(el).toHaveClass("bg-surface-secondary");
      expect(el).not.toHaveClass("border");
    });

    it("renders ghost variant", () => {
      render(
        <Card data-testid="card" variant="ghost">
          Content
        </Card>,
      );
      const el = screen.getByTestId("card");
      expect(el).toHaveClass("bg-transparent");
      expect(el).not.toHaveClass("border");
    });

    it("is full width by default", () => {
      render(<Card data-testid="card">Content</Card>);
      expect(screen.getByTestId("card")).toHaveClass("w-full");
    });

    it("can disable full width", () => {
      render(
        <Card data-testid="card" fullWidth={false}>
          Content
        </Card>,
      );
      expect(screen.getByTestId("card")).not.toHaveClass("w-full");
    });

    it("removes padding when noPadding is true", () => {
      render(
        <Card data-testid="card" noPadding>
          Content
        </Card>,
      );
      expect(screen.getByTestId("card")).not.toHaveClass("p-4");
    });

    it("spreads additional HTML attributes", () => {
      render(
        <Card data-custom="value" data-testid="card">
          Content
        </Card>,
      );
      expect(screen.getByTestId("card")).toHaveAttribute("data-custom", "value");
    });
  });

  describe("CardHeader", () => {
    it("renders children", () => {
      render(<CardHeader>Header content</CardHeader>);
      expect(screen.getByText("Header content")).toBeInTheDocument();
    });

    it("renders action element", () => {
      render(<CardHeader action={<span data-testid="action">icon</span>}>Header</CardHeader>);
      expect(screen.getByTestId("action")).toBeInTheDocument();
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardHeader ref={ref}>Header</CardHeader>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("applies custom className", () => {
      render(
        <CardHeader data-testid="header" className="custom">
          Header
        </CardHeader>,
      );
      expect(screen.getByTestId("header")).toHaveClass("custom");
    });
  });

  describe("CardTitle", () => {
    it("renders as h3 element", () => {
      render(<CardTitle>Title</CardTitle>);
      const el = screen.getByText("Title");
      expect(el.tagName).toBe("H3");
    });

    it("applies typography classes", () => {
      render(<CardTitle>Title</CardTitle>);
      expect(screen.getByText("Title")).toHaveClass("typography-semibold-body-lg");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLHeadingElement>();
      render(<CardTitle ref={ref}>Title</CardTitle>);
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });

    it("applies custom className", () => {
      render(<CardTitle className="custom">Title</CardTitle>);
      expect(screen.getByText("Title")).toHaveClass("custom");
    });
  });

  describe("CardDescription", () => {
    it("renders as p element", () => {
      render(<CardDescription>Description</CardDescription>);
      const el = screen.getByText("Description");
      expect(el.tagName).toBe("P");
    });

    it("applies typography classes", () => {
      render(<CardDescription>Description</CardDescription>);
      expect(screen.getByText("Description")).toHaveClass("typography-regular-body-sm");
    });

    it("applies secondary text color", () => {
      render(<CardDescription>Description</CardDescription>);
      expect(screen.getByText("Description")).toHaveClass("text-content-secondary");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLParagraphElement>();
      render(<CardDescription ref={ref}>Description</CardDescription>);
      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
    });
  });

  describe("CardContent", () => {
    it("renders children", () => {
      render(<CardContent>Content body</CardContent>);
      expect(screen.getByText("Content body")).toBeInTheDocument();
    });

    it("applies vertical padding", () => {
      render(<CardContent data-testid="content">Content</CardContent>);
      expect(screen.getByTestId("content")).toHaveClass("py-4");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardContent ref={ref}>Content</CardContent>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("applies custom className", () => {
      render(
        <CardContent data-testid="content" className="custom">
          Content
        </CardContent>,
      );
      expect(screen.getByTestId("content")).toHaveClass("custom");
    });
  });

  describe("CardFooter", () => {
    it("renders children in a row", () => {
      render(
        <CardFooter data-testid="footer">
          <button type="button">Action 1</button>
          <button type="button">Action 2</button>
        </CardFooter>,
      );
      const footer = screen.getByTestId("footer");
      expect(footer).toHaveClass("flex");
      expect(footer).toHaveClass("items-center");
      expect(footer).toHaveClass("gap-3");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardFooter ref={ref}>Footer</CardFooter>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("applies custom className", () => {
      render(
        <CardFooter data-testid="footer" className="custom">
          Footer
        </CardFooter>,
      );
      expect(screen.getByTestId("footer")).toHaveClass("custom");
    });
  });

  describe("composition", () => {
    it("renders a fully composed card", () => {
      render(
        <Card data-testid="card">
          <CardHeader action={<span data-testid="icon">icon</span>}>
            <CardTitle>Card title</CardTitle>
            <CardDescription>Card description</CardDescription>
          </CardHeader>
          <CardContent>Body content</CardContent>
          <CardFooter>
            <button type="button">Action</button>
          </CardFooter>
        </Card>,
      );

      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByText("Card title")).toBeInTheDocument();
      expect(screen.getByText("Card description")).toBeInTheDocument();
      expect(screen.getByText("Body content")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("renders card with only content", () => {
      render(
        <Card data-testid="card">
          <CardContent>Just content</CardContent>
        </Card>,
      );
      expect(screen.getByText("Just content")).toBeInTheDocument();
    });

    it("renders card with header only", () => {
      render(
        <Card data-testid="card">
          <CardHeader>
            <CardTitle>Only title</CardTitle>
          </CardHeader>
        </Card>,
      );
      expect(screen.getByText("Only title")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations with outlined variant", async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations with elevated variant", async () => {
      const { container } = render(
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations with filled variant", async () => {
      const { container } = render(
        <Card variant="filled">
          <CardContent>Content</CardContent>
        </Card>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations with ghost variant", async () => {
      const { container } = render(
        <Card variant="ghost">
          <CardContent>Content</CardContent>
        </Card>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations with full composition", async () => {
      const { container } = render(
        <Card>
          <CardHeader action={<span>icon</span>}>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
          <CardFooter>
            <button type="button">Action</button>
          </CardFooter>
        </Card>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
