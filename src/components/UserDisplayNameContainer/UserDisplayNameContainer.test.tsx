import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { UserDisplayNameContainer } from "./UserDisplayNameContainer";

describe("UserDisplayNameContainer", () => {
  describe("API", () => {
    it("renders its children", () => {
      render(<UserDisplayNameContainer>Aitana Lopez</UserDisplayNameContainer>);
      expect(screen.getByText("Aitana Lopez")).toBeInTheDocument();
    });

    it("renders a span whose name truncates with the default typography by default", () => {
      render(<UserDisplayNameContainer data-testid="name">Aitana</UserDisplayNameContainer>);
      const el = screen.getByTestId("name");
      expect(el.tagName).toBe("SPAN");
      expect(el).toHaveClass("inline-flex", "max-w-full", "items-center");
      // Truncation and typography live on the inner name span so trailing
      // badges/status stay visible while only the name is clipped.
      const name = screen.getByText("Aitana");
      expect(name).toHaveClass("truncate", "min-w-0", "typography-body-small-14px-semibold");
    });

    it("does not truncate the name when noWrap is false", () => {
      render(<UserDisplayNameContainer noWrap={false}>Aitana</UserDisplayNameContainer>);
      expect(screen.getByText("Aitana")).not.toHaveClass("truncate");
    });

    it("applies custom className and spreads attributes", () => {
      render(
        <UserDisplayNameContainer data-testid="name" className="custom" data-custom="x">
          Aitana
        </UserDisplayNameContainer>,
      );
      const el = screen.getByTestId("name");
      expect(el).toHaveClass("custom");
      expect(el).toHaveAttribute("data-custom", "x");
    });

    it("forwards ref to the rendered element", () => {
      const ref = React.createRef<HTMLElement>();
      render(<UserDisplayNameContainer ref={ref}>Aitana</UserDisplayNameContainer>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe("variant", () => {
    it.each([
      ["body2SemiBold", "typography-body-small-14px-semibold"],
      ["body1SemiBold", "typography-body-default-16px-semibold"],
      ["heading4", "typography-header-heading-xs"],
      ["captionRegular", "typography-description-12px-regular"],
    ] as const)("maps %s to its typography class", (variant, expectedClass) => {
      render(<UserDisplayNameContainer variant={variant}>Aitana</UserDisplayNameContainer>);
      expect(screen.getByText("Aitana")).toHaveClass(expectedClass);
    });

    it("falls back to the default class for an unknown variant", () => {
      render(
        // @ts-expect-error - exercising the runtime fallback for an out-of-type variant
        <UserDisplayNameContainer variant="nope">Aitana</UserDisplayNameContainer>,
      );
      expect(screen.getByText("Aitana")).toHaveClass("typography-body-small-14px-semibold");
    });
  });

  describe("polymorphism", () => {
    it.each(["h1", "h2", "h3", "p", "div"] as const)("renders as <%s>", (component) => {
      render(
        <UserDisplayNameContainer data-testid="name" component={component}>
          Aitana
        </UserDisplayNameContainer>,
      );
      expect(screen.getByTestId("name").tagName).toBe(component.toUpperCase());
    });
  });

  describe("style props", () => {
    it("applies color=white as a text-white class", () => {
      render(
        <UserDisplayNameContainer data-testid="name" color="white">
          Aitana
        </UserDisplayNameContainer>,
      );
      expect(screen.getByTestId("name")).toHaveClass("text-white");
    });

    it("converts mt/pt to 8px-scaled spacing and applies maxWidth/textAlign", () => {
      render(
        <UserDisplayNameContainer
          data-testid="name"
          mt={2}
          pt={1}
          maxWidth={120}
          textAlign="center"
        >
          Aitana
        </UserDisplayNameContainer>,
      );
      const el = screen.getByTestId("name");
      expect(el).toHaveStyle({
        marginTop: "16px",
        paddingTop: "8px",
        maxWidth: "120px",
        textAlign: "center",
      });
    });
  });

  describe("badges", () => {
    it("renders an ambassador badge with an accessible label", () => {
      render(<UserDisplayNameContainer ambassador>Aitana</UserDisplayNameContainer>);
      expect(screen.getByRole("img", { name: "Ambassador" })).toBeInTheDocument();
    });

    it("renders a verified badge with an accessible label", () => {
      render(<UserDisplayNameContainer verified>Aitana</UserDisplayNameContainer>);
      expect(screen.getByRole("img", { name: "Verified" })).toBeInTheDocument();
    });

    it("prefers the ambassador badge over verified when both are set", () => {
      render(
        <UserDisplayNameContainer ambassador verified>
          Aitana
        </UserDisplayNameContainer>,
      );
      expect(screen.getByRole("img", { name: "Ambassador" })).toBeInTheDocument();
      expect(screen.queryByRole("img", { name: "Verified" })).not.toBeInTheDocument();
    });

    it("supports custom badge labels", () => {
      render(
        <UserDisplayNameContainer ambassador ambassadorLabel="Fanvue Ambassador">
          Aitana
        </UserDisplayNameContainer>,
      );
      expect(screen.getByRole("img", { name: "Fanvue Ambassador" })).toBeInTheDocument();
    });

    it("renders no badge by default", () => {
      render(<UserDisplayNameContainer>Aitana</UserDisplayNameContainer>);
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });
  });

  describe("online status", () => {
    it("renders the online status with its default label", () => {
      render(<UserDisplayNameContainer showOnlineStatus>Aitana</UserDisplayNameContainer>);
      expect(screen.getByText("Online")).toBeInTheDocument();
    });

    it("supports a custom online label", () => {
      render(
        <UserDisplayNameContainer showOnlineStatus onlineLabel="Active now">
          Aitana
        </UserDisplayNameContainer>,
      );
      expect(screen.getByText("Active now")).toBeInTheDocument();
    });

    it("is hidden by default", () => {
      render(<UserDisplayNameContainer>Aitana</UserDisplayNameContainer>);
      expect(screen.queryByText("Online")).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations with badges and online status", async () => {
      const { container } = render(
        <UserDisplayNameContainer ambassador showOnlineStatus>
          Aitana Lopez
        </UserDisplayNameContainer>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
