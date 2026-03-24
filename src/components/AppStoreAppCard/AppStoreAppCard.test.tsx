import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { AppStoreAppCard } from "./AppStoreAppCard";

const img = { src: "https://example.com/icon.png", alt: "Icon" };

describe("AppStoreAppCard", () => {
  it("renders title, description, and plan label", () => {
    render(
      <AppStoreAppCard
        title="My App"
        description="Does things"
        imageProps={img}
        planLabel="Free"
      />,
    );
    expect(screen.getByText("My App")).toBeInTheDocument();
    expect(screen.getByText("Does things")).toBeInTheDocument();
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it("renders rating and reviews when provided", () => {
    render(
      <AppStoreAppCard title="A" description="B" imageProps={img} rating={4.5} reviewCount={10} />,
    );
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("(10)")).toBeInTheDocument();
  });

  it("calls onAdd when Add is clicked", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AppStoreAppCard title="A" description="B" imageProps={img} showAdd onAdd={onAdd} />);
    await user.click(screen.getByRole("button", { name: "Add" }));
    expect(onAdd).toHaveBeenCalledOnce();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <AppStoreAppCard title="A" description="B" imageProps={img} planLabel="Free" />,
    );
    const results = await axe(container);
    // eslint-disable-next-line -- vitest-axe matcher type augmentation
    (expect(results) as any).toHaveNoViolations();
  });
});
