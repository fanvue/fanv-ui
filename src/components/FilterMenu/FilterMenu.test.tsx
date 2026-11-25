import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { FilterMenu } from "./FilterMenu";

type Platform = "instagram" | "youtube" | "tiktok";

const OPTIONS = [
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
] as const;

function Harness({
  initial = [],
  onValueChange,
}: {
  initial?: Platform[];
  onValueChange?: (value: Platform[]) => void;
}) {
  const [value, setValue] = React.useState<Platform[]>(initial);
  return (
    <FilterMenu
      options={OPTIONS}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange?.(next);
      }}
      contentProps={{ "aria-label": "Platform" }}
    >
      <button type="button">Platform</button>
    </FilterMenu>
  );
}

async function openMenu() {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Platform" }));
  return user;
}

describe("FilterMenu", () => {
  it("emits on each tick and stays open so several can be ticked in one go", async () => {
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);
    const user = await openMenu();

    await user.click(screen.getByRole("menuitemcheckbox", { name: "Instagram" }));
    await user.click(screen.getByRole("menuitemcheckbox", { name: "TikTok" }));

    expect(onValueChange).toHaveBeenNthCalledWith(1, ["instagram"]);
    expect(onValueChange).toHaveBeenNthCalledWith(2, ["instagram", "tiktok"]);
    expect(screen.getByRole("menu", { name: "Platform" })).toBeInTheDocument();
  });

  it("emits without the value when an option is unticked", async () => {
    const onValueChange = vi.fn();
    render(<Harness initial={["instagram", "youtube"]} onValueChange={onValueChange} />);
    const user = await openMenu();

    await user.click(screen.getByRole("menuitemcheckbox", { name: "Instagram" }));

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(["youtube"]);
  });

  it("exposes each option as a menuitemcheckbox with its checked state", async () => {
    render(<Harness initial={["youtube"]} />);
    await openMenu();

    expect(screen.getByRole("menuitemcheckbox", { name: "Instagram" })).not.toBeChecked();
    expect(screen.getByRole("menuitemcheckbox", { name: "YouTube" })).toBeChecked();
    expect(screen.getByRole("menuitemcheckbox", { name: "TikTok" })).not.toBeChecked();
  });

  it("forwards its ref to the menu content", async () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <FilterMenu ref={ref} options={OPTIONS} value={[]} onValueChange={() => {}}>
        <button type="button">Platform</button>
      </FilterMenu>,
    );
    await openMenu();

    expect(ref.current).toBe(screen.getByRole("menu"));
  });

  it("has no accessibility violations when open", async () => {
    const { baseElement } = render(<Harness initial={["youtube"]} />);
    await openMenu();

    const results = await axe(baseElement, { rules: { region: { enabled: false } } });
    expect(results).toHaveNoViolations();
  });
});
