import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { UserDisplayName } from "./UserDisplayName";

describe("UserDisplayName", () => {
  describe("API", () => {
    it("renders its children", () => {
      render(<UserDisplayName>Aitana Lopez</UserDisplayName>);
      expect(screen.getByText("Aitana Lopez")).toBeInTheDocument();
    });

    it("renders a truncating name span and applies no typography of its own", () => {
      render(<UserDisplayName data-testid="name">Aitana</UserDisplayName>);
      const el = screen.getByTestId("name");
      expect(el.tagName).toBe("SPAN");
      expect(el).toHaveClass("inline-flex", "max-w-full", "items-center");
      expect(el).not.toHaveClass("typography-body-small-14px-semibold");
      const name = screen.getByText("Aitana");
      expect(name).toHaveClass("truncate", "min-w-0");
      expect(name).not.toHaveClass("typography-body-small-14px-semibold");
    });

    it("does not truncate the name when noWrap is false", () => {
      render(<UserDisplayName noWrap={false}>Aitana</UserDisplayName>);
      expect(screen.getByText("Aitana")).not.toHaveClass("truncate");
    });

    it("applies custom className and spreads attributes", () => {
      render(
        <UserDisplayName data-testid="name" className="custom" data-custom="x">
          Aitana
        </UserDisplayName>,
      );
      const el = screen.getByTestId("name");
      expect(el).toHaveClass("custom");
      expect(el).toHaveAttribute("data-custom", "x");
    });

    it("forwards ref to the rendered element", () => {
      const ref = React.createRef<HTMLElement>();
      render(<UserDisplayName ref={ref}>Aitana</UserDisplayName>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe("typography", () => {
    it("applies the typography scale from className to the root", () => {
      render(
        <UserDisplayName data-testid="name" className="typography-header-heading-xs">
          Aitana
        </UserDisplayName>,
      );
      const el = screen.getByTestId("name");
      expect(el).toHaveClass("typography-header-heading-xs");
      expect(el).not.toHaveClass("typography-body-small-14px-semibold");
    });
  });

  describe("polymorphism", () => {
    it.each(["h1", "h2", "h3", "p", "div"] as const)("renders as <%s>", (component) => {
      render(
        <UserDisplayName data-testid="name" component={component}>
          Aitana
        </UserDisplayName>,
      );
      expect(screen.getByTestId("name").tagName).toBe(component.toUpperCase());
    });
  });

  describe("badges", () => {
    it("renders an ambassador badge with an accessible label", () => {
      render(<UserDisplayName ambassador>Aitana</UserDisplayName>);
      expect(screen.getByRole("img", { name: "Ambassador" })).toBeInTheDocument();
    });

    it("renders a verified badge with an accessible label", () => {
      render(<UserDisplayName verified>Aitana</UserDisplayName>);
      expect(screen.getByRole("img", { name: "Verified" })).toBeInTheDocument();
    });

    it("prefers the ambassador badge over verified when both are set", () => {
      render(
        <UserDisplayName ambassador verified>
          Aitana
        </UserDisplayName>,
      );
      expect(screen.getByRole("img", { name: "Ambassador" })).toBeInTheDocument();
      expect(screen.queryByRole("img", { name: "Verified" })).not.toBeInTheDocument();
    });

    it("supports custom badge labels", () => {
      render(
        <UserDisplayName ambassador ambassadorLabel="Fanvue Ambassador">
          Aitana
        </UserDisplayName>,
      );
      expect(screen.getByRole("img", { name: "Fanvue Ambassador" })).toBeInTheDocument();
    });

    it("renders no badge by default", () => {
      render(<UserDisplayName>Aitana</UserDisplayName>);
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });
  });

  describe("online status", () => {
    it("renders the online status with its default label", () => {
      render(<UserDisplayName showOnlineStatus>Aitana</UserDisplayName>);
      expect(screen.getByText("Online")).toBeInTheDocument();
    });

    it("supports a custom online label", () => {
      render(
        <UserDisplayName showOnlineStatus onlineLabel="Active now">
          Aitana
        </UserDisplayName>,
      );
      expect(screen.getByText("Active now")).toBeInTheDocument();
    });

    it("is hidden by default", () => {
      render(<UserDisplayName>Aitana</UserDisplayName>);
      expect(screen.queryByText("Online")).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations with badges and online status", async () => {
      const { container } = render(
        <UserDisplayName ambassador showOnlineStatus>
          Aitana Lopez
        </UserDisplayName>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
