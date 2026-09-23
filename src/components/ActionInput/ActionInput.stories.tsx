import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { userEvent, within } from "storybook/test";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../DropdownMenu/DropdownMenu";
import { AddIcon } from "../Icons/AddIcon";
import { ActionInput } from "./ActionInput";

const meta = {
  title: "Components/ActionInput",
  component: ActionInput,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=22005-17152",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "add"],
    },
    filled: { control: "boolean" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    children: "Last 30d",
  },
} satisfies Meta<typeof ActionInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Add: Story = {
  args: {
    variant: "add",
    leadingIcon: <AddIcon size={16} />,
    children: "Add condition",
  },
};

export const Filled: Story = {
  args: { filled: true, children: "Total spent" },
};

export const ErrorState: Story = {
  name: "Error",
  args: { error: true, children: "Any" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const IconOptions: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <ActionInput {...args} leadingIcon={<AddIcon size={16} />} trailingIcon={null}>
        Leading
      </ActionInput>
      <ActionInput {...args} leadingIcon={<AddIcon size={16} />}>
        Both
      </ActionInput>
      <ActionInput {...args}>Trailing</ActionInput>
      <ActionInput {...args} trailingIcon={null}>
        None
      </ActionInput>
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {(["default", "add"] as const).map((variant) => (
        <div key={variant} className="flex flex-col items-start gap-3">
          <ActionInput variant={variant} leadingIcon={<AddIcon size={16} />}>
            Default
          </ActionInput>
          <ActionInput variant={variant} leadingIcon={<AddIcon size={16} />} filled>
            Filled
          </ActionInput>
          <ActionInput variant={variant} leadingIcon={<AddIcon size={16} />} error>
            Error
          </ActionInput>
          <ActionInput variant={variant} leadingIcon={<AddIcon size={16} />} disabled>
            Disabled
          </ActionInput>
        </div>
      ))}
    </div>
  ),
};

const PERIODS = ["Last 7d", "Last 30d", "Last 90d"];

function PeriodPicker() {
  const [period, setPeriod] = React.useState<string>("");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ActionInput filled={period !== ""}>{period || "Any"}</ActionInput>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup value={period} onValueChange={setPeriod}>
          {PERIODS.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {option}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const WithDropdownMenu: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ActionInput variant="add" leadingIcon={<AddIcon size={16} />}>
            Add condition
          </ActionInput>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>Total spent</DropdownMenuItem>
          <DropdownMenuItem>Subscription status</DropdownMenuItem>
          <DropdownMenuItem>Last active</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <PeriodPicker />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Add condition" }));
  },
};
