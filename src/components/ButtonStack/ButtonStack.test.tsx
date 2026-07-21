import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "../Button/Button";
import { ButtonStack } from "./ButtonStack";

describe("ButtonStack", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(
        <ButtonStack className="custom" data-testid="stack">
          <Button>Cancel</Button>
          <Button>Confirm</Button>
        </ButtonStack>,
      );
      expect(screen.getByTestId("stack")).toHaveClass("custom");
    });

    it("renders horizontal layout by default", () => {
      render(
        <ButtonStack data-testid="stack">
          <Button>Cancel</Button>
          <Button>Confirm</Button>
        </ButtonStack>,
      );
      expect(screen.getByTestId("stack")).toHaveClass("flex-row");
    });

    it("renders vertical layout when direction is vertical", () => {
      render(
        <ButtonStack direction="vertical" data-testid="stack">
          <Button>Cancel</Button>
          <Button>Confirm</Button>
        </ButtonStack>,
      );
      expect(screen.getByTestId("stack")).toHaveClass("flex-col");
    });

    it("forwards its ref to the underlying element", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(
        <ButtonStack ref={ref}>
          <Button>Cancel</Button>
          <Button>Confirm</Button>
        </ButtonStack>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <ButtonStack>
          <Button>Cancel</Button>
          <Button>Confirm</Button>
        </ButtonStack>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
