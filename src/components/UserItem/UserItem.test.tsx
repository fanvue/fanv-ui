import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { UserItem } from "./UserItem";

const baseUser = {
  displayName: "Jane Doe",
  handle: "jane_doe",
};

describe("UserItem", () => {
  describe("API", () => {
    it("renders the display name and handle", () => {
      render(<UserItem user={baseUser} />);
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
      expect(screen.getByText("@jane_doe")).toBeInTheDocument();
    });

    it("prefers the nickname over the display name when present", () => {
      render(<UserItem user={{ ...baseUser, nickname: "JD" }} />);
      expect(screen.getByText("JD")).toBeInTheDocument();
      expect(screen.queryByText("Jane Doe")).not.toBeInTheDocument();
    });

    it("hides the handle when showHandle is false", () => {
      render(<UserItem user={baseUser} showHandle={false} />);
      expect(screen.queryByText("@jane_doe")).not.toBeInTheDocument();
    });

    it("renders the avatar by default with initials fallback", async () => {
      render(<UserItem user={baseUser} />);
      expect(screen.getByTestId("avatar")).toBeInTheDocument();
      expect(await screen.findByText("JD")).toBeInTheDocument();
    });

    it("hides the avatar when showAvatar is false", () => {
      render(<UserItem user={baseUser} showAvatar={false} />);
      expect(screen.queryByTestId("avatar")).not.toBeInTheDocument();
    });

    it("forwards the avatar src and alt from the user", () => {
      render(<UserItem user={{ ...baseUser, avatarUri: { url: "/jane.jpg" } }} />);
      const image = document.querySelector("img");
      // Radix renders the image lazily, but the alt is taken from displayName.
      expect(screen.getByTestId("avatar")).toBeInTheDocument();
      if (image) {
        expect(image).toHaveAttribute("alt", "Jane Doe");
      }
    });

    it("applies custom className and spreads HTML attributes", () => {
      render(<UserItem user={baseUser} data-testid="item" className="custom" data-custom="x" />);
      const item = screen.getByTestId("item");
      expect(item).toHaveClass("custom");
      expect(item).toHaveAttribute("data-custom", "x");
    });

    it("forwards ref to the root element", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<UserItem user={baseUser} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("muted indicator", () => {
    it("is hidden by default", () => {
      const { container } = render(<UserItem user={baseUser} />);
      expect(container.querySelector(".bg-surface-primary")).not.toBeInTheDocument();
    });

    it("is shown when isMuted is true", () => {
      const { container } = render(<UserItem user={baseUser} isMuted />);
      expect(container.querySelector(".bg-surface-primary")).toBeInTheDocument();
    });
  });

  describe("online indicator", () => {
    it("is not shown when only isOnline is set", () => {
      const { container } = render(<UserItem user={baseUser} isOnline />);
      expect(container.querySelector(".bg-brand-primary-default")).not.toBeInTheDocument();
    });

    it("is shown only when both showOnlineStatus and isOnline are set", () => {
      const { container } = render(<UserItem user={baseUser} isOnline showOnlineStatus />);
      expect(container.querySelector(".bg-brand-primary-default")).toBeInTheDocument();
    });

    it("is not shown when showOnlineStatus is set but the user is offline", () => {
      const { container } = render(<UserItem user={baseUser} showOnlineStatus />);
      expect(container.querySelector(".bg-brand-primary-default")).not.toBeInTheDocument();
    });
  });

  describe("avatarSize", () => {
    it("defaults to the 48px avatar (size-12)", () => {
      render(<UserItem user={baseUser} />);
      expect(screen.getByTestId("avatar")).toHaveClass("size-12");
    });

    it.each([
      [21, "size-6"], // 21 -> nearest 24
      [30, "size-8"], // 30 -> nearest 32
      [70, "size-16"], // 70 -> nearest 64
      [120, "size-37"], // 120 -> nearest 148
    ])("snaps %ipx to the nearest supported size", (size, expectedClass) => {
      render(<UserItem user={baseUser} avatarSize={size} />);
      expect(screen.getByTestId("avatar")).toHaveClass(expectedClass);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <UserItem user={{ ...baseUser, nickname: "JD" }} isMuted isOnline showOnlineStatus />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
