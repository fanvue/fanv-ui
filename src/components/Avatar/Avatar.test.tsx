import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  Avatar,
  AvatarAnonymousPlaceholder,
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "./Avatar";

describe("Avatar", () => {
  describe("API", () => {
    it("applies custom className", () => {
      const { container } = render(<Avatar className="custom-class" fallback="AB" />);
      const avatar = container.querySelector(".custom-class");
      expect(avatar).toBeInTheDocument();
    });

    it("renders fallback when src is not provided", async () => {
      render(<Avatar fallback="AB" />);
      const fallback = await screen.findByText("AB");
      expect(fallback).toBeInTheDocument();
    });

    it("uses a neutral alpha background on the avatar root for the fallback state", async () => {
      render(<Avatar fallback="AB" />);
      await screen.findByText("AB");
      expect(screen.getByTestId("avatar")).toHaveClass("bg-neutral-alphas-200");
    });

    it("renders anonymous placeholder when anonymousUser is true and there is no src", async () => {
      const { container } = render(<Avatar anonymousUser size={48} />);
      await screen.findByTestId("avatar");
      await waitFor(() => {
        expect(container.querySelector("img")).toBeTruthy();
      });
      const img = container.querySelector("img");
      expect(img).toHaveAttribute("alt", "");
    });

    it("prefers anonymous placeholder over string fallback when anonymousUser is true", async () => {
      const { container } = render(<Avatar anonymousUser fallback="AB" />);
      expect(screen.queryByText("AB")).not.toBeInTheDocument();
      await screen.findByTestId("avatar");
      await waitFor(() => {
        expect(container.querySelector("img")).toBeTruthy();
      });
    });

    it("renders fallback when image fails to load", async () => {
      render(<Avatar src="https://invalid-url.com/avatar.jpg" fallback="AB" />);
      const fallback = await screen.findByText("AB");
      expect(fallback).toBeInTheDocument();
    });

    it("renders custom fallback content", async () => {
      render(<Avatar fallback={<span data-testid="custom-fallback">Custom</span>} />);
      const customFallback = await screen.findByTestId("custom-fallback");
      expect(customFallback).toBeInTheDocument();
    });

    it("uses the larger online indicator for 48px avatars", async () => {
      const { container } = render(<Avatar size={48} fallback="AB" onlineIndicator={true} />);
      await screen.findByText("AB");
      const statusDot = container.querySelector('span[aria-hidden="true"]');
      expect(statusDot).toHaveClass("size-2", "border");
      expect(statusDot).toHaveStyle({ top: "5px", right: "2px" });
    });
  });

  describe("individual component exports", () => {
    it("renders with individual components", async () => {
      render(
        <AvatarRoot>
          <AvatarImage src="https://example.com/avatar.jpg" alt="User avatar" />
          <AvatarFallback>AB</AvatarFallback>
        </AvatarRoot>,
      );
      const fallback = await screen.findByText("AB");
      expect(fallback).toBeInTheDocument();
    });

    it("applies custom className to AvatarFallback", async () => {
      render(
        <AvatarRoot>
          <AvatarFallback className="custom-fallback">AB</AvatarFallback>
        </AvatarRoot>,
      );
      const fallback = await screen.findByText("AB");
      expect(fallback).toHaveClass("custom-fallback");
    });

    it("allows AvatarAnonymousPlaceholder inside AvatarFallback", async () => {
      const { container } = render(
        <AvatarRoot size={40}>
          <AvatarFallback>
            <AvatarAnonymousPlaceholder />
          </AvatarFallback>
        </AvatarRoot>,
      );
      await screen.findByTestId("avatar");
      await waitFor(() => {
        expect(container.querySelector("img")).toBeTruthy();
      });
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations with simple API", async () => {
      const { container } = render(
        <Avatar src="https://example.com/avatar.jpg" alt="User avatar" fallback="AB" />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with individual components", async () => {
      const { container } = render(
        <AvatarRoot>
          <AvatarImage src="https://example.com/avatar.jpg" alt="User avatar" />
          <AvatarFallback>AB</AvatarFallback>
        </AvatarRoot>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with decorative avatar (empty alt)", async () => {
      const { container } = render(
        <AvatarRoot>
          <AvatarImage
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg=="
            alt=""
          />
          <AvatarFallback>AB</AvatarFallback>
        </AvatarRoot>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with anonymousUser", async () => {
      const { container } = render(<Avatar anonymousUser aria-label="Unknown partner" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
