import type { Meta, StoryObj } from "@storybook/react";
import { UserHandleTypography } from "./UserHandleTypography";

const meta = {
  title: "Components/UserHandleTypography",
  component: UserHandleTypography,
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
      <UserHandleTypography {...args} />
    </div>
  ),
} satisfies Meta<typeof UserHandleTypography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongHandle: Story = {
  args: {
    children: "an_extremely_long_handle_that_should_truncate_with_an_ellipsis",
  },
};
