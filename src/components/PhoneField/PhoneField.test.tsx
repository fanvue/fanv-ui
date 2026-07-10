import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { PhoneField } from "./PhoneField";

describe("PhoneField", () => {
  describe("API", () => {
    it("forwards ref to the input element", () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<PhoneField aria-label="Phone" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.tagName.toLowerCase()).toBe("input");
    });

    it("defaults the input type to tel", () => {
      render(<PhoneField label="Phone" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "tel");
    });

    it("associates the label with the input", () => {
      render(<PhoneField id="phone" label="Phone number" />);
      const input = screen.getByRole("textbox");
      const label = screen.getByText("Phone number");
      expect(label).toHaveAttribute("for", "phone");
      expect(input).toHaveAttribute("id", "phone");
    });

    it("applies fullWidth className when fullWidth is true", () => {
      const { container } = render(<PhoneField aria-label="Phone" fullWidth />);
      expect(container.querySelector('[class*="w-full"]')).toBeInTheDocument();
    });
  });

  describe("country selector", () => {
    it("renders the dial code and flag", () => {
      render(<PhoneField aria-label="Phone" dialCode="+39" flag={<span>flag</span>} />);
      expect(screen.getByText("+39")).toBeInTheDocument();
      expect(screen.getByText("flag")).toBeInTheDocument();
    });

    it("calls onCountrySelect when the country button is clicked", async () => {
      const user = userEvent.setup();
      const onCountrySelect = vi.fn();
      render(<PhoneField aria-label="Phone" onCountrySelect={onCountrySelect} />);
      await user.click(screen.getByRole("button", { name: "Select country" }));
      expect(onCountrySelect).toHaveBeenCalledTimes(1);
    });

    it("uses a custom country button label", () => {
      render(<PhoneField aria-label="Phone" countryButtonLabel="Change country" />);
      expect(screen.getByRole("button", { name: "Change country" })).toBeInTheDocument();
    });

    it("links the dial code to the input via aria-describedby", () => {
      render(<PhoneField id="phone" aria-label="Phone" dialCode="+39" />);
      const input = screen.getByRole("textbox");
      expect(input.getAttribute("aria-describedby")).toContain("phone-dial-code");
    });

    it("focuses the input when clicking the dial code or the field padding", async () => {
      const user = userEvent.setup();
      const { container } = render(<PhoneField aria-label="Phone" dialCode="+39" />);
      const input = screen.getByRole("textbox");

      await user.click(screen.getByText("+39"));
      expect(input).toHaveFocus();

      input.blur();
      const fieldContainer = container.querySelector('[class*="rounded-sm"]') as HTMLElement;
      await user.click(fieldContainer);
      expect(input).toHaveFocus();
    });

    it("does not steal focus from the country button when clicked", async () => {
      const user = userEvent.setup();
      const onCountrySelect = vi.fn();
      render(<PhoneField aria-label="Phone" onCountrySelect={onCountrySelect} />);
      const input = screen.getByRole("textbox");

      await user.click(screen.getByRole("button", { name: "Select country" }));
      expect(onCountrySelect).toHaveBeenCalledTimes(1);
      expect(input).not.toHaveFocus();
    });
  });

  describe("states", () => {
    it("shows the error message and marks the input invalid", () => {
      render(
        <PhoneField aria-label="Phone" error errorMessage="Invalid number" helperText="Helper" />,
      );
      expect(screen.getByText("Invalid number")).toBeInTheDocument();
      expect(screen.queryByText("Helper")).not.toBeInTheDocument();
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    });

    it("shows helper text when there is no error", () => {
      render(<PhoneField aria-label="Phone" helperText="Helper" />);
      expect(screen.getByText("Helper")).toBeInTheDocument();
    });

    it("disables both the input and the country button when disabled", () => {
      render(<PhoneField aria-label="Phone" disabled />);
      expect(screen.getByRole("textbox")).toBeDisabled();
      expect(screen.getByRole("button", { name: "Select country" })).toBeDisabled();
    });
  });

  describe("accessibility", () => {
    it("warns when no accessible name is provided", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<PhoneField />);
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("no accessible name"));
      warn.mockRestore();
    });

    it("has no axe violations", async () => {
      const { container } = render(
        <PhoneField
          label="Phone number"
          dialCode="+39"
          flag={<span>IT</span>}
          helperText="Helper"
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
