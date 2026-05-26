import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Avatar } from "../Avatar/Avatar";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import { Checkbox } from "../Checkbox/Checkbox";
import { Chip } from "../Chip/Chip";
import { IconButton } from "../IconButton/IconButton";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";
import { MoreIcon } from "../Icons/MoreIcon";
import { MoreVerticalIcon } from "../Icons/MoreVerticalIcon";
import { ShareIcon } from "../Icons/ShareIcon";
import { TrashBinIcon } from "../Icons/TrashBinIcon";
import { UsersIcon } from "../Icons/UsersIcon";
import { Pagination } from "../Pagination/Pagination";
import { Pill } from "../Pill/Pill";
import {
  Table,
  TableBody,
  TableCard,
  TableCell,
  TableCellContent,
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

const V2_FIGMA_URL =
  "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=18411-85630";

const meta = {
  title: "Components/Table",
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: V2_FIGMA_URL,
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

type ProductRow = {
  name: string;
  created: string;
  price: string;
  purchases: string;
  status: { label: "Active" | "Inactive" | "Warning"; variant: "green" | "error" | "gold" };
};

const PRODUCT_ROWS: ProductRow[] = [
  {
    name: "Product Name",
    created: "16 May, 01:15 AM",
    price: "$5.99 / month",
    purchases: "$0.00",
    status: { label: "Active", variant: "green" },
  },
  {
    name: "Product Name",
    created: "16 May, 01:15 AM",
    price: "$5.99 / month",
    purchases: "$0.00",
    status: { label: "Active", variant: "green" },
  },
  {
    name: "Product Name",
    created: "16 May, 01:15 AM",
    price: "$5.99 / month",
    purchases: "$156.25",
    status: { label: "Inactive", variant: "error" },
  },
  {
    name: "Product Name",
    created: "16 May, 01:15 AM",
    price: "$5.99 / month",
    purchases: "$0.00",
    status: { label: "Warning", variant: "gold" },
  },
];

export const Default: Story = {
  name: "Default",
  render: function DefaultStory() {
    const [page, setPage] = React.useState(2);
    return (
      <TableCard className="max-w-4xl">
        <TableScrollArea>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Purchases</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
                <TableHead intent="checkbox">
                  <span className="sr-only">More</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PRODUCT_ROWS.map((row, index) => (
                <TableRow key={`${row.name}-${index}`}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <TableCellGroup>
                      <TableMediaThumbnail src={TABLE_MEDIA_SRC} alt="" />
                      <ChevronDownIcon
                        className="size-4 shrink-0 text-content-primary"
                        aria-hidden
                      />
                    </TableCellGroup>
                  </TableCell>
                  <TableCell>{row.created}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.purchases}</TableCell>
                  <TableCell>
                    <Pill variant={row.status.variant}>{row.status.label}</Pill>
                  </TableCell>
                  <TableCell>
                    <Button variant="secondary" size="32">
                      Copy
                    </Button>
                  </TableCell>
                  <TableCell intent="checkbox">
                    <IconButton
                      variant="tertiary"
                      size="32"
                      icon={<MoreVerticalIcon />}
                      aria-label="Row actions"
                    />
                  </TableCell>
                </TableRow>
              ))}
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

export const WithToolbar: Story = {
  name: "With toolbar (bulk select)",
  render: function WithToolbarStory() {
    const [page, setPage] = React.useState(2);
    return (
      <TableCard className="max-w-4xl">
        <TableToolbar>
          <span className="typography-regular-body-sm text-content-primary">2 selected</span>
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
                  <Checkbox size="16" aria-label="Select all rows" />
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
                      <Checkbox size="16" aria-label={`Select row ${date}`} />
                    </TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell intent="multiline">
                      <TableLineClamp>
                        Placeholder description text for this row.{" "}
                        <button type="button" className="typography-semibold-body-sm">
                          Read more
                        </button>
                      </TableLineClamp>
                    </TableCell>
                    <TableCell>
                      <TableCellGroup>
                        <TableMediaThumbnail src={TABLE_MEDIA_SRC} alt="" />
                        <span>5</span>
                        <ChevronDownIcon
                          className="size-4 shrink-0 text-content-primary"
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
                          className="size-4 shrink-0 text-content-primary"
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

export const Sortable: Story = {
  name: "Sortable header",
  render: function SortableStory() {
    type Direction = "asc" | "desc" | null;
    const Demo = () => {
      const [direction, setDirection] = React.useState<Direction>("asc");
      const next: Record<NonNullable<Direction>, Direction> = { asc: "desc", desc: null };
      const cycle = () => setDirection((d) => (d == null ? "asc" : next[d]));
      return (
        <TableCard className="max-w-2xl">
          <TableScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button type="button" onClick={cycle} className="cursor-pointer">
                      <TableSortLabel direction={direction}>Title</TableSortLabel>
                    </button>
                  </TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Quarterly review</TableCell>
                  <TableCell>Jane Doe</TableCell>
                  <TableCell>
                    <Pill variant="green">Active</Pill>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Roadmap planning</TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>
                    <Pill variant="gold">Warning</Pill>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableScrollArea>
        </TableCard>
      );
    };
    return <Demo />;
  },
};

export const LargeRows: Story = {
  name: "Variant — lg (80px rows)",
  render: function LargeRowsStory() {
    const [page, setPage] = React.useState(1);
    return (
      <TableCard size="lg" className="max-w-3xl">
        <TableScrollArea>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead intent="checkbox">
                  <Checkbox size="16" aria-label="Select all" />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Media</TableHead>
                <TableHead>Label</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell intent="checkbox">
                  <Checkbox size="16" aria-label="Select row" />
                </TableCell>
                <TableCell>
                  <TableCellContent primary="Sample label" secondary="Created today" />
                </TableCell>
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
  name: "Cell variants",
  parameters: { design: { type: "figma", url: V2_FIGMA_URL } },
  render: () => (
    <div className="flex max-w-3xl flex-col gap-10">
      <div>
        <p className="typography-semibold-body-md mb-3 text-content-primary">Header</p>
        <TableCard>
          <TableScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead intent="sort">
                    <TableSortLabel direction="asc">Sortable</TableSortLabel>
                  </TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </TableScrollArea>
        </TableCard>
      </div>

      <div>
        <p className="typography-semibold-body-md mb-3 text-content-primary">Body cells</p>
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
                    <Checkbox size="16" aria-label="Row select" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell intent="sideLabel">Text</TableCell>
                  <TableCell>Cell</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell intent="sideLabel">Cell + info</TableCell>
                  <TableCell intent="stacked">
                    <TableCellContent primary="Cell" secondary="Secondary line" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell intent="sideLabel">Cell + info (legacy)</TableCell>
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
                      <ChevronDownIcon className="size-4 shrink-0" aria-hidden />
                    </TableCellGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell intent="sideLabel">Pill</TableCell>
                  <TableCell>
                    <Pill variant="green">Active</Pill>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell intent="sideLabel">Badge</TableCell>
                  <TableCell>
                    <Badge variant="info">Badge</Badge>
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
                    <Avatar src={TABLE_MEDIA_SRC} alt="" fallback="U" size={24} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell intent="sideLabel">Media</TableCell>
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
                    <ShareIcon className="size-4 text-content-primary" aria-hidden />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell intent="sideLabel">More</TableCell>
                  <TableCell>
                    <TableCellGroup>
                      <MoreIcon className="size-4 text-content-primary" aria-hidden />
                      <MoreVerticalIcon className="size-4 text-content-primary" aria-hidden />
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

export const AllStatesV2: Story = {
  name: "All states (v2)",
  render: function AllStatesV2Story() {
    const [page, setPage] = React.useState(2);
    return (
      <TableCard className="max-w-5xl">
        <TableToolbar>
          <span className="typography-regular-body-sm text-content-primary">2 selected</span>
          <div className="flex flex-wrap gap-1">
            <Button variant="tertiary" size="32" leftIcon={<UsersIcon className="size-3.5" />}>
              Assign
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
                  <Checkbox size="16" aria-label="Select all rows" />
                </TableHead>
                <TableHead>
                  <TableSortLabel direction="asc">Product</TableSortLabel>
                </TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
                <TableHead intent="checkbox">
                  <span className="sr-only">More</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { status: "Active" as const, variant: "green" as const, progress: 80 },
                { status: "Warning" as const, variant: "gold" as const, progress: 40 },
                { status: "Inactive" as const, variant: "error" as const, progress: 10 },
              ].map((row, idx) => (
                <TableRow key={row.status}>
                  <TableCell intent="checkbox">
                    <Checkbox size="16" aria-label={`Select ${row.status}`} />
                  </TableCell>
                  <TableCell intent="stacked">
                    <TableCellContent primary="Product Name" secondary="SKU-00321" />
                  </TableCell>
                  <TableCell>
                    <TableCellGroup>
                      <Avatar src={TABLE_MEDIA_SRC} alt="" fallback={`U${idx}`} size={24} />
                      <span>@jane_doe</span>
                    </TableCellGroup>
                  </TableCell>
                  <TableCell>
                    <TableCellGroup>
                      <TableMediaThumbnail src={TABLE_MEDIA_SRC} alt="" />
                      <ChevronDownIcon
                        className="size-4 shrink-0 text-content-primary"
                        aria-hidden
                      />
                    </TableCellGroup>
                  </TableCell>
                  <TableCell>16 May, 01:15 AM</TableCell>
                  <TableCell>
                    <Pill variant={row.variant}>{row.status}</Pill>
                  </TableCell>
                  <TableCell cellVariant="pillProgress">
                    <TablePillProgressLayout>
                      <Badge variant="special">{row.progress}%</Badge>
                      <TableProgressTrack value={row.progress} />
                    </TablePillProgressLayout>
                  </TableCell>
                  <TableCell>
                    <Button variant="secondary" size="32">
                      Copy
                    </Button>
                  </TableCell>
                  <TableCell intent="checkbox">
                    <IconButton
                      variant="tertiary"
                      size="32"
                      icon={<MoreVerticalIcon />}
                      aria-label="Row actions"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableScrollArea>
        <TablePagination
          leadingSlot={<TableRowsPerPageSelect id="v2-rows" />}
          paginationSlot={
            <Pagination className="pb-0" totalPages={5} currentPage={page} onPageChange={setPage} />
          }
          summary="20–30 of 100 rows"
        />
      </TableCard>
    );
  },
};

export const PaginationDesktop: Story = {
  name: "Pagination — desktop",
  render: function PaginationDesktopStory() {
    const [page, setPage] = React.useState(2);
    return (
      <div className="w-full max-w-[628px] rounded-3xl border border-border-strong">
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
  render: function PaginationMobileStory() {
    const [page, setPage] = React.useState(2);
    return (
      <TablePagination
        layout="mobile"
        className="max-w-sm rounded-3xl border border-border-strong"
        leadingSlot={<TableRowsPerPageSelect id="mob-rows" />}
        paginationSlot={
          <Pagination className="pb-0" totalPages={5} currentPage={page} onPageChange={setPage} />
        }
        summary="20–30 of 100 rows"
      />
    );
  },
};
