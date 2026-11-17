import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "../Button/Button";
import { CreatorCover } from "./CreatorCover";

const baseProps = {
  imageSrc: "https://example.com/creator.jpg",
  imageAlt: "Jane Doe",
  name: "JANE DOE",
};

describe("CreatorCover", () => {
  describe("API", () => {
    it("renders a region labelled by the heading", () => {
      render(<CreatorCover {...baseProps} />);
      const region = screen.getByRole("region", { name: "JANE DOE" });
      expect(region).toBeInTheDocument();
      expect(region).toHaveAttribute("data-testid", "creator-cover");
    });

    it("renders the name as a level-2 heading", () => {
      render(<CreatorCover {...baseProps} />);
      expect(screen.getByRole("heading", { level: 2, name: "JANE DOE" })).toBeInTheDocument();
    });

    it("uses the imageSrc for the cover image with the provided alt text", () => {
      render(<CreatorCover {...baseProps} />);
      const cover = screen.getByAltText("Jane Doe");
      expect(cover).toHaveAttribute("src", baseProps.imageSrc);
      expect(cover).toHaveAttribute("loading", "lazy");
    });

    it("falls back to imageSrc for the blurred background when backgroundSrc is omitted", () => {
      const { container } = render(<CreatorCover {...baseProps} />);
      const images = container.querySelectorAll("img");
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute("src", baseProps.imageSrc);
    });

    it("uses backgroundSrc for the blurred background when provided", () => {
      const { container } = render(
        <CreatorCover {...baseProps} backgroundSrc="https://example.com/bg.jpg" />,
      );
      const backgroundImg = container.querySelector("img[alt='']");
      expect(backgroundImg).toHaveAttribute("src", "https://example.com/bg.jpg");
    });

    it("renders the tagline in uppercase styling", () => {
      render(<CreatorCover {...baseProps} tagline="Global Popstar" />);
      const tagline = screen.getByText("Global Popstar");
      expect(tagline).toHaveClass("uppercase");
      expect(tagline).toHaveClass("text-brand-primary-default");
    });

    it("renders a string tag as a pill", () => {
      render(<CreatorCover {...baseProps} tag="New Joiner" />);
      const tag = screen.getByTestId("pill");
      expect(tag).toHaveTextContent("New Joiner");
      expect(tag).toHaveClass("bg-brand-primary-default");
      expect(tag).toHaveClass("rounded-full");
    });

    it("renders a node tag as-is", () => {
      render(<CreatorCover {...baseProps} tag={<span data-testid="custom-tag">Trending</span>} />);
      expect(screen.getByTestId("custom-tag")).toBeInTheDocument();
    });

    it("renders a node action as-is", () => {
      render(
        <CreatorCover
          {...baseProps}
          action={
            <Button variant="brand" fullWidth>
              Subscribe
            </Button>
          }
        />,
      );
      const button = screen.getByRole("button", { name: "Subscribe" });
      expect(button).toHaveClass("w-full");
      expect(button).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(<CreatorCover {...baseProps} className="custom-class" />);
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("forwards additional HTML attributes", () => {
      render(<CreatorCover {...baseProps} id="hero" />);
      expect(screen.getByRole("region")).toHaveAttribute("id", "hero");
    });
  });

  describe("accessibility", () => {
    it("has no axe violations with all slots", async () => {
      const { container } = render(
        <CreatorCover
          {...baseProps}
          tagline="Global Popstar"
          tag="New Joiner"
          action={
            <Button variant="brand" fullWidth>
              Join for free for 7 days
            </Button>
          }
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no axe violations with minimal props", async () => {
      const { container } = render(<CreatorCover {...baseProps} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
