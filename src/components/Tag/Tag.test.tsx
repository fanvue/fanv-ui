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

    it("renders a label built from text and a number", () => {
      const hiddenCount = 2;
      render(<Tag>+{hiddenCount}</Tag>);
      expect(screen.getByTestId("tag")).toHaveTextContent("+2");
    });

    it("renders no button when onRemove is conditionally undefined", () => {
      const canRemove = false;
      render(
        <Tag onRemove={canRemove ? () => {} : undefined} removeLabel="Remove Whale">
          Whale
        </Tag>,
      );
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

    it("passes the click to onRemove so a caller can stop it bubbling", async () => {
      const user = userEvent.setup();
      const onOutsideClick = vi.fn();
      document.body.addEventListener("click", onOutsideClick);
      render(
        <Tag onRemove={(event) => event.stopPropagation()} removeLabel="Remove Whale">
          Whale
        </Tag>,
      );
      await user.click(screen.getByRole("button", { name: "Remove Whale" }));
      document.body.removeEventListener("click", onOutsideClick);
      expect(onOutsideClick).not.toHaveBeenCalled();
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

  describe("remove target", () => {
    it("stretches the × hit area over the whole tag", () => {
      render(
        <Tag onRemove={() => {}} removeLabel="Remove Whale" removeTarget="tag">
          Whale
        </Tag>,
      );
      const remove = screen.getByRole("button", { name: "Remove Whale" });
      expect(remove).toHaveClass("after:inset-0");
      expect(remove).not.toHaveClass("relative");
      expect(screen.getByTestId("tag")).toHaveClass("relative", "cursor-pointer");
    });

    it("keeps the hit area on the × by default", () => {
      render(
        <Tag onRemove={() => {}} removeLabel="Remove Whale">
          Whale
        </Tag>,
      );
      const remove = screen.getByRole("button", { name: "Remove Whale" });
      expect(remove).toHaveClass("relative", "after:-inset-1.25");
      expect(remove).not.toHaveClass("after:inset-0");
    });

    it("stays one button named by removeLabel", async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();
      render(
        <Tag onRemove={onRemove} removeLabel="Remove Whale" removeTarget="tag">
          Whale
        </Tag>,
      );
      expect(screen.getAllByRole("button")).toHaveLength(1);
      await user.click(screen.getByRole("button", { name: "Remove Whale" }));
      expect(onRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe("selected", () => {
    it("uses the deeper step of its colour when selected", () => {
      render(
        <Tag selected variant="red">
          Whale
        </Tag>,
      );
      const tag = screen.getByTestId("tag");
      expect(tag).toHaveAttribute("data-selected", "true");
      expect(tag).toHaveClass("bg-tag-red-surface-strong", "text-tag-red-content-strong");
      expect(tag).not.toHaveClass("bg-tag-red-surface");
    });

    it("deepens to the same step on hover when removable", () => {
      render(
        <Tag variant="blue" onRemove={() => {}} removeLabel="Remove Whale">
          Whale
        </Tag>,
      );
      expect(screen.getByTestId("tag")).toHaveClass(
        "bg-tag-blue-surface",
        "hover:bg-tag-blue-surface-strong",
        "hover:text-tag-blue-content-strong",
      );
    });

    it("keeps the resting fill when not selected", () => {
      render(<Tag>Whale</Tag>);
      const tag = screen.getByTestId("tag");
      expect(tag).toHaveTextContent("Whale");
      expect(tag).not.toHaveAttribute("data-selected");
      expect(tag).toHaveClass("bg-tag-gray-surface");
      expect(tag).not.toHaveClass("bg-tag-gray-surface-strong");
    });

    it("keeps a hover-revealed × visible while selected", () => {
      render(
        <Tag selected onRemove={() => {}} removeLabel="Remove Whale" removeVisibility="hover">
          Whale
        </Tag>,
      );
      const remove = screen.getByRole("button", { name: "Remove Whale" });
      expect(remove).toHaveClass("size-3.5");
      expect(remove).not.toHaveClass("[@media(hover:hover)]:opacity-0");
    });

    it("hides a hover-revealed × at rest when not selected", () => {
      render(
        <Tag onRemove={() => {}} removeLabel="Remove Whale" removeVisibility="hover">
          Whale
        </Tag>,
      );
      expect(screen.getByRole("button", { name: "Remove Whale" })).toHaveClass(
        "[@media(hover:hover)]:opacity-0",
      );
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<Tag>Whale</Tag>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations when selected and removable by the whole tag", async () => {
      const { container } = render(
        <Tag selected onRemove={() => {}} removeLabel="Remove Whale" removeTarget="tag">
          Whale
        </Tag>,
      );
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
