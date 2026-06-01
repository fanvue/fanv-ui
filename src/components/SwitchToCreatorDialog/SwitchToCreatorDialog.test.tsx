import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SwitchToCreatorDialog } from "./SwitchToCreatorDialog";

describe("SwitchToCreatorDialog", () => {
  it("renders with default props when open", () => {
    render(<SwitchToCreatorDialog open />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Switch to Creator Account")).toBeInTheDocument();
    expect(
      screen.getByText(
        "To complete this purchase, please switch to a creator account. You can select any creator account you manage.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Switch Account" })).toBeInTheDocument();
  });

  it("renders with custom labels", () => {
    render(
      <SwitchToCreatorDialog
        open
        title="Custom Title"
        description="Custom description text"
        switchAccountLabel="Go to Creator"
        cancelLabel="Not Now"
      />,
    );

    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText("Custom description text")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to Creator" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Not Now" })).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<SwitchToCreatorDialog open={false} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onSwitchAccount when switch button is clicked", async () => {
    const user = userEvent.setup();
    const onSwitchAccount = vi.fn();

    render(<SwitchToCreatorDialog open onSwitchAccount={onSwitchAccount} />);

    await user.click(screen.getByRole("button", { name: "Switch Account" }));

    expect(onSwitchAccount).toHaveBeenCalledTimes(1);
  });

  it("calls onOpenChange with false when cancel is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(<SwitchToCreatorDialog open onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onOpenChange with false when close button is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(<SwitchToCreatorDialog open onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
