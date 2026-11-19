import { type AnchorHTMLAttributes, Fragment, forwardRef, type ReactElement } from "react";
import { Accordion } from "../components/Accordion/Accordion";
import { AccordionContent } from "../components/Accordion/AccordionContent";
import { AccordionItem } from "../components/Accordion/AccordionItem";
import { AccordionTrigger } from "../components/Accordion/AccordionTrigger";
import { AudioPlayer } from "../components/AudioPlayer/AudioPlayer";
import { Autocomplete } from "../components/Autocomplete/Autocomplete";
import { Badge } from "../components/Badge/Badge";
import { Banner } from "../components/Banner/Banner";
import { BottomNavigation } from "../components/BottomNavigation/BottomNavigation";
import { BottomNavigationAction } from "../components/BottomNavigation/BottomNavigationAction";
import { Button } from "../components/Button/Button";
import { ChartLegendContent } from "../components/Chart/ChartLegend";
import { ChartLoadingOverlay } from "../components/Chart/ChartLoadingOverlay";
import { ChartContext } from "../components/Chart/useChart";
import { ChatEmbed } from "../components/ChatEmbed/ChatEmbed";
import { ChatInput } from "../components/ChatInput/ChatInput";
import { Chip } from "../components/Chip/Chip";
import { DatePicker } from "../components/DatePicker/DatePicker";
import { Dialog, DialogContent, DialogTitle } from "../components/Dialog/Dialog";
import { Drawer, DrawerContent, DrawerTitle } from "../components/Drawer/Drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/DropdownMenu/DropdownMenu";
import { DropdownMenuHeader } from "../components/DropdownMenu/DropdownMenuHeader";
import { DropdownMenuReorderItem } from "../components/DropdownMenu/DropdownMenuReorderItem";
import { EmptyState } from "../components/EmptyState/EmptyState";
import { ArrowUpRightIcon } from "../components/Icons/ArrowUpRightIcon";
import { Link } from "../components/Link/Link";
import { LiveStatus } from "../components/LiveStatus/LiveStatus";
import { Pill } from "../components/Pill/Pill";
import { ProfileOnlineStatus } from "../components/ProfileOnlineStatus/ProfileOnlineStatus";
import { ProgressBar } from "../components/ProgressBar/ProgressBar";
import { RatingSummary } from "../components/RatingSummary/RatingSummary";
import { ReviewCard } from "../components/ReviewCard/ReviewCard";
import { Select, SelectContent, SelectItem } from "../components/Select/Select";
import { Snackbar } from "../components/Snackbar/Snackbar";
import { TableCellContent, TableSortLabel } from "../components/Table/Table";
import { TableCardPagination } from "../components/Table/TablePagination";
import { Tabs } from "../components/Tabs/Tabs";
import { TabsList } from "../components/Tabs/TabsList";
import { TabsOverflow, TabsOverflowItem } from "../components/Tabs/TabsOverflow";
import { TabsTrigger } from "../components/Tabs/TabsTrigger";
import { Toast, ToastProvider, ToastViewport } from "../components/Toast/Toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/Tooltip/Tooltip";
import { TrendPill } from "../components/TrendPill/TrendPill";
import { UserHandle } from "../components/UserHandle/UserHandle";

const RouterLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(
  (props, ref) => <a ref={ref} {...props} />,
);

