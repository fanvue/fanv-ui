import type { Meta, StoryObj } from "@storybook/react";
import { InfoCircleIcon } from "../Icons/InfoCircleIcon";
import { ProgressBar } from "./ProgressBar";

const meta = {
  title: "Components/ProgressBar",
  component: ProgressBar,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=18411-91424",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    size: { control: "select", options: ["default", "small"] },
    variant: { control: "select", options: ["brand", "mono", "default", "generic", "neutral"] },
    showCompletion: { control: "boolean" },
    title: { control: "text" },
    stepsLabel: { control: "text" },
    helperLeft: { control: "text" },
    helperRight: { control: "text" },
  },
  args: {
    className: "w-[300px]",
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every variant at both sizes. */
export const AllVariants: Story = {
  args: { value: 60 },
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-6">
      {(["default", "brand", "mono", "generic", "neutral"] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="typography-description-12px-semibold text-content-tertiary">
            {variant}
          </span>
          <ProgressBar className="w-[300px]" value={60} variant={variant} />
          <ProgressBar className="w-[300px]" value={60} variant={variant} size="small" />
        </div>
      ))}
    </div>
  ),
};

export const Default: Story = {
  args: {
    value: 60,
  },
};

export const WithCompletion: Story = {
  args: {
    value: 50,
    title: "Upload Progress",
    showCompletion: true,
  },
};

export const WithSteps: Story = {
  args: {
    value: 25,
    title: "Profile Completion",
    stepsLabel: "2/8 steps",
  },
};

export const WithHelpers: Story = {
  args: {
    value: 40,
    helperLeft: "Uploading...",
    helperRight: "40% complete",
  },
};

export const WithIconAndHelpers: Story = {
  args: {
    value: 60,
    leftIcon: <InfoCircleIcon className="size-4" />,
    helperLeft: "Processing",
    helperRight: "3 of 5 files",
  },
};

export const FullFeatured: Story = {
  args: {
    value: 75,
    title: "Profile Setup",
    showCompletion: true,
    stepsLabel: "6/8 steps",
    helperLeft: "Almost there!",
    helperRight: "75% complete",
    leftIcon: <InfoCircleIcon className="size-4" />,
  },
};
