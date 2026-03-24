import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { AppStoreInstalledApp } from "./AppStoreInstalledApp";

const img = { src: "https://example.com/icon.png", alt: "Icon" };

describe("AppStoreInstalledApp", () => {
  it("renders title and builder", () => {
    render(<AppStoreInstalledApp title="App" builderName="Dev" imageProps={img} />);
    expect(screen.getByText("App")).toBeInTheDocument();
    expect(screen.getByText("Dev")).toBeInTheDocument();
  });

  it("calls onOpen and onMenuPress", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const onMenuPress = vi.fn();
    render(
      <AppStoreInstalledApp
        title="App"
        builderName="Dev"
        imageProps={img}
        onOpen={onOpen}
        onMenuPress={onMenuPress}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.click(screen.getByRole("button", { name: "More actions" }));
    expect(onOpen).toHaveBeenCalledOnce();
    expect(onMenuPress).toHaveBeenCalledOnce();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <AppStoreInstalledApp title="App" builderName="Dev" imageProps={img} onOpen={() => {}} />,
    );
    const results = await axe(container);
    // eslint-disable-next-line -- vitest-axe matcher type augmentation
    (expect(results) as any).toHaveNoViolations();
  });
});
