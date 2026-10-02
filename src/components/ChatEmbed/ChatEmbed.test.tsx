import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "../Button/Button";
import { ChatEmbed } from "./ChatEmbed";

const baseProps = {
  media: <img src="https://images.unsplash.com/photo-abc?w=800&h=320&fit=crop" alt="" />,
  title: "Display Name",
  subtitle: "@handle",
};

describe("ChatEmbed", () => {
  describe("API", () => {
    it("applies custom className and forwards ref", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ChatEmbed ref={ref} {...baseProps} className="custom" />);
      expect(ref.current).toHaveClass("custom");
    });

    it("sizes the creator and experience layouts to the design heights", () => {
      const { container, rerender } = render(<ChatEmbed {...baseProps} />);
      expect(container.firstChild).toHaveClass("h-40");
      rerender(<ChatEmbed {...baseProps} variant="experience" />);
      expect(container.firstChild).toHaveClass("h-[239px]");
    });

    it("shows the verified and AI-disclosure badges", () => {
      render(<ChatEmbed {...baseProps} verified aiDisclosure />);
      expect(screen.getByRole("img", { name: "Verified" })).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "AI creator" })).toBeInTheDocument();
    });

    it("renders the status badge and meta pill", () => {
      render(<ChatEmbed {...baseProps} variant="experience" status="live" meta="842 watching" />);
      expect(screen.getByText("LIVE")).toBeInTheDocument();
      expect(screen.getByText("842 watching")).toBeInTheDocument();
    });

    it("greys out the media when the live has ended", () => {
      render(
        <ChatEmbed
          {...baseProps}
          variant="experience"
          status="ended"
          media={<img src="https://images.unsplash.com/photo-abc" alt="" data-testid="media" />}
        />,
      );
      const layer = screen.getByTestId("media").closest(".select-none");
      expect(layer?.querySelector(".mix-blend-saturation")).not.toBeNull();
    });

    it("renders social proof only on the experience layout", () => {
      const socialProof = {
        avatars: [{ fallback: "A" }, { fallback: "B" }],
        name: "Jane Doe",
        label: "+2 watching",
      };
      const { rerender } = render(<ChatEmbed {...baseProps} socialProof={socialProof} />);
      expect(screen.queryByText("+2 watching")).not.toBeInTheDocument();
      rerender(<ChatEmbed {...baseProps} variant="experience" socialProof={socialProof} />);
      expect(screen.getByText("+2 watching")).toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    it("hides the blurred backdrop copy of vertical media from assistive tech", () => {
      render(
        <ChatEmbed
          {...baseProps}
          verticalMedia
          media={<img src="https://images.unsplash.com/photo-abc" alt="Stream" />}
        />,
      );
      expect(screen.getAllByRole("img", { name: "Stream" })).toHaveLength(1);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <ChatEmbed
          {...baseProps}
          variant="experience"
          status="live"
          meta="842 watching"
          avatar={{ fallback: "JD" }}
          socialProof={{ avatars: [{ fallback: "A" }], label: "+2 watching" }}
          action={
            <Button variant="white" size="32">
              Join
            </Button>
          }
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
