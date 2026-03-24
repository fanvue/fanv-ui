import type { Meta, StoryObj } from "@storybook/react";
import { AppStoreReview } from "./AppStoreReview";

const sampleBody =
  "Fantastic Experience with Content Scheduler Pro! This app was incredibly easy to install and made dropshipping products to my store simple and hassle-free. The online help chat is super user-friendly, and I had a great experience with the support team who assisted me—they were friendly, knowledgeable, and quickly helped me with everything I needed. Excellent service all around. I would definitely recommend this app to anyone looking...";

const meta = {
  title: "App store/AppStoreReview",
  component: AppStoreReview,
  args: {
    reviewerName: "Abbie",
    avatarInitials: "AB",
    rating: 4,
    reviewDate: "30 Jun 2025",
    body: sampleBody,
    helpfulCount: 15,
    onHelpfulPress: () => {},
    onShowMorePress: () => {},
  },
} satisfies Meta<typeof AppStoreReview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
