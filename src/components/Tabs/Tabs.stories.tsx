import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";
import { TabsContent } from "./TabsContent";
import { TabsList } from "./TabsList";
import { TabsTrigger } from "./TabsTrigger";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=87-4098&m=dev",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Photos</TabsTrigger>
        <TabsTrigger value="tab2">Videos</TabsTrigger>
        <TabsTrigger value="tab3">Posts</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="pt-4 text-neutral-400 text-sm">Photos content</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="pt-4 text-neutral-400 text-sm">Videos content</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="pt-4 text-neutral-400 text-sm">Posts content</p>
      </TabsContent>
    </Tabs>
  ),
};

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Active</TabsTrigger>
        <TabsTrigger value="tab2">Normal</TabsTrigger>
        <TabsTrigger value="tab3" disabled>
          Disabled
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="pt-4 text-neutral-400 text-sm">Active tab content</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="pt-4 text-neutral-400 text-sm">Normal tab content</p>
      </TabsContent>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="tab1" orientation="vertical">
      <TabsList>
        <TabsTrigger value="tab1">Photos</TabsTrigger>
        <TabsTrigger value="tab2">Videos</TabsTrigger>
        <TabsTrigger value="tab3">Posts</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="pl-4 text-neutral-400 text-sm">Photos content</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="pl-4 text-neutral-400 text-sm">Videos content</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="pl-4 text-neutral-400 text-sm">Posts content</p>
      </TabsContent>
    </Tabs>
  ),
};

export const Inline: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList fullWidth={false}>
        <TabsTrigger value="tab1">Photos</TabsTrigger>
        <TabsTrigger value="tab2">Videos</TabsTrigger>
        <TabsTrigger value="tab3">Posts</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="pt-4 text-neutral-400 text-sm">Photos content</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="pt-4 text-neutral-400 text-sm">Videos content</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="pt-4 text-neutral-400 text-sm">Posts content</p>
      </TabsContent>
    </Tabs>
  ),
};

export const AllStates: Story = {
  name: "All States (Matrix)",
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="typography-body-2-semibold mb-4 text-neutral-300">Active</p>
        <div className="flex gap-10">
          <div className="flex flex-col items-center gap-2">
            <p className="typography-caption-regular text-neutral-250">Default</p>
            <Tabs defaultValue="t">
              <TabsList>
                <TabsTrigger value="t">Tab</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="typography-caption-regular text-neutral-250">Disabled</p>
            <Tabs defaultValue="t">
              <TabsList>
                <TabsTrigger value="t" disabled>
                  Tab
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
      <div>
        <p className="typography-body-2-semibold mb-4 text-neutral-300">Inactive</p>
        <div className="flex gap-10">
          <div className="flex flex-col items-center gap-2">
            <p className="typography-caption-regular text-neutral-250">Default</p>
            <Tabs defaultValue="other">
              <TabsList>
                <TabsTrigger value="t">Tab</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="typography-caption-regular text-neutral-250">Disabled</p>
            <Tabs defaultValue="other">
              <TabsList>
                <TabsTrigger value="t" disabled>
                  Tab
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  ),
};
