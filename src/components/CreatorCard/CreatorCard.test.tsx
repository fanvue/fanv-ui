import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "../Button/Button";
import { CreatorCard } from "./CreatorCard";

const baseProps = {
  imageSrc: "https://images.unsplash.com/photo-abc?w=290&h=450&fit=crop",
  name: "Jane Doe",
};

describe("CreatorCard", () => {
  describe("API", () => {
    it("renders the name and description", () => {
      render(<CreatorCard {...baseProps} description="MODEL & PODCASTER" />);
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
      expect(screen.getByText("MODEL & PODCASTER")).toBeInTheDocument();
    });

    it("renders the background image with empty alt by default", () => {
      render(<CreatorCard {...baseProps} data-testid="card" />);
      const image = screen.getByTestId("card").querySelector("img");
      expect(image).toHaveAttribute("src", baseProps.imageSrc);
      expect(image).toHaveAttribute("alt", "");
    });

    it("uses provided imageAlt when set", () => {
      render(<CreatorCard {...baseProps} imageAlt="Creator portrait" data-testid="card" />);
      const image = screen.getByTestId("card").querySelector("img");
      expect(image).toHaveAttribute("alt", "Creator portrait");
    });

    it("renders avatar fallback content", async () => {
      render(<CreatorCard {...baseProps} avatar={{ fallback: "JD" }} />);
      expect(await screen.findByText("JD")).toBeInTheDocument();
    });

    it("forwards avatar props to the inner Avatar", async () => {
      render(
        <CreatorCard
          {...baseProps}
          avatar={{
            fallback: "JD",
            size: 64,
            className: "custom-avatar",
            onlineIndicator: true,
          }}
        />,
      );
      const avatar = screen.getByTestId("avatar");
      expect(avatar).toHaveClass("custom-avatar");
      expect(avatar).toHaveClass("size-16");
      expect(await screen.findByText("JD")).toBeInTheDocument();
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CreatorCard {...baseProps} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("applies custom className", () => {
      render(<CreatorCard {...baseProps} data-testid="card" className="custom" />);
      expect(screen.getByTestId("card")).toHaveClass("custom");
    });

    it("spreads additional HTML attributes", () => {
      render(<CreatorCard {...baseProps} data-custom="value" data-testid="card" />);
      expect(screen.getByTestId("card")).toHaveAttribute("data-custom", "value");
    });
  });

  describe("actions", () => {
    it("renders no action buttons when actions is omitted", () => {
      render(<CreatorCard {...baseProps} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("renders a single action button", () => {
      render(
        <CreatorCard
          {...baseProps}
          actions={
            <Button variant="brand" fullWidth>
              Follow for Free
            </Button>
          }
        />,
      );
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveTextContent("Follow for Free");
    });

    it("renders two stacked action buttons", () => {
      render(
        <CreatorCard
          {...baseProps}
          actions={
            <>
              <Button variant="brand" fullWidth>
                Join for free for 3 days
              </Button>
              <Button variant="primary" fullWidth>
                Follow for Free
              </Button>
            </>
          }
        />,
      );
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveTextContent("Join for free for 3 days");
      expect(buttons[1]).toHaveTextContent("Follow for Free");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations with no buttons", async () => {
      const { container } = render(
        <CreatorCard {...baseProps} description="MODEL & PODCASTER" avatar={{ fallback: "JD" }} />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations with one button", async () => {
      const { container } = render(
        <CreatorCard
          {...baseProps}
          description="MODEL & PODCASTER"
          avatar={{ fallback: "JD" }}
          actions={
            <Button variant="brand" fullWidth>
              Follow for Free
            </Button>
          }
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations with two buttons", async () => {
      const { container } = render(
        <CreatorCard
          {...baseProps}
          description="MODEL & PODCASTER"
          avatar={{ fallback: "JD" }}
          actions={
            <>
              <Button variant="brand" fullWidth>
                Join for free for 3 days
              </Button>
              <Button variant="primary" fullWidth>
                Follow for Free
              </Button>
            </>
          }
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
