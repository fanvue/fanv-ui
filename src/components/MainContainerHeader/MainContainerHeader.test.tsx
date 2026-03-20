import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  MainContainerHeader,
  MainContainerHeaderEnd,
  MainContainerHeaderStart,
  MainContainerHeaderTitle,
} from "./MainContainerHeader";

describe("MainContainerHeader", () => {
  describe("API", () => {
    it("applies custom className on the root", () => {
      render(
        <MainContainerHeader className="custom-root" data-testid="header">
          <span>child</span>
        </MainContainerHeader>,
      );
      expect(screen.getByTestId("header")).toHaveClass("custom-root");
    });

    it("forwards ref on the root", () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <MainContainerHeader ref={ref}>
          <span>x</span>
        </MainContainerHeader>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("applies mobile padding when device is mobile", () => {
      render(
        <MainContainerHeader device="mobile" data-testid="header">
          <span>x</span>
        </MainContainerHeader>,
      );
      expect(screen.getByTestId("header")).toHaveClass("p-4");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations for a typical composition", async () => {
      const { container } = render(
        <MainContainerHeader>
          <MainContainerHeaderStart>
            <MainContainerHeaderTitle>Conversation</MainContainerHeaderTitle>
          </MainContainerHeaderStart>
          <MainContainerHeaderEnd>
            <button type="button">Action</button>
          </MainContainerHeaderEnd>
        </MainContainerHeader>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
