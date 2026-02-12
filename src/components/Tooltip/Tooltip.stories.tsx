import type { Meta, StoryObj } from "@storybook/react";
import { InfoCircleIcon } from "../Icons/InfoCircleIcon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./Tooltip";

const meta: Meta<typeof TooltipContent> = {
  title: "Components/Tooltip",
  component: TooltipContent,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=621-1403&m=dev",
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={0}>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof TooltipContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <button type="button" className="text-body-200">
          <InfoCircleIcon className="size-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent>Info text</TooltipContent>
    </Tooltip>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <button type="button" className="text-body-200">
          <InfoCircleIcon className="size-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">Info text</TooltipContent>
    </Tooltip>
  ),
};

export const Left: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <button type="button" className="text-body-200">
          <InfoCircleIcon className="size-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="left">Info text</TooltipContent>
    </Tooltip>
  ),
};

export const Right: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <button type="button" className="text-body-200">
          <InfoCircleIcon className="size-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">Info text</TooltipContent>
    </Tooltip>
  ),
};

export const NoArrow: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <button type="button" className="text-body-200">
          <InfoCircleIcon className="size-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent showArrow={false}>Info text</TooltipContent>
    </Tooltip>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <button type="button" className="text-body-200">
          <InfoCircleIcon className="size-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        This is a longer tooltip that demonstrates how the component handles multiline text content
        within the max-width constraint.
      </TooltipContent>
    </Tooltip>
  ),
};

export const AllPlacements: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-24 py-16">
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <button type="button" className="text-body-200">
            <InfoCircleIcon className="size-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">Top</TooltipContent>
      </Tooltip>
      <div className="flex gap-48">
        <Tooltip defaultOpen>
          <TooltipTrigger asChild>
            <button type="button" className="text-body-200">
              <InfoCircleIcon className="size-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">Left</TooltipContent>
        </Tooltip>
        <Tooltip defaultOpen>
          <TooltipTrigger asChild>
            <button type="button" className="text-body-200">
              <InfoCircleIcon className="size-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Right</TooltipContent>
        </Tooltip>
      </div>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <button type="button" className="text-body-200">
            <InfoCircleIcon className="size-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Bottom</TooltipContent>
      </Tooltip>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
