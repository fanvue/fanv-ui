import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/Button";
import { ButtonStack } from "./ButtonStack";

const meta = {
  title: "Components/ButtonStack",
  component: ButtonStack,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=17522-10501",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    direction: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ButtonStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: {
    direction: "horizontal",
    children: (
      <>
        <Button variant="outline">Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </>
    ),
  },
};

export const Vertical: Story = {
  args: {
    direction: "vertical",
    children: (
      <>
        <Button variant="primary">Confirm</Button>
        <Button variant="outline">Cancel</Button>
      </>
    ),
  },
};
