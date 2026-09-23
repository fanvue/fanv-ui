import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { NON_VISUAL_STORY_PARAMETERS } from "../../storybook";
import { RefreshArrowIcon } from "../Icons/RefreshArrowIcon";
import { UsersIcon } from "../Icons/UsersIcon";
import { RadioGroup } from "../RadioGroup/RadioGroup";
import { RadioCard } from "./RadioCard";

const meta = {
  title: "Components/RadioCard",
  component: RadioCard,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=20781-6547",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    disabled: { control: "boolean" },
  },
  render: (args) => (
    <RadioGroup aria-label="List type" className="w-60">
      <RadioCard {...args} />
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "dynamic",
    title: "Dynamic list",
    description: "Define rules which automatically update",
    icon: <RefreshArrowIcon />,
  },
};

export const Selected: Story = {
  args: {
    value: "dynamic",
    title: "Dynamic list",
    description: "Define rules which automatically update",
    icon: <RefreshArrowIcon />,
  },
  render: (args) => (
    <RadioGroup aria-label="List type" defaultValue={args.value} className="w-60">
      <RadioCard {...args} />
    </RadioGroup>
  ),
};

export const WithoutIcon: Story = {
  args: {
    value: "specific",
    title: "Specific fans",
    description: "A fixed set of fans picked by you",
  },
};

export const Disabled: Story = {
  args: {
    value: "dynamic",
    title: "Dynamic list",
    description: "Define rules which automatically update",
    icon: <RefreshArrowIcon />,
    disabled: true,
  },
};

export const Group: Story = {
  name: "Group (controlled)",
  args: { value: "unused", title: "unused" },
  parameters: {
    ...NON_VISUAL_STORY_PARAMETERS,
    docs: {
      description: {
        story:
          "Cards inside a `RadioGroup` grid. Click anywhere on a card or use the arrow keys to move the selection.",
      },
    },
  },
  render: function GroupRender() {
    const [value, setValue] = useState("dynamic");
    return (
      <RadioGroup
        value={value}
        onValueChange={setValue}
        aria-label="List type"
        className="grid w-[500px] grid-cols-2 gap-4"
      >
        <RadioCard
          value="dynamic"
          icon={<RefreshArrowIcon />}
          title="Dynamic list"
          description="Define rules which automatically update"
        />
        <RadioCard
          value="specific"
          icon={<UsersIcon />}
          title="Specific fans"
          description="A fixed set of fans picked by you"
        />
      </RadioGroup>
    );
  },
};
