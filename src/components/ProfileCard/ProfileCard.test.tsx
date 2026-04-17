import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ProfileCard } from "./ProfileCard";

describe("ProfileCard", () => {
  const baseProps = {
    name: "Aitana Lopez",
    username: "fit_aitana",
    bannerSrc: "https://example.com/banner.jpg",
    avatarSrc: "https://example.com/avatar.jpg",
  };

  it("renders profile details", () => {
    render(<ProfileCard {...baseProps} />);

    expect(screen.getByTestId("profile-card")).toBeInTheDocument();
    expect(screen.getByText("Aitana Lopez")).toBeInTheDocument();
    expect(screen.getByText("@fit_aitana")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Follow Aitana Lopez" })).toBeInTheDocument();
  });

  it("uses username as-is when it already has @", () => {
    render(<ProfileCard {...baseProps} username="@fit_aitana" />);
    expect(screen.getByText("@fit_aitana")).toBeInTheDocument();
  });

  it("calls onFollowClick when action is clicked", () => {
    const onFollowClick = vi.fn();
    render(<ProfileCard {...baseProps} onFollowClick={onFollowClick} />);

    screen.getByRole("button", { name: "Follow Aitana Lopez" }).click();
    expect(onFollowClick).toHaveBeenCalledTimes(1);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ProfileCard {...baseProps} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
