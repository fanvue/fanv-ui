import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Avatar } from "../Avatar/Avatar";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import { Checkbox } from "../Checkbox/Checkbox";
import { Chip } from "../Chip/Chip";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";
import { MoreIcon } from "../Icons/MoreIcon";
import { MoreVerticalIcon } from "../Icons/MoreVerticalIcon";
import { ShareIcon } from "../Icons/ShareIcon";
import { TrashBinIcon } from "../Icons/TrashBinIcon";
import { UsersIcon } from "../Icons/UsersIcon";
import { Pagination } from "../Pagination/Pagination";
import {
  Table,
  TableBody,
  TableCard,
  TableCell,
  TableCellGroup,
  TableHead,
  TableHeader,
  TableLineClamp,
  TableMediaThumbnail,
  TablePillProgressLayout,
  TableProgressTrack,
  TableRow,
  TableRowsPerPageSelect,
  TableScrollArea,
  TableSortLabel,
  TableStackedText,
  TableStatusDot,
  TableToolbar,
} from "./Table";
import { TablePagination } from "./TablePagination";

const TABLE_MEDIA_SRC =
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=112&h=160&fit=crop";

const meta = {
  title: "Components/Table",
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=15042-40225",
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const VariantMd: Story = {
  name: "Table — md",
  render: function VariantMdStory() {
    const [page, setPage] = React.useState(2);
    return (
      <TableCard className="max-w-4xl">
        <TableToolbar>
          <span className="typography-regular-body-md text-foreground-default">2 selected</span>
          <div className="flex flex-wrap gap-1">
            <Button variant="tertiary" size="32" leftIcon={<UsersIcon className="size-3.5" />}>
              Assign to creators
            </Button>
            <Button
              variant="tertiaryDestructive"
              size="32"
              leftIcon={<TrashBinIcon className="size-3.5" />}
            >
              Delete
            </Button>
          </div>
        </TableToolbar>
        <TableScrollArea>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead intent="checkbox">
                  <Checkbox aria-label="Select all rows" />
                </TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Preview</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {["Feb 18, 2025, 4:19 PM", "Feb 17, 2025, 2:00 PM", "Feb 16, 2025, 9:30 AM"].map(
                (date) => (
                  <TableRow key={date}>
                    <TableCell intent="checkbox">
                      <Checkbox aria-label={`Select row ${date}`} />
                    </TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell intent="multiline">
                      <TableLineClamp>
                        Placeholder description text for this row.{" "}
                        <button type="button" className="typography-semibold-body-md">
                          Read more
                        </button>
                      </TableLineClamp>
                    </TableCell>
                    <TableCell>
                      <TableCellGroup>
                        <TableMediaThumbnail src={TABLE_MEDIA_SRC} alt="" />
                        <span>5</span>
                        <ChevronDownIcon
                          className="size-5 shrink-0 text-foreground-default"
                          aria-hidden
                        />
                      </TableCellGroup>
                    </TableCell>
                    <TableCell>
                      <TableCellGroup>
                        <span
                          className="inline-block size-5 shrink-0 rounded bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400"
                          aria-hidden
                        />
                        <span>5</span>
                        <ChevronDownIcon
                          className="size-5 shrink-0 text-foreground-default"
                          aria-hidden
                        />
                      </TableCellGroup>
                    </TableCell>
                    <TableCell>
                      <TableStatusDot aria-hidden />
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </TableScrollArea>
        <TablePagination
          leadingSlot={<TableRowsPerPageSelect />}
          paginationSlot={
            <Pagination className="pb-0" totalPages={5} currentPage={page} onPageChange={setPage} />
          }
          summary="20–30 of 100 rows"
        />
      </TableCard>
    );
  },
};

export const VariantLg: Story = {
  name: "Table — lg",
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=15042-40225",
    },
  },
  render: function VariantLgStory() {
    const [page, setPage] = React.useState(1);
    return (
      <TableCard size="lg" className="max-w-3xl">
        <TableScrollArea>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead intent="checkbox">
                  <Checkbox aria-label="Select all" />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Media</TableHead>
                <TableHead>Label</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell intent="checkbox">
                  <Checkbox aria-label="Select row" />
                </TableCell>
                <TableCell>Sample label</TableCell>
                <TableCell>
                  <TableMediaThumbnail src={TABLE_MEDIA_SRC} alt="" align="center" />
                </TableCell>
                <TableCell>
                  <Badge variant="info">Badge</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableScrollArea>
        <TablePagination
          leadingSlot={<TableRowsPerPageSelect id="lg-rows" />}
          paginationSlot={
            <Pagination className="pb-0" totalPages={5} currentPage={page} onPageChange={setPage} />
          }
          summary="1–10 of 48 rows"
        />
      </TableCard>
    );
  },
};

export const CellVariants: Story = {
  name: "Cell variants (Figma)",
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=854-3764",
    },
  },
  render: () => (
    <div className="flex max-w-3xl flex-col gap-10">
      <div>
        <p className="typography-semibold-body-md mb-3 text-foreground-default">Header</p>
        <TableCard>
          <TableScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead intent="sort">
                    <TableSortLabel>Sortable</TableSortLabel>
                  </TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </TableScrollArea>
        </TableCard>
      </div>

      <div>
        <p className="typography-semibold-body-md mb-3 text-foreground-default">Body cells</p>
        <TableCard>
          <TableScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead intent="leading">Variant</TableHead>
                  <TableHead>Example</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell intent="sideLabel">Checkbox</TableCell>
                  <TableCell>
                    <Checkbox aria-label="Row select" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell intent="sideLabel">Text</TableCell>
                  <TableCell>Cell</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell intent="sideLabel">Cell + info</TableCell>
                  <TableCell intent="stacked">
                    <TableStackedText title="Cell" subtitle="Secondary line" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell intent="sideLabel">Chip</TableCell>
                  <TableCell cellVariant="chip">
                    <Chip>Chip</Chip>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell intent="sideLabel">Chip + chevron</TableCell>
                  <TableCell cellVariant="chip">
                    <TableCellGroup>
                      <Chip>Chip</Chip>
                      <ChevronDownIcon className="size-5 shrink-0" aria-hidden />
                    </TableCellGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell intent="sideLabel">Badge</TableCell>
                  <TableCell>
                    <Badge variant="info">Badge</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell intent="sideLabel">Badge + chevron</TableCell>
                  <TableCell>
                    <TableCellGroup>
                      <Badge variant="info">Badge</Badge>
                      <ChevronDownIcon className="size-5 shrink-0" aria-hidden />
                    </TableCellGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell intent="sideLabel">Pill + progress</TableCell>
                  <TableCell cellVariant="pillProgress">
                    <TablePillProgressLayout>
                      <Badge variant="special">Sending</Badge>
                      <TableProgressTrack value={40} />
                    </TablePillProgressLayout>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell intent="sideLabel">Avatar</TableCell>
                  <TableCell>
                    <Avatar src={TABLE_MEDIA_SRC} alt="" fallback="U" size={40} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell intent="sideLabel">Media (md)</TableCell>
                  <TableCell>
                    <TableMediaThumbnail src={TABLE_MEDIA_SRC} alt="" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell intent="sideLabel">Media blurred</TableCell>
                  <TableCell>
                    <TableMediaThumbnail src={TABLE_MEDIA_SRC} alt="" blurred />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell intent="sideLabel">Icon</TableCell>
                  <TableCell>
                    <span
                      className="inline-flex size-5 rounded bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400"
                      aria-hidden
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell intent="sideLabel">Share</TableCell>
                  <TableCell>
                    <ShareIcon className="size-5 text-foreground-default" aria-hidden />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell intent="sideLabel">More</TableCell>
                  <TableCell>
                    <TableCellGroup>
                      <MoreIcon className="size-5 text-foreground-default" aria-hidden />
                      <MoreVerticalIcon className="size-5 text-foreground-default" aria-hidden />
                    </TableCellGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell intent="sideLabel">Button</TableCell>
                  <TableCell>
                    <Button variant="secondary" size="32">
                      Add
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableScrollArea>
        </TableCard>
      </div>
    </div>
  ),
};

export const PaginationDesktop: Story = {
  name: "Pagination — desktop",
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=10637-2872",
    },
  },
  render: function PaginationDesktopStory() {
    const [page, setPage] = React.useState(2);
    return (
      <div className="w-full max-w-[628px] rounded-2xl bg-surface-page py-4">
        <TablePagination
          leadingSlot={<TableRowsPerPageSelect id="desk-rows" />}
          paginationSlot={
            <Pagination className="pb-0" totalPages={5} currentPage={page} onPageChange={setPage} />
          }
          summary="20–30 of 100 rows"
        />
      </div>
    );
  },
};

export const PaginationMobile: Story = {
  name: "Pagination — mobile",
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=10637-2872",
    },
  },
  render: function PaginationMobileStory() {
    const [page, setPage] = React.useState(2);
    return (
      <TablePagination
        layout="mobile"
        className="max-w-sm rounded-2xl bg-surface-page py-4"
        leadingSlot={<TableRowsPerPageSelect id="mob-rows" />}
        paginationSlot={
          <Pagination className="pb-0" totalPages={5} currentPage={page} onPageChange={setPage} />
        }
        summary="20–30 of 100 rows"
      />
    );
  },
};
