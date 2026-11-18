import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Button } from "../Button/Button";
import { SpinnerIcon } from "./SpinnerIcon";

const animatedElements = (root: Element) =>
  [root, ...root.querySelectorAll("*")].filter(
    (element) => getComputedStyle(element).animationName !== "none",
  );

const meta = {
  title: "Components/SpinnerIcon",
  component: SpinnerIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: [undefined, 16, 24, 32],
    },
    spin: { control: "boolean" },
  },
} satisfies Meta<typeof SpinnerIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { className: "text-content-primary" },
  play: async ({ canvasElement }) => {
    await expect(animatedElements(canvasElement)).toEqual([]);
  },
};

export const Spin: Story = {
  args: { spin: true, className: "text-content-primary" },
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg") as SVGSVGElement;
    await expect(getComputedStyle(svg).animationName).toBe("spin");
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-content-primary">
      <SpinnerIcon size={16} />
      <SpinnerIcon />
      <SpinnerIcon size={24} />
      <SpinnerIcon size={32} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const widths = [...canvasElement.querySelectorAll("svg")].map(
      (svg) => svg.getBoundingClientRect().width,
    );
    await expect(widths).toEqual([16, 20, 24, 32]);
  },
};

export const LegacyAnimateSpin: Story = {
  name: "Legacy animate-spin class",
  args: { className: "size-6 animate-spin text-content-primary" },
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg") as SVGSVGElement;
    await expect(animatedElements(canvasElement)).toEqual([svg]);
    await expect(getComputedStyle(svg).animationDuration).toBe("1s");
  },
};

export const LegacyAnimateSpinWithSpin: Story = {
  name: "Legacy animate-spin class with spin",
  args: { spin: true, className: "size-6 animate-spin text-content-primary" },
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg") as SVGSVGElement;
    await expect(animatedElements(canvasElement)).toEqual([svg]);
    await expect(getComputedStyle(svg).animationDuration).toBe("1s");
  },
};

export const InLoadingButton: Story = {
  name: "In a loading Button",
  render: () => <Button loading>Save</Button>,
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button");
    const svg = button.querySelector("svg") as SVGSVGElement;
    await expect(animatedElements(button)).toEqual([svg]);
  },
};
