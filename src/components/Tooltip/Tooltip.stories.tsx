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
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=11704-59942",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: "select",
      options: [
        "top",
        "top-start",
        "top-end",
        "bottom",
        "bottom-start",
        "bottom-end",
        "left",
        "left-start",
        "left-end",
        "right",
        "right-start",
        "right-end",
      ],
    },
  },
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
        <button type="button" className="text-content-secondary">
          <InfoCircleIcon className="size-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent>Tooltip</TooltipContent>
    </Tooltip>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <button type="button" className="text-content-secondary">
          <InfoCircleIcon className="size-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent placement="bottom">Tooltip</TooltipContent>
    </Tooltip>
  ),
};

export const Left: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <button type="button" className="text-content-secondary">
          <InfoCircleIcon className="size-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent placement="left">Tooltip</TooltipContent>
    </Tooltip>
  ),
};

export const Right: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <button type="button" className="text-content-secondary">
          <InfoCircleIcon className="size-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent placement="right">Tooltip</TooltipContent>
    </Tooltip>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <button type="button" className="text-content-secondary">
          <InfoCircleIcon className="size-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        This is a longer tooltip that demonstrates how the component handles multiline text content.
      </TooltipContent>
    </Tooltip>
  ),
};

export const AllPlacements: Story = {
  render: () => {
    const placements = [
      "top-start",
      "top",
      "top-end",
      "left-start",
      "spacer-1",
      "right-start",
      "left",
      "spacer-2",
      "right",
      "left-end",
      "spacer-3",
      "right-end",
      "bottom-start",
      "bottom",
      "bottom-end",
    ] as const;
    return (
      <div className="grid grid-cols-3 place-items-center gap-24 py-24">
        {placements.map((slot) =>
          slot.startsWith("spacer") ? (
            <div key={slot} />
          ) : (
            <Tooltip key={slot} defaultOpen>
              <TooltipTrigger asChild>
                <button type="button" className="text-content-secondary">
                  <InfoCircleIcon className="size-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent placement={slot as Exclude<typeof slot, `spacer-${string}`>}>
                {slot}
              </TooltipContent>
            </Tooltip>
          ),
        )}
      </div>
    );
  },
  parameters: {
    layout: "padded",
  },
};
