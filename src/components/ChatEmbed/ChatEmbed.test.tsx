import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "../Button/Button";
import { LiveStatus } from "../LiveStatus/LiveStatus";
import { ChatEmbed, ChatEmbedSkeleton, ChatEmbedUnavailable } from "./ChatEmbed";

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

    it("shows the creator badges after the title on the creator layout", () => {
      render(<ChatEmbed {...baseProps} verified aiDisclosure />);
      const title = screen.getByText("Display Name").closest("p");
      expect(title).toContainElement(screen.getByRole("img", { name: "Verified" }));
      expect(screen.getByRole("img", { name: "AI creator" })).toBeInTheDocument();
    });

    it("shows the creator badges after the subtitle on the experience layout", () => {
      render(<ChatEmbed {...baseProps} variant="experience" verified />);
      const subtitle = screen.getByText("@handle").closest("p");
      expect(subtitle).toContainElement(screen.getByRole("img", { name: "Verified" }));
    });

    it("renders the badge, category and meta slots", () => {
      render(
        <ChatEmbed
          {...baseProps}
          variant="experience"
          badge={<LiveStatus />}
          category="Audio"
          meta="2 hours ago"
        />,
      );
      expect(screen.getByText("LIVE")).toBeInTheDocument();
      expect(screen.getByText("Audio")).toBeInTheDocument();
      expect(screen.getByText("2 hours ago")).toBeInTheDocument();
    });

    it("greys out the media when inactive", () => {
      render(
        <ChatEmbed
          {...baseProps}
          inactive
          media={<img src="https://images.unsplash.com/photo-abc" alt="" data-testid="media" />}
        />,
      );
      const layer = screen.getByTestId("media").closest(".select-none");
      expect(layer?.querySelector(".mix-blend-saturation")).not.toBeNull();
    });

    it("renders social proof on the experience layout", () => {
      render(
        <ChatEmbed
          {...baseProps}
          variant="experience"
          socialProof={{ avatars: [{ fallback: "A" }, { fallback: "B" }], label: "+2 watching" }}
        />,
      );
      expect(screen.getByText("+2 watching")).toBeInTheDocument();
    });

    it("renders a fallback surface when media is omitted", () => {
      const { container } = render(<ChatEmbed title="Display Name" />);
      expect(container.querySelector(".bg-content-always-black")).not.toBeNull();
    });

    it("uses mediaBackdrop for the blurred copy of vertical media", () => {
      render(
        <ChatEmbed
          {...baseProps}
          verticalMedia
          media={<img src="https://images.unsplash.com/photo-abc" alt="Stream" />}
          mediaBackdrop={
            <img src="https://images.unsplash.com/photo-def" alt="" data-testid="backdrop" />
          }
        />,
      );
      expect(screen.getAllByRole("img", { name: "Stream" })).toHaveLength(1);
      expect(screen.getByTestId("backdrop").closest('[aria-hidden="true"]')).not.toBeNull();
    });

    it("links the whole card when href is set, named by the title", () => {
      render(
        <ChatEmbed
          {...baseProps}
          variant="experience"
          href="https://www.fanvue.com"
          target="_blank"
        />,
      );
      const link = screen.getByRole("link", { name: "Display Name" });
      expect(link).toHaveAttribute("href", "https://www.fanvue.com");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("calls onOpen from a whole-card button and keeps the action separate", () => {
      const onOpen = vi.fn();
      const onAction = vi.fn();
      render(
        <ChatEmbed
          {...baseProps}
          variant="experience"
          onOpen={onOpen}
          action={
            <Button variant="white" size="32" onClick={onAction}>
              Join
            </Button>
          }
        />,
      );
      fireEvent.click(screen.getByRole("button", { name: "Display Name" }));
      expect(onOpen).toHaveBeenCalledTimes(1);
      fireEvent.click(screen.getByRole("button", { name: "Join" }));
      expect(onAction).toHaveBeenCalledTimes(1);
      expect(onOpen).toHaveBeenCalledTimes(1);
    });
  });

  describe("ChatEmbedSkeleton", () => {
    it("announces a busy loading state", () => {
      render(<ChatEmbedSkeleton variant="experience" label="Loading experience" />);
      const status = screen.getByRole("status", { name: "Loading experience" });
      expect(status).toHaveAttribute("aria-busy", "true");
      expect(status).toHaveClass("h-[239px]");
    });
  });

  describe("ChatEmbedUnavailable", () => {
    it("shows a default message per variant and accepts a custom one", () => {
      const { rerender } = render(<ChatEmbedUnavailable variant="experience" />);
      expect(screen.getByText("This experience is no longer available")).toBeInTheDocument();
      rerender(<ChatEmbedUnavailable>Introuvable</ChatEmbedUnavailable>);
      expect(screen.getByText("Introuvable")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <div>
          <ChatEmbed
            {...baseProps}
            variant="experience"
            href="https://www.fanvue.com"
            badge={<LiveStatus />}
            category="Audio"
            meta="2 hours ago"
            verified
            aiDisclosure
            avatar={{ fallback: "JD" }}
            socialProof={{ avatars: [{ fallback: "A" }], label: "+2 watching" }}
            action={
              <Button variant="white" size="32">
                Join
              </Button>
            }
          />
          <ChatEmbedSkeleton />
          <ChatEmbedUnavailable />
        </div>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
