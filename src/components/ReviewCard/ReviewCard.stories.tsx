import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "../Divider/Divider";
import { ReviewCard } from "./ReviewCard";

const SAMPLE_BODY =
  "Easily plan and organize your content with this app. Streamline your scheduling and management tasks to focus on what you do best — creating.";

const meta = {
  title: "Components/ReviewCard",
  component: ReviewCard,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[400px] max-w-full">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    rating: { control: { type: "number", min: 0 } },
    maxRating: { control: { type: "number", min: 1 } },
  },
} satisfies Meta<typeof ReviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rating: 4,
    author: "@jane_doe",
    title: "A great app to start!",
    children: SAMPLE_BODY,
  },
};

export const WithoutAuthor: Story = {
  args: {
    rating: 5,
    title: "Exactly what I needed",
    children: SAMPLE_BODY,
  },
};

export const TitleOnly: Story = {
  args: {
    rating: 3,
    author: "@user_123",
    title: "Good, but room to grow.",
  },
};

export const LowRating: Story = {
  args: {
    rating: 1,
    author: "@user_456",
    title: "Not for me",
    children:
      "The idea is solid but it kept crashing on launch. Hoping a future update sorts out the stability issues.",
  },
};

export const List: Story = {
  args: { rating: 5 },
  render: () => (
    <div className="flex flex-col gap-6">
      <ReviewCard rating={5} author="@jane_doe" title="A great app to start!">
        {SAMPLE_BODY}
      </ReviewCard>
      <Divider />
      <ReviewCard rating={4} author="@sam_smith" title="Really useful">
        {SAMPLE_BODY}
      </ReviewCard>
      <Divider />
      <ReviewCard rating={3} author="@alex_p" title="Does the job">
        {SAMPLE_BODY}
      </ReviewCard>
    </div>
  ),
};
