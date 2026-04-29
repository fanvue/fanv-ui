import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "../Button/Button";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders a region labelled by title", () => {
    render(<EmptyState title="No media yet" description="Add content to get started." />);
    const region = screen.getByRole("region", { name: "No media yet" });
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute("data-testid", "empty-state");
  });

  it("renders both action slots when provided", () => {
    render(
      <EmptyState
        title="No posts"
        primaryAction={<Button variant="brand">Create post</Button>}
        secondaryAction={<Button variant="secondary">Read guide</Button>}
      />,
    );

    expect(screen.getByRole("button", { name: "Create post" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Read guide" })).toBeInTheDocument();
  });

  it("renders string actions as full-width buttons", () => {
    render(<EmptyState title="Title" primaryAction="Primary" secondaryAction="Secondary" />);

    expect(screen.getByRole("button", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Secondary" })).toBeInTheDocument();
  });

  it("renders string media as an image", () => {
    const { container } = render(<EmptyState title="T" media="https://example.com/empty.png" />);

    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img).toHaveAttribute("src", "https://example.com/empty.png");
  });

  it("uses a heading for string titles", () => {
    render(<EmptyState title="No media yet" />);

    expect(screen.getByRole("heading", { level: 2, name: "No media yet" })).toBeInTheDocument();
  });

  it("applies the titleSize token class to the heading", () => {
    const { container } = render(<EmptyState title="No media yet" titleSize="sm" />);
    const heading = container.querySelector("h2");
    expect(heading).toHaveClass("typography-bold-heading-sm");
    expect(heading).not.toHaveClass("typography-bold-heading-lg");
  });

  it("defaults titleSize to lg (typography-bold-heading-lg)", () => {
    const { container } = render(<EmptyState title="No media yet" />);
    expect(container.querySelector("h2")).toHaveClass("typography-bold-heading-lg");
  });

  it("applies the correct height class for mediaSize", () => {
    const { container } = render(
      <EmptyState title="T" media="https://example.com/img.png" mediaSize="sm" />,
    );
    const wrapper = container.querySelector("[data-testid='empty-state'] > div");
    expect(wrapper).toHaveClass("h-[160px]");
  });

  it("defaults mediaSize to lg", () => {
    const { container } = render(<EmptyState title="T" media="https://example.com/img.png" />);
    const wrapper = container.querySelector("[data-testid='empty-state'] > div");
    expect(wrapper).toHaveClass("h-[280px]");
  });

  it("has no serious axe violations", async () => {
    const { container } = render(
      <EmptyState
        variant="centered"
        title="No media yet"
        description="Add content to start earning."
        primaryAction={<Button variant="brand">Add media</Button>}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
