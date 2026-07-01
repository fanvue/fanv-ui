import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { RatingSummary } from "./RatingSummary";

const SAMPLE: { rating: number; count: number }[] = [
  { rating: 5, count: 300 },
  { rating: 4, count: 20 },
  { rating: 3, count: 20 },
  { rating: 2, count: 10 },
  { rating: 1, count: 0 },
];

describe("RatingSummary", () => {
  describe("API", () => {
    it("applies custom className", () => {
      const { container } = render(
        <RatingSummary distribution={SAMPLE} className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("forwards arbitrary props to the root element", () => {
      const { container } = render(<RatingSummary distribution={SAMPLE} data-foo="bar" />);
      expect(container.firstChild).toHaveAttribute("data-foo", "bar");
    });
  });

  describe("aggregation", () => {
    it("derives the count-weighted average and total from the distribution", () => {
      render(<RatingSummary distribution={SAMPLE} />);
      expect(
        screen.getByRole("img", { name: "Average rating 4.7 out of 5, 350 reviews" }),
      ).toBeInTheDocument();
    });

    it("prefers an explicit averageRating over the derived value", () => {
      render(<RatingSummary distribution={SAMPLE} averageRating={4.3} />);
      expect(
        screen.getByRole("img", { name: "Average rating 4.3 out of 5, 350 reviews" }),
      ).toBeInTheDocument();
    });

    it("renders a row for every rating down to 1, including ratings with no reviews", () => {
      render(<RatingSummary distribution={SAMPLE} />);
      expect(screen.getByRole("img", { name: "5 stars, 300 reviews" })).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "1 star, 0 reviews" })).toBeInTheDocument();
    });

    it("renders maxRating rows plus the header", () => {
      render(<RatingSummary distribution={SAMPLE} maxRating={3} />);
      expect(screen.getAllByRole("img")).toHaveLength(4);
      expect(screen.queryByRole("img", { name: /^5 stars/ })).not.toBeInTheDocument();
    });

    it("excludes out-of-range ratings from the derived total and average", () => {
      render(<RatingSummary distribution={SAMPLE} maxRating={3} />);
      expect(
        screen.getByRole("img", { name: "Average rating 2.7 out of 3, 30 reviews" }),
      ).toBeInTheDocument();
    });
  });

  describe("histogram bars", () => {
    it("scales bar widths relative to the most-reviewed rating", () => {
      const { container } = render(
        <RatingSummary
          distribution={[
            { rating: 5, count: 200 },
            { rating: 4, count: 100 },
            { rating: 3, count: 0 },
            { rating: 2, count: 0 },
            { rating: 1, count: 0 },
          ]}
        />,
      );
      const widths = Array.from(
        container.querySelectorAll<HTMLElement>("[style*='width']"),
        (fill) => fill.style.width,
      );
      expect(widths).toEqual(["100%", "50%", "0%", "0%", "0%"]);
    });

    it("fills the track for the busiest rating even when it is not the top rating", () => {
      const { container } = render(
        <RatingSummary
          distribution={[
            { rating: 5, count: 50 },
            { rating: 4, count: 100 },
            { rating: 3, count: 20 },
            { rating: 2, count: 0 },
            { rating: 1, count: 0 },
          ]}
        />,
      );
      const widths = Array.from(
        container.querySelectorAll<HTMLElement>("[style*='width']"),
        (fill) => fill.style.width,
      );
      expect(widths).toEqual(["50%", "100%", "20%", "0%", "0%"]);
    });

    it("renders zero-width bars when there are no reviews", () => {
      const { container } = render(
        <RatingSummary
          distribution={[
            { rating: 5, count: 0 },
            { rating: 4, count: 0 },
            { rating: 3, count: 0 },
            { rating: 2, count: 0 },
            { rating: 1, count: 0 },
          ]}
        />,
      );
      const fills = container.querySelectorAll<HTMLElement>("[style*='width']");
      expect(fills).toHaveLength(5);
      for (const fill of fills) {
        expect(fill.style.width).toBe("0%");
      }
    });
  });

  describe("count formatting", () => {
    it("pluralises the default review label for a single review", () => {
      render(<RatingSummary distribution={[{ rating: 5, count: 1 }]} />);
      expect(
        screen.getByRole("img", { name: "Average rating 5.0 out of 5, 1 review" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "5 stars, 1 review" })).toBeInTheDocument();
    });

    it("uses a custom formatCount for both header and row labels", () => {
      render(
        <RatingSummary
          distribution={[{ rating: 5, count: 12 }]}
          formatCount={(count) => `${count} ratings`}
        />,
      );
      expect(
        screen.getByRole("img", { name: "Average rating 5.0 out of 5, 12 ratings" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "5 stars, 12 ratings" })).toBeInTheDocument();
    });
  });

  describe("accessible label overrides", () => {
    it("uses formatAverageLabel for the header label", () => {
      render(
        <RatingSummary
          distribution={SAMPLE}
          formatAverageLabel={(average, max, total) => `${average}/${max} from ${total}`}
        />,
      );
      expect(screen.getByRole("img", { name: "4.7/5 from 350" })).toBeInTheDocument();
    });

    it("uses formatRatingLabel for each row label", () => {
      render(
        <RatingSummary
          distribution={SAMPLE}
          formatRatingLabel={(rating, count) => `rating ${rating}: ${count}`}
        />,
      );
      expect(screen.getByRole("img", { name: "rating 5: 300" })).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "rating 1: 0" })).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<RatingSummary distribution={SAMPLE} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations when empty", async () => {
      const { container } = render(<RatingSummary distribution={[]} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
