import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import type { DrawerContentProps, DrawerPosition } from "./Drawer";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./Drawer";

function renderDrawer(
  contentProps?: Partial<DrawerContentProps>,
  drawerProps?: { overlay?: boolean },
) {
  return render(
    <Drawer {...drawerProps}>
      <DrawerTrigger>Open drawer</DrawerTrigger>
      <DrawerContent aria-describedby={undefined} {...contentProps}>
        <DrawerHeader>
          <DrawerTitle>Test title</DrawerTitle>
          <DrawerDescription>Test description</DrawerDescription>
        </DrawerHeader>
        <p>Drawer body</p>
        <DrawerFooter>
          <DrawerClose>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>,
  );
}

describe("Drawer", () => {
  describe("rendering", () => {
    it("does not render content when closed", () => {
      renderDrawer();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("renders the trigger", () => {
      renderDrawer();
      expect(screen.getByRole("button", { name: "Open drawer" })).toBeInTheDocument();
    });

    it("renders content when opened", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await user.click(screen.getByRole("button", { name: "Open drawer" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Test title")).toBeInTheDocument();
      expect(screen.getByText("Test description")).toBeInTheDocument();
      expect(screen.getByText("Drawer body")).toBeInTheDocument();
    });
  });

  describe("open/close", () => {
    it("opens on trigger click and closes on DrawerClose click", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await user.click(screen.getByRole("button", { name: "Open drawer" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Close" }));
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("closes on Escape key", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await user.click(screen.getByRole("button", { name: "Open drawer" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      await user.keyboard("{Escape}");
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("closes on overlay click", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await user.click(screen.getByRole("button", { name: "Open drawer" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      const overlay = document.querySelector(".bg-background-overlay");
      expect(overlay).toBeInTheDocument();
      await user.click(overlay as Element);
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("closes via the header close button", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await user.click(screen.getByRole("button", { name: "Open drawer" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Close drawer" }));
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  });

  describe("controlled mode", () => {
    it("respects controlled open state", () => {
      const onOpenChange = vi.fn();
      render(
        <Drawer open={true} onOpenChange={onOpenChange}>
          <DrawerTrigger>Open drawer</DrawerTrigger>
          <DrawerContent aria-describedby={undefined}>
            <DrawerTitle>Title</DrawerTitle>
            <p>Controlled content</p>
          </DrawerContent>
        </Drawer>,
      );
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Controlled content")).toBeInTheDocument();
    });

    it("calls onOpenChange when closing", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <Drawer open={true} onOpenChange={onOpenChange}>
          <DrawerTrigger>Open drawer</DrawerTrigger>
          <DrawerContent aria-describedby={undefined}>
            <DrawerTitle>Title</DrawerTitle>
            <DrawerClose>Close</DrawerClose>
          </DrawerContent>
        </Drawer>,
      );
      await user.click(screen.getByRole("button", { name: "Close" }));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("positions", () => {
    const positions: DrawerPosition[] = ["left", "right", "top", "bottom"];

    for (const position of positions) {
      it(`renders with position="${position}"`, async () => {
        const user = userEvent.setup();
        renderDrawer({ position });
        await user.click(screen.getByRole("button", { name: "Open drawer" }));
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    }

    it("applies right position classes by default", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await user.click(screen.getByRole("button", { name: "Open drawer" }));
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("right-0");
    });

    it("applies left position classes", async () => {
      const user = userEvent.setup();
      renderDrawer({ position: "left" });
      await user.click(screen.getByRole("button", { name: "Open drawer" }));
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("left-0");
    });

    it("applies top position classes", async () => {
      const user = userEvent.setup();
      renderDrawer({ position: "top" });
      await user.click(screen.getByRole("button", { name: "Open drawer" }));
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("top-0");
    });

    it("applies bottom position classes", async () => {
      const user = userEvent.setup();
      renderDrawer({ position: "bottom" });
      await user.click(screen.getByRole("button", { name: "Open drawer" }));
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("bottom-0");
    });
  });

  describe("overlay", () => {
    it("renders overlay by default", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await user.click(screen.getByRole("button", { name: "Open drawer" }));
      expect(document.querySelector(".bg-background-overlay")).toBeInTheDocument();
    });

    it("does not render overlay when overlay=false on root", async () => {
      const user = userEvent.setup();
      renderDrawer(undefined, { overlay: false });
      await user.click(screen.getByRole("button", { name: "Open drawer" }));
      expect(document.querySelector(".bg-background-overlay")).not.toBeInTheDocument();
    });

    it("does not render overlay when overlay=false on content", async () => {
      const user = userEvent.setup();
      renderDrawer({ overlay: false });
      await user.click(screen.getByRole("button", { name: "Open drawer" }));
      expect(document.querySelector(".bg-background-overlay")).not.toBeInTheDocument();
    });
  });

  describe("custom className", () => {
    it("applies custom className to content", async () => {
      const user = userEvent.setup();
      renderDrawer({ className: "custom-drawer" });
      await user.click(screen.getByRole("button", { name: "Open drawer" }));
      expect(screen.getByRole("dialog")).toHaveClass("custom-drawer");
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to DrawerContent", async () => {
      const ref = React.createRef<HTMLDivElement>();
      const user = userEvent.setup();
      render(
        <Drawer>
          <DrawerTrigger>Open drawer</DrawerTrigger>
          <DrawerContent ref={ref} aria-describedby={undefined}>
            <DrawerTitle>Title</DrawerTitle>
            <p>Content</p>
          </DrawerContent>
        </Drawer>,
      );
      await user.click(screen.getByRole("button", { name: "Open drawer" }));
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const user = userEvent.setup();
      const { container } = renderDrawer();
      await user.click(screen.getByRole("button", { name: "Open drawer" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("renders title as an accessible heading", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await user.click(screen.getByRole("button", { name: "Open drawer" }));
      expect(screen.getByRole("heading", { name: "Test title" })).toBeInTheDocument();
    });

    it("renders description for screen readers", async () => {
      const user = userEvent.setup();
      render(
        <Drawer>
          <DrawerTrigger>Open drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Title</DrawerTitle>
            <DrawerDescription>Accessible description</DrawerDescription>
          </DrawerContent>
        </Drawer>,
      );
      await user.click(screen.getByRole("button", { name: "Open drawer" }));
      const dialog = screen.getByRole("dialog");
      const description = screen.getByText("Accessible description");
      expect(dialog).toHaveAttribute("aria-describedby", description.id);
    });

    it("returns focus to trigger after closing", async () => {
      const user = userEvent.setup();
      renderDrawer();
      const trigger = screen.getByRole("button", { name: "Open drawer" });
      await user.click(trigger);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      await user.keyboard("{Escape}");
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
      expect(trigger).toHaveFocus();
    });
  });
});