export const translationCases: [string, (changed: boolean) => ReactElement][] = [
  [
    "DatePicker changes month",
    (changed) => <DatePicker mode="single" month={new Date(2026, changed ? 1 : 0, 1)} />,
  ],
  [
    "Tooltip gains a title",
    (changed) => (
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Help</TooltipTrigger>
          <TooltipContent title={changed ? "Heading" : undefined}>Details</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  ],
  [
    "EmptyState action becomes markup",
    (changed) => (
      <EmptyState
        title="Empty"
        primaryAction={changed ? <button type="button">Continue</button> : "Continue"}
      />
    ),
  ],
  [
    "Banner app store text action clears",
    (changed) => (
      <Banner variant="appStore1" title="Guide" textAction={changed ? null : "Read more"} />
    ),
  ],
  [
    "Banner feature text action clears",
    (changed) => (
      <Banner variant="whatsNew" title="Feature" textAction={changed ? null : "Read more"} />
    ),
  ],
  ...([Badge, Pill, Link, Chip] as const).map(
    (Component): [string, (changed: boolean) => ReactElement] => [
      `${Component.displayName} slotted text becomes markup`,
      (changed) => (
        <Component asChild>
          <a href="#example">{changed ? <b>Updated</b> : "Label"}</a>
        </Component>
      ),
    ],
  ),
  [
    "BottomNavigationAction slotted text becomes markup",
    (changed) => (
      <BottomNavigation>
        <BottomNavigationAction value="a" icon={<svg />} asChild>
          <a href="#example">{changed ? <b>Home</b> : "Home"}</a>
        </BottomNavigationAction>
      </BottomNavigation>
    ),
  ],
  [
    "DropdownMenuItem slotted text becomes markup",
    (changed) => (
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <a href="#example">{changed ? <b>Action</b> : "Action"}</a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  ],
  [
    "Button slotted loading",
    (changed) => (
      <Button asChild loading={changed}>
        <a href="#example">Save</a>
      </Button>
    ),
  ],
  [
    "ChatInput toolbar text clears",
    (changed) => <ChatInput toolbarRight={changed ? null : "Ready"} />,
  ],
  [
    "ChatEmbed badge becomes markup",
    (changed) => (
      <ChatEmbed
        variant="experience"
        title="Example"
        category="Audio"
        badge={changed ? <b>Live</b> : "Live"}
      />
    ),
  ],
  [
    "Snackbar primary slot becomes markup",
    (changed) => (
      <Snackbar primarySlot={changed ? <button type="button">Action</button> : "Action"}>
        Notice
      </Snackbar>
    ),
  ],
  [
    "Snackbar welcome secondary slot becomes markup",
    (changed) => (
      <Snackbar
        variant="welcome"
        title="Welcome"
        primaryLabel="Continue"
        secondarySlot={changed ? <button type="button">Later</button> : "Later"}
      />
    ),
  ],
  [
    "DropdownMenuHeader action clears",
    (changed) => <DropdownMenuHeader title="Menu" actions={changed ? null : "Done"} showClose />,
  ],
  [
    "BottomNavigation changes active action",
    (changed) => (
      <BottomNavigation hasInformationArchitectureNav value={changed ? "b" : "a"}>
        <BottomNavigationAction icon={<svg />} value="a" label="First" />
        <BottomNavigationAction icon={<svg />} value="b" label="Second" />
      </BottomNavigation>
    ),
  ],
  [
    "TabsList changes active tab",
    (changed) => (
      <Tabs value={changed ? "b" : "a"}>
        <TabsList>
          <TabsTrigger value="a">First</TabsTrigger>
          <TabsTrigger value="b">Second</TabsTrigger>
        </TabsList>
      </Tabs>
    ),
  ],
  [
    "Dialog plain content becomes markup",
    (changed) => (
      <Dialog open>
        <DialogContent aria-label="Example" aria-describedby={undefined}>
          <DialogTitle>Example</DialogTitle>
          {changed ? <p>Updated</p> : "Content"}
        </DialogContent>
      </Dialog>
    ),
  ],
  [
    "Drawer plain content becomes markup",
    (changed) => (
      <Drawer open>
        <DrawerContent aria-label="Example" aria-describedby={undefined}>
          <DrawerTitle>Example</DrawerTitle>
          {changed ? <p>Updated</p> : "Content"}
        </DrawerContent>
      </Drawer>
    ),
  ],
  [
    "Toast custom content clears",
    (changed) => (
      <ToastProvider>
        <Toast open title="Notice">
          {changed ? null : "Details"}
        </Toast>
        <ToastViewport />
      </ToastProvider>
    ),
  ],
  [
    "ChartLoadingOverlay content becomes markup",
    (changed) => (
      <ChartLoadingOverlay>{changed ? <div>Chart</div> : "Waiting"}</ChartLoadingOverlay>
    ),
  ],
  [
    "TableCellContent primary adornment clears",
    (changed) => <TableCellContent primary="Name" primaryAdornment={changed ? null : "New"} />,
  ],
  [
    "TableCellContent secondary adornment clears",
    (changed) => (
      <TableCellContent
        primary="Name"
        secondary="Details"
        secondaryAdornment={changed ? null : "New"}
      />
    ),
  ],
  [
    "DropdownMenuReorderItem label becomes markup",
    (changed) => (
      <DropdownMenuReorderItem value="a">{changed ? <b>New</b> : "Name"}</DropdownMenuReorderItem>
    ),
  ],
  [
    "ProgressBar updates completion",
    (changed) => <ProgressBar value={changed ? 80 : 20} showCompletion />,
  ],
  [
    "AudioPlayer duration changes",
    (changed) => <AudioPlayer src="/example.mp3" duration={changed ? 20 : 10} />,
  ],
  [
    "Autocomplete selected value changes",
    (changed) => (
      <Autocomplete
        label="Choice"
        options={[
          { value: "a", label: "Alpha" },
          { value: "b", label: "Beta" },
        ]}
        value={changed ? "b" : "a"}
      />
    ),
  ],
  [
    "Accordion opens",
    (changed) => (
      <Accordion type="single" value={changed ? "a" : ""}>
        <AccordionItem value="a">
          <AccordionTrigger>Title</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  ],

  [
    "LiveStatus label becomes rich content",
    (changed) => <LiveStatus>{changed ? <b>Ended</b> : "Live"}</LiveStatus>,
  ],
  [
    "ProfileOnlineStatus label clears",
    (changed) => <ProfileOnlineStatus label={changed ? "" : "Online"} />,
  ],
  [
    "TrendPill label becomes rich content",
    (changed) => <TrendPill trend="positive" label={changed ? <b>Updated</b> : "Increase"} />,
  ],
  ["UserHandle clears", (changed) => <UserHandle>{changed ? null : "username"}</UserHandle>],
  [
    "TableSortLabel label becomes rich content",
    (changed) => <TableSortLabel direction="asc">{changed ? <b>Name</b> : "Name"}</TableSortLabel>,
  ],
  [
    "TableSortLabel adds sort arrows",
    (changed) => <TableSortLabel direction={changed ? "asc" : null}>Name</TableSortLabel>,
  ],
  [
    "TableCardPagination formatter clears",
    (changed) => (
      <TableCardPagination
        page={1}
        pageCount={2}
        pageSize={10}
        pageSizeOptions={[10, 20]}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        formatPageSize={() => (changed ? "" : "Ten rows")}
      />
    ),
  ],
  [
    "ChatInput selected label clears",
    (changed) => (
      <ChatInput
        selectOptions={[{ value: "a", label: changed ? "" : "Model A" }]}
        selectValue="a"
      />
    ),
  ],
  [
    "ChatInput adds selected icon",
    (changed) => (
      <ChatInput
        selectOptions={[
          { value: "a", label: "Model A", icon: changed ? <svg aria-hidden="true" /> : undefined },
        ]}
        selectValue="a"
      />
    ),
  ],
  [
    "ChartLegend config label clears",
    (changed) => (
      <ChartContext.Provider value={{ config: { a: { label: changed ? undefined : "Revenue" } } }}>
        <ChartLegendContent payload={[{ value: "a", dataKey: "a", color: "red" }]} />
      </ChartContext.Provider>
    ),
  ],
  [
    "RatingSummary count formatter clears",
    (changed) => (
      <RatingSummary
        distribution={[{ rating: 5, count: 1 }]}
        formatCount={() => (changed ? "" : "One review")}
      />
    ),
  ],
  [
    "ReviewCard author becomes rich content",
    (changed) => <ReviewCard rating={5} author={changed ? <b>Jane Doe</b> : "Jane Doe"} />,
  ],
  ["Button loading", (changed) => <Button loading={changed}>Save</Button>],
  [
    "Badge label becomes rich content",
    (changed) => <Badge>{changed ? <b>Updated</b> : "Label"}</Badge>,
  ],
  [
    "Pill label becomes rich content",
    (changed) => <Pill>{changed ? <b>Updated</b> : "Label"}</Pill>,
  ],
  [
    "TabsOverflow label becomes rich content",
    (changed) => (
      <Tabs defaultValue="first">
        <TabsList>
          <TabsOverflow label={changed ? <b>More</b> : "More"}>
            <TabsOverflowItem value="extra">Extra</TabsOverflowItem>
          </TabsOverflow>
        </TabsList>
      </Tabs>
    ),
  ],
  [
    "Select selected label drops its count",
    (changed) => (
      <Select label="Basket" defaultValue="cart">
        <SelectContent>
          <SelectItem value="cart">Cart{changed ? null : " (1)"}</SelectItem>
        </SelectContent>
      </Select>
    ),
  ],
  [
    "Select selected label count changes",
    (changed) => (
      <Select label="Basket" defaultValue="cart">
        <SelectContent>
          <SelectItem value="cart">Cart ({changed ? 2 : 1})</SelectItem>
        </SelectContent>
      </Select>
    ),
  ],
  [
    "ChartLoadingOverlay fragment text clears",
    (changed) => (
      <ChartLoadingOverlay>
        <Fragment key="status">
          Loading{changed ? null : " data"}
          <b>!</b>
        </Fragment>
      </ChartLoadingOverlay>
    ),
  ],
  [
    "Pill asChild native label drops its count",
    (changed) => (
      <Pill asChild>
        <a href="/items">Items{changed ? null : " (3)"}</a>
      </Pill>
    ),
  ],
  [
    "Link asChild router link label span changes",
    (changed) => (
      <Link asChild rightIcon={<ArrowUpRightIcon />}>
        <RouterLink href="/plans">
          <span>{changed ? "See our plans" : "See our plans (new)"}</span>
        </RouterLink>
      </Link>
    ),
  ],
  [
    "TooltipContent asChild text clears",
    (changed) => (
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Help</TooltipTrigger>
          <TooltipContent asChild>
            <div>Details{changed ? null : " (beta)"}</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  ],
  [
    "Select option description drops its count",
    (changed) => (
      <Select label="Plan" defaultValue="team">
        <SelectContent>
          <SelectItem
            value="team"
            description={
              <Fragment key="seats">
                Seats{changed ? null : " (2)"}
                <b>!</b>
              </Fragment>
            }
          >
            Team
          </SelectItem>
        </SelectContent>
      </Select>
    ),
  ],
  [
    "Link label drops its count",
    (changed) => (
      <Link href="/items">
        Items{changed ? null : " (3)"}
        <b>!</b>
      </Link>
    ),
  ],
  [
    "UserHandle rich content drops its suffix",
    (changed) => (
      <UserHandle>
        <Fragment key="handle">
          jane{changed ? null : "_doe"}
          <b>!</b>
        </Fragment>
      </UserHandle>
    ),
  ],
];
