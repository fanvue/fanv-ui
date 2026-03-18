import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { InfoBox, InfoBoxContent, InfoBoxTrigger } from "./InfoBox";

function renderInfoBox(contentProps?: React.ComponentPropsWithoutRef<typeof InfoBoxContent>) {
  return render(
    <InfoBox>
      <InfoBoxTrigger>Open</InfoBoxTrigger>
      <InfoBoxContent heading="Title" {...contentProps}>
        Info text
      </InfoBoxContent>
    </InfoBox>,
  );
}

async function openInfoBox(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Open" }));
  return screen.findByRole("dialog");
}

describe("InfoBox", () => {
  describe("API", () => {
    it("renders content on click", async () => {
      const user = userEvent.setup();
      renderInfoBox();
      const dialog = await openInfoBox(user);
      expect(within(dialog).getByText("Info text")).toBeInTheDocument();
    });

    it("hides content when not clicked", () => {
      renderInfoBox();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("renders heading", async () => {
      const user = userEvent.setup();
      renderInfoBox({ heading: "My Heading" });
      const dialog = await openInfoBox(user);
      expect(within(dialog).getByText("My Heading")).toBeInTheDocument();
    });

    it("renders icon", async () => {
      const user = userEvent.setup();
      renderInfoBox({ icon: <span data-testid="icon">i</span> });
      const dialog = await openInfoBox(user);
      expect(within(dialog).getByTestId("icon")).toBeInTheDocument();
    });

    it("renders pill", async () => {
      const user = userEvent.setup();
      renderInfoBox({ pill: <span data-testid="pill">New</span> });
      const dialog = await openInfoBox(user);
      expect(within(dialog).getByTestId("pill")).toBeInTheDocument();
    });

    it("renders action buttons", async () => {
      const user = userEvent.setup();
      renderInfoBox({
        primaryAction: { label: "OK" },
        secondaryAction: { label: "Dismiss" },
      });
      const dialog = await openInfoBox(user);
      expect(within(dialog).getByRole("button", { name: "OK" })).toBeInTheDocument();
      expect(within(dialog).getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
    });

    it("calls onClick when action button is clicked", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      renderInfoBox({ primaryAction: { label: "OK", onClick: handleClick } });
      const dialog = await openInfoBox(user);
      await user.click(within(dialog).getByRole("button", { name: "OK" }));
      expect(handleClick).toHaveBeenCalledOnce();
    });

    it("renders custom element action", async () => {
      const user = userEvent.setup();
      renderInfoBox({
        primaryAction: { element: <a href="/link">Custom</a> },
      });
      const dialog = await openInfoBox(user);
      expect(within(dialog).getByRole("link", { name: "Custom" })).toBeInTheDocument();
    });

    it("applies custom className to content", async () => {
      const user = userEvent.setup();
      renderInfoBox({ className: "custom-class" });
      await openInfoBox(user);
      expect(document.querySelector(".custom-class")).toBeInTheDocument();
    });

    it("forwards ref to content", async () => {
      const ref = React.createRef<HTMLDivElement>();
      const user = userEvent.setup();
      render(
        <InfoBox>
          <InfoBoxTrigger>Open</InfoBoxTrigger>
          <InfoBoxContent ref={ref} heading="Title">
            Info text
          </InfoBoxContent>
        </InfoBox>,
      );
      await openInfoBox(user);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("keyboard", () => {
    it("closes on Escape", async () => {
      const user = userEvent.setup();
      renderInfoBox();
      await openInfoBox(user);
      await user.keyboard("{Escape}");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("action buttons are keyboard-reachable", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      renderInfoBox({ primaryAction: { label: "OK", onClick: handleClick } });
      await openInfoBox(user);
      const dialog = await screen.findByRole("dialog");
      const okButton = within(dialog).getByRole("button", { name: "OK" });
      okButton.focus();
      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledOnce();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const user = userEvent.setup();
      renderInfoBox();
      await openInfoBox(user);
      const results = await axe(document.body);
      expect(results).toHaveNoViolations();
    });
  });
});
