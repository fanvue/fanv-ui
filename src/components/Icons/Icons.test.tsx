import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckCircleIcon,
  CheckIcon,
  CrossIcon,
  CrownIcon,
  ErrorCircleIcon,
  FireIcon,
  HomeIcon,
  InfoCircleIcon,
  MinusIcon,
  PlusIcon,
  SpinnerIcon,
  VipBadgeIcon,
  WarningTriangleIcon,
} from "./index";

const icons = [
  { name: "ArrowRightIcon", Component: ArrowRightIcon },
  { name: "ArrowUpRightIcon", Component: ArrowUpRightIcon },
  { name: "CheckCircleIcon", Component: CheckCircleIcon },
  { name: "CheckIcon", Component: CheckIcon },
  { name: "CrossIcon", Component: CrossIcon },
  { name: "CrownIcon", Component: CrownIcon },
  { name: "ErrorCircleIcon", Component: ErrorCircleIcon },
  { name: "FireIcon", Component: FireIcon },
  { name: "HomeIcon", Component: HomeIcon },
  { name: "InfoCircleIcon", Component: InfoCircleIcon },
  { name: "MinusIcon", Component: MinusIcon },
  { name: "PlusIcon", Component: PlusIcon },
  { name: "SpinnerIcon", Component: SpinnerIcon },
  { name: "VipBadgeIcon", Component: VipBadgeIcon },
  { name: "WarningTriangleIcon", Component: WarningTriangleIcon },
];

describe("Icons", () => {
  for (const { name, Component } of icons) {
    describe(name, () => {
      it("renders an SVG element", () => {
        const { container } = render(<Component />);
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
      });

      it("applies aria-hidden by default", () => {
        const { container } = render(<Component />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveAttribute("aria-hidden", "true");
      });

      it("uses default size", () => {
        const { container } = render(<Component />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveAttribute("width");
        expect(svg).toHaveAttribute("height");
      });

      it("applies custom size", () => {
        const { container } = render(<Component size={10} />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveAttribute("width", "40");
        expect(svg).toHaveAttribute("height", "40");
      });

      it("applies custom className", () => {
        const { container } = render(<Component className="custom-icon" />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveClass("custom-icon");
      });

      it("forwards ref", () => {
        const ref = createRef<SVGSVGElement>();
        render(<Component ref={ref} />);
        expect(ref.current).toBeInstanceOf(SVGSVGElement);
      });
    });
  }
});
