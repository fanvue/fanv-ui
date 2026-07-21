import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { CriticalBanner } from "./CriticalBanner";

describe("CriticalBanner", () => {
  describe("API", () => {
    it("applies custom className to the root", () => {
      render(
        <CriticalBanner className="custom" title="Blocked">
          Body copy
        </CriticalBanner>,
      );
      expect(screen.getByRole("alert")).toHaveClass("custom");
    });

    it("renders a built-in CTA from ctaLabel and forwards onClick", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <CriticalBanner title="Blocked" ctaLabel="Fix it" ctaProps={{ onClick }}>
          Body copy
        </CriticalBanner>,
      );
      await user.click(screen.getByRole("button", { name: "Fix it" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("renders a custom action instead of the built-in CTA", () => {
      render(
        <CriticalBanner title="Blocked" ctaLabel="Ignored" action={<a href="/help">Get help</a>}>
          Body copy
        </CriticalBanner>,
      );
      expect(screen.getByRole("link", { name: "Get help" })).toHaveAttribute("href", "/help");
      expect(screen.queryByRole("button", { name: "Ignored" })).not.toBeInTheDocument();
    });

    it("allows overriding the default alert role", () => {
      render(
        <CriticalBanner role="region" aria-label="Account status" title="Blocked">
          Body copy
        </CriticalBanner>,
      );
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.getByRole("region", { name: "Account status" })).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations in the trailing layout", async () => {
      const { container } = render(
        <CriticalBanner title="Account suspended" ctaLabel="Contact support">
          Your account has been suspended pending review.
        </CriticalBanner>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations in the under layout", async () => {
      const { container } = render(
        <CriticalBanner layout="under" title="Verify your identity" ctaLabel="Start verification">
          You must verify your identity before you can continue.
        </CriticalBanner>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
