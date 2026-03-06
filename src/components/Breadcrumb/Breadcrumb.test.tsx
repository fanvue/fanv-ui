import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "./Breadcrumb";

function BasicBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbPage>Current Page</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

describe("Breadcrumb", () => {
  describe("API", () => {
    it("renders a nav landmark with the correct aria-label", () => {
      render(<BasicBreadcrumb />);
      expect(screen.getByRole("navigation", { name: "breadcrumb" })).toBeInTheDocument();
    });

    it("accepts a custom aria-label", () => {
      render(
        <Breadcrumb aria-label="site navigation">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByRole("navigation", { name: "site navigation" })).toBeInTheDocument();
    });

    it("applies custom className to BreadcrumbList", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList className="custom-list">
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByRole("list")).toHaveClass("custom-list");
    });

    it("marks the current page with aria-current", () => {
      render(<BasicBreadcrumb />);
      const current = screen.getByText("Current Page");
      expect(current).toHaveAttribute("aria-current", "page");
    });

    it("renders BreadcrumbLink as an anchor by default", () => {
      render(<BasicBreadcrumb />);
      const link = screen.getByRole("link", { name: "Home" });
      expect(link).toHaveAttribute("href", "/");
    });

    it("renders BreadcrumbLink as a child element when asChild is true", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button type="button">Home</button>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
    });

    it("automatically injects separators between items", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/section">Section</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      const separators = document.querySelectorAll('li[aria-hidden="true"]');
      expect(separators).toHaveLength(2);
    });

    it("does not inject a separator before the first item", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Only Item</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      const separators = document.querySelectorAll('li[aria-hidden="true"]');
      expect(separators).toHaveLength(0);
    });

    it("renders a custom separator via the separator prop", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList separator={<span data-testid="custom-sep">/</span>}>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(screen.getByTestId("custom-sep")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<BasicBreadcrumb />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with multiple items", async () => {
      const { container } = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/section">Section</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
