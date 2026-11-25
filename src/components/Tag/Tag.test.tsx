import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Tag } from "./Tag";

describe("Tag", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(<Tag className="custom-class">Whale</Tag>);
      expect(screen.getByTestId("tag")).toHaveClass("custom-class");
    });

    it("forwards ref", () => {
      const ref = vi.fn();
      render(<Tag ref={ref}>Whale</Tag>);
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLSpanElement));
    });

    it("renders no button without onRemove", () => {
      render(<Tag>+2</Tag>);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("hides the leading icon from assistive technology", () => {
      render(<Tag leadingIcon="🐳">Whale</Tag>);
      expect(screen.getByText("🐳")).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("remove button", () => {
    it("is named by removeLabel", () => {
      render(
        <Tag onRemove={() => {}} removeLabel="Quitar Ballena">
          Ballena
        </Tag>,
      );
      expect(screen.getByRole("button", { name: "Quitar Ballena" })).toBeInTheDocument();
    });

    it("calls onRemove on click", async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();
      render(
        <Tag onRemove={onRemove} removeLabel="Remove Whale">
          Whale
        </Tag>,
      );
      await user.click(screen.getByRole("button", { name: "Remove Whale" }));
      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it.each(["{Enter}", " "])("calls onRemove from the keyboard with %j", async (key) => {
      const user = userEvent.setup();
      const onRemove = vi.fn();
      render(
        <Tag onRemove={onRemove} removeLabel="Remove Whale">
          Whale
        </Tag>,
      );
      await user.tab();
      expect(screen.getByRole("button", { name: "Remove Whale" })).toHaveFocus();
      await user.keyboard(key);
      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it("is reachable by keyboard when revealed on hover", async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();
      render(
        <Tag onRemove={onRemove} removeLabel="Remove Whale" removeVisibility="hover">
          Whale
        </Tag>,
      );
      await user.tab();
      expect(screen.getByRole("button", { name: "Remove Whale" })).toHaveFocus();
      await user.keyboard("{Enter}");
      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it("stays in the accessibility tree when revealed on hover", () => {
      render(
        <Tag onRemove={() => {}} removeLabel="Remove Whale" removeVisibility="hover">
          Whale
        </Tag>,
      );
      expect(screen.getByRole("button", { name: "Remove Whale" })).toBeVisible();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<Tag>Whale</Tag>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations with a remove button", async () => {
      const { container } = render(
        <Tag variant="blue" leadingIcon="🐳" onRemove={() => {}} removeLabel="Remove Whale">
          Whale
        </Tag>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
