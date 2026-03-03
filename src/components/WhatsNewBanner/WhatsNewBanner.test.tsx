import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { WhatsNewBanner } from "./WhatsNewBanner";

const DEFAULT_PROPS = {
  title: "Perfectly proportioned",
  description: "Aspect ratio selection is here!",
  imageSrc: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=264&h=264&fit=crop",
  imageAlt: "Feature preview",
};

describe("WhatsNewBanner", () => {
  describe("API", () => {
    it("applies custom className to the root element", () => {
      const { container } = render(<WhatsNewBanner {...DEFAULT_PROPS} className="custom-class" />);
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("renders title and description", () => {
      render(<WhatsNewBanner {...DEFAULT_PROPS} />);
      expect(screen.getByText(DEFAULT_PROPS.title)).toBeInTheDocument();
      expect(screen.getByText(DEFAULT_PROPS.description)).toBeInTheDocument();
    });

    it("renders image with the provided src and alt", () => {
      render(<WhatsNewBanner {...DEFAULT_PROPS} />);
      const img = screen.getByRole("img", { name: DEFAULT_PROPS.imageAlt });
      expect(img).toHaveAttribute("src", DEFAULT_PROPS.imageSrc);
    });

    it("renders image with empty alt when imageAlt is omitted", () => {
      const { imageAlt: _imageAlt, ...propsWithoutAlt } = DEFAULT_PROPS;
      render(<WhatsNewBanner {...propsWithoutAlt} />);
      const img = screen.getByAltText("");
      expect(img).toBeInTheDocument();
    });

    it("renders CTA as an anchor when ctaHref is provided", () => {
      render(<WhatsNewBanner {...DEFAULT_PROPS} ctaHref="/features" ctaLabel="Learn more" />);
      const link = screen.getByRole("link", { name: /learn more/i });
      expect(link).toHaveAttribute("href", "/features");
    });

    it("renders CTA as a button when ctaHref is omitted", () => {
      render(<WhatsNewBanner {...DEFAULT_PROPS} onCtaClick={vi.fn()} ctaLabel="Learn more" />);
      expect(screen.getByRole("button", { name: /learn more/i })).toBeInTheDocument();
    });

    it("fires onCtaClick when the CTA button is clicked", async () => {
      const handleClick = vi.fn();
      render(<WhatsNewBanner {...DEFAULT_PROPS} onCtaClick={handleClick} ctaLabel="Go" />);
      await userEvent.click(screen.getByRole("button", { name: /go/i }));
      expect(handleClick).toHaveBeenCalledOnce();
    });

    it("fires onCtaClick when the CTA anchor is clicked", async () => {
      const handleClick = vi.fn();
      render(
        <WhatsNewBanner
          {...DEFAULT_PROPS}
          ctaHref="/features"
          onCtaClick={handleClick}
          ctaLabel="Go"
        />,
      );
      await userEvent.click(screen.getByRole("link", { name: /go/i }));
      expect(handleClick).toHaveBeenCalledOnce();
    });

    it("hides the CTA when ctaLabel is empty", () => {
      render(<WhatsNewBanner {...DEFAULT_PROPS} ctaLabel="" />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("uses default ctaLabel when not provided", () => {
      render(<WhatsNewBanner {...DEFAULT_PROPS} />);
      expect(screen.getByText("See how it works")).toBeInTheDocument();
    });

    it("forwards extra HTML attributes to the root div", () => {
      render(<WhatsNewBanner {...DEFAULT_PROPS} data-testid="banner" />);
      expect(screen.getByTestId("banner")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations in portrait variant", async () => {
      const { container } = render(
        <WhatsNewBanner {...DEFAULT_PROPS} variant="portrait" ctaHref="/features" />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations in landscape variant", async () => {
      const { container } = render(
        <WhatsNewBanner {...DEFAULT_PROPS} variant="landscape" ctaHref="/features" />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations in landscape-small variant", async () => {
      const { container } = render(
        <WhatsNewBanner {...DEFAULT_PROPS} variant="landscape-small" ctaHref="/features" />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
