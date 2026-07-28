import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { IconButton } from "../IconButton/IconButton";
import { HomeIcon } from "../Icons/HomeIcon";
import { ButtonIconGroup } from "./ButtonIconGroup";

const renderGroup = (props?: Partial<React.ComponentProps<typeof ButtonIconGroup>>) => (
  <ButtonIconGroup aria-label="Media controls" {...props}>
    <IconButton variant="tertiary" size="48" icon={<HomeIcon />} aria-label="Home" />
    <IconButton variant="tertiary" size="48" icon={<HomeIcon />} aria-label="Search" />
  </ButtonIconGroup>
);

describe("ButtonIconGroup", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(renderGroup({ className: "custom-class" }));
      expect(screen.getByTestId("button-icon-group")).toHaveClass("custom-class");
    });

    it("forwards ref correctly", () => {
      const ref = { current: null };
      render(renderGroup({ ref }));
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("defaults to a horizontal group role", () => {
      render(renderGroup());
      const group = screen.getByRole("group", { name: "Media controls" });
      expect(group).toHaveAttribute("data-orientation", "horizontal");
      expect(group).not.toHaveClass("flex-col");
    });

    it("stacks buttons when orientation is vertical", () => {
      render(renderGroup({ orientation: "vertical" }));
      const group = screen.getByTestId("button-icon-group");
      expect(group).toHaveAttribute("data-orientation", "vertical");
      expect(group).toHaveClass("flex-col");
    });

    it("allows overriding the role", () => {
      render(renderGroup({ role: "toolbar" }));
      expect(screen.getByRole("toolbar", { name: "Media controls" })).toBeInTheDocument();
    });

    it("does not set aria-orientation on the default group role", () => {
      render(renderGroup({ orientation: "vertical" }));
      expect(screen.getByTestId("button-icon-group")).not.toHaveAttribute("aria-orientation");
    });

    it("mirrors orientation onto orientation-aware roles", () => {
      render(renderGroup({ role: "toolbar", orientation: "vertical" }));
      expect(screen.getByRole("toolbar", { name: "Media controls" })).toHaveAttribute(
        "aria-orientation",
        "vertical",
      );
    });

    it("renders the composed icon buttons", () => {
      render(renderGroup());
      expect(screen.getAllByTestId("icon-button")).toHaveLength(2);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(renderGroup());
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
