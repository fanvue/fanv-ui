import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ExampleCard } from "./ExampleCard";

describe("ExampleCard", () => {
  it("renders title and description", () => {
    render(<ExampleCard title="Test Title" description="Test description" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("renders default action label", () => {
    render(<ExampleCard title="Title" description="Desc" />);
    expect(screen.getByRole("button", { name: "Learn more" })).toBeInTheDocument();
  });

  it("renders custom action label", () => {
    render(<ExampleCard title="Title" description="Desc" actionLabel="Click me" />);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("calls onAction when button is clicked", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<ExampleCard title="Title" description="Desc" onAction={onAction} />);
    await user.click(screen.getByRole("button"));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ExampleCard title="Title" description="Desc" />);
    const results = await axe(container);
    // eslint-disable-next-line -- vitest-axe matcher type augmentation
    (expect(results) as any).toHaveNoViolations();
  });
});
