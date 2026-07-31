import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";
import { TabsContent } from "./TabsContent";
import { TabsList } from "./TabsList";
import { TabsTrigger } from "./TabsTrigger";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=16804-89710",
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
        <p className="pt-4 text-content-tertiary text-sm">Photos content</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="pt-4 text-content-tertiary text-sm">Videos content</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="pt-4 text-content-tertiary text-sm">Posts content</p>
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
        <p className="pt-4 text-content-tertiary text-sm">Active tab content</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="pt-4 text-content-tertiary text-sm">Normal tab content</p>
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
        <p className="pl-4 text-content-tertiary text-sm">Photos content</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="pl-4 text-content-tertiary text-sm">Videos content</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="pl-4 text-content-tertiary text-sm">Posts content</p>
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
        <p className="pt-4 text-content-tertiary text-sm">Photos content</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="pt-4 text-content-tertiary text-sm">Videos content</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="pt-4 text-content-tertiary text-sm">Posts content</p>
      </TabsContent>
    </Tabs>
  ),
};

export const HugStyle: Story = {
  name: "Hug (sizes to content — does not stretch)",
  render: () => (
    <div style={{ width: 400 }}>
      <Tabs defaultValue="tab1">
        <TabsList variant="hug">
          <TabsTrigger value="tab1">Photos</TabsTrigger>
          <TabsTrigger value="tab2">Videos</TabsTrigger>
          <TabsTrigger value="tab3">Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <p className="pt-4 text-content-tertiary text-sm">
            List is only as wide as its tabs — not 400 px
          </p>
        </TabsContent>
        <TabsContent value="tab2">
          <p className="pt-4 text-content-tertiary text-sm">Videos content</p>
        </TabsContent>
        <TabsContent value="tab3">
          <p className="pt-4 text-content-tertiary text-sm">Posts content</p>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

export const FillStyle: Story = {
  name: "Fill (stretches to container width)",
  render: () => (
    <div style={{ width: 400 }}>
      <Tabs defaultValue="tab1">
        <TabsList variant="fill">
          <TabsTrigger value="tab1">Photos</TabsTrigger>
          <TabsTrigger value="tab2">Videos</TabsTrigger>
          <TabsTrigger value="tab3">Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <p className="pt-4 text-content-tertiary text-sm">
            List stretches to fill all 400 px — tabs share width equally
          </p>
        </TabsContent>
        <TabsContent value="tab2">
          <p className="pt-4 text-content-tertiary text-sm">Videos content</p>
        </TabsContent>
        <TabsContent value="tab3">
          <p className="pt-4 text-content-tertiary text-sm">Posts content</p>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

/**
 * `flushLeft` drops the first tab's leading padding so its label lines up with
 * page content outside the bar. The heading here shares the tab list's left
 * edge, which the default 16px trigger padding would otherwise break.
 */
export const FlushLeft: Story = {
  name: "Full Width - Align Left, Flush",
  render: () => (
    <Tabs defaultValue="tab1">
      <h2 className="typography-header-heading-sm pb-4 text-content-primary">Insights</h2>
      <TabsList alignLeft flushLeft>
        <TabsTrigger value="tab1">Manager Insights</TabsTrigger>
        <TabsTrigger value="tab2">Chatter Leaderboard</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="pt-4 text-content-tertiary text-sm">
          The first label sits flush with the heading above it.
        </p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="pt-4 text-content-tertiary text-sm">Chatter Leaderboard content</p>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * `scrollable` keeps every label readable in a narrow container. Without it the
 * tabs compress until they all ellipsise at once; here they hold their width and
 * the row scrolls, with the clipped tab at the edge as the affordance.
 */
export const Scrollable: Story = {
  name: "Scrollable - Narrow Container",
  render: () => (
    <div className="w-[320px]">
      <Tabs defaultValue="tab1">
        <TabsList scrollable flushLeft>
          <TabsTrigger value="tab1">Manager Insights</TabsTrigger>
          <TabsTrigger value="tab2">Chatter Leaderboard</TabsTrigger>
          <TabsTrigger value="tab3">Fans at Risk</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <p className="pt-4 text-content-tertiary text-sm">
            Drag the row sideways to reach the later tabs.
          </p>
        </TabsContent>
        <TabsContent value="tab2">
          <p className="pt-4 text-content-tertiary text-sm">Chatter Leaderboard content</p>
        </TabsContent>
        <TabsContent value="tab3">
          <p className="pt-4 text-content-tertiary text-sm">Fans at Risk content</p>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

/**
 * A `scrollable` row mounted with a later tab already active, as URL-driven tab
 * state does. The row scrolls to bring it into view on mount, so the active tab and
 * its indicator are both visible rather than sitting off to the right unannounced.
 */
export const ScrollableActiveOffscreen: Story = {
  name: "Scrollable - Active Tab Offscreen",
  render: () => (
    <div className="w-[320px]">
      <Tabs defaultValue="tab3">
        <TabsList scrollable flushLeft>
          <TabsTrigger value="tab1">Manager Insights</TabsTrigger>
          <TabsTrigger value="tab2">Chatter Leaderboard</TabsTrigger>
          <TabsTrigger value="tab3">Fans at Risk</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <p className="pt-4 text-content-tertiary text-sm">Manager Insights content</p>
        </TabsContent>
        <TabsContent value="tab2">
          <p className="pt-4 text-content-tertiary text-sm">Chatter Leaderboard content</p>
        </TabsContent>
        <TabsContent value="tab3">
          <p className="pt-4 text-content-tertiary text-sm">
            Mounted on the third tab, scrolled into view.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

export const AlignLeft: Story = {
  name: "Full Width - Align Left",
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList alignLeft>
        <TabsTrigger value="tab1">Photos</TabsTrigger>
        <TabsTrigger value="tab2">Videos</TabsTrigger>
        <TabsTrigger value="tab3">Posts</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="pt-4 text-neutral-400 text-sm">
          Full width container with left-aligned tabs (sized to content)
        </p>
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

export const AlignLeftResponsive: Story = {
  name: "Full Width - Align Left (Responsive)",
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList alignLeft="md">
        <TabsTrigger value="tab1">App Store</TabsTrigger>
        <TabsTrigger value="tab2">My apps</TabsTrigger>
        <TabsTrigger value="tab3">Builder</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="pt-4 text-neutral-400 text-sm">
          Tabs spread evenly on mobile, left-aligned on md and up. Resize the viewport to see the
          difference.
        </p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="pt-4 text-neutral-400 text-sm">My apps content</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="pt-4 text-neutral-400 text-sm">Builder content</p>
      </TabsContent>
    </Tabs>
  ),
};

export const Truncated: Story = {
  render: () => (
    <div style={{ width: 250 }}>
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Very Long Tab Name Here</TabsTrigger>
          <TabsTrigger value="tab2">Another Long Tab Name</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <p className="pt-4 text-content-tertiary text-sm">First tab content</p>
        </TabsContent>
        <TabsContent value="tab2">
          <p className="pt-4 text-content-tertiary text-sm">Second tab content</p>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

export const AllStates: Story = {
  name: "All States (Matrix)",
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="typography-body-small-14px-semibold mb-4 text-content-tertiary">Active</p>
        <div className="flex gap-10">
          <div className="flex flex-col items-center gap-2">
            <p className="typography-description-12px-regular text-content-tertiary">Default</p>
            <Tabs defaultValue="t">
              <TabsList>
                <TabsTrigger value="t">Tab</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="typography-description-12px-regular text-content-tertiary">Disabled</p>
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
        <p className="typography-body-small-14px-semibold mb-4 text-content-tertiary">Inactive</p>
        <div className="flex gap-10">
          <div className="flex flex-col items-center gap-2">
            <p className="typography-description-12px-regular text-content-tertiary">Default</p>
            <Tabs defaultValue="other">
              <TabsList>
                <TabsTrigger value="t">Tab</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="typography-description-12px-regular text-content-tertiary">Disabled</p>
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

export const AsLinks: Story = {
  name: "As Navigation Links (asChild)",
  render: () => (
    // Navigation tabs: each trigger renders as a real anchor via `asChild`, so
    // it behaves like a link (right-click, open-in-new-tab, router prefetch)
    // while still getting tab styling and the active indicator. Swap the `<a>`
    // for your framework's link component (e.g. next/link).
    <Tabs value="tab1">
      <TabsList alignLeft aria-label="Sections">
        <TabsTrigger value="tab1" asChild>
          <a href="#photos">Photos</a>
        </TabsTrigger>
        <TabsTrigger value="tab2" asChild>
          <a href="#videos">Videos</a>
        </TabsTrigger>
        <TabsTrigger value="tab3" asChild>
          <a href="#posts">Posts</a>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  ),
};
