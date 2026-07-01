import type { Meta, StoryObj } from "@storybook/react";
import { UserHandle } from "./UserHandle";

const meta = {
  title: "Components/UserHandle",
  component: UserHandle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: { control: "text" },
  },
  args: {
    children: "fit_aitana",
  },
  render: (args) => (
    <div className="w-72">
      <UserHandle {...args} />
    </div>
  ),
} satisfies Meta<typeof UserHandle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongHandle: Story = {
  args: {
    children: "an_extremely_long_handle_that_should_truncate_with_an_ellipsis",
  },
};
