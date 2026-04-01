import type { Meta, StoryObj } from "@storybook/react";
import { StepperStep } from "./StepperStep";

const meta = {
  title: "Components/StepperStep",
  component: StepperStep,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=14962-1474774",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: "select",
      options: ["completed", "active", "upcoming"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    stepNumber: { control: "number" },
    title: { control: "text" },
    description: { control: "text" },
  },
} satisfies Meta<typeof StepperStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Completed: Story = {
  args: {
    state: "completed",
    stepNumber: 1,
    title: "Account",
    description: "Create account",
  },
};

export const Active: Story = {
  args: {
    state: "active",
    stepNumber: 2,
    title: "Profile",
    description: "Set up profile",
  },
};

export const Upcoming: Story = {
  args: {
    state: "upcoming",
    stepNumber: 3,
    title: "Review",
    description: "Final review",
  },
};

export const Small: Story = {
  args: {
    state: "active",
    size: "sm",
    stepNumber: 1,
    title: "Step",
    description: "Details",
  },
};

export const Large: Story = {
  args: {
    state: "active",
    size: "lg",
    stepNumber: 1,
    title: "Step",
    description: "Details",
  },
};

export const WithoutLabels: Story = {
  args: {
    state: "active",
    stepNumber: 2,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex items-start gap-8">
      <StepperStep state="completed" stepNumber={1} title="Completed" description="Done" />
      <StepperStep state="active" stepNumber={2} title="Active" description="In progress" />
      <StepperStep state="upcoming" stepNumber={3} title="Upcoming" description="Not started" />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-start gap-8">
      <StepperStep state="active" size="sm" stepNumber={1} title="Small" description="12px" />
      <StepperStep state="active" size="md" stepNumber={2} title="Medium" description="14px" />
      <StepperStep state="active" size="lg" stepNumber={3} title="Large" description="16px" />
    </div>
  ),
};
