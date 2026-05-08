import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "../Button/Button";
import { CreatorTile } from "./CreatorTile";

const baseProps = {
  background: (
    <img
      src="https://images.unsplash.com/photo-abc?w=720&h=400&fit=crop"
      alt=""
      loading="lazy"
      data-testid="background-image"
    />
  ),
  name: "Aitana Lopez",
};

describe("CreatorTile", () => {
  describe("API", () => {
    it("renders the name and tagline", () => {
      render(<CreatorTile {...baseProps} tagline="@fit_aitana" />);
      expect(screen.getByText("Aitana Lopez")).toBeInTheDocument();
      expect(screen.getByText("@fit_aitana")).toBeInTheDocument();
    });

    it("renders the background in a non-interactive full-size layer", () => {
      render(<CreatorTile {...baseProps} />);
      const image = screen.getByTestId("background-image");
      const background = image.parentElement;
      expect(background).toHaveClass("pointer-events-none");
      expect(image).toHaveAttribute(
        "src",
        "https://images.unsplash.com/photo-abc?w=720&h=400&fit=crop",
      );
    });

    it("renders avatar fallback content", async () => {
      render(<CreatorTile {...baseProps} avatar={{ fallback: "AL" }} />);
      expect(await screen.findByText("AL")).toBeInTheDocument();
    });

    it("forwards avatar props to the inner Avatar", () => {
      render(
        <CreatorTile
          {...baseProps}
          avatar={{ fallback: "AL", className: "custom-avatar", onlineIndicator: true }}
        />,
      );
      const avatar = screen.getByTestId("avatar");
      expect(avatar).toHaveClass("custom-avatar");
    });

    it("omits the tagline when not provided", () => {
      render(<CreatorTile {...baseProps} />);
      expect(screen.queryByText("@fit_aitana")).not.toBeInTheDocument();
    });

    it("renders the action element", () => {
      render(<CreatorTile {...baseProps} action={<Button variant="primary">Follow</Button>} />);
      expect(screen.getByRole("button", { name: "Follow" })).toBeInTheDocument();
    });

    it("omits the action when not provided", () => {
      render(<CreatorTile {...baseProps} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(<CreatorTile {...baseProps} data-testid="tile" className="custom" />);
      expect(screen.getByTestId("tile")).toHaveClass("custom");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CreatorTile {...baseProps} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("spreads additional HTML attributes", () => {
      render(<CreatorTile {...baseProps} data-testid="tile" data-custom="value" />);
      expect(screen.getByTestId("tile")).toHaveAttribute("data-custom", "value");
    });
  });

  describe("aspectRatio", () => {
    it("uses medium (361/200) ratio by default", () => {
      render(<CreatorTile {...baseProps} data-testid="tile" />);
      expect(screen.getByTestId("tile")).toHaveClass("aspect-[361/200]");
    });

    it.each([
      ["tall", "aspect-1/2"],
      ["medium", "aspect-[361/200]"],
      ["short", "aspect-4/5"],
    ] as const)("applies %s ratio class", (aspectRatio, expectedClass) => {
      render(<CreatorTile {...baseProps} data-testid="tile" aspectRatio={aspectRatio} />);
      expect(screen.getByTestId("tile")).toHaveClass(expectedClass);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations with name and tagline", async () => {
      const { container } = render(
        <CreatorTile
          {...baseProps}
          tagline="@fit_aitana"
          avatar={{ fallback: "AL" }}
          action={<Button variant="primary">Follow</Button>}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations without optional content", async () => {
      const { container } = render(<CreatorTile {...baseProps} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
