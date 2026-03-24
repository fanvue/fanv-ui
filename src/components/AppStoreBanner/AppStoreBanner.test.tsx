import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { AppStoreBanner } from "./AppStoreBanner";

const base = {
  eyebrow: "Build for Fanvue",
  headline: "Main message",
  ctaLabel: "Get started",
};

describe("AppStoreBanner", () => {
  it("renders copy", () => {
    render(<AppStoreBanner {...base} />);
    expect(screen.getByText("Build for Fanvue")).toBeInTheDocument();
    expect(screen.getByText("Main message")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Get started" })).toBeInTheDocument();
  });

  it("renders optional description", () => {
    render(<AppStoreBanner {...base} description="Extra" />);
    expect(screen.getByText("Extra")).toBeInTheDocument();
  });

  it("calls onCtaPress", async () => {
    const user = userEvent.setup();
    const onCtaPress = vi.fn();
    render(<AppStoreBanner {...base} onCtaPress={onCtaPress} />);
    await user.click(screen.getByRole("button", { name: "Get started" }));
    expect(onCtaPress).toHaveBeenCalledOnce();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<AppStoreBanner {...base} onCtaPress={() => {}} />);
    const results = await axe(container);
    // eslint-disable-next-line -- vitest-axe matcher type augmentation
    (expect(results) as any).toHaveNoViolations();
  });
});
