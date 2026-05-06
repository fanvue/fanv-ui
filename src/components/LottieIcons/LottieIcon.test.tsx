import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { HomeIcon } from "../Icons/HomeIcon";
import { LottieIcon } from "./LottieIcon";

vi.mock("lottie-web/build/player/lottie_light", () => ({
  default: {
    loadAnimation: () => ({ destroy: vi.fn(), goToAndPlay: vi.fn(), goToAndStop: vi.fn() }),
  },
}));

const noopLoader = () => Promise.resolve({});

describe("LottieIcon", () => {
  it("renders the static fallback initially", () => {
    render(<LottieIcon Fallback={HomeIcon} loadAnimationData={noopLoader} aria-label="Home" />);
    expect(screen.getByLabelText("Home")).toBeInTheDocument();
  });

  it("applies the size class to the wrapper", () => {
    const { container } = render(
      <LottieIcon Fallback={HomeIcon} loadAnimationData={noopLoader} size={32} />,
    );
    expect(container.firstChild).toHaveClass("size-8");
  });

  it("plays when controlled via the play prop", async () => {
    render(
      <LottieIcon Fallback={HomeIcon} loadAnimationData={noopLoader} play aria-label="Home" />,
    );
    expect(screen.getByLabelText("Home")).toBeInTheDocument();
  });

  it("forwards a ref to the wrapping element", () => {
    const ref = vi.fn();
    render(<LottieIcon ref={ref} Fallback={HomeIcon} loadAnimationData={noopLoader} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLSpanElement));
  });

  it("plays on hover of the closest interactive ancestor", async () => {
    const user = userEvent.setup();
    render(
      <button type="button">
        <LottieIcon Fallback={HomeIcon} loadAnimationData={noopLoader} />
      </button>,
    );
    await user.hover(screen.getByRole("button"));
  });

  it("has no accessibility violations when decorative", async () => {
    const { container } = render(<LottieIcon Fallback={HomeIcon} loadAnimationData={noopLoader} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
