import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ReviewCard } from "./ReviewCard";

describe("ReviewCard", () => {
  describe("API", () => {
    it("applies custom className", () => {
      const { container } = render(
        <ReviewCard rating={4} className="custom-class">
          Body
        </ReviewCard>,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("forwards arbitrary props to the root element", () => {
      const { container } = render(
        <ReviewCard rating={4} data-foo="bar">
          Body
        </ReviewCard>,
      );
      expect(container.firstChild).toHaveAttribute("data-foo", "bar");
    });
  });

  describe("content", () => {
    it("renders the title and body", () => {
      render(
        <ReviewCard rating={4} title="A great app to start!">
          Easily plan and organize your content.
        </ReviewCard>,
      );
      expect(screen.getByText("A great app to start!")).toBeInTheDocument();
      expect(screen.getByText("Easily plan and organize your content.")).toBeInTheDocument();
    });

    it("renders the author byline when provided", () => {
      render(
        <ReviewCard rating={4} author="@jane_doe">
          Body
        </ReviewCard>,
      );
      expect(screen.getByText(/by\s*@jane_doe/)).toBeInTheDocument();
    });

    it("omits the byline when no author is provided", () => {
      render(<ReviewCard rating={4}>Body</ReviewCard>);
      expect(screen.queryByText(/by/)).not.toBeInTheDocument();
    });
  });

  describe("rating", () => {
    it("exposes an accessible label for the rating", () => {
      render(<ReviewCard rating={4}>Body</ReviewCard>);
      expect(screen.getByRole("img", { name: "Rated 4 out of 5" })).toBeInTheDocument();
    });

    it("reflects a custom maxRating in the accessible label", () => {
      render(
        <ReviewCard rating={7} maxRating={10}>
          Body
        </ReviewCard>,
      );
      expect(screen.getByRole("img", { name: "Rated 7 out of 10" })).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <ReviewCard rating={4} author="@jane_doe" title="A great app to start!">
          Easily plan and organize your content.
        </ReviewCard>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
