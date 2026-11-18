import type { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "../IconButton/IconButton";
import { MoreIcon } from "../Icons/MoreIcon";
import { Pill } from "../Pill/Pill";
import {
  Table,
  TableBody,
  TableCard,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableScrollArea,
} from "./Table";
import { TableRowLink } from "./TableRowLink";

const CAMPAIGNS = [
  { name: "Summer launch", status: "Active", clicks: "1,204" },
  { name: "Creator collab", status: "Active", clicks: "860" },
  { name: "Winter teaser", status: "Ended", clicks: "312" },
];

const meta = {
  title: "Components/Table/TableRowLink",
  component: TableRowLink,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library",
    },
  },
  tags: ["autodocs"],
  args: {
    href: "#campaign",
    children: "Summer launch",
  },
} satisfies Meta<typeof TableRowLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The name in each interactive row is a `TableRowLink`. Clicking anywhere on the
 * row opens it, except on the row's own menu button, which keeps its click.
 */
export const InInteractiveRows: Story = {
  render: () => (
    <TableCard className="max-w-2xl">
      <TableScrollArea>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead aria-label="Actions" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {CAMPAIGNS.map((campaign) => (
              <TableRow key={campaign.name} interactive>
                <TableCell>
                  <TableRowLink href="#campaign">{campaign.name}</TableRowLink>
                </TableCell>
                <TableCell>
                  <Pill variant={campaign.status === "Active" ? "green" : "grey"}>
                    {campaign.status}
                  </Pill>
                </TableCell>
                <TableCell>{campaign.clicks}</TableCell>
                <TableCell>
                  <IconButton
                    icon={<MoreIcon />}
                    aria-label={`Actions for ${campaign.name}`}
                    variant="tertiary"
                    size="32"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableScrollArea>
    </TableCard>
  ),
};

/** On its own the link reads as primary text and underlines on hover. */
export const Default: Story = {};
