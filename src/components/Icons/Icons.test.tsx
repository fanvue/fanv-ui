import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { ArrowRightIcon } from "./ArrowRightIcon";
import { ArrowUpRightIcon } from "./ArrowUpRightIcon";
import { CheckCircleIcon } from "./CheckCircleIcon";
import { CheckIcon } from "./CheckIcon";
import { ChevronLeftIcon } from "./ChevronLeftIcon";
import { ChevronRightIcon } from "./ChevronRightIcon";
import { CrossIcon } from "./CrossIcon";
import { CrownIcon } from "./CrownIcon";
import { ErrorCircleIcon } from "./ErrorCircleIcon";
import { EyeIcon } from "./EyeIcon";
import { FireIcon } from "./FireIcon";
import { HomeIcon } from "./HomeIcon";
import { InfoCircleIcon } from "./InfoCircleIcon";
import { MicrophoneIcon } from "./MicrophoneIcon";
import { MinusIcon } from "./MinusIcon";
import { PlusIcon } from "./PlusIcon";
import { SpinnerIcon } from "./SpinnerIcon";
import { StopIcon } from "./StopIcon";
import { VipBadgeIcon } from "./VipBadgeIcon";
import { WarningTriangleIcon } from "./WarningTriangleIcon";

const icons = [
  { name: "ArrowRightIcon", Component: ArrowRightIcon },
  { name: "ArrowUpRightIcon", Component: ArrowUpRightIcon },
  { name: "MicrophoneIcon", Component: MicrophoneIcon },
  { name: "StopIcon", Component: StopIcon },
  { name: "CheckCircleIcon", Component: CheckCircleIcon },
  { name: "CheckIcon", Component: CheckIcon },
  { name: "ChevronLeftIcon", Component: ChevronLeftIcon },
  { name: "ChevronRightIcon", Component: ChevronRightIcon },
  { name: "CrossIcon", Component: CrossIcon },
  { name: "CrownIcon", Component: CrownIcon },
  { name: "ErrorCircleIcon", Component: ErrorCircleIcon },
  { name: "EyeIcon", Component: EyeIcon },
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

      it("has a default size class", () => {
        const { container } = render(<Component />);
        const svg = container.querySelector("svg");
        expect(svg?.getAttribute("class")).toMatch(/size-\d/);
      });

      it("allows size override via className", () => {
        const { container } = render(<Component className="size-10" />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveClass("size-10");
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
