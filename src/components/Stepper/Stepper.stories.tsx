import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "./Stepper";

const meta = {
  title: "Components/Stepper",
  component: Stepper,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=14962-1474841",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    activeStep: { control: "number" },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

const threeSteps = [
  { title: "Account", description: "Create account" },
  { title: "Profile", description: "Set up profile" },
  { title: "Review", description: "Final review" },
];

const fourSteps = [
  { title: "Account", description: "Create account" },
  { title: "Profile", description: "Set up profile" },
  { title: "Payment", description: "Add payment" },
  { title: "Review", description: "Final review" },
];

const fiveSteps = [
  { title: "Account", description: "Create account" },
  { title: "Profile", description: "Set up profile" },
  { title: "Verify", description: "Verify identity" },
  { title: "Payment", description: "Add payment" },
  { title: "Review", description: "Final review" },
];

export const TwoSteps: Story = {
  args: {
    activeStep: 1,
    steps: [
      { title: "Account", description: "Create account" },
      { title: "Profile", description: "Set up profile" },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export const ThreeSteps: Story = {
  args: {
    activeStep: 1,
    steps: threeSteps,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 500 }}>
        <Story />
      </div>
    ),
  ],
};

export const FourSteps: Story = {
  args: {
    activeStep: 1,
    steps: fourSteps,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 600 }}>
        <Story />
      </div>
    ),
  ],
};

export const FiveSteps: Story = {
  args: {
    activeStep: 1,
    steps: fiveSteps,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 700 }}>
        <Story />
      </div>
    ),
  ],
};

export const AllCompleted: Story = {
  args: {
    activeStep: 3,
    steps: threeSteps,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 500 }}>
        <Story />
      </div>
    ),
  ],
};

export const FirstStep: Story = {
  args: {
    activeStep: 0,
    steps: threeSteps,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 500 }}>
        <Story />
      </div>
    ),
  ],
};

export const Small: Story = {
  args: {
    activeStep: 1,
    size: "sm",
    steps: threeSteps,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 500 }}>
        <Story />
      </div>
    ),
  ],
};

export const Large: Story = {
  args: {
    activeStep: 1,
    size: "lg",
    steps: threeSteps,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 500 }}>
        <Story />
      </div>
    ),
  ],
};

export const WithoutDescriptions: Story = {
  args: {
    activeStep: 1,
    steps: [{ title: "Account" }, { title: "Profile" }, { title: "Review" }],
  },
  decorators: [
    (Story) => (
      <div style={{ width: 500 }}>
        <Story />
      </div>
    ),
  ],
};
