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

    it("shows the creator badges after the title on the creator layout", () => {
      render(<ChatEmbed {...baseProps} verified aiDisclosure />);
      const title = screen.getByText("Display Name").closest("p");
      expect(title).toContainElement(screen.getByRole("img", { name: "Verified" }));
      expect(screen.getByRole("img", { name: "AI creator" })).toBeInTheDocument();
    });

    it("labels the verified badge with the given text", () => {
      render(<ChatEmbed {...baseProps} verified verifiedLabel="Verifiziert" />);
      expect(screen.getByRole("img", { name: "Verifiziert" })).toBeInTheDocument();
      expect(screen.queryByRole("img", { name: "Verified" })).not.toBeInTheDocument();
    });

    it("shows the creator badges after the subtitle on the experience layout", () => {
      render(<ChatEmbed {...baseProps} variant="experience" verified />);
      const subtitle = screen.getByText("@handle").closest("p");
      expect(subtitle).toContainElement(screen.getByRole("img", { name: "Verified" }));
    });

    it("names the whole-card link by the creator name alone", () => {
      render(<ChatEmbed {...baseProps} href="https://www.fanvue.com" verified aiDisclosure />);
      expect(screen.getByRole("link", { name: "Display Name" })).toBeInTheDocument();
    });

    it("keeps the creator badges on experience cards without a subtitle", () => {
      render(
        <ChatEmbed
          {...baseProps}
          subtitle={undefined}
          variant="experience"
          verified
          aiDisclosure
        />,
      );
      expect(screen.getByRole("img", { name: "Verified" })).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "AI creator" })).toBeInTheDocument();
    });

    it("skips the top row for falsy slot values", () => {
      const { container } = render(
        <ChatEmbed {...baseProps} variant="experience" badge={false} category="" meta={null} />,
      );
      expect(container.firstChild).toHaveClass("justify-end");
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
    it("marks itself busy with a visually hidden label", () => {
      const { container } = render(<ChatEmbedSkeleton label="Loading experience" />);
      expect(container.firstChild).toHaveAttribute("aria-busy", "true");
      expect(screen.getByText("Loading experience")).toHaveClass("sr-only");
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
