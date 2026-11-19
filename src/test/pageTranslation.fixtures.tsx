import { type AnchorHTMLAttributes, Fragment, forwardRef, type ReactElement } from "react";
import { Accordion } from "../components/Accordion/Accordion";
import { AccordionContent } from "../components/Accordion/AccordionContent";
import { AccordionItem } from "../components/Accordion/AccordionItem";
import { AccordionTrigger } from "../components/Accordion/AccordionTrigger";
import { Alert } from "../components/Alert/Alert";
import { AudioPlayer } from "../components/AudioPlayer/AudioPlayer";
import { Autocomplete } from "../components/Autocomplete/Autocomplete";
import { Badge } from "../components/Badge/Badge";
import { Banner } from "../components/Banner/Banner";
import { BottomNavigation } from "../components/BottomNavigation/BottomNavigation";
import { BottomNavigationAction } from "../components/BottomNavigation/BottomNavigationAction";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "../components/Breadcrumb/Breadcrumb";
import { Button } from "../components/Button/Button";
import { Card, CardDescription, CardFooter, CardTitle } from "../components/Card/Card";
import { ChartCard } from "../components/Chart/ChartCard";
import { ChartLegendContent } from "../components/Chart/ChartLegend";
import { ChartLoadingOverlay } from "../components/Chart/ChartLoadingOverlay";
import { ChartPieLegend } from "../components/Chart/ChartPieLegend";
import { ChartTooltipContent } from "../components/Chart/ChartTooltip";
import { ChartContext } from "../components/Chart/useChart";
import { ChatEmbed, ChatEmbedUnavailable } from "../components/ChatEmbed/ChatEmbed";
import { ChatInput } from "../components/ChatInput/ChatInput";
import { ChatMessage } from "../components/ChatMessage/ChatMessage";
import { Chip } from "../components/Chip/Chip";
import { Count } from "../components/Count/Count";
import { CreatorCard } from "../components/CreatorCard/CreatorCard";
import { CreatorTile } from "../components/CreatorTile/CreatorTile";
import { CriticalBanner } from "../components/CriticalBanner/CriticalBanner";
import { DatePicker } from "../components/DatePicker/DatePicker";
import { Demographics } from "../components/Demographics/Demographics";
import { Dialog, DialogContent, DialogTitle } from "../components/Dialog/Dialog";
import { Drawer, DrawerContent, DrawerTitle } from "../components/Drawer/Drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/DropdownMenu/DropdownMenu";
import { DropdownMenuHeader } from "../components/DropdownMenu/DropdownMenuHeader";
import { DropdownMenuReorderItem } from "../components/DropdownMenu/DropdownMenuReorderItem";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../components/DropdownMenu/DropdownMenuSelectionItems";
import { EmptyState } from "../components/EmptyState/EmptyState";
import { ArrowUpRightIcon } from "../components/Icons/ArrowUpRightIcon";
import { InfoBox, InfoBoxContent, InfoBoxTrigger } from "../components/InfoBox/InfoBox";
import { Link } from "../components/Link/Link";
import { LiveStatus } from "../components/LiveStatus/LiveStatus";
import { PhoneField } from "../components/PhoneField/PhoneField";
import { Pill } from "../components/Pill/Pill";
import { ProfileOnlineStatus } from "../components/ProfileOnlineStatus/ProfileOnlineStatus";
import { ProgressBar } from "../components/ProgressBar/ProgressBar";
import { RatingSummary } from "../components/RatingSummary/RatingSummary";
import { ReviewCard } from "../components/ReviewCard/ReviewCard";
import { Select, SelectContent, SelectItem } from "../components/Select/Select";
import { Snackbar } from "../components/Snackbar/Snackbar";
import { SubscribeButton } from "../components/SubscribeButton/SubscribeButton";
import { TableCellContent, TableSortLabel, TableToolbarAction } from "../components/Table/Table";
import { TableMobileRow } from "../components/Table/TableMobileRow";
import { TableCardPagination } from "../components/Table/TablePagination";
import { Tabs } from "../components/Tabs/Tabs";
import { TabsList } from "../components/Tabs/TabsList";
import { TabsOverflow, TabsOverflowItem } from "../components/Tabs/TabsOverflow";
import { TabsTrigger } from "../components/Tabs/TabsTrigger";
import { TextField } from "../components/TextField/TextField";
import { Toast, ToastProvider, ToastViewport } from "../components/Toast/Toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/Tooltip/Tooltip";
import { TooltipLabel } from "../components/Tooltip/TooltipLabel";
import { TrendPill } from "../components/TrendPill/TrendPill";
import { UndoAlertPrompt } from "../components/UndoAlertPrompt/UndoAlertPrompt";
import { UserDisplayName } from "../components/UserDisplayName/UserDisplayName";
import { UserHandle } from "../components/UserHandle/UserHandle";
import { UserItem } from "../components/UserItem/UserItem";
import { UserItemTrailing } from "../components/UserItem/UserItemTrailing";

const RouterLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(
  (props, ref) => <a ref={ref} {...props} />,
);

const richLabel = (changed: boolean) => (
  <Fragment key="rich">
    Details{changed ? null : " (2)"}
    <b>!</b>
  </Fragment>
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
  [
    "DropdownMenuItem rich label drops its count",
    (changed) => (
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuItem>{richLabel(changed)}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  ],
  [
    "LiveStatus rich label drops its count",
    (changed) => <LiveStatus>{richLabel(changed)}</LiveStatus>,
  ],
  ["Badge rich label drops its count", (changed) => <Badge>{richLabel(changed)}</Badge>],
  ["Pill rich label drops its count", (changed) => <Pill>{richLabel(changed)}</Pill>],
  [
    "ReviewCard rich author drops its count",
    (changed) => <ReviewCard rating={4} author={richLabel(changed)} />,
  ],
  [
    "TableCellContent rich lines drop their count",
    (changed) => <TableCellContent primary={richLabel(changed)} secondary={richLabel(changed)} />,
  ],
  [
    "Toast rich description drops its count",
    (changed) => (
      <ToastProvider>
        <Toast open title="Saved" description={richLabel(changed)} />
        <ToastViewport />
      </ToastProvider>
    ),
  ],
  [
    "Banner rich description drops its count",
    (changed) => <Banner variant="whatsNew" title="New" description={richLabel(changed)} />,
  ],
  [
    "Button asChild mixed label enters loading",
    (changed) => (
      <Button asChild loading={changed}>
        <a href="#example">Save{" changes"}</a>
      </Button>
    ),
  ],
  [
    "Button loading rich label drops its count",
    (changed) => <Button loading>{richLabel(changed)}</Button>,
  ],
  [
    "TabsTrigger label drops its count",
    (changed) => (
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Inbox{changed ? null : " (2)"}</TabsTrigger>
        </TabsList>
      </Tabs>
    ),
  ],
  [
    "TabsTrigger asChild label drops its count",
    (changed) => (
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a" asChild>
            <a href="#inbox">Inbox{changed ? null : " (2)"}</a>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    ),
  ],
  [
    "TabsList text child clears",
    (changed) => (
      <Tabs defaultValue="a">
        <TabsList>
          {changed ? null : "Loading"}
          <TabsTrigger value="a">First</TabsTrigger>
        </TabsList>
      </Tabs>
    ),
  ],
  [
    "BottomNavigation text child clears",
    (changed) => (
      <BottomNavigation hasInformationArchitectureNav value="a">
        {changed ? null : "Loading"}
        <BottomNavigationAction icon={<svg />} value="a" label="First" />
      </BottomNavigation>
    ),
  ],
  [
    "Select text child clears",
    (changed) => (
      <Select label="Country">
        {changed ? null : "Loading"}
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
        </SelectContent>
      </Select>
    ),
  ],
  ["ChatMessage body drops a phrase", (changed) => <ChatMessage message={richLabel(changed)} />],
  [
    "ChartTooltip range becomes a single value",
    (changed) => (
      <ChartContext.Provider value={{ config: {} }}>
        <ChartTooltipContent
          active
          payload={[{ graphicalItemId: "a", name: "a", dataKey: "a", value: changed ? 5 : [1, 2] }]}
        />
      </ChartContext.Provider>
    ),
  ],
  [
    "ChartTooltip config label drops its count",
    (changed) => (
      <ChartContext.Provider value={{ config: { a: { label: richLabel(changed) } } }}>
        <ChartTooltipContent
          active
          payload={[{ graphicalItemId: "a", name: "a", dataKey: "a", value: 5 }]}
        />
      </ChartContext.Provider>
    ),
  ],
  [
    "ChartTooltip formatters drop their count",
    (changed) => (
      <ChartContext.Provider value={{ config: {} }}>
        <ChartTooltipContent
          active
          payload={[{ graphicalItemId: "a", name: "a", dataKey: "a", value: 5 }]}
          labelFormatter={() => richLabel(changed)}
          formatter={() => richLabel(changed)}
        />
      </ChartContext.Provider>
    ),
  ],
  [
    "ChartPieLegend text icon becomes markup",
    (changed) => (
      <ChartPieLegend
        items={[{ label: "Tips", value: 1, color: "red", icon: changed ? <b>*</b> : "T" }]}
      />
    ),
  ],
  [
    "ChartPieLegend rich label drops its count",
    (changed) => (
      <ChartPieLegend
        items={[
          { label: richLabel(changed), value: 1, formattedValue: richLabel(changed), color: "red" },
        ]}
      />
    ),
  ],
  [
    "ChartCard rich text drops its count",
    (changed) => (
      <ChartCard
        title={richLabel(changed)}
        subtitle={richLabel(changed)}
        dateInfo={richLabel(changed)}
        trendChip={{ label: richLabel(changed), trend: "positive" }}
      />
    ),
  ],
  [
    "Count rich content drops its count",
    (changed) => <Count value={1}>{richLabel(changed)}</Count>,
  ],
  [
    "Count asChild label drops its count",
    (changed) => (
      <Count asChild value={1}>
        <a href="#new">New{changed ? null : " (2)"}</a>
      </Count>
    ),
  ],
  [
    "EmptyState rich text drops its count",
    (changed) => <EmptyState title={richLabel(changed)} description={richLabel(changed)} />,
  ],
  [
    "EmptyState numeric action becomes markup",
    (changed) => (
      <EmptyState
        title="Empty"
        primaryAction={changed ? <button type="button">Continue</button> : 5}
        secondaryAction="Later"
      />
    ),
  ],
  [
    "UserItem primary text becomes markup",
    (changed) => (
      <UserItem
        user={{ displayName: "Jane Doe", handle: "jane_doe" }}
        showAvatar={false}
        primary={changed ? <b>Jane</b> : "Jane"}
        secondary="Online"
      />
    ),
  ],
  [
    "UserItem rich secondary drops its count",
    (changed) => (
      <UserItem
        user={{ displayName: "Jane Doe", handle: "jane_doe" }}
        showAvatar={false}
        secondary={richLabel(changed)}
        trailing={<UserItemTrailing value={richLabel(changed)} meta={richLabel(changed)} />}
      />
    ),
  ],
  [
    "UserDisplayName rich name drops its count",
    (changed) => <UserDisplayName>{richLabel(changed)}</UserDisplayName>,
  ],
  [
    "TooltipLabel rich label drops its count",
    (changed) => <TooltipLabel tooltip="Help">{richLabel(changed)}</TooltipLabel>,
  ],
  [
    "Accordion rich text drops its count",
    (changed) => (
      <Accordion type="single" defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger description={richLabel(changed)}>{richLabel(changed)}</AccordionTrigger>
          <AccordionContent>{richLabel(changed)}</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  ],
  ["Alert rich message drops its count", (changed) => <Alert>{richLabel(changed)}</Alert>],
  [
    "Card rich title and description drop their count",
    (changed) => (
      <Card>
        <CardTitle>{richLabel(changed)}</CardTitle>
        <CardDescription>{richLabel(changed)}</CardDescription>
      </Card>
    ),
  ],
  [
    "Banner rich secondary line drops its count",
    (changed) => <Banner variant="Subtle" title="New" secondaryLine={richLabel(changed)} />,
  ],
  [
    "Banner rich eyebrow drops its count",
    (changed) => <Banner variant="Default" title="New" eyebrow={richLabel(changed)} />,
  ],
  [
    "Breadcrumb rich separator drops its count",
    (changed) => (
      <Breadcrumb>
        <BreadcrumbList separator={richLabel(changed)}>
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem>Settings</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
  ],
  [
    "ChatEmbed rich text drops its count",
    (changed) => (
      <ChatEmbed
        variant="experience"
        title={richLabel(changed)}
        subtitle={richLabel(changed)}
        category={richLabel(changed)}
        meta={richLabel(changed)}
      />
    ),
  ],
  [
    "ChatEmbed creator rich text drops its count",
    (changed) => (
      <ChatEmbed variant="creator" title={richLabel(changed)} subtitle={richLabel(changed)} />
    ),
  ],
  [
    "ChatEmbedUnavailable rich message drops its count",
    (changed) => <ChatEmbedUnavailable>{richLabel(changed)}</ChatEmbedUnavailable>,
  ],
  [
    "DropdownMenu rich rows drop their count",
    (changed) => (
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuHeader>{richLabel(changed)}</DropdownMenuHeader>
          <DropdownMenuItem count={richLabel(changed)}>Inbox</DropdownMenuItem>
          <DropdownMenuCheckboxItem checked>{richLabel(changed)}</DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value="a">
            <DropdownMenuRadioItem value="a">{richLabel(changed)}</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  ],
  [
    "DropdownMenuReorderItem rich label drops its count",
    (changed) => <DropdownMenuReorderItem value="a">{richLabel(changed)}</DropdownMenuReorderItem>,
  ],
  [
    "CreatorCard rich text drops its count",
    (changed) => (
      <CreatorCard background={<div />} name={richLabel(changed)} tagline={richLabel(changed)} />
    ),
  ],
  [
    "CreatorTile rich text drops its count",
    (changed) => (
      <CreatorTile background={<div />} name={richLabel(changed)} tagline={richLabel(changed)} />
    ),
  ],
  [
    "CriticalBanner rich text drops its count",
    (changed) => <CriticalBanner title={richLabel(changed)}>{richLabel(changed)}</CriticalBanner>,
  ],
  [
    "ProgressBar rich text drops its count",
    (changed) => (
      <ProgressBar
        value={50}
        title={richLabel(changed)}
        stepsLabel={richLabel(changed)}
        helperLeft={richLabel(changed)}
        helperRight={richLabel(changed)}
      />
    ),
  ],
  [
    "Demographics rich value drops its count",
    (changed) => <Demographics label="Italy" value={50} formattedValue={richLabel(changed)} />,
  ],
  [
    "InfoBox rich text drops its count",
    (changed) => (
      <InfoBox open>
        <InfoBoxTrigger>Open</InfoBoxTrigger>
        <InfoBoxContent heading={richLabel(changed)}>{richLabel(changed)}</InfoBoxContent>
      </InfoBox>
    ),
  ],
  [
    "PhoneField rich dial code drops its count",
    (changed) => <PhoneField label="Phone" dialCode={richLabel(changed)} />,
  ],
  [
    "TextField rich side label drops its count",
    (changed) => <TextField label="Amount" leftLabel={richLabel(changed)} />,
  ],
  [
    "ReviewCard rich text drops its count",
    (changed) => (
      <ReviewCard rating={4} title={richLabel(changed)}>
        {richLabel(changed)}
      </ReviewCard>
    ),
  ],
  [
    "SubscribeButton rich label drops its count",
    (changed) => <SubscribeButton price="$9.99">{richLabel(changed)}</SubscribeButton>,
  ],
  [
    "TableToolbarAction rich label drops its count",
    (changed) => <TableToolbarAction>{richLabel(changed)}</TableToolbarAction>,
  ],
  [
    "TableMobileRow rich text drops its count",
    (changed) => <TableMobileRow title={richLabel(changed)} description={richLabel(changed)} />,
  ],
  [
    "UndoAlertPrompt rich title drops its count",
    (changed) => (
      <ToastProvider>
        <UndoAlertPrompt open title={richLabel(changed)} onUndo={() => {}} />
        <ToastViewport />
      </ToastProvider>
    ),
  ],
  [
    "Autocomplete custom rows drop their count",
    (changed) => (
      <Autocomplete
        label="City"
        open
        options={[{ value: "a", label: "Alpha", groupId: "g" }]}
        groups={[{ id: "g", label: "Group" }]}
        renderOption={() => richLabel(changed)}
        renderGroupHeading={() => richLabel(changed)}
      />
    ),
  ],
  [
    "BottomNavigation text beside an action clears",
    (changed) => (
      <BottomNavigation value="a">
        {changed ? null : "Quick links"}
        <BottomNavigationAction icon={<svg />} value="a" label="First" />
      </BottomNavigation>
    ),
  ],
  [
    "ChartCard zero subtitle becomes an amount",
    (changed) => <ChartCard title="Revenue" subtitle={changed ? "$100" : 0} />,
  ],
  [
    "ChartCard content value changes beside markup",
    (changed) => (
      <ChartCard title="Revenue">{[changed ? "200" : "100", <b key="unit">USD</b>]}</ChartCard>
    ),
  ],
  [
    "CardFooter value changes beside markup",
    (changed) => (
      <Card>
        <CardFooter>{[changed ? "200" : "100", <b key="unit">USD</b>]}</CardFooter>
      </Card>
    ),
  ],
  [
    "UserItem trailing value changes beside markup",
    (changed) => (
      <UserItem
        user={{ displayName: "Jane Doe", handle: "jane_doe" }}
        showAvatar={false}
        trailing={[changed ? "200" : "100", <b key="unit">USD</b>]}
      />
    ),
  ],
  [
    "Button bigint label changes beside an icon",
    (changed) => <Button rightIcon={<svg />}>{changed ? 6n : 5n}</Button>,
  ],
];
