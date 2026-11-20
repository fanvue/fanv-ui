import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { RepeatIcon } from "../Icons/RepeatIcon";
import { UsersIcon } from "../Icons/UsersIcon";
import { RadioGroup } from "../RadioGroup/RadioGroup";
import { SettingsCard } from "./SettingsCard";

const meta = {
  title: "Components/SettingsCard",
  component: SettingsCard,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/23x2vofTPkLpbcJyRdDa55/Creator---Management--Teams?node-id=9086-65149",
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <RadioGroup defaultValue="dynamic" className="w-[173px]">
        <Story />
      </RadioGroup>
    ),
  ],
  args: {
    value: "dynamic",
    icon: <RepeatIcon />,
    title: "Dynamic Logic",
    description: "Define rules which automatically update",
  },
} satisfies Meta<typeof SettingsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

function ChooseListType() {
  const [value, setValue] = React.useState("dynamic");
  return (
    <RadioGroup value={value} onValueChange={setValue} className="grid w-[361px] grid-cols-2 gap-4">
      <SettingsCard
        value="dynamic"
        icon={<RepeatIcon />}
        title="Dynamic Logic"
        description="Define rules which automatically update"
      />
      <SettingsCard
        value="manual"
        icon={<UsersIcon />}
        title="Manual"
        description="Pick the members yourself"
      />
    </RadioGroup>
  );
}

export const Group: Story = {
  decorators: [],
  render: () => <ChooseListType />,
};
