import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { UserItemTrailing } from "./UserItemTrailing";

describe("UserItemTrailing", () => {
  it("renders the value", () => {
    render(<UserItemTrailing value="$421.32" />);
    expect(screen.getByText("$421.32")).toBeInTheDocument();
  });

  it("renders no meta line when meta is not given", () => {
    render(<UserItemTrailing value="12" data-testid="trailing" />);
    expect(screen.getByTestId("trailing").children).toHaveLength(1);
  });

  it("renders the meta line under the value", () => {
    render(<UserItemTrailing value="$421.32" meta="7 hours ago" data-testid="trailing" />);
    const trailing = screen.getByTestId("trailing");
    expect(trailing.children).toHaveLength(2);
    expect(trailing.lastElementChild).toHaveTextContent("7 hours ago");
  });

  it("aligns its content to the end of the row", () => {
    render(<UserItemTrailing value="12" data-testid="trailing" />);
    expect(screen.getByTestId("trailing")).toHaveClass("flex", "flex-col", "items-end");
  });

  it("applies custom className and spreads HTML attributes", () => {
    render(<UserItemTrailing value="12" className="custom" data-testid="trailing" data-x="y" />);
    const trailing = screen.getByTestId("trailing");
    expect(trailing).toHaveClass("custom");
    expect(trailing).toHaveAttribute("data-x", "y");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<UserItemTrailing value="$421.32" meta="7 hours ago" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
