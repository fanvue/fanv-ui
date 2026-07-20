import type { Meta, StoryObj } from "@storybook/react";
import { AddIcon } from "../Icons/AddIcon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../Tooltip/Tooltip";
import { FloatingActionButton } from "./FloatingActionButton";

const meta = {
  title: "Components/FloatingActionButton",
  component: FloatingActionButton,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/LB9q4XzCNlbOaeW3xN6tQo/Creator---Content---Creation?node-id=4506-17416",
    },
  },
  tags: ["autodocs"],
  args: {
    "aria-label": "Add content",
    children: <AddIcon />,
  },
} satisfies Meta<typeof FloatingActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DesktopPlacement: Story = {
  render: (args) => (
    <div className="relative h-80 w-[480px] rounded-md bg-surface-secondary">
      <FloatingActionButton {...args} className="absolute right-6 bottom-6" />
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const MobilePlacement: Story = {
  render: (args) => (
    <div className="relative h-80 w-72 rounded-md bg-surface-secondary">
      <FloatingActionButton {...args} className="absolute bottom-6 left-1/2 -translate-x-1/2" />
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const WithTooltip: Story = {
  render: (args) => (
    <TooltipProvider delayDuration={0}>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <FloatingActionButton {...args} />
        </TooltipTrigger>
        <TooltipContent>Add a media</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
