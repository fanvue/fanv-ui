import { render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { UserItem } from "./UserItem";

const baseUser = {
  displayName: "Jane Doe",
  handle: "jane_doe",
};

const mockImageLoad = () => {
  vi.spyOn(globalThis, "Image").mockImplementation(function Image() {
    const image = document.createElement("img");
    queueMicrotask(() => image.dispatchEvent(new Event("load")));
    return image;
  } as unknown as typeof Image);
};

afterEach(() => {
  vi.restoreAllMocks();
});

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

    it("forwards the avatar src and alt from the user", async () => {
      mockImageLoad();
      render(<UserItem user={{ ...baseUser, avatarUri: { url: "/jane.jpg" } }} />);
      expect(screen.getByTestId("avatar")).toBeInTheDocument();
      const image = await screen.findByRole("img", { name: "Jane Doe" });
      expect(image).toHaveAttribute("src", "/jane.jpg");
    });

    it("applies custom className and spreads HTML attributes", () => {
      render(<UserItem user={baseUser} data-testid="item" className="custom" data-custom="x" />);
      const item = screen.getByTestId("item");
      expect(item).toHaveClass("relative", "flex", "w-full", "px-2", "py-1", "custom");
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

  describe("badges", () => {
    it("renders no badges by default", () => {
      render(<UserItem user={baseUser} />);
      expect(screen.queryByRole("img", { name: "Verified" })).not.toBeInTheDocument();
      expect(screen.queryByRole("img", { name: "AI creator" })).not.toBeInTheDocument();
    });

    it("forwards verified and AI disclosure to the display name", () => {
      render(<UserItem user={baseUser} verified aiDisclosure />);
      expect(screen.getByRole("img", { name: "Verified" })).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "AI creator" })).toBeInTheDocument();
    });

    it("forwards custom badge labels to the display name", () => {
      render(
        <UserItem
          user={baseUser}
          verified
          verifiedLabel="Cuenta verificada"
          aiDisclosure
          aiDisclosureLabel="Creador con IA"
        />,
      );
      expect(screen.getByRole("img", { name: "Cuenta verificada" })).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "Creador con IA" })).toBeInTheDocument();
    });
  });

  describe("trailing", () => {
    it("renders no trailing slot by default", () => {
      render(<UserItem user={baseUser} data-testid="item" />);
      expect(screen.getByTestId("item").children).toHaveLength(2);
    });

    it("renders trailing content as the last child of the row", () => {
      render(<UserItem user={baseUser} trailing={<span>$14,523.59</span>} data-testid="item" />);
      expect(screen.getByText("$14,523.59")).toBeInTheDocument();
      expect(screen.getByTestId("item").lastElementChild).toHaveTextContent("$14,523.59");
    });

    it("keeps trailing content at its intrinsic width", () => {
      render(<UserItem user={baseUser} trailing={<span>12</span>} data-testid="item" />);
      expect(screen.getByTestId("item").lastElementChild).toHaveClass("shrink-0");
    });
  });

  describe("primary", () => {
    it("renders the display name when primary is not given", () => {
      render(<UserItem user={baseUser} />);
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    it("replaces the display-name line with custom content", () => {
      render(<UserItem user={baseUser} primary={<span>Jane Doe subscribed</span>} />);
      expect(screen.getByText("Jane Doe subscribed")).toBeInTheDocument();
      expect(screen.queryByText("Jane Doe")).not.toBeInTheDocument();
    });

    it("still renders the handle alongside custom primary content", () => {
      render(<UserItem user={baseUser} primary={<span>Jane Doe subscribed</span>} />);
      expect(screen.getByText("@jane_doe")).toBeInTheDocument();
    });
  });

  describe("secondary", () => {
    it("renders no secondary line by default", () => {
      render(<UserItem user={baseUser} showHandle={false} data-testid="item" />);
      expect(screen.getByTestId("item").querySelector("p")).not.toBeInTheDocument();
    });

    it("renders the secondary line under the name", () => {
      render(<UserItem user={baseUser} showHandle={false} secondary="subscribed to your feed" />);
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
      expect(screen.getByText("subscribed to your feed")).toBeInTheDocument();
    });

    it("renders the secondary line on the same tier as trailing meta", () => {
      render(
        <UserItem
          user={baseUser}
          showHandle={false}
          secondary="subscribed to your feed"
          data-testid="item"
        />,
      );
      expect(screen.getByText("subscribed to your feed")).toHaveClass(
        "typography-description-12px-regular",
        "text-content-secondary",
      );
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <UserItem user={{ ...baseUser, nickname: "JD" }} isMuted isOnline showOnlineStatus />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations with trailing content", async () => {
      const { container } = render(
        <UserItem user={baseUser} showHandle={false} trailing={<span>$14,523.59</span>} />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations with badges", async () => {
      const { container } = render(
        <UserItem user={baseUser} verified aiDisclosure showAvatar={false} />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
