import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { CreatorTile } from "./CreatorTile";

const SAMPLE_IMAGE =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=480&h=720&fit=crop";

describe("CreatorTile", () => {
  describe("API", () => {
    it("renders the name and tagline", () => {
      render(
        <CreatorTile
          imageSrc={SAMPLE_IMAGE}
          imageAlt="Portrait"
          name="JANE DOE"
          tagline="GLOBAL MUSIC ICON"
        />,
      );
      expect(screen.getByText("JANE DOE")).toBeInTheDocument();
      expect(screen.getByText("GLOBAL MUSIC ICON")).toBeInTheDocument();
    });

    it("renders the image with the provided alt text", () => {
      render(
        <CreatorTile imageSrc={SAMPLE_IMAGE} imageAlt="Portrait of Jane Doe" name="JANE DOE" />,
      );
      const image = screen.getByAltText("Portrait of Jane Doe");
      expect(image).toHaveAttribute("src", SAMPLE_IMAGE);
    });

    it("omits the tagline when not provided", () => {
      render(<CreatorTile imageSrc={SAMPLE_IMAGE} name="JANE DOE" />);
      expect(screen.queryByText("GLOBAL MUSIC ICON")).not.toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <CreatorTile
          data-testid="tile"
          className="custom"
          imageSrc={SAMPLE_IMAGE}
          name="JANE DOE"
        />,
      );
      expect(screen.getByTestId("tile")).toHaveClass("custom");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CreatorTile ref={ref} imageSrc={SAMPLE_IMAGE} name="JANE DOE" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("spreads additional HTML attributes", () => {
      render(
        <CreatorTile
          data-testid="tile"
          data-custom="value"
          imageSrc={SAMPLE_IMAGE}
          name="JANE DOE"
        />,
      );
      expect(screen.getByTestId("tile")).toHaveAttribute("data-custom", "value");
    });
  });

  describe("radius", () => {
    it("uses lg rounding by default", () => {
      render(<CreatorTile data-testid="tile" imageSrc={SAMPLE_IMAGE} name="JANE DOE" />);
      expect(screen.getByTestId("tile")).toHaveClass("rounded-lg");
    });

    it.each(["xs", "sm", "md", "lg", "xl"] as const)("supports %s rounding", (radius) => {
      render(
        <CreatorTile data-testid="tile" imageSrc={SAMPLE_IMAGE} name="JANE DOE" radius={radius} />,
      );
      expect(screen.getByTestId("tile")).toHaveClass(`rounded-${radius}`);
    });

    it("supports no rounded edges via `none`", () => {
      render(
        <CreatorTile data-testid="tile" imageSrc={SAMPLE_IMAGE} name="JANE DOE" radius="none" />,
      );
      expect(screen.getByTestId("tile")).toHaveClass("rounded-none");
    });
  });

  describe("aspectRatio", () => {
    it("uses medium (2/3) ratio by default", () => {
      render(<CreatorTile data-testid="tile" imageSrc={SAMPLE_IMAGE} name="JANE DOE" />);
      expect(screen.getByTestId("tile")).toHaveClass("aspect-2/3");
    });

    it.each([
      ["tall", "aspect-1/2"],
      ["medium", "aspect-2/3"],
      ["short", "aspect-4/5"],
    ] as const)("applies %s ratio class", (aspectRatio, expectedClass) => {
      render(
        <CreatorTile
          data-testid="tile"
          imageSrc={SAMPLE_IMAGE}
          name="JANE DOE"
          aspectRatio={aspectRatio}
        />,
      );
      expect(screen.getByTestId("tile")).toHaveClass(expectedClass);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations with name and tagline", async () => {
      const { container } = render(
        <CreatorTile
          imageSrc={SAMPLE_IMAGE}
          imageAlt="Portrait of Jane Doe"
          name="JANE DOE"
          tagline="GLOBAL MUSIC ICON"
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations with decorative image (empty alt)", async () => {
      const { container } = render(<CreatorTile imageSrc={SAMPLE_IMAGE} name="JANE DOE" />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
