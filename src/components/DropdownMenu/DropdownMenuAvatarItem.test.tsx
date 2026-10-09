import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  DropdownMenu,
  DropdownMenuAvatarItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./DropdownMenu";

function renderMenu(ui: React.ReactNode, { variant }: { variant?: "sheet" } = {}) {
  return render(
    <DropdownMenu defaultOpen variant={variant}>
      <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
      <DropdownMenuContent aria-label="Accounts">{ui}</DropdownMenuContent>
    </DropdownMenu>,
  );
}

describe("DropdownMenuAvatarItem", () => {
  it("has no accessibility violations", async () => {
    const { container } = renderMenu(
      <DropdownMenuAvatarItem name="Maya Chen" handle="@mayachen" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("renders the name, the handle and the initials fallback", async () => {
    renderMenu(<DropdownMenuAvatarItem name="Maya Chen" handle="@mayachen" />);
    const item = screen.getByRole("menuitem");
    expect(item).toHaveTextContent("Maya Chen");
    expect(item).toHaveTextContent("@mayachen");
    // Avatar's fallback mounts on the next tick (delayMs 0).
    await waitFor(() => expect(item).toHaveTextContent("MC"));
  });

  it("omits the handle line when no handle is given", () => {
    renderMenu(<DropdownMenuAvatarItem name="Maya Chen" />);
    expect(screen.getByRole("menuitem")).not.toHaveTextContent("@");
  });

  it("prefers avatarFallback over the initials", async () => {
    renderMenu(<DropdownMenuAvatarItem name="Maya Chen" avatarFallback="X" />);
    await waitFor(() => expect(screen.getByRole("menuitem")).toHaveTextContent("X"));
    expect(screen.getByRole("menuitem")).not.toHaveTextContent("MC");
  });

  it("renders the trailing node", () => {
    renderMenu(<DropdownMenuAvatarItem name="Maya Chen" trailing={<span data-testid="more" />} />);
    expect(screen.getByTestId("more")).toBeInTheDocument();
  });

  it("applies the selected fill and inverts the handle", () => {
    renderMenu(<DropdownMenuAvatarItem name="Maya Chen" handle="@mayachen" selected />);
    expect(screen.getByRole("menuitem")).toHaveClass("bg-buttons-primary-default");
    expect(screen.getByText("@mayachen")).toHaveClass("text-content-primary-inverted");
  });

  it("uses the 12px radius and no fixed 40px height", () => {
    renderMenu(<DropdownMenuAvatarItem name="Maya Chen" />);
    const item = screen.getByRole("menuitem");
    expect(item).toHaveClass("rounded-sm", "min-h-0");
    expect(item).not.toHaveClass("min-h-10");
  });

  it("calls onSelect on click", async () => {
    const onSelect = vi.fn();
    renderMenu(<DropdownMenuAvatarItem name="Maya Chen" onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("menuitem"));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("does not call onSelect when disabled", async () => {
    const onSelect = vi.fn();
    renderMenu(<DropdownMenuAvatarItem name="Maya Chen" disabled onSelect={onSelect} />);
    const item = screen.getByRole("menuitem");
    expect(item).toHaveAttribute("data-disabled");
    await userEvent.click(item);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("forwards its ref and className", () => {
    const ref = React.createRef<HTMLDivElement>();
    renderMenu(<DropdownMenuAvatarItem ref={ref} name="Maya Chen" className="custom" />);
    expect(ref.current).toBe(screen.getByRole("menuitem"));
    expect(ref.current).toHaveClass("custom");
  });

  it("works in the sheet variant", async () => {
    const onSelect = vi.fn();
    renderMenu(<DropdownMenuAvatarItem name="Maya Chen" handle="@mayachen" onSelect={onSelect} />, {
      variant: "sheet",
    });
    await userEvent.click(await screen.findByRole("option"));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
