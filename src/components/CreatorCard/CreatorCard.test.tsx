import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "../Button/Button";
import { CreatorCard } from "./CreatorCard";

const baseProps = {
  background: (
    <img
      src="https://images.unsplash.com/photo-abc?w=320&h=352&fit=crop"
      alt=""
      loading="lazy"
      data-testid="background-image"
    />
  ),
  name: "Jane Doe",
};

describe("CreatorCard", () => {
  describe("API", () => {
    it("renders the name, tagline and content", () => {
      render(<CreatorCard {...baseProps} tagline="412 posts" content="$9.99 / month" />);
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
      expect(screen.getByText("412 posts")).toBeInTheDocument();
      expect(screen.getByText("$9.99 / month")).toBeInTheDocument();
    });

    it("renders the background in a non-interactive full-size layer", () => {
      render(<CreatorCard {...baseProps} />);
      const background = screen.getByTestId("background-image").parentElement;
      expect(background).toHaveClass("pointer-events-none");
    });

    it("renders ReactNode content", () => {
      render(<CreatorCard {...baseProps} content={<strong data-testid="price">$4.99</strong>} />);
      expect(screen.getByTestId("price")).toHaveTextContent("$4.99");
    });

    it("does not truncate content by default", () => {
      render(<CreatorCard {...baseProps} content="$9.99 / month" />);
      expect(screen.getByText("$9.99 / month")).not.toHaveClass("truncate");
    });

    it("renders the pill with the contrast variant by default", () => {
      render(<CreatorCard {...baseProps} pill={{ children: "Popular this week" }} />);
      const pill = screen.getByTestId("pill");
      expect(pill).toHaveTextContent("Popular this week");
      expect(pill).toHaveClass("bg-buttons-primary-default");
    });

    it("forwards pill props", () => {
      render(
        <CreatorCard
          {...baseProps}
          pill={{ variant: "brand", className: "custom-pill", children: "New" }}
        />,
      );
      const pill = screen.getByTestId("pill");
      expect(pill).toHaveClass("bg-brand-primary-default");
      expect(pill).toHaveClass("custom-pill");
    });

    it("omits the pill when not provided", () => {
      render(<CreatorCard {...baseProps} />);
      expect(screen.queryByTestId("pill")).not.toBeInTheDocument();
    });

    it("renders the verified badge only when verified", () => {
      const { rerender } = render(<CreatorCard {...baseProps} />);
      expect(screen.queryByRole("img", { name: "Verified" })).not.toBeInTheDocument();
      rerender(<CreatorCard {...baseProps} verified verifiedLabel="Verified creator" />);
      expect(screen.getByRole("img", { name: "Verified creator" })).toBeInTheDocument();
    });

    it("forwards avatar props to the inner Avatar", async () => {
      render(
        <CreatorCard {...baseProps} avatar={{ fallback: "JD", className: "custom-avatar" }} />,
      );
      expect(screen.getByTestId("avatar")).toHaveClass("custom-avatar");
      expect(await screen.findByText("JD")).toBeInTheDocument();
    });

    it("renders the action element", () => {
      render(
        <CreatorCard
          {...baseProps}
          action={
            <Button variant="primary" size="32" fullWidth>
              Subscribe
            </Button>
          }
        />,
      );
      expect(screen.getByRole("button", { name: "Subscribe" })).toBeInTheDocument();
    });

    it("omits the action when not provided", () => {
      render(<CreatorCard {...baseProps} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("applies custom className to the root", () => {
      render(<CreatorCard {...baseProps} data-testid="card" className="w-40 rounded-md" />);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("w-40", "rounded-md", "overflow-hidden");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CreatorCard {...baseProps} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("spreads additional HTML attributes", () => {
      render(<CreatorCard {...baseProps} data-testid="card" data-custom="value" />);
      expect(screen.getByTestId("card")).toHaveAttribute("data-custom", "value");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations with all content", async () => {
      const { container } = render(
        <CreatorCard
          {...baseProps}
          pill={{ children: "Popular this week" }}
          avatar={{ fallback: "JD" }}
          verified
          tagline="412 posts"
          content="$9.99 / month"
          action={
            <Button variant="primary" size="32" fullWidth>
              Subscribe
            </Button>
          }
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations without optional content", async () => {
      const { container } = render(<CreatorCard {...baseProps} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
