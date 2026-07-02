import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Avatar } from "../Avatar/Avatar";
import { CrownIcon } from "../Icons/CrownIcon";
import { Accordion } from "./Accordion";
import { AccordionContent } from "./AccordionContent";
import { AccordionItem } from "./AccordionItem";
import { AccordionTrigger } from "./AccordionTrigger";

const avatarSrc = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop";

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=17976-15947",
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: "Default (Single, Collapsible)",
  render: () => (
    <Accordion type="single" collapsible className="max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is your refund policy?</AccordionTrigger>
        <AccordionContent>
          If you are unhappy with your purchase, we will refund you in full within the first 30
          days.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I cancel my subscription?</AccordionTrigger>
        <AccordionContent>
          You can cancel your subscription at any time from your account settings page.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Can I change my plan later?</AccordionTrigger>
        <AccordionContent>
          Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  name: "Multiple Mode",
  render: () => (
    <Accordion type="multiple" className="max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Section 1</AccordionTrigger>
        <AccordionContent>
          Multiple items can be open at the same time. Try clicking multiple headers.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Section 2</AccordionTrigger>
        <AccordionContent>
          This section is independent from the others. Opening it won't close Section 1.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Section 3</AccordionTrigger>
        <AccordionContent>All three sections can be expanded simultaneously.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const WithDisabledItems: Story = {
  name: "With Disabled Items",
  render: () => (
    <Accordion type="single" collapsible className="max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Enabled item</AccordionTrigger>
        <AccordionContent>This item can be toggled normally.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger>Disabled item</AccordionTrigger>
        <AccordionContent>You should not be able to see this.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Another enabled item</AccordionTrigger>
        <AccordionContent>This item can also be toggled normally.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Controlled: Story = {
  name: "Controlled Mode",
  render: () => {
    const [value, setValue] = useState("item-1");
    return (
      <div className="max-w-md space-y-4">
        <p className="typography-description-12px-regular text-content-secondary">
          Current value: <strong>{value || "(none)"}</strong>
        </p>
        <Accordion type="single" collapsible value={value} onValueChange={setValue}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Controlled Section 1</AccordionTrigger>
            <AccordionContent>Content for section 1.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Controlled Section 2</AccordionTrigger>
            <AccordionContent>Content for section 2.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Controlled Section 3</AccordionTrigger>
            <AccordionContent>Content for section 3.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  },
};

export const DefaultExpanded: Story = {
  name: "Default Expanded",
  render: () => (
    <Accordion type="single" collapsible defaultValue="item-2" className="max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Section 1</AccordionTrigger>
        <AccordionContent>Content for section 1.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Section 2 (default open)</AccordionTrigger>
        <AccordionContent>This section is expanded by default via defaultValue.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Section 3</AccordionTrigger>
        <AccordionContent>Content for section 3.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const WithDescription: Story = {
  name: "Header with Description",
  render: () => (
    <Accordion type="single" collapsible defaultValue="item-1" className="max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger description="A short summary of what this section covers.">
          Billing & payments
        </AccordionTrigger>
        <AccordionContent>Manage your payment methods and view past invoices.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger description="Control who can see your profile and activity.">
          Privacy
        </AccordionTrigger>
        <AccordionContent>Adjust your visibility and data-sharing preferences.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const WithLeadingIcon: Story = {
  name: "Header with Leading Icon",
  render: () => (
    <Accordion type="single" collapsible defaultValue="item-1" className="max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger leadingIcon={<CrownIcon />} description="Perks for premium members.">
          Membership benefits
        </AccordionTrigger>
        <AccordionContent>Exclusive content, early access, and priority support.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger leadingIcon={<CrownIcon />}>Rewards</AccordionTrigger>
        <AccordionContent>Earn points every time you engage.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const WithAvatar: Story = {
  name: "Header with Avatar",
  render: () => (
    <Accordion type="single" collapsible defaultValue="item-1" className="max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger
          avatar={<Avatar size={24} src={avatarSrc} alt="Jane Doe" fallback="JD" />}
          description="@jane_doe"
        >
          Jane Doe
        </AccordionTrigger>
        <AccordionContent>View this creator's recent posts and details.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger avatar={<Avatar size={24} fallback="AB" />} description="@alex_b">
          Alex Brown
        </AccordionTrigger>
        <AccordionContent>View this creator's recent posts and details.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const HeaderVariants: Story = {
  name: "Header Variants (Matrix)",
  render: () => (
    <Accordion type="multiple" defaultValue={["desc", "icon", "avatar"]} className="max-w-md">
      <AccordionItem value="title">
        <AccordionTrigger>Title only</AccordionTrigger>
        <AccordionContent>The default header with just a title.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="desc">
        <AccordionTrigger description="With a secondary description line.">
          Title + description
        </AccordionTrigger>
        <AccordionContent>Adds context under the title.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="icon">
        <AccordionTrigger leadingIcon={<CrownIcon />} description="With a leading icon.">
          Title + icon
        </AccordionTrigger>
        <AccordionContent>A leading icon identifies the section type.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="avatar">
        <AccordionTrigger
          avatar={<Avatar size={24} src={avatarSrc} alt="Jane Doe" fallback="JD" />}
          description="@jane_doe"
        >
          Title + avatar
        </AccordionTrigger>
        <AccordionContent>An avatar identifies a person or account.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const AllStates: Story = {
  name: "All States (Matrix)",
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="typography-body-small-14px-semibold mb-4 text-content-tertiary">
          Single, Collapsible
        </p>
        <Accordion type="single" collapsible defaultValue="item-1" className="max-w-sm">
          <AccordionItem value="item-1">
            <AccordionTrigger>Expanded</AccordionTrigger>
            <AccordionContent>Expanded content</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Collapsed</AccordionTrigger>
            <AccordionContent>Collapsed content</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div>
        <p className="typography-body-small-14px-semibold mb-4 text-content-tertiary">
          Disabled Item
        </p>
        <Accordion type="single" collapsible className="max-w-sm">
          <AccordionItem value="item-1">
            <AccordionTrigger>Enabled</AccordionTrigger>
            <AccordionContent>Enabled content</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" disabled>
            <AccordionTrigger>Disabled</AccordionTrigger>
            <AccordionContent>Disabled content</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div>
        <p className="typography-body-small-14px-semibold mb-4 text-content-tertiary">
          Multiple Mode
        </p>
        <Accordion type="multiple" defaultValue={["item-1", "item-2"]} className="max-w-sm">
          <AccordionItem value="item-1">
            <AccordionTrigger>Open 1</AccordionTrigger>
            <AccordionContent>Both items open at once</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Open 2</AccordionTrigger>
            <AccordionContent>Both items open at once</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div>
        <p className="typography-body-small-14px-semibold mb-4 text-content-tertiary">
          Root Disabled
        </p>
        <Accordion type="single" collapsible disabled className="max-w-sm">
          <AccordionItem value="item-1">
            <AccordionTrigger>Disabled 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Disabled 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  ),
};
