import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Alert } from "./Alert";

describe("Alert", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(<Alert className="custom-class">Custom alert</Alert>);
      expect(screen.getByTestId("alert")).toHaveClass("custom-class");
    });

    it("forwards ref to the root element", () => {
      const ref = { current: null as HTMLDivElement | null };
      render(<Alert ref={ref}>Alert body</Alert>);
      expect(ref.current).toBe(screen.getByTestId("alert"));
      expect(ref.current?.tagName).toBe("DIV");
    });

    it("renders title when provided", () => {
      render(<Alert title="Alert Title">Alert body</Alert>);
      expect(screen.getByText("Alert Title")).toBeInTheDocument();
      expect(screen.getByText("Alert body")).toBeInTheDocument();
    });

    it("renders without title when not provided", () => {
      render(<Alert>Alert body only</Alert>);
      expect(screen.getByText("Alert body only")).toBeInTheDocument();
    });

    it("applies semibold font to title", () => {
      render(<Alert title="Bold Title">Body text</Alert>);
      const title = screen.getByText("Bold Title");
      expect(title).toHaveClass("typography-body-small-14px-semibold");
    });

    it("applies normal font to body", () => {
      render(<Alert title="Title">Body text</Alert>);
      const body = screen.getByText("Body text");
      expect(body).toHaveClass("typography-body-small-14px-regular");
    });
  });

  describe("default icons", () => {
    it("renders a default icon for the info variant", () => {
      render(<Alert variant="info">Info</Alert>);
      expect(screen.getByTestId("alert").querySelector("svg")).toBeInTheDocument();
    });

    it("renders a default icon for the success variant", () => {
      render(<Alert variant="success">Success</Alert>);
      expect(screen.getByTestId("alert").querySelector("svg")).toBeInTheDocument();
    });

    it("renders a default icon for the warning variant", () => {
      render(<Alert variant="warning">Warning</Alert>);
      expect(screen.getByTestId("alert").querySelector("svg")).toBeInTheDocument();
    });

    it("renders a default icon for the error variant", () => {
      render(<Alert variant="error">Error</Alert>);
      expect(screen.getByTestId("alert").querySelector("svg")).toBeInTheDocument();
    });

    it("hides the icon when icon={null}", () => {
      render(
        <Alert variant="info" icon={null}>
          No icon
        </Alert>,
      );
      expect(screen.getByTestId("alert").querySelector("svg")).not.toBeInTheDocument();
    });

    it("renders a custom icon when provided", () => {
      render(<Alert icon={<span data-testid="custom-icon">★</span>}>Custom</Alert>);
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });
  });

  describe("neutral variant", () => {
    it("renders a default icon for the neutral variant", () => {
      render(<Alert variant="neutral">Neutral</Alert>);
      expect(screen.getByTestId("alert").querySelector("svg")).toBeInTheDocument();
    });

    it("applies the neutral background token", () => {
      render(<Alert variant="neutral">Neutral</Alert>);
      expect(screen.getByTestId("alert")).toHaveClass("bg-alerts-info-prompt-background-neutral");
    });
  });

  describe("action slot", () => {
    it("renders the passed element", () => {
      render(<Alert action={<a href="/details">Learn more</a>}>Alert with an action</Alert>);
      const link = screen.getByRole("link", { name: /learn more/i });
      expect(link).toHaveAttribute("href", "/details");
    });

    it("applies the link styling to the passed element", () => {
      render(<Alert action={<a href="/details">Learn more</a>}>Alert with an action</Alert>);
      const link = screen.getByRole("link", { name: /learn more/i });
      expect(link).toHaveClass("underline");
    });

    it.each([
      "info",
      "success",
      "warning",
      "error",
      "neutral",
    ] as const)("colours the %s cta from the link tokens, not the alert tint", (variant) => {
      // The node's CTA is a V2 Link bound to Color/Buttons/Link/Primary/Default
      // with no per-variant override, so every variant takes the same link colour.
      render(
        <Alert variant={variant} action={<a href="/details">Learn more</a>}>
          Body
        </Alert>,
      );
      const link = screen.getByRole("link", { name: /learn more/i });
      expect(link).toHaveClass(
        "text-buttons-link-primary-default",
        "hover:text-buttons-link-primary-hover",
      );
      expect(link).not.toHaveClass(`text-alerts-info-prompt-content-${variant}`);
    });

    it("does not render an action when none is passed", () => {
      render(<Alert>No action</Alert>);
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("renders the action outside the alert live region", () => {
      render(<Alert action={<a href="/details">Learn more</a>}>Alert with an action</Alert>);
      const liveRegion = screen.getByRole("alert");
      expect(liveRegion.querySelector("a")).not.toBeInTheDocument();
    });
  });

  describe("closable behavior", () => {
    it("calls onClose when close button is clicked", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <Alert closable onClose={onClose}>
          Closable alert
        </Alert>,
      );
      const closeButton = screen.getByRole("button", { name: /close alert/i });
      await user.click(closeButton);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when close button is activated with keyboard", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <Alert closable onClose={onClose}>
          Closable alert
        </Alert>,
      );
      const closeButton = screen.getByRole("button", { name: /close alert/i });
      closeButton.focus();
      await user.keyboard("{Enter}");
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("has cursor pointer on close button", () => {
      render(
        <Alert closable onClose={vi.fn()}>
          Closable alert
        </Alert>,
      );
      const closeButton = screen.getByRole("button", { name: /close alert/i });
      expect(closeButton).toHaveClass("cursor-pointer");
    });

    it("renders the close button as the 24px icon button", () => {
      render(<Alert closable>Body</Alert>);
      const close = screen.getByRole("button", { name: "Close alert" });
      expect(close).toHaveAttribute("data-testid", "icon-button");
      expect(close).toHaveClass("size-6", "p-1", "rounded-xs");
    });

    it("renders the close button as the node's Secondary icon button", () => {
      // The node builds the close from V2 Button Icon, Type=Secondary, Size=24px,
      // with Iconography / Close at Size=16, Fill=No.
      render(
        <Alert variant="info" closable>
          Body
        </Alert>,
      );
      const close = screen.getByRole("button", { name: "Close alert" });
      expect(close).toHaveAttribute("data-testid", "icon-button");
      expect(close).toHaveClass("size-6", "p-1", "rounded-xs");
      expect(close.querySelector("svg")).toHaveAttribute("viewBox", "0 0 16 16");
    });

    it("renders the close button outside the alert live region", () => {
      render(
        <Alert closable onClose={vi.fn()}>
          Closable alert
        </Alert>,
      );
      const liveRegion = screen.getByRole("alert");
      expect(liveRegion.querySelector("button")).not.toBeInTheDocument();
    });
  });

  describe("figma colour and iconography", () => {
    // Figma binds title and description to Color/Alerts/Info Prompt/Content/<variant>,
    // Neutral to Color/Content/Secondary. Measured hexes: info #082a68,
    // success #075f1e, warning #653e00, error #710921, neutral #404040.
    it.each([
      ["info", "text-alerts-info-prompt-content-info"],
      ["success", "text-alerts-info-prompt-content-success"],
      ["warning", "text-alerts-info-prompt-content-warning"],
      ["error", "text-alerts-info-prompt-content-error"],
      ["neutral", "text-content-secondary"],
    ] as const)("colours the %s message with the variant content token", (variant, expected) => {
      render(
        <Alert variant={variant} title="Title">
          Body
        </Alert>,
      );
      expect(screen.getByText("Title")).toHaveClass(expected);
      expect(screen.getByText("Body")).toHaveClass(expected);
      expect(screen.getByText("Title")).not.toHaveClass("text-content-primary");
    });

    it.each([
      ["info", "bg-alerts-info-prompt-background-info"],
      ["success", "bg-alerts-info-prompt-background-success"],
      ["warning", "bg-alerts-info-prompt-background-warning"],
      ["error", "bg-alerts-info-prompt-background-error"],
      ["neutral", "bg-alerts-info-prompt-background-neutral"],
    ] as const)("reads the %s surface from the alert background token", (variant, expected) => {
      // The node binds Color/Alerts/Info Prompt/Background/<variant>. The generic
      // `*-surface` tokens alias to the same value but would not follow a repoint.
      render(<Alert variant={variant}>Body</Alert>);
      expect(screen.getByTestId("alert")).toHaveClass(expected);
    });

    it.each([
      ["info", "text-alerts-info-prompt-icon-info"],
      ["success", "text-alerts-info-prompt-icon-success"],
      ["warning", "text-alerts-info-prompt-icon-warning"],
      ["error", "text-alerts-info-prompt-icon-error"],
      ["neutral", "text-alerts-info-prompt-icon-neutral"],
    ] as const)("colours the %s icon from the alert icon token", (variant, expected) => {
      // Color/Alerts/Info Prompt/Icon/<variant>. The generic `*-content` tokens
      // agreed only for info in light mode and carry no dark-mode step, so they
      // were wrong in 8 of 10 variant/mode combinations.
      render(<Alert variant={variant}>Body</Alert>);
      expect(screen.getByTestId("alert")).toHaveClass(expected);
    });

    it("uses the Iconography set's native 16px geometry for default icons", () => {
      // The previous *CircleIcon defaults were 20px art scaled down.
      for (const variant of ["info", "success", "warning", "error", "neutral"] as const) {
        const { unmount } = render(<Alert variant={variant}>Body</Alert>);
        const svg = screen.getByTestId("alert").querySelector('[aria-hidden="true"] svg');
        expect(svg).toHaveAttribute("viewBox", "0 0 16 16");
        unmount();
      }
    });
  });

  describe("figma spacing", () => {
    // Values from Figma node 17818:71958 (Type=Information, CTA=Under), 741x72.
    // Measured in Chromium as: 16px radius, 16px inset around the message,
    // 12px to the close button, 12px icon-to-text, 28px text-to-close,
    // 4px title-to-description, 12px description-to-CTA, 24px inline CTA.
    it("applies the container radius and insets", () => {
      render(<Alert closable>Body</Alert>);
      const alert = screen.getByTestId("alert");
      expect(alert).toHaveClass("rounded-md", "p-3", "pl-4", "gap-6", "items-start");
      expect(alert).not.toHaveClass("rounded-xs", "p-4");
    });

    it("insets the content row so the message sits 16px in", () => {
      render(<Alert closable>Body</Alert>);
      const row = screen.getByRole("alert").parentElement?.parentElement;
      expect(row).toHaveClass("py-1", "pr-1", "gap-3");
    });

    it("constrains the icon to the design's 16px slot", () => {
      // The default variant icons ship at size-5 (20px); the design slot is 16px,
      // which only shows up in single-line alerts (50px tall, not 53px).
      render(<Alert closable>Body</Alert>);
      const wrapper = screen.getByTestId("alert").querySelector('[aria-hidden="true"]');
      expect(wrapper).toHaveClass("[&>svg]:size-4", "pt-px");
    });

    it("uses a 4px gap between title and description", () => {
      render(<Alert title="Title">Body</Alert>);
      expect(screen.getByRole("alert")).toHaveClass("gap-1");
    });

    it("uses a 12px gap between description and a stacked cta", () => {
      render(<Alert action={<a href="/m">More</a>}>Body</Alert>);
      expect(screen.getByRole("alert").parentElement).toHaveClass("gap-3");
    });
  });

  describe("cta layout", () => {
    it("stacks the cta under the description by default", () => {
      render(<Alert action={<a href="/more">More</a>}>Body</Alert>);
      const column = screen.getByRole("alert").parentElement;
      expect(column).toHaveClass("flex-col", "gap-3");
      expect(column).not.toHaveClass("items-center");
    });

    it("places the cta inline when layout is trailing", () => {
      render(
        <Alert layout="trailing" action={<a href="/more">More</a>}>
          Body
        </Alert>,
      );
      const column = screen.getByRole("alert").parentElement;
      expect(column).toHaveClass("items-center", "gap-6");
      expect(column).not.toHaveClass("flex-col");
    });

    it("lets the message flex and the cta hold its width when trailing", () => {
      render(
        <Alert layout="trailing" action={<a href="/more">More</a>}>
          Body
        </Alert>,
      );
      expect(screen.getByRole("alert")).toHaveClass("flex-1");
      expect(screen.getByRole("link", { name: "More" })).toHaveClass("shrink-0");
    });
  });

  describe("button cta", () => {
    it("renders ctaLabel as a button", () => {
      render(<Alert ctaLabel="Verify now">Body</Alert>);
      expect(screen.getByRole("button", { name: "Verify now" })).toBeInTheDocument();
    });

    it("does not apply link styling to the button cta", () => {
      render(<Alert ctaLabel="Verify now">Body</Alert>);
      expect(screen.getByRole("button", { name: "Verify now" })).not.toHaveClass("underline");
    });

    it("fills on mobile and hugs from the sm breakpoint up when stacked", () => {
      // Without this the button stretches across the whole alert, because the
      // stacked CTA sits in a flex column.
      render(<Alert ctaLabel="Verify now">Body</Alert>);
      const cta = screen.getByRole("button", { name: "Verify now" });
      expect(cta).toHaveClass("w-full", "sm:w-fit");
    });

    it("hugs rather than filling when the cta is inline", () => {
      render(
        <Alert layout="trailing" ctaLabel="Verify now">
          Body
        </Alert>,
      );
      const cta = screen.getByRole("button", { name: "Verify now" });
      expect(cta).toHaveClass("shrink-0");
      expect(cta).not.toHaveClass("w-full");
    });

    it("lets ctaProps override the base width", () => {
      // Note the modifier chain: a bare `w-auto` replaces `w-full` but not
      // `sm:w-fit`, so overriding the desktop width needs `sm:` too.
      render(
        <Alert ctaLabel="Verify now" ctaProps={{ className: "w-auto sm:w-auto" }}>
          Body
        </Alert>,
      );
      const cta = screen.getByRole("button", { name: "Verify now" });
      expect(cta).toHaveClass("w-auto", "sm:w-auto");
      expect(cta).not.toHaveClass("w-full", "sm:w-fit");
    });

    it("forwards ctaProps to the button", async () => {
      const onClick = vi.fn();
      render(
        <Alert ctaLabel="Verify now" ctaProps={{ onClick }}>
          Body
        </Alert>,
      );
      await userEvent.click(screen.getByRole("button", { name: "Verify now" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("renders the button cta outside the alert live region", () => {
      render(<Alert ctaLabel="Verify now">Body</Alert>);
      const liveRegion = screen.getByRole("alert");
      expect(liveRegion.querySelector("button")).not.toBeInTheDocument();
    });

    it("prefers action over ctaLabel when both are passed", () => {
      render(
        <Alert action={<a href="/more">More</a>} ctaLabel="Verify now">
          Body
        </Alert>,
      );
      expect(screen.getByRole("link", { name: "More" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Verify now" })).not.toBeInTheDocument();
    });

    it("renders no cta when neither action nor ctaLabel is passed", () => {
      render(<Alert>Body</Alert>);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
  });

  describe("optional description", () => {
    it("omits the description element when no children are passed", () => {
      render(<Alert title="Title only" />);
      expect(screen.getByText("Title only")).toBeInTheDocument();
      expect(
        screen.getByRole("alert").querySelector(".typography-body-small-14px-regular"),
      ).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<Alert>Accessible alert</Alert>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with icon and close button", async () => {
      const { container } = render(
        <Alert icon={<span>Icon</span>} closable>
          Alert with all features
        </Alert>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations for the neutral variant with an action", async () => {
      const { container } = render(
        <Alert variant="neutral" title="Heads up" action={<a href="/details">Learn more</a>}>
          Neutral alert with an action
        </Alert>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations for a trailing button cta", async () => {
      const { container } = render(
        <Alert
          variant="warning"
          title="Finish setup"
          layout="trailing"
          ctaLabel="Verify now"
          closable
        >
          Verify your identity to start receiving payouts.
        </Alert>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
