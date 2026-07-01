import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { FanFollowerCount } from "./FanFollowerCount";

describe("FanFollowerCount", () => {
  describe("API", () => {
    it("applies custom className", () => {
      const { container } = render(<FanFollowerCount fans={10} className="custom-class" />);
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("forwards ref correctly", () => {
      const ref = { current: null };
      render(<FanFollowerCount fans={10} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("value display", () => {
    it("compacts numeric counts", () => {
      render(<FanFollowerCount fans={1200} subs={3000} />);
      expect(screen.getByText("1.2k")).toBeInTheDocument();
      expect(screen.getByText("3k")).toBeInTheDocument();
    });

    it("renders string counts verbatim", () => {
      render(<FanFollowerCount fans="1.2m" subs="42" />);
      expect(screen.getByText("1.2m")).toBeInTheDocument();
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("renders the default labels", () => {
      render(<FanFollowerCount fans={1} subs={1} />);
      expect(screen.getByText("Fans")).toBeInTheDocument();
      expect(screen.getByText("Subs")).toBeInTheDocument();
    });

    it("supports custom labels", () => {
      render(<FanFollowerCount fans={1} subs={1} fansLabel="Followers" subsLabel="Members" />);
      expect(screen.getByText("Followers")).toBeInTheDocument();
      expect(screen.getByText("Members")).toBeInTheDocument();
    });
  });

  describe("visibility", () => {
    it("hides the fans group when showFans is false", () => {
      render(<FanFollowerCount fans={10} subs={20} showFans={false} />);
      expect(screen.queryByText("Fans")).not.toBeInTheDocument();
      expect(screen.getByText("Subs")).toBeInTheDocument();
    });

    it("hides the subs group when showSubs is false", () => {
      render(<FanFollowerCount fans={10} subs={20} showSubs={false} />);
      expect(screen.getByText("Fans")).toBeInTheDocument();
      expect(screen.queryByText("Subs")).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<FanFollowerCount fans={1200} subs={3000} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
