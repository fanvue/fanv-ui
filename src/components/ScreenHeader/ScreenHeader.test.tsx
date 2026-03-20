import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  ScreenHeader,
  ScreenHeaderActions,
  ScreenHeaderDotIndicators,
  ScreenHeaderGreeting,
  ScreenHeaderSteps,
  ScreenHeaderTitle,
  ScreenHeaderToolbar,
} from "./ScreenHeader";

describe("ScreenHeader", () => {
  describe("API", () => {
    it("applies custom className on the root", () => {
      render(
        <ScreenHeader className="custom-shell" data-testid="shell">
          <span>x</span>
        </ScreenHeader>,
      );
      expect(screen.getByTestId("shell")).toHaveClass("custom-shell");
    });

    it("forwards ref on the root", () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <ScreenHeader ref={ref}>
          <span>x</span>
        </ScreenHeader>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("applies frosted surface classes", () => {
      render(
        <ScreenHeader surface="frosted" data-testid="shell">
          <span>x</span>
        </ScreenHeader>,
      );
      expect(screen.getByTestId("shell").className).toContain("backdrop-blur");
    });
  });

  describe("ScreenHeaderSteps", () => {
    it("renders the requested number of segments", () => {
      render(<ScreenHeaderSteps total={6} activeIndex={0} />);
      const group = screen.getByRole("group", { name: "Step progress" });
      expect(group.querySelectorAll(":scope > div").length).toBe(6);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations for a typical toolbar", async () => {
      const { container } = render(
        <ScreenHeader>
          <ScreenHeaderToolbar>
            <ScreenHeaderTitle className="min-w-0 flex-1">Home</ScreenHeaderTitle>
            <ScreenHeaderActions>
              <button type="button">Action</button>
            </ScreenHeaderActions>
          </ScreenHeaderToolbar>
        </ScreenHeader>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations for greeting and steps", async () => {
      const { container } = render(
        <ScreenHeader>
          <ScreenHeaderGreeting greetingTitle="Hello" greetingSubtitle="Profile" />
          <ScreenHeaderSteps total={4} activeIndex={1} />
          <ScreenHeaderDotIndicators count={5} activeIndex={2} />
        </ScreenHeader>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
