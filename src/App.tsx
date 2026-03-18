import * as React from "react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { DatePicker } from "./date-picker";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AddIcon,
  AIIcon,
  Alert,
  AlertIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  AudioUpload,
  Autocomplete,
  Avatar,
  Badge,
  BankIcon,
  BellIcon,
  BellOffIcon,
  BoltIcon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BulbIcon,
  Button,
  CalendarIcon,
  CameraIcon,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ChartIcon,
  Checkbox,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  Chip,
  ClockIcon,
  CloseIcon,
  CodeIcon,
  CoinIcon,
  CompassIcon,
  CopyIcon,
  Count,
  CrossIcon,
  CrownIcon,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DiamondIcon,
  DiscountIcon,
  Divider,
  DonateIcon,
  DoubleTickIcon,
  DownloadIcon,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  EditIcon,
  ErrorCircleIcon,
  ErrorIcon,
  ExpandIcon,
  EyeIcon,
  EyeSlashIcon,
  FlagIcon,
  FlameIcon,
  FolderIcon,
  ForwardIcon,
  GalleryIcon,
  GenderIcon,
  GiftIcon,
  HelpIcon,
  HomeIcon,
  HourglassIcon,
  IconButton,
  ImageIcon,
  InboxIcon,
  InfoBox,
  InfoBoxContent,
  InfoBoxTrigger,
  InfoCircleIcon,
  InfoIcon,
  LinkIcon,
  Loader,
  LocationIcon,
  LockerOffIcon,
  LockerOnIcon,
  Logo,
  LogoutIcon,
  LoveIcon,
  MegaphoneIcon,
  MenuCloseIcon,
  MenuIcon,
  MenuOpenIcon,
  MessageIcon,
  MicrophoneIcon,
  MinusIcon,
  MobileStepper,
  MoonIcon,
  MoreIcon,
  MoreVerticalIcon,
  Pagination,
  PasswordField,
  PauseIcon,
  PhoneIcon,
  PhoneOffIcon,
  Pill,
  PinIcon,
  PlayIcon,
  PlusIcon,
  PrivacyIcon,
  ProgressBar,
  Radio,
  RadioGroup,
  RepeatIcon,
  Reply2Icon,
  ReplyIcon,
  SearchField,
  SearchIcon,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SendIcon,
  SettingsIcon,
  ShareIcon,
  Skeleton,
  Slider,
  Snackbar,
  SpinnerIcon,
  StarIcon,
  StopIcon,
  SuccessIcon,
  SunIcon,
  Support2Icon,
  SupportIcon,
  Switch,
  SwitchField,
  SwitchToggle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TagIcon,
  TaskIcon,
  TextArea,
  TextField,
  ThumbDownIcon,
  ThumbUpIcon,
  TickCircleIcon,
  TickCircleOffIcon,
  TickIcon,
  Toast,
  ToastProvider,
  ToastViewport,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TrashBinIcon,
  TrophyIcon,
  UploadIcon,
  UserCircleIcon,
  UserIcon,
  UsersIcon,
  VideoIcon,
  VipBadgeIcon,
  WalletIcon,
  WarningIcon,
  WarningTriangleIcon,
  WifiOffIcon,
  WifiOnIcon,
  WrenchIcon,
} from "./index";
import "./showcase.css";

function DatePickerShowcase() {
  const [singleDate, setSingleDate] = useState<Date | undefined>(new Date(2026, 1, 15));
  const [singleRange, setSingleRange] = useState<DateRange | undefined>({
    from: new Date(2026, 1, 9),
    to: new Date(2026, 1, 19),
  });
  const [doubleDate, setDoubleDate] = useState<Date | undefined>(new Date(2026, 1, 15));
  const [doubleRange, setDoubleRange] = useState<DateRange | undefined>({
    from: new Date(2026, 1, 9),
    to: new Date(2026, 2, 4),
  });

  return (
    <div className="flex flex-wrap items-start gap-8">
      <DatePicker
        mode="single"
        defaultMonth={new Date(2026, 1)}
        selected={singleDate}
        onSelect={setSingleDate}
      />
      <DatePicker
        mode="range"
        defaultMonth={new Date(2026, 1)}
        selected={singleRange}
        onSelect={setSingleRange}
      />
      <DatePicker
        mode="single"
        variant="double"
        defaultMonth={new Date(2026, 1)}
        selected={doubleDate}
        onSelect={setDoubleDate}
      />
      <DatePicker
        mode="range"
        variant="double"
        defaultMonth={new Date(2026, 1)}
        selected={doubleRange}
        onSelect={setDoubleRange}
      />
    </div>
  );
}

function SliderShowcase() {
  const [controlled, setControlled] = useState([50]);

  return (
    <div className="flex max-w-md flex-col gap-6">
      <Slider defaultValue={[50]} label="Label" minLabel="Min Value" maxLabel="Max Value" />
      <Slider defaultValue={[40]} label="Volume" labelPosition="top" minLabel="0" maxLabel="100" />
      <Slider defaultValue={[40]} label="Volume" labelPosition="left" minLabel="0" maxLabel="100" />
      <Slider defaultValue={[25]} label="Brightness" showTooltip minLabel="0%" maxLabel="100%" />
      <Slider
        defaultValue={[50]}
        label="Price"
        showTooltip
        min={0}
        max={1000}
        step={10}
        formatTooltip={(value: number) => `$${value}`}
      />
      <Slider defaultValue={[20, 80]} label="Price Range" minLabel="$0" maxLabel="$1000" />
      <Slider defaultValue={[50]} aria-label="No labels slider" />
      <Slider defaultValue={[30]} aria-label="Intensity" minLabel="Low" maxLabel="High" />
      <Slider defaultValue={[50]} label="Disabled Slider" minLabel="Min" maxLabel="Max" disabled />
      <Slider
        defaultValue={[50]}
        label="Rating"
        min={0}
        max={100}
        step={25}
        minLabel="0"
        maxLabel="100"
        showTooltip
      />
      <Slider
        value={controlled}
        onValueChange={setControlled}
        label="Controlled"
        showTooltip
        minLabel="0"
        maxLabel="100"
      />
      <Slider defaultValue={[60]} label="Speed" labelPosition="left" />
    </div>
  );
}

function PaginationShowcase() {
  const [defaultPage, setDefaultPage] = useState(2);
  const [manyPage, setManyPage] = useState(10);
  const [dotsPage, setDotsPage] = useState(2);
  const [dotsFewPage, setDotsFewPage] = useState(3);

  return (
    <div className="flex flex-col gap-6">
      <Pagination totalPages={5} currentPage={defaultPage} onPageChange={setDefaultPage} />
      <Pagination totalPages={20} currentPage={manyPage} onPageChange={setManyPage} />
      <Pagination totalPages={1} currentPage={1} />
      <Pagination
        variant="dots"
        totalPages={15}
        currentPage={dotsPage}
        onPageChange={setDotsPage}
      />
      <Pagination
        variant="dots"
        totalPages={5}
        currentPage={dotsFewPage}
        onPageChange={setDotsFewPage}
      />
    </div>
  );
}

function TextFieldShowcase() {
  const [value, setValue] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  return (
    <div id="textfield" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Text Field</h2>
      <TextField label="Size 48" placeholder="Placeholder" size="48" autoComplete="off" />
      <TextField label="Size 40" placeholder="Placeholder" size="40" autoComplete="off" />
      <TextField label="Size 32" placeholder="Placeholder" size="32" autoComplete="off" />
      <TextField
        label="With helper"
        placeholder="Placeholder"
        helperText="Helper text below"
        autoComplete="off"
      />
      <TextField placeholder="No label" aria-label="Search" autoComplete="off" />
      <TextField
        label="Validated"
        placeholder="Placeholder"
        validated
        defaultValue="user@example.com"
        autoComplete="off"
      />
      <TextField
        label="Validated with right icon"
        placeholder="Placeholder"
        validated
        rightIcon={<InfoCircleIcon />}
        defaultValue="user@example.com"
        autoComplete="off"
      />
      <TextField
        label="Left icon"
        leftIcon={<HomeIcon />}
        placeholder="Placeholder"
        autoComplete="off"
      />
      <TextField
        label="Right icon"
        rightIcon={<InfoCircleIcon />}
        placeholder="Placeholder"
        autoComplete="off"
      />
      <TextField
        label="Both icons"
        leftIcon={<HomeIcon />}
        rightIcon={<InfoCircleIcon />}
        placeholder="Placeholder"
        autoComplete="off"
      />
      <TextField
        label="Error"
        placeholder="Placeholder"
        error
        errorMessage="Error message"
        autoComplete="off"
      />
      <TextField label="Error + helper" error helperText="Required field" autoComplete="off" />
      <TextField label="Disabled" placeholder="Placeholder" disabled autoComplete="off" />
      <TextField
        label="Disabled with value"
        defaultValue="Cannot edit"
        disabled
        autoComplete="off"
      />
      <TextField
        label="Controlled Input"
        fullWidth
        placeholder="Placeholder"
        value={value}
        onChange={handleChange}
        autoComplete="off"
      />
    </div>
  );
}

function PasswordFieldShowcase() {
  const [value, setValue] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  return (
    <div id="passwordfield" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Password Field</h2>
      <PasswordField label="Size 48" placeholder="Enter password" size="48" autoComplete="off" />
      <PasswordField label="Size 40" placeholder="Enter password" size="40" autoComplete="off" />
      <PasswordField label="Size 32" placeholder="Enter password" size="32" autoComplete="off" />
      <PasswordField
        label="With helper"
        placeholder="Enter password"
        helperText="Must be at least 8 characters"
        autoComplete="off"
      />
      <PasswordField placeholder="No label" autoComplete="off" />
      <PasswordField
        label="Validated"
        placeholder="Enter password"
        validated
        defaultValue="securepassword123"
        autoComplete="off"
        helperText="Validation icon appears after the eye icon"
      />
      <PasswordField
        label="Error"
        placeholder="Enter password"
        error
        errorMessage="Password is required"
        autoComplete="off"
      />
      <PasswordField label="Error + helper" error helperText="Required field" autoComplete="off" />
      <PasswordField label="Disabled" placeholder="Enter password" disabled autoComplete="off" />
      <PasswordField
        label="Disabled with value"
        defaultValue="secretpassword"
        disabled
        autoComplete="off"
      />
      <PasswordField
        label="Controlled Input"
        fullWidth
        placeholder="Enter password"
        value={value}
        onChange={handleChange}
        autoComplete="off"
      />
    </div>
  );
}

function TextAreaShowcase() {
  const [value, setValue] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };
  return (
    <div id="textarea" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Text Area</h2>
      <div className="flex max-w-2xl flex-col gap-4">
        <TextArea label="Size 48" placeholder="Enter description..." size="48" />
        <TextArea label="Size 40" placeholder="Enter description..." size="40" />
        <TextArea label="Size 32" placeholder="Enter description..." size="32" />
        <TextArea
          label="With helper"
          placeholder="Enter description..."
          helperText="Maximum 500 characters"
        />
        <TextArea placeholder="No label" aria-label="Description" />
        <TextArea
          label="Validated"
          placeholder="Enter description..."
          validated
          defaultValue="This input has been validated"
        />
        <TextArea
          label="With min rows"
          placeholder="Enter description..."
          minRows={5}
          helperText="Starts with 5 rows"
        />
        <TextArea
          label="With max rows"
          placeholder="Try typing many lines..."
          maxRows={6}
          helperText="Maximum 6 rows, scrolls after"
        />
        <TextArea
          label="Min and max rows"
          placeholder="Enter description..."
          minRows={3}
          maxRows={8}
          helperText="Starts with 3 rows, max 8 rows"
        />
        <TextArea
          label="With clear button"
          placeholder="Enter description..."
          showClearButton
          defaultValue="This text can be cleared"
        />
        <TextArea
          label="Error"
          placeholder="Enter description..."
          error
          errorMessage="Description is required"
        />
        <TextArea label="Error + helper" error helperText="Required field" />
        <TextArea label="Disabled" placeholder="Enter description..." disabled />
        <TextArea
          label="Disabled with value"
          defaultValue="This textarea is disabled and cannot be edited"
          disabled
        />
        <TextArea
          label="Controlled Input"
          fullWidth
          placeholder="Enter description..."
          value={value}
          onChange={handleChange}
          showClearButton
          onClear={() => setValue("")}
        />
      </div>
    </div>
  );
}

function SearchFieldShowcase() {
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [minCharsValue, setMinCharsValue] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  return (
    <div id="searchfield" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Search Field</h2>
      <SearchField label="Size 48" placeholder="Search..." size="48" autoComplete="off" />
      <SearchField label="Size 40" placeholder="Search..." size="40" autoComplete="off" />
      <SearchField label="Size 32" placeholder="Search..." size="32" autoComplete="off" />
      <SearchField
        label="With helper"
        placeholder="Search..."
        helperText="Type to search"
        autoComplete="off"
      />
      <SearchField placeholder="No label" autoComplete="off" />
      <SearchField
        label="With clear button"
        placeholder="Search..."
        value={value}
        onChange={handleChange}
        onClear={() => setValue("")}
        autoComplete="off"
      />
      <SearchField
        label="Error"
        placeholder="Search..."
        error
        errorMessage="No results found"
        autoComplete="off"
      />
      <SearchField label="Disabled" placeholder="Search..." disabled autoComplete="off" />
      <SearchField
        label="Disabled with value"
        defaultValue="Cannot edit"
        disabled
        autoComplete="off"
      />
      <SearchField
        label="Debounced (300ms)"
        placeholder="Type and wait..."
        value={debouncedValue}
        onChange={(e) => setDebouncedValue(e.target.value)}
        onClear={() => setDebouncedValue("")}
        debounceMs={300}
        helperText={`Debounced value: "${debouncedValue}"`}
        autoComplete="off"
      />
      <SearchField
        label="Min 3 characters"
        placeholder="Type at least 3 chars..."
        value={minCharsValue}
        onChange={(e) => setMinCharsValue(e.target.value)}
        onClear={() => setMinCharsValue("")}
        minChars={3}
        helperText={`Value (fires after 3 chars): "${minCharsValue}"`}
        autoComplete="off"
      />
    </div>
  );
}

function ToastDemo() {
  // Toast state management
  const [toasts, setToasts] = useState({
    info: false,
    warning: false,
    success: false,
    error: false,
    withAction: false,
    noClose: false,
    titleOnly: false,
    longContent: false,
    messageToast: false,
  });

  const showToast = (type: keyof typeof toasts) => {
    setToasts((prev) => ({ ...prev, [type]: true }));
  };

  const hideToast = (type: keyof typeof toasts) => {
    setToasts((prev) => ({ ...prev, [type]: false }));
  };

  return (
    <div id="toast" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Toast</h2>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="40" onClick={() => showToast("info")}>
            Show Info Toast
          </Button>
          <Button variant="primary" size="40" onClick={() => showToast("warning")}>
            Show Warning Toast
          </Button>
          <Button variant="primary" size="40" onClick={() => showToast("success")}>
            Show Success Toast
          </Button>
          <Button variant="primary" size="40" onClick={() => showToast("error")}>
            Show Error Toast
          </Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="40" onClick={() => showToast("withAction")}>
            With Action Button
          </Button>
          <Button variant="secondary" size="40" onClick={() => showToast("noClose")}>
            No Close Button
          </Button>
          <Button variant="secondary" size="40" onClick={() => showToast("titleOnly")}>
            Title Only
          </Button>
          <Button variant="secondary" size="40" onClick={() => showToast("longContent")}>
            Long Content
          </Button>
          <Button variant="secondary" size="40" onClick={() => showToast("messageToast")}>
            Message Toast
          </Button>
        </div>
      </div>
      <Toast
        variant="info"
        title="Information"
        description="This is an informational message"
        open={toasts.info}
        onOpenChange={(open: boolean) => !open && hideToast("info")}
      />
      <Toast
        variant="warning"
        title="Warning"
        description="This is a warning message"
        open={toasts.warning}
        onOpenChange={(open: boolean) => !open && hideToast("warning")}
      />
      <Toast
        variant="success"
        title="Success"
        description="Operation completed successfully"
        open={toasts.success}
        onOpenChange={(open: boolean) => !open && hideToast("success")}
      />
      <Toast
        variant="error"
        title="Error"
        description="An error occurred while processing your request"
        open={toasts.error}
        onOpenChange={(open: boolean) => !open && hideToast("error")}
      />
      <Toast
        variant="info"
        title="Update available"
        description="A new version is available"
        onActionClick={() => hideToast("withAction")}
        actionLabel="Update"
        open={toasts.withAction}
        onOpenChange={(open: boolean) => !open && hideToast("withAction")}
      />
      <Toast
        variant="success"
        title="Success"
        description="Operation completed"
        showClose={false}
        open={toasts.noClose}
        onOpenChange={(open: boolean) => !open && hideToast("noClose")}
        duration={3000}
      />
      <Toast
        variant="info"
        title="Title Only Toast"
        open={toasts.titleOnly}
        onOpenChange={(open: boolean) => !open && hideToast("titleOnly")}
      />
      <Toast
        variant="warning"
        title="Warning: Important Information"
        description="This is a longer message that demonstrates how the toast component handles multiple lines of text and maintains its layout with proper spacing and readability."
        open={toasts.longContent}
        onOpenChange={(open: boolean) => !open && hideToast("longContent")}
      />
      <Toast
        variant="messageToast"
        title="New message"
        description="Hey! Just wanted to check in and see how things are going."
        avatarSrc="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
        avatarFallback="JD"
        open={toasts.messageToast}
        onOpenChange={(open: boolean) => !open && hideToast("messageToast")}
      />
      <ToastViewport />
    </div>
  );
}

function LogoDemo() {
  return (
    <div id="logo" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Logo</h2>
      <div className="flex flex-wrap items-start gap-8">
        <Logo variant="full" color="fullColour" />
        <Logo variant="icon" color="fullColour" />
        <Logo variant="portrait" color="fullColour" />
        <Logo variant="wordmark" color="fullColour" />
        <Logo variant="full" color="decolour" />
        <Logo variant="icon" color="decolour" />
        <Logo variant="portrait" color="decolour" />
        <Logo variant="wordmark" color="decolour" />
      </div>
      <div className="rounded-lg bg-white p-4">
        <div className="flex flex-wrap items-start gap-8">
          <Logo variant="full" color="blackAlways" />
          <Logo variant="icon" color="blackAlways" />
          <Logo variant="portrait" color="blackAlways" />
          <Logo variant="wordmark" color="blackAlways" />
        </div>
      </div>
      <div className="rounded-lg bg-neutral-solid p-4">
        <div className="flex flex-wrap items-start gap-8">
          <Logo variant="full" color="whiteAlways" />
          <Logo variant="icon" color="whiteAlways" />
          <Logo variant="portrait" color="whiteAlways" />
          <Logo variant="wordmark" color="whiteAlways" />
        </div>
      </div>
    </div>
  );
}

function IconsDemo() {
  const allIcons = [
    ["Add", AddIcon],
    ["AI", AIIcon],
    ["Alert", AlertIcon],
    ["ArrowDown", ArrowDownIcon],
    ["ArrowLeft", ArrowLeftIcon],
    ["ArrowRight", ArrowRightIcon],
    ["ArrowUp", ArrowUpIcon],
    ["ArrowUpRight", ArrowUpRightIcon],
    ["Bank", BankIcon],
    ["Bell", BellIcon],
    ["BellOff", BellOffIcon],
    ["Bolt", BoltIcon],
    ["Bulb", BulbIcon],
    ["Calendar", CalendarIcon],
    ["Camera", CameraIcon],
    ["Chart", ChartIcon],
    ["CheckCircle", CheckCircleIcon],
    ["Check", CheckIcon],
    ["ChevronDown", ChevronDownIcon],
    ["ChevronLeft", ChevronLeftIcon],
    ["ChevronRight", ChevronRightIcon],
    ["ChevronUp", ChevronUpIcon],
    ["Clock", ClockIcon],
    ["Close", CloseIcon],
    ["Code", CodeIcon],
    ["Coin", CoinIcon],
    ["Compass", CompassIcon],
    ["Copy", CopyIcon],
    ["Cross", CrossIcon],
    ["Crown", CrownIcon],
    ["Diamond", DiamondIcon],
    ["Discount", DiscountIcon],
    ["Donate", DonateIcon],
    ["DoubleTick", DoubleTickIcon],
    ["Download", DownloadIcon],
    ["Edit", EditIcon],
    ["ErrorCircle", ErrorCircleIcon],
    ["Error", ErrorIcon],
    ["Expand", ExpandIcon],
    ["Eye", EyeIcon],
    ["EyeSlash", EyeSlashIcon],
    ["Flag", FlagIcon],
    ["Flame", FlameIcon],
    ["Folder", FolderIcon],
    ["Forward", ForwardIcon],
    ["Gallery", GalleryIcon],
    ["Gender", GenderIcon],
    ["Gift", GiftIcon],
    ["Help", HelpIcon],
    ["Home", HomeIcon],
    ["Hourglass", HourglassIcon],
    ["Image", ImageIcon],
    ["Inbox", InboxIcon],
    ["InfoCircle", InfoCircleIcon],
    ["Info", InfoIcon],
    ["Link", LinkIcon],
    ["Location", LocationIcon],
    ["LockerOff", LockerOffIcon],
    ["LockerOn", LockerOnIcon],
    ["Logout", LogoutIcon],
    ["Love", LoveIcon],
    ["Megaphone", MegaphoneIcon],
    ["MenuClose", MenuCloseIcon],
    ["Menu", MenuIcon],
    ["MenuOpen", MenuOpenIcon],
    ["Message", MessageIcon],
    ["Microphone", MicrophoneIcon],
    ["Minus", MinusIcon],
    ["Moon", MoonIcon],
    ["More", MoreIcon],
    ["MoreVertical", MoreVerticalIcon],
    ["Pause", PauseIcon],
    ["Phone", PhoneIcon],
    ["PhoneOff", PhoneOffIcon],
    ["Pin", PinIcon],
    ["Play", PlayIcon],
    ["Plus", PlusIcon],
    ["Privacy", PrivacyIcon],
    ["Repeat", RepeatIcon],
    ["Reply2", Reply2Icon],
    ["Reply", ReplyIcon],
    ["Search", SearchIcon],
    ["Send", SendIcon],
    ["Settings", SettingsIcon],
    ["Share", ShareIcon],
    ["Spinner", SpinnerIcon],
    ["Star", StarIcon],
    ["Stop", StopIcon],
    ["Success", SuccessIcon],
    ["Sun", SunIcon],
    ["Support2", Support2Icon],
    ["Support", SupportIcon],
    ["Tag", TagIcon],
    ["Task", TaskIcon],
    ["TickCircle", TickCircleIcon],
    ["TickCircleOff", TickCircleOffIcon],
    ["Tick", TickIcon],
    ["TrashBin", TrashBinIcon],
    ["Trophy", TrophyIcon],
    ["ThumbDown", ThumbDownIcon],
    ["ThumbUp", ThumbUpIcon],
    ["Upload", UploadIcon],
    ["UserCircle", UserCircleIcon],
    ["User", UserIcon],
    ["Users", UsersIcon],
    ["Video", VideoIcon],
    ["VipBadge", VipBadgeIcon],
    ["Wallet", WalletIcon],
    ["Warning", WarningIcon],
    ["WarningTriangle", WarningTriangleIcon],
    ["WifiOff", WifiOffIcon],
    ["WifiOn", WifiOnIcon],
    ["Wrench", WrenchIcon],
  ] as const;

  return (
    <div id="icons" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Icons</h2>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end gap-6">
          {allIcons.map(([name, Icon]) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <Icon className="size-6" />
              <span className="text-[10px] text-foreground-secondary leading-tight">{name}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-end gap-6 rounded-lg bg-white p-4 text-foreground-default">
          {allIcons.map(([name, Icon]) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <Icon className="size-6" />
              <span className="text-[10px] leading-tight">{name}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-end gap-6 rounded-lg bg-neutral-solid p-4 text-foreground-inverse">
          {allIcons.map(([name, Icon]) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <Icon className="size-6" />
              <span className="text-[10px] leading-tight">{name}</span>
            </div>
          ))}
        </div>

        {/* Sizes */}
        <div className="flex flex-wrap items-end gap-8">
          <div className="flex flex-col items-center gap-1">
            <HomeIcon className="size-4" />
            <span className="text-[10px] text-foreground-secondary">16px</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <HomeIcon />
            <span className="text-[10px] text-foreground-secondary">20px</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <HomeIcon className="size-6" />
            <span className="text-[10px] text-foreground-secondary">24px</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <HomeIcon className="size-8" />
            <span className="text-[10px] text-foreground-secondary">32px</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <HomeIcon className="size-10" />
            <span className="text-[10px] text-foreground-secondary">40px</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TypographyDemo() {
  const boldTokens = [
    { name: "Display", className: "typography-bold-display", sample: "Display" },
    { name: "Heading Xl", className: "typography-bold-heading-xl", sample: "Heading XL" },
    { name: "Heading Lg", className: "typography-bold-heading-lg", sample: "Heading Lg" },
    { name: "Heading Md", className: "typography-bold-heading-md", sample: "Heading Md" },
    { name: "Heading Sm", className: "typography-bold-heading-sm", sample: "Heading Sm" },
    { name: "Heading Xs", className: "typography-bold-heading-xs", sample: "Heading Xs" },
  ];

  const semiboldTokens = [
    {
      name: "Body Lg",
      className: "typography-semibold-body-lg",
      sample: "Body text with semibold weight for strong emphasis.",
    },
    {
      name: "Body Md",
      className: "typography-semibold-body-md",
      sample: "Smaller body text with semibold weight.",
    },
    {
      name: "Body Sm",
      className: "typography-semibold-body-sm",
      sample: "Semibold caption for labels and emphasis.",
    },
    { name: "Link Lg", className: "typography-semibold-link-lg", sample: "Large link text" },
    { name: "Link Md", className: "typography-semibold-link-md", sample: "Medium link text" },
    { name: "Link Xs", className: "typography-semibold-link-xs", sample: "Extra small link text" },
    { name: "Badge", className: "typography-semibold-badge", sample: "Badge Label" },
  ];

  const regularTokens = [
    {
      name: "Body Lg",
      className: "typography-regular-body-lg",
      sample: "Body text at the standard reading size for paragraphs and content.",
    },
    {
      name: "Body Md",
      className: "typography-regular-body-md",
      sample: "Smaller body text for secondary content and descriptions.",
    },
    {
      name: "Body Sm",
      className: "typography-regular-body-sm",
      sample: "Caption text for annotations and helper text.",
    },
  ];

  return (
    <div id="typography" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Typography</h2>
      <p className="mb-6 text-foreground-secondary">
        All typography is set in <strong>Inter</strong>. Styles are available as utility classes
        generated from Figma tokens.
      </p>

      <div className="space-y-8">
        <div>
          <h3 className="mb-3 font-semibold text-foreground-secondary text-xs uppercase tracking-wider">
            Bold
          </h3>
          <div className="space-y-4">
            {boldTokens.map((token) => (
              <div
                key={token.className}
                className="flex items-baseline gap-6 border-neutral-200 border-b pb-4"
              >
                <div className="w-48 shrink-0">
                  <div className="font-semibold text-sm">{token.name}</div>
                  <code className="text-[11px] text-foreground-secondary">{token.className}</code>
                </div>
                <div className={token.className}>{token.sample}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-foreground-secondary text-xs uppercase tracking-wider">
            Semibold
          </h3>
          <div className="space-y-4">
            {semiboldTokens.map((token) => (
              <div
                key={token.className}
                className="flex items-baseline gap-6 border-neutral-200 border-b pb-4"
              >
                <div className="w-48 shrink-0">
                  <div className="font-semibold text-sm">{token.name}</div>
                  <code className="text-[11px] text-foreground-secondary">{token.className}</code>
                </div>
                <div className={token.className}>{token.sample}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-foreground-secondary text-xs uppercase tracking-wider">
            Regular
          </h3>
          <div className="space-y-4">
            {regularTokens.map((token) => (
              <div
                key={token.className}
                className="flex items-baseline gap-6 border-neutral-200 border-b pb-4"
              >
                <div className="w-48 shrink-0">
                  <div className="font-semibold text-sm">{token.name}</div>
                  <code className="text-[11px] text-foreground-secondary">{token.className}</code>
                </div>
                <div className={token.className}>{token.sample}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AvatarDemo() {
  return (
    <div id="avatar" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Avatar</h2>
      <div className="flex flex-wrap items-center gap-4">
        <Avatar
          size={16}
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
          fallback="16"
        />
        <Avatar
          size={24}
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
          fallback="24"
        />
        <Avatar
          size={32}
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
          fallback="32"
        />
        <Avatar
          size={40}
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
          fallback="40"
        />
        <Avatar
          size={48}
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
          fallback="48"
        />
        <Avatar
          size={64}
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
          fallback="64"
        />
        <Avatar
          size={88}
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
          fallback="88"
        />
        <Avatar
          size={148}
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
          fallback="148"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Avatar
          size={40}
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
          fallback="JD"
        />
        <Avatar size={40} fallback="AB" />
        <Avatar size={40} fallback={<CheckCircleIcon className="size-6" />} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Avatar
          size={24}
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
          fallback="JD"
          onlineIndicator={true}
        />
        <Avatar
          size={32}
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
          fallback="JD"
          onlineIndicator={true}
        />
        <Avatar
          size={40}
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
          fallback="JD"
          onlineIndicator={true}
        />
        <Avatar size={48} fallback="AB" onlineIndicator={true} />
        <Avatar size={64} fallback="AB" onlineIndicator={true} />
        <Avatar size={88} fallback="AB" onlineIndicator={true} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Avatar
          size={40}
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
          fallback="JD"
          platinumShow
        />
        <Avatar
          size={64}
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
          fallback="JD"
          platinumShow
        />
        <Avatar
          size={88}
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
          fallback="JD"
          platinumShow
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Avatar
          size={40}
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
          fallback="JD"
          NSFWShow
        />
        <Avatar
          size={64}
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
          fallback="JD"
          NSFWShow
        />
        <Avatar
          size={88}
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
          fallback="JD"
          NSFWShow
        />
      </div>
    </div>
  );
}

function AccordionDemo() {
  return (
    <div id="accordion" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Accordion</h2>
      <div className="flex flex-wrap items-start gap-8">
        <div className="w-80">
          <p className="typography-regular-body-sm mb-2 text-neutral-250">Single / Collapsible</p>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Section 1</AccordionTrigger>
              <AccordionContent>Content for the first section.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Section 2</AccordionTrigger>
              <AccordionContent>Content for the second section.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Section 3</AccordionTrigger>
              <AccordionContent>Content for the third section.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="w-80">
          <p className="typography-regular-body-sm mb-2 text-neutral-250">Multiple</p>
          <Accordion type="multiple" defaultValue={["item-1", "item-2"]}>
            <AccordionItem value="item-1">
              <AccordionTrigger>Open 1</AccordionTrigger>
              <AccordionContent>Both items are open at once.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Open 2</AccordionTrigger>
              <AccordionContent>Both items are open at once.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="w-80">
          <p className="typography-regular-body-sm mb-2 text-neutral-250">Disabled Item</p>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Enabled</AccordionTrigger>
              <AccordionContent>This item works normally.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" disabled>
              <AccordionTrigger>Disabled</AccordionTrigger>
              <AccordionContent>You should not see this.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

function DrawerDemo() {
  return (
    <div id="drawer" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Drawer</h2>
      <div className="flex flex-wrap items-start gap-4">
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Right (default)</Button>
          </DrawerTrigger>
          <DrawerContent position="right">
            <DrawerHeader>
              <DrawerTitle>Right Drawer</DrawerTitle>
              <DrawerDescription>Slides in from the right.</DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 p-4">
              <p>Content area.</p>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="secondary">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Drawer>
          <DrawerTrigger asChild>
            <Button>Left</Button>
          </DrawerTrigger>
          <DrawerContent position="left">
            <DrawerHeader>
              <DrawerTitle>Left Drawer</DrawerTitle>
              <DrawerDescription>Slides in from the left.</DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 p-4">
              <p>Content area.</p>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="secondary">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Drawer>
          <DrawerTrigger asChild>
            <Button>Top</Button>
          </DrawerTrigger>
          <DrawerContent position="top">
            <DrawerHeader>
              <DrawerTitle>Top Drawer</DrawerTitle>
              <DrawerDescription>Slides in from the top.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <p>Content area.</p>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="secondary">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Drawer>
          <DrawerTrigger asChild>
            <Button>Bottom</Button>
          </DrawerTrigger>
          <DrawerContent position="bottom">
            <DrawerHeader>
              <DrawerTitle>Bottom Drawer</DrawerTitle>
              <DrawerDescription>Slides in from the bottom.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <p>Content area.</p>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="secondary">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="secondary">Without Overlay</Button>
          </DrawerTrigger>
          <DrawerContent position="right" overlay={false}>
            <DrawerHeader>
              <DrawerTitle>No Overlay</DrawerTitle>
              <DrawerDescription>No backdrop behind this drawer.</DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 p-4">
              <p>Content area.</p>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="secondary">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

function AlertDemo() {
  return (
    <div id="alert" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Alert</h2>
      <div className="max-w-2xl space-y-4">
        <Alert variant="info" icon={<InfoCircleIcon />}>
          This is an informational alert message.
        </Alert>
        <Alert variant="success" icon={<CheckCircleIcon />}>
          Your changes have been saved successfully.
        </Alert>
        <Alert variant="warning" icon={<WarningTriangleIcon />}>
          Please review your information before proceeding.
        </Alert>
        <Alert variant="error" icon={<ErrorCircleIcon />}>
          An error occurred while processing your request.
        </Alert>
        <Alert variant="info" icon={<InfoCircleIcon />} closable>
          This is a closable info alert.
        </Alert>
        <Alert variant="info" icon={<InfoCircleIcon />} title="Informational title">
          This alert has a title and a description body.
        </Alert>
        <Alert variant="error" icon={<ErrorCircleIcon />} title="Something went wrong" closable>
          This alert shows title, icon, and closable all together.
        </Alert>
      </div>
    </div>
  );
}

function ButtonDemo() {
  return (
    <div id="button" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Button</h2>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="primary">Label</Button>
        <Button variant="secondary">Label</Button>
        <Button variant="tertiary">Label</Button>
        <Button variant="brand">Label</Button>
        <Button variant="link">Label</Button>
        <Button variant="destructive">Label</Button>
        <div className="rounded-lg bg-neutral-solid p-3">
          <Button variant="white">Label</Button>
        </div>
        <Button variant="tertiaryDestructive">Label</Button>
        <Button variant="text">Label</Button>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <Button size="48">Label</Button>
        <Button size="40">Label</Button>
        <Button size="32">Label</Button>
        <Button variant="text" size="24">
          Label
        </Button>
      </div>

      <div className="space-y-3">
        {(["48", "40", "32"] as const).map((size) => (
          <div key={size} className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size={size}>
              Label
            </Button>
            <Button variant="secondary" size={size}>
              Label
            </Button>
            <Button variant="tertiary" size={size}>
              Label
            </Button>
            <Button variant="brand" size={size}>
              Label
            </Button>
            <Button variant="link" size={size}>
              Label
            </Button>
            <Button variant="destructive" size={size}>
              Label
            </Button>
            <div className="rounded-lg bg-neutral-solid p-2">
              <Button variant="white" size={size}>
                Label
              </Button>
            </div>
            <Button variant="tertiaryDestructive" size={size}>
              Label
            </Button>
            <Button variant="text" size={size}>
              Label
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button variant="primary" disabled>
          Label
        </Button>
        <Button variant="secondary" disabled>
          Label
        </Button>
        <Button variant="tertiary" disabled>
          Label
        </Button>
        <Button variant="brand" disabled>
          Label
        </Button>
        <Button variant="link" disabled>
          Label
        </Button>
        <Button variant="destructive" disabled>
          Label
        </Button>
        <div className="rounded-lg bg-neutral-solid p-3">
          <Button variant="white" disabled>
            Label
          </Button>
        </div>
        <Button variant="tertiaryDestructive" disabled>
          Label
        </Button>
        <Button variant="text" disabled>
          Label
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button variant="primary" loading>
          Label
        </Button>
        <Button variant="secondary" loading>
          Label
        </Button>
        <Button variant="tertiary" loading>
          Label
        </Button>
        <Button variant="brand" loading>
          Label
        </Button>
        <Button variant="link" loading>
          Label
        </Button>
        <Button variant="destructive" loading>
          Label
        </Button>
        <div className="rounded-lg bg-neutral-solid p-3">
          <Button variant="white" loading>
            Label
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button variant="primary" leftIcon={<HomeIcon />}>
          Label
        </Button>
        <Button variant="primary" rightIcon={<HomeIcon />}>
          Label
        </Button>
        <Button variant="brand" leftIcon={<HomeIcon />} rightIcon={<HomeIcon />}>
          Label
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button variant="primary" price="$9.99/month">
          Subscribe
        </Button>
        <Button fullWidth variant="primary" discount="$X.XX" price="$X.XX/ month">
          Join now
        </Button>
        <div className="rounded-lg bg-neutral-solid p-3">
          <Button variant="white" rightIcon={<CrownIcon />} discount="$X.XX" price="$X.XX/ month">
            Join now
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button variant="primary" asChild>
          <a href="#link">Link as Primary</a>
        </Button>
        <Button variant="brand" asChild>
          <a href="#link">Link as Brand</a>
        </Button>
      </div>
    </div>
  );
}

function BadgeDemo() {
  return (
    <div id="badge" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Badge</h2>
      <div className="flex flex-wrap gap-4">
        <Badge variant="default">Default</Badge>
        <Badge variant="dark">Dark</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="error">Error</Badge>
        <Badge variant="special">Special</Badge>
        <Badge variant="brand">Brand</Badge>
        <Badge variant="pink">Pink</Badge>
        <Badge variant="online">Online</Badge>
        <Badge variant="brandLight">Brand light</Badge>
        <Badge variant="pinkLight">Pink light</Badge>
        <Badge variant="default" leftDot={false}>
          No dot
        </Badge>
        <Badge variant="info" leftDot={false} leftIcon={<InfoCircleIcon />}>
          Left icon
        </Badge>
        <Badge variant="success" leftDot={false} rightIcon={<ArrowUpRightIcon />}>
          Right icon
        </Badge>
      </div>
    </div>
  );
}

function IconButtonDemo() {
  return (
    <div id="iconbutton" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Icon Button</h2>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <IconButton variant="primary" icon={<HomeIcon />} aria-label="Home" />
          <IconButton variant="secondary" icon={<HomeIcon />} aria-label="Home" />
          <IconButton variant="tertiary" icon={<HomeIcon />} aria-label="Home" />
          <IconButton variant="brand" icon={<HomeIcon />} aria-label="Home" />
          <IconButton variant="tertiaryDestructive" icon={<CrossIcon />} aria-label="Close" />
          <IconButton variant="navTray" icon={<HomeIcon />} aria-label="Home" />
        </div>

        <div className="rounded-lg bg-neutral-solid p-4">
          <div className="flex flex-wrap items-center gap-4">
            <IconButton variant="contrast" icon={<HomeIcon />} aria-label="Home" />
            <IconButton variant="messaging" icon={<PlusIcon />} aria-label="Add" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <IconButton variant="primary" icon={<HomeIcon />} size="24" aria-label="Home" />
          <IconButton variant="primary" icon={<HomeIcon />} size="32" aria-label="Home" />
          <IconButton variant="primary" icon={<HomeIcon />} size="40" aria-label="Home" />
          <IconButton variant="primary" icon={<HomeIcon />} size="52" aria-label="Home" />
          <IconButton variant="primary" icon={<HomeIcon />} size="72" aria-label="Home" />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <IconButton variant="primary" icon={<HomeIcon />} disabled aria-label="Home" />
          <IconButton variant="secondary" icon={<HomeIcon />} disabled aria-label="Home" />
          <IconButton variant="tertiary" icon={<HomeIcon />} disabled aria-label="Home" />
          <IconButton variant="brand" icon={<HomeIcon />} disabled aria-label="Home" />
          <IconButton
            variant="tertiaryDestructive"
            icon={<CrossIcon />}
            disabled
            aria-label="Close"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <IconButton variant="tertiary" icon={<HomeIcon />} counterValue={5} aria-label="Home" />
          <IconButton variant="tertiary" icon={<HomeIcon />} counterValue={12} aria-label="Home" />
          <IconButton variant="navTray" icon={<HomeIcon />} counterValue={99} aria-label="Home" />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <IconButton variant="stop" icon={<StopIcon />} size="52" aria-label="Stop" />
          <IconButton
            variant="microphone"
            icon={<MicrophoneIcon />}
            size="52"
            aria-label="Microphone"
          />
        </div>
      </div>
    </div>
  );
}

function PillDemo() {
  return (
    <div id="pill" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Pill</h2>
      <div className="flex flex-wrap gap-4">
        <Pill variant="green">Green</Pill>
        <Pill variant="grey">Grey</Pill>
        <Pill variant="blue">Blue</Pill>
        <Pill variant="gold">Gold</Pill>
        <Pill variant="pinkLight">Pink Light</Pill>
        <Pill variant="base">Base</Pill>
        <Pill variant="brand">Brand</Pill>
        <Pill variant="brandLight">Brand light</Pill>
        <Pill variant="beta">Beta</Pill>
        <Pill variant="error">Error</Pill>
      </div>

      <div className="flex flex-wrap gap-4">
        <Pill variant="brand" leftIcon={<CheckCircleIcon className="size-3" />}>
          Left icon
        </Pill>
        <Pill variant="blue" rightIcon={<ArrowUpRightIcon className="size-3" />}>
          Right icon
        </Pill>
      </div>
    </div>
  );
}

function CheckboxDemo() {
  return (
    <div id="checkbox" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Checkbox</h2>
      <div className="flex flex-col gap-4">
        <Checkbox label="Default checkbox" />
        <Checkbox label="Small text size" size="small" helperText="Label and helper are smaller" />
        <Checkbox label="Checked checkbox" checked />
        <Checkbox label="Indeterminate checkbox" checked="indeterminate" />
        <Checkbox label="Disabled checkbox" disabled />
        <Checkbox label="Disabled checked" disabled checked />
        <Checkbox label="Disabled indeterminate" disabled checked="indeterminate" />
        <Checkbox label="With helper text" helperText="This field is required" />
        <Checkbox aria-label="Standalone checkbox" />
      </div>
    </div>
  );
}

function RadioDemo() {
  return (
    <div id="radio" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Radio</h2>
      <RadioGroup defaultValue="option1" aria-label="Options" className="flex flex-col gap-4">
        <Radio label="Option 1" value="option1" helperText="This is the first option" />
        <Radio label="Option 2" value="option2" helperText="This is the second option" />
        <Radio label="Option 3" value="option3" />
      </RadioGroup>

      <RadioGroup defaultValue="a" aria-label="Small options" className="flex flex-col gap-4">
        <Radio size="small" label="Option A" value="a" />
        <Radio size="small" label="Option B" value="b" />
        <Radio size="small" label="Option C" value="c" />
      </RadioGroup>

      <RadioGroup
        disabled
        defaultValue="x"
        aria-label="Disabled options"
        className="flex flex-col gap-4"
      >
        <Radio label="Option 1" value="x" />
        <Radio label="Option 2" value="y" />
        <Radio label="Option 3" value="z" />
      </RadioGroup>
    </div>
  );
}

const AUTOCOMPLETE_OPTIONS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
];

function AutocompleteDemo() {
  const [controlled, setControlled] = useState<string | null>("apple");

  return (
    <div id="autocomplete" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Autocomplete</h2>
      <div className="flex max-w-sm flex-col gap-4">
        <Autocomplete
          label="Default"
          placeholder="Search..."
          options={AUTOCOMPLETE_OPTIONS}
          emptyText="No results"
        />
        <Autocomplete
          label="Size 40"
          placeholder="Search..."
          size="40"
          options={AUTOCOMPLETE_OPTIONS}
          emptyText="No results"
        />
        <Autocomplete
          label="Size 32"
          placeholder="Search..."
          size="32"
          options={AUTOCOMPLETE_OPTIONS}
          emptyText="No results"
        />
        <Autocomplete
          label="With helper"
          placeholder="Search..."
          helperText="Pick a fruit"
          options={AUTOCOMPLETE_OPTIONS}
          emptyText="No results"
        />
        <Autocomplete
          label="Error"
          placeholder="Search..."
          error
          errorMessage="This field is required"
          options={AUTOCOMPLETE_OPTIONS}
          emptyText="No results"
        />
        <Autocomplete
          label="Disabled"
          placeholder="Search..."
          disabled
          options={AUTOCOMPLETE_OPTIONS}
          emptyText="No results"
        />
        <Autocomplete
          label="With left icon"
          placeholder="Search..."
          leftIcon={<HomeIcon />}
          options={AUTOCOMPLETE_OPTIONS}
          emptyText="No results"
        />
        <Autocomplete
          label="Clearable"
          placeholder="Search..."
          clearable
          clearAriaLabel="Clear selection"
          defaultValue="banana"
          options={AUTOCOMPLETE_OPTIONS}
          emptyText="No results"
        />
        <Autocomplete
          label="Multi-select"
          placeholder="Select fruits..."
          multiple
          defaultValue={["apple", "cherry"]}
          options={AUTOCOMPLETE_OPTIONS}
          emptyText="No results"
        />
        <Autocomplete
          label="Controlled"
          placeholder="Search..."
          value={controlled}
          onChange={setControlled}
          options={AUTOCOMPLETE_OPTIONS}
          emptyText="No results"
        />
      </div>
    </div>
  );
}

function SelectDemo() {
  return (
    <div id="select" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Select</h2>
      <div className="flex max-w-sm flex-col gap-4">
        <Select label="Size 48" placeholder="Select an option" size="48">
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
            <SelectItem value="c">Option C</SelectItem>
          </SelectContent>
        </Select>
        <Select label="Size 40" placeholder="Select an option" size="40">
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
            <SelectItem value="c">Option C</SelectItem>
          </SelectContent>
        </Select>
        <Select label="Size 32" placeholder="Select an option" size="32">
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
            <SelectItem value="c">Option C</SelectItem>
          </SelectContent>
        </Select>
        <Select
          label="With helper"
          placeholder="Select an option"
          helperText="Choose one of the options"
        >
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
            <SelectItem value="c">Option C</SelectItem>
          </SelectContent>
        </Select>
        <Select placeholder="No label" aria-label="Standalone select">
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>
        <Select label="Left icon" placeholder="Select an option" leftIcon={<HomeIcon />}>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
            <SelectItem value="c">Option C</SelectItem>
          </SelectContent>
        </Select>
        <Select
          label="Error"
          placeholder="Select an option"
          error
          errorMessage="This field is required"
        >
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>
        <Select label="Disabled" placeholder="Select an option" disabled>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>
        <Select label="With groups" placeholder="Select a category">
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="mango">Mango</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Vegetables</SelectLabel>
              <SelectItem value="carrot">Carrot</SelectItem>
              <SelectItem value="broccoli">Broccoli</SelectItem>
              <SelectItem value="spinach">Spinach</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select label="With disabled item" placeholder="Select an option">
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b" disabled>
              Option B (disabled)
            </SelectItem>
            <SelectItem value="c">Option C</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function CountDemo() {
  return (
    <div id="count" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Count</h2>
      <div className="flex flex-wrap items-center gap-4">
        <Count value={5} variant="default" />
        <Count value={12} variant="brand" />
        <Count value={8} variant="pink" />
        <Count value={3} variant="info" />
        <Count value={7} variant="success" />
        <Count value={15} variant="warning" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Count value={9} />
        <Count value={42} />
        <Count value={99} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Count value={150} max={99} />
        <Count value={1000} max={999} />
      </div>
    </div>
  );
}

function ChipDemo() {
  return (
    <div id="chip" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Chip</h2>
      <div className="flex flex-wrap items-center gap-3">
        <Chip>Chip</Chip>
        <Chip variant="square">Chip</Chip>
        <Chip variant="dark">Chip</Chip>
        <Chip selected>Chip</Chip>
        <Chip variant="square" selected>
          Chip
        </Chip>
        <Chip disabled>Chip</Chip>
        <Chip variant="square" disabled>
          Chip
        </Chip>
        <Chip variant="dark" disabled>
          Chip
        </Chip>
        <Chip selected disabled>
          Chip
        </Chip>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Chip size="40">Chip</Chip>
        <Chip size="40" variant="square">
          Chip
        </Chip>
        <Chip size="40" variant="dark">
          Chip
        </Chip>
        <Chip size="40" selected>
          Chip
        </Chip>
        <Chip size="40" variant="square" selected>
          Chip
        </Chip>
        <Chip size="40" disabled>
          Chip
        </Chip>
        <Chip size="40" variant="dark" disabled>
          Chip
        </Chip>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Chip onClick={() => {}}>Clickable</Chip>
        <Chip onClick={() => {}} selected>
          Selected
        </Chip>
        <Chip onClick={() => {}} disabled>
          Disabled
        </Chip>
        <Chip onClick={() => {}} variant="square">
          Square
        </Chip>
        <Chip onClick={() => {}} variant="square" selected>
          Selected
        </Chip>
        <Chip onClick={() => {}} variant="dark">
          Dark
        </Chip>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Chip leftDot>Chip</Chip>
        <Chip leftDot selected>
          Chip
        </Chip>
        <Chip leftDot variant="dark">
          Chip
        </Chip>
        <Chip leftDot variant="square">
          Chip
        </Chip>
        <Chip leftDot disabled>
          Chip
        </Chip>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Chip leftIcon={<CheckCircleIcon className="size-5" />}>Chip</Chip>
        <Chip rightIcon={<CrossIcon className="size-5" />} onClick={() => {}}>
          Chip
        </Chip>
        <Chip
          leftIcon={<CheckCircleIcon className="size-5" />}
          rightIcon={<CrossIcon className="size-5" />}
        >
          Chip
        </Chip>
        <Chip leftIcon={<CheckCircleIcon className="size-5" />} selected>
          Chip
        </Chip>
        <Chip leftIcon={<CheckCircleIcon className="size-5" />} variant="dark">
          Chip
        </Chip>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Chip notificationLabel="3">Chip</Chip>
        <Chip notificationLabel="99+">Chip</Chip>
        <Chip notificationLabel="3" selected>
          Chip
        </Chip>
        <Chip notificationLabel="3" variant="dark">
          Chip
        </Chip>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Chip
          leftDot
          leftIcon={<CheckCircleIcon className="size-5" />}
          rightIcon={<CrossIcon className="size-5" />}
          notificationLabel="5"
          selected
          onClick={() => {}}
        >
          Full
        </Chip>
        <Chip
          leftDot
          leftIcon={<CheckCircleIcon className="size-5" />}
          rightIcon={<CrossIcon className="size-5" />}
          notificationLabel="5"
          variant="square"
          onClick={() => {}}
        >
          Full
        </Chip>
        <Chip
          leftDot
          leftIcon={<CheckCircleIcon className="size-5" />}
          rightIcon={<CrossIcon className="size-5" />}
          notificationLabel="5"
          variant="dark"
        >
          Full
        </Chip>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Chip
          size="40"
          leftDot
          leftIcon={<CheckCircleIcon className="size-5" />}
          rightIcon={<CrossIcon className="size-5" />}
          notificationLabel="5"
          selected
          onClick={() => {}}
        >
          Full MD
        </Chip>
        <Chip
          size="40"
          leftDot
          leftIcon={<CheckCircleIcon className="size-5" />}
          rightIcon={<CrossIcon className="size-5" />}
          notificationLabel="5"
          variant="square"
          onClick={() => {}}
        >
          Full MD
        </Chip>
        <Chip
          size="40"
          leftDot
          leftIcon={<CheckCircleIcon className="size-5" />}
          rightIcon={<CrossIcon className="size-5" />}
          notificationLabel="5"
          variant="dark"
        >
          Full MD
        </Chip>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Chip
          variant="square"
          size="40"
          leftIcon={
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='10' fill='%23F7931A'/%3E%3Ctext x='10' y='14' text-anchor='middle' fill='white' font-size='10' font-family='sans-serif'%3E%E2%82%BF%3C/text%3E%3C/svg%3E"
              alt="Bitcoin"
              className="size-5 rounded-full"
            />
          }
          onClick={() => {}}
        >
          Bitcoin
        </Chip>
        <Chip
          variant="square"
          size="40"
          leftIcon={
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='10' fill='%234285F4'/%3E%3Ctext x='10' y='14' text-anchor='middle' fill='white' font-size='10' font-family='sans-serif'%3EG%3C/text%3E%3C/svg%3E"
              alt="Google Pay"
              className="size-5 rounded-full"
            />
          }
          selected
          onClick={() => {}}
        >
          Google Pay
        </Chip>
        <Chip
          variant="square"
          size="40"
          leftIcon={
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='10' fill='%23003087'/%3E%3Ctext x='10' y='14' text-anchor='middle' fill='white' font-size='10' font-family='sans-serif'%3EP%3C/text%3E%3C/svg%3E"
              alt="PayPal"
              className="size-5 rounded-full"
            />
          }
          onClick={() => {}}
        >
          PayPal
        </Chip>
        <Chip
          variant="square"
          size="40"
          leftIcon={
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='10' fill='%23000'/%3E%3Ctext x='10' y='14' text-anchor='middle' fill='white' font-size='10' font-family='sans-serif'%3EA%3C/text%3E%3C/svg%3E"
              alt="Apple Pay"
              className="size-5 rounded-full"
            />
          }
          disabled
        >
          Apple Pay
        </Chip>
      </div>
    </div>
  );
}

function SnackbarDemo() {
  return (
    <div id="snackbar" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Snackbar</h2>
      <div className="max-w-xl space-y-4">
        <Snackbar
          variant="vipEarn"
          icon={<VipBadgeIcon />}
          title="You're killing it! You've earned 1,000pts"
          description="Find out how to redeem them, and earn more..."
          primaryLabel="Redeem points"
          closable
        />
        <Snackbar primaryLabel="Accept" secondaryLabel="Dismiss">
          <span className="typography-semibold-body-md">
            <span>@user.with.username</span> changed their subscription price to <span>$43.99</span>{" "}
            per month
          </span>
        </Snackbar>
        <Snackbar
          variant="welcome"
          title="Welcome to Fanvue 👋"
          description="Let's get you started!"
          primaryLabel="Become a creator"
          secondaryLabel="Discover creators"
        />
      </div>
    </div>
  );
}

function SwitchDemo() {
  return (
    <div id="switch" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Switch</h2>
      <div className="flex flex-wrap items-center gap-4">
        <Switch aria-label="Toggle default" />
        <Switch aria-label="Toggle default checked" defaultChecked />
        <Switch aria-label="Toggle small" size="small" />
        <Switch aria-label="Toggle small checked" size="small" defaultChecked />
        <Switch aria-label="Toggle disabled" disabled />
        <Switch aria-label="Toggle disabled checked" disabled defaultChecked />
        <Switch aria-label="Toggle small disabled" size="small" disabled />
        <Switch aria-label="Toggle small disabled checked" size="small" disabled defaultChecked />
      </div>
    </div>
  );
}

function SwitchFieldDemo() {
  return (
    <div id="switchfield" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Switch Field</h2>
      <div className="flex max-w-2xl flex-col gap-4">
        <SwitchField label="Notifications" />
        <SwitchField label="Notifications" defaultChecked />
        <SwitchField label="Notifications" helperText="Receive push notifications" />
        <SwitchField label="Notifications" helperText="Receive push notifications" defaultChecked />
        <SwitchField label="Notifications" infoText="Info text" />
        <SwitchField
          label="Notifications"
          helperText="Receive push notifications"
          infoText="Info text"
        />
        <SwitchField label="Notifications" orientation="left" />
        <SwitchField label="Notifications" orientation="left" defaultChecked />
        <SwitchField
          label="Notifications"
          orientation="left"
          helperText="Receive push notifications"
        />
        <SwitchField
          label="Notifications"
          orientation="left"
          helperText="Receive push notifications"
          defaultChecked
        />
        <SwitchField label="Notifications" orientation="left" infoText="Info text" />
        <SwitchField
          label="Notifications"
          orientation="left"
          helperText="Receive push notifications"
          infoText="Info text"
        />
        <SwitchField label="Small switch" size="small" />
        <SwitchField label="Small switch" size="small" defaultChecked />
        <SwitchField label="Small switch" size="small" helperText="A smaller variant" />
        <SwitchField label="Small switch" size="small" orientation="left" />
        <SwitchField label="Small switch" size="small" orientation="left" defaultChecked />
        <SwitchField
          label="Small switch"
          size="small"
          orientation="left"
          helperText="A smaller variant"
        />
        <SwitchField label="Disabled" disabled />
        <SwitchField label="Disabled checked" disabled defaultChecked />
        <SwitchField label="Disabled" disabled helperText="This option is not available" />
        <SwitchField label="Disabled" disabled orientation="left" />
        <SwitchField label="Disabled" disabled size="small" />
        <SwitchField label="Disabled" disabled size="small" helperText="Not available" />
      </div>
    </div>
  );
}

function SwitchToggleDemo() {
  return (
    <div id="switchtoggle" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Switch Toggle</h2>
      <div className="flex flex-wrap items-center gap-4">
        <SwitchToggle
          size="24"
          options={[
            { label: "Monthly", value: "monthly" },
            { label: "Yearly", value: "yearly" },
          ]}
        />
        <SwitchToggle
          size="24"
          options={[
            { label: "Monthly", value: "monthly" },
            { label: "Yearly", value: "yearly" },
          ]}
          defaultValue="yearly"
        />
        <SwitchToggle
          size="32"
          options={[
            { label: "Monthly", value: "monthly" },
            { label: "Yearly", value: "yearly" },
          ]}
        />
        <SwitchToggle
          size="32"
          options={[
            { label: "Monthly", value: "monthly" },
            { label: "Yearly", value: "yearly" },
          ]}
          defaultValue="yearly"
        />
        <SwitchToggle
          size="40"
          options={[
            { label: "Monthly", value: "monthly" },
            { label: "Yearly", value: "yearly" },
          ]}
        />
        <SwitchToggle
          size="40"
          options={[
            { label: "Monthly", value: "monthly" },
            { label: "Yearly", value: "yearly" },
          ]}
          defaultValue="yearly"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <SwitchToggle
          size="24"
          disabled
          options={[
            { label: "On", value: "on" },
            { label: "Off", value: "off" },
          ]}
        />
        <SwitchToggle
          size="24"
          disabled
          defaultValue="off"
          options={[
            { label: "On", value: "on" },
            { label: "Off", value: "off" },
          ]}
        />
        <SwitchToggle
          size="32"
          disabled
          options={[
            { label: "On", value: "on" },
            { label: "Off", value: "off" },
          ]}
        />
        <SwitchToggle
          size="32"
          disabled
          defaultValue="off"
          options={[
            { label: "On", value: "on" },
            { label: "Off", value: "off" },
          ]}
        />
        <SwitchToggle
          size="40"
          disabled
          options={[
            { label: "On", value: "on" },
            { label: "Off", value: "off" },
          ]}
        />
        <SwitchToggle
          size="40"
          disabled
          defaultValue="off"
          options={[
            { label: "On", value: "on" },
            { label: "Off", value: "off" },
          ]}
        />
      </div>
    </div>
  );
}

function DatePickerDemo() {
  return (
    <div id="datepicker" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Date Picker</h2>
      <DatePickerShowcase />
    </div>
  );
}

function DividerDemo() {
  return (
    <div id="divider" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Divider</h2>
      <div className="flex flex-col gap-6">
        <Divider />
        <Divider className="w-1/2" />
        <Divider label="or" />
        <div className="flex h-24 items-center gap-6">
          <Divider orientation="vertical" />
          <Divider orientation="vertical" className="h-1/2" />
        </div>
      </div>
    </div>
  );
}

function TabsDemo() {
  return (
    <div id="tabs" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Tabs</h2>
      <div className="flex flex-wrap items-start gap-8">
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
        <Tabs defaultValue="t">
          <TabsList>
            <TabsTrigger value="t">Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="t">
            <p className="pt-4 text-neutral-400 text-sm">Single tab content</p>
          </TabsContent>
        </Tabs>
        <Tabs defaultValue="t">
          <TabsList>
            <TabsTrigger value="t" disabled>
              Tab
            </TabsTrigger>
          </TabsList>
          <TabsContent value="t">
            <p className="pt-4 text-neutral-400 text-sm">Disabled tab content</p>
          </TabsContent>
        </Tabs>
        <Tabs defaultValue="other">
          <TabsList>
            <TabsTrigger value="t">Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="t">
            <p className="pt-4 text-neutral-400 text-sm">Inactive tab content</p>
          </TabsContent>
        </Tabs>
        <Tabs defaultValue="other">
          <TabsList>
            <TabsTrigger value="t" disabled>
              Tab
            </TabsTrigger>
          </TabsList>
          <TabsContent value="t">
            <p className="pt-4 text-neutral-400 text-sm">Disabled inactive tab content</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SliderDemo() {
  return (
    <div id="slider" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Slider</h2>
      <SliderShowcase />
    </div>
  );
}

function PaginationDemo() {
  return (
    <div id="pagination" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Pagination</h2>
      <PaginationShowcase />
    </div>
  );
}

function ProgressBarDemo() {
  return (
    <div id="progressbar" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Progress Bar</h2>
      <div className="flex max-w-md flex-col gap-6">
        {/* Default variant — color-coded by value */}
        <ProgressBar value={20} />
        <ProgressBar value={60} />
        <ProgressBar value={100} />

        {/* Generic variant — always green */}
        <ProgressBar value={20} variant="generic" />
        <ProgressBar value={60} variant="generic" />
        <ProgressBar value={100} variant="generic" />

        {/* Small size */}
        <ProgressBar value={20} size="small" />
        <ProgressBar value={60} size="small" />
        <ProgressBar value={100} size="small" />

        {/* Small + generic */}
        <ProgressBar value={50} size="small" variant="generic" />

        {/* Neutral variant — always white */}
        <div className="rounded-lg bg-neutral-800 p-4">
          <div className="flex flex-col gap-6">
            <ProgressBar value={20} variant="neutral" />
            <ProgressBar value={60} variant="neutral" />
            <ProgressBar value={80} variant="neutral" size="small" />
          </div>
        </div>

        {/* With title */}
        <ProgressBar value={75} title="Profile completeness" />
        <ProgressBar value={30} title="Upload progress" />

        {/* With showCompletion */}
        <ProgressBar value={25} showCompletion />
        <ProgressBar value={65} showCompletion />
        <ProgressBar value={100} showCompletion />

        {/* Small with showCompletion */}
        <ProgressBar value={45} size="small" showCompletion />

        {/* Generic with showCompletion */}
        <ProgressBar value={70} variant="generic" showCompletion />

        {/* With stepsLabel */}
        <ProgressBar value={50} stepsLabel="4/8 steps" />
        <ProgressBar value={100} stepsLabel="8/8 steps" />

        {/* Title + showCompletion + stepsLabel (full header) */}
        <ProgressBar value={37} title="Verification" showCompletion stepsLabel="3/8 steps" />
        <ProgressBar value={100} title="Verification" showCompletion stepsLabel="8/8 steps" />

        {/* With helperLeft / helperRight */}
        <ProgressBar value={50} helperLeft="50% complete" helperRight="5 of 10" />
        <ProgressBar value={80} helperRight="Almost there!" />

        {/* With leftIcon */}
        <ProgressBar
          value={60}
          leftIcon={<InfoCircleIcon className="size-5" />}
          helperLeft="Keep going"
        />
        <ProgressBar
          value={100}
          leftIcon={<CheckCircleIcon className="size-5" />}
          helperLeft="Completed"
          helperRight="All done"
        />

        {/* Full kitchen sink — default variant */}
        <ProgressBar
          value={62}
          title="Profile setup"
          showCompletion
          stepsLabel="5/8 steps"
          leftIcon={<InfoCircleIcon className="size-5" />}
          helperLeft="Complete your profile"
          helperRight="3 remaining"
        />

        {/* Full kitchen sink — generic variant */}
        <ProgressBar
          value={85}
          variant="generic"
          title="Storage used"
          showCompletion
          stepsLabel="8.5/10 GB"
          leftIcon={<WarningTriangleIcon className="size-5" />}
          helperLeft="Running low"
          helperRight="Upgrade plan"
        />

        {/* Full kitchen sink — small size */}
        <ProgressBar
          value={40}
          size="small"
          title="Level progress"
          showCompletion
          stepsLabel="Level 4"
          leftIcon={<FlameIcon className="size-5" />}
          helperLeft="Keep it up!"
          helperRight="60 XP to go"
        />
      </div>
    </div>
  );
}

function MobileStepperDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = 6;

  return (
    <div id="mobilestepper" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Mobile Stepper</h2>
      <div className="flex max-w-md flex-col gap-6">
        {/* Dots variant */}
        <MobileStepper
          steps={steps}
          activeStep={activeStep}
          variant="dots"
          backButton={
            <Button
              size="32"
              variant="tertiary"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((prev) => prev - 1)}
            >
              Back
            </Button>
          }
          nextButton={
            <Button
              size="32"
              variant="tertiary"
              disabled={activeStep === steps - 1}
              onClick={() => setActiveStep((prev) => prev + 1)}
            >
              Next
            </Button>
          }
        />

        {/* Progress variant */}
        <MobileStepper
          steps={steps}
          activeStep={activeStep}
          variant="progress"
          backButton={
            <Button
              size="32"
              variant="tertiary"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((prev) => prev - 1)}
            >
              Back
            </Button>
          }
          nextButton={
            <Button
              size="32"
              variant="tertiary"
              disabled={activeStep === steps - 1}
              onClick={() => setActiveStep((prev) => prev + 1)}
            >
              Next
            </Button>
          }
        />

        {/* Text variant */}
        <MobileStepper
          steps={steps}
          activeStep={activeStep}
          variant="text"
          backButton={
            <Button
              size="32"
              variant="tertiary"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((prev) => prev - 1)}
            >
              Back
            </Button>
          }
          nextButton={
            <Button
              size="32"
              variant="tertiary"
              disabled={activeStep === steps - 1}
              onClick={() => setActiveStep((prev) => prev + 1)}
            >
              Next
            </Button>
          }
        />
      </div>
    </div>
  );
}

function TooltipDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div id="tooltip" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Tooltip</h2>
      <TooltipProvider>
        <div className="flex flex-col gap-8">
          {/* Controlled */}
          {/*
          Controlled Tooltip Example
          Demonstrates programmatically controlling tooltip open/close state.
        */}
          <div className="flex items-center gap-4">
            {(() => {
              return (
                <>
                  <Tooltip open={open} onOpenChange={setOpen}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="32"
                        onMouseEnter={() => setOpen(true)}
                        onMouseLeave={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        onBlur={() => setOpen(false)}
                      >
                        Hover/focus me (controlled)
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      This tooltip is <span className="font-semibold">controlled</span> via state.
                    </TooltipContent>
                  </Tooltip>
                  <Button
                    variant="tertiary"
                    size="32"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-pressed={open}
                  >
                    {open ? "Hide Tooltip" : "Show Tooltip"}
                  </Button>
                </>
              );
            })()}
          </div>
          {/* Simple tooltip */}
          <div className="flex flex-wrap items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="32">
                  Top (default)
                </Button>
              </TooltipTrigger>
              <TooltipContent>Tooltip with arrow</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="32">
                  No arrow
                </Button>
              </TooltipTrigger>
              <TooltipContent>Tooltip without arrow</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="32">
                  Right
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Tooltip on right</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="32">
                  Left
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Tooltip on left</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="32">
                  Bottom
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Tooltip on bottom</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton variant="tertiary" icon={<InfoCircleIcon />} aria-label="Info" />
              </TooltipTrigger>
              <TooltipContent>More information about this feature</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}

function InfoBoxDemo() {
  return (
    <div id="infobox" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">InfoBox</h2>
      <div className="flex flex-wrap items-center gap-4">
        <InfoBox>
          <InfoBoxTrigger asChild>
            <Button variant="secondary" size="32">
              Infobox
            </Button>
          </InfoBoxTrigger>
          <InfoBoxContent heading="Title">Info text</InfoBoxContent>
        </InfoBox>
        <InfoBox>
          <InfoBoxTrigger asChild>
            <Button variant="secondary" size="32">
              With icon
            </Button>
          </InfoBoxTrigger>
          <InfoBoxContent
            side="right"
            icon={<InfoCircleIcon className="text-foreground-inverse" />}
            heading="Title"
          >
            Info text
          </InfoBoxContent>
        </InfoBox>
        <InfoBox>
          <InfoBoxTrigger asChild>
            <Button variant="secondary" size="32">
              With actions
            </Button>
          </InfoBoxTrigger>
          <InfoBoxContent
            side="bottom"
            heading="Title"
            primaryAction={{ label: "OK", onClick: () => console.log("OK") }}
            secondaryAction={{ label: "Dismiss", onClick: () => console.log("Dismiss") }}
          >
            Info text with a longer description that wraps across multiple lines.
          </InfoBoxContent>
        </InfoBox>
        <InfoBox>
          <InfoBoxTrigger asChild>
            <IconButton variant="tertiary" icon={<InfoCircleIcon />} aria-label="Info" />
          </InfoBoxTrigger>
          <InfoBoxContent
            icon={<InfoCircleIcon className="text-foreground-inverse" />}
            heading="Title"
            primaryAction={{ label: "OK", onClick: () => console.log("OK") }}
            secondaryAction={{ label: "Dismiss", onClick: () => console.log("Dismiss") }}
          >
            Info text
          </InfoBoxContent>
        </InfoBox>
      </div>
    </div>
  );
}

function AudioUploadDemo() {
  return (
    <div id="audioupload" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Audio Upload</h2>
      <AudioUpload
        className="w-80"
        onFilesAccepted={(files) => console.log("Accepted:", files)}
        onRecordingComplete={(blob, duration) => console.log("Recording:", blob, duration)}
      />
      <AudioUpload
        className="w-80"
        allowRecording={false}
        onFilesAccepted={(files) => console.log("Accepted:", files)}
      />
      <AudioUpload className="w-80" disabled />
      <AudioUpload
        className="w-80"
        uploadTitle="Drop your audio here"
        uploadDescription="MP3, WAV, OGG — max 5MB"
        separatorText="or alternatively"
        recordButtonLabel="Use microphone"
        maxFileSize={5 * 1024 * 1024}
      />
      <AudioUpload
        className="w-80"
        maxFiles={7}
        uploadDescription="Audio files only, up to 10MB each (max 7 files)"
      />
      <AudioUpload className="w-80" maxRecordingDuration={10} />
    </div>
  );
}

function LoaderDemo() {
  return (
    <div id="loader" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Loader</h2>
      <div className="flex flex-col gap-6">
        <Loader show center minHeight={120} />
        <Loader show centerX minHeight={80} />
        <Loader show centerY minHeight={120} />
        <Loader show minHeight={80} />
      </div>
    </div>
  );
}

function DialogDemo() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [smOpen, setSmOpen] = useState(false);
  const [lgOpen, setLgOpen] = useState(false);
  const [backOpen, setBackOpen] = useState(false);
  const [scrollOpen, setScrollOpen] = useState(false);

  return (
    <div id="dialog" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-bold-heading-xs mb-4">Dialog</h2>

      {/* Basic */}
      <h3 className="typography-semibold-body-lg">Basic</h3>
      <div className="flex flex-wrap gap-3">
        <Dialog open={basicOpen} onOpenChange={setBasicOpen}>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <DialogDescription>
                Dialog body text goes here. Describe the content or provide information to the user.
              </DialogDescription>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button>Accept</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sizes */}
      <h3 className="typography-semibold-body-lg mt-4">Sizes</h3>
      <div className="flex flex-wrap gap-3">
        <Dialog open={smOpen} onOpenChange={setSmOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">Small (400px)</Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>Small Dialog</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <DialogDescription>A compact confirmation dialog.</DialogDescription>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={lgOpen} onOpenChange={setLgOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">Large (600px)</Button>
          </DialogTrigger>
          <DialogContent size="lg">
            <DialogHeader>
              <DialogTitle>Large Dialog</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <DialogDescription>A wider dialog for complex content.</DialogDescription>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* With Back Button */}
      <h3 className="typography-semibold-body-lg mt-4">With Back Button</h3>
      <div className="flex flex-wrap gap-3">
        <Dialog open={backOpen} onOpenChange={setBackOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">With Back</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader onBack={() => setBackOpen(false)}>
              <DialogTitle>Step 2</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <DialogDescription>This dialog has a back button in the header.</DialogDescription>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button>Next</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Scrollable */}
      <h3 className="typography-semibold-body-lg mt-4">Scrollable</h3>
      <div className="flex flex-wrap gap-3">
        <Dialog open={scrollOpen} onOpenChange={setScrollOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">Scrollable</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Terms and Conditions</DialogTitle>
            </DialogHeader>
            <DialogBody>
              {Array.from({ length: 15 }, (_, i) => `paragraph-${i + 1}`).map((id) => (
                <p key={id} className="typography-regular-body-lg mb-4 text-foreground-secondary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </p>
              ))}
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Decline</Button>
              </DialogClose>
              <Button>Accept</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function BreadcrumbDemo() {
  return (
    <div id="breadcrumb" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-h3 mb-4">Breadcrumb</h2>
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/section">Section</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/section">Section</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/section/subsection">Subsection</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}

function SkeletonDemo() {
  return (
    <div id="skeleton" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-bold-heading-xs mb-4">Skeleton</h2>

      {/* Variants */}
      <h3 className="typography-semibold-body-lg">Variants</h3>
      <div className="flex flex-col gap-4">
        <div>
          <p className="typography-regular-body-sm mb-1 text-foreground-tertiary">text</p>
          <Skeleton variant="text" width={240} />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
        </div>
        <div>
          <p className="typography-regular-body-sm mb-1 text-foreground-tertiary">circular</p>
          <div className="flex gap-3">
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={64} height={64} />
          </div>
        </div>
        <div>
          <p className="typography-regular-body-sm mb-1 text-foreground-tertiary">rectangular</p>
          <Skeleton variant="rectangular" width="100%" height={120} />
        </div>
        <div>
          <p className="typography-regular-body-sm mb-1 text-foreground-tertiary">rounded</p>
          <Skeleton variant="rounded" width="100%" height={120} />
        </div>
      </div>

      {/* Animations */}
      <h3 className="typography-semibold-body-lg mt-4">Animations</h3>
      <div className="flex flex-col gap-4">
        <div>
          <p className="typography-regular-body-sm mb-1 text-foreground-tertiary">
            pulse (default)
          </p>
          <Skeleton variant="rectangular" width="100%" height={60} animation="pulse" />
        </div>
        <div>
          <p className="typography-regular-body-sm mb-1 text-foreground-tertiary">wave</p>
          <Skeleton variant="rectangular" width="100%" height={60} animation="wave" />
        </div>
        <div>
          <p className="typography-regular-body-sm mb-1 text-foreground-tertiary">disabled</p>
          <Skeleton variant="rectangular" width="100%" height={60} animation={false} />
        </div>
      </div>

      {/* Wrapping children */}
      <h3 className="typography-semibold-body-lg mt-4">Wrapping children</h3>
      <Skeleton variant="rounded">
        <div className="h-24 w-64">Content shape preserved</div>
      </Skeleton>

      {/* Composition: Avatar + Text */}
      <h3 className="typography-semibold-body-lg mt-4">Composition patterns</h3>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-1">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </div>
        </div>

        {/* Composition: Card */}
        <div className="w-72 space-y-3 rounded-lg border border-neutral-200 p-0 pb-3">
          <Skeleton variant="rectangular" width="100%" height={160} />
          <div className="flex items-center gap-3 px-3">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1 space-y-1">
              <Skeleton variant="text" width="70%" />
              <Skeleton variant="text" width="50%" />
            </div>
          </div>
        </div>

        {/* Composition: Card with wave */}
        <div className="w-72 space-y-3 rounded-lg border border-neutral-200 p-0 pb-3">
          <Skeleton variant="rectangular" width="100%" height={160} animation="wave" />
          <div className="flex items-center gap-3 px-3">
            <Skeleton variant="circular" width={40} height={40} animation="wave" />
            <div className="flex-1 space-y-1">
              <Skeleton variant="text" width="70%" animation="wave" />
              <Skeleton variant="text" width="50%" animation="wave" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardDemo() {
  return (
    <div id="card" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="typography-bold-heading-xs mb-4">Card</h2>

      {/* All variants */}
      <h3 className="typography-semibold-body-lg">Variants</h3>
      <div className="flex flex-wrap items-start gap-6">
        {(["outlined", "elevated", "filled", "ghost"] as const).map((variant) => (
          <Card key={variant} variant={variant} className="w-64">
            <CardHeader action={<HomeIcon className="size-5" />}>
              <CardTitle>Card title</CardTitle>
              <CardDescription>Card description text</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="typography-regular-body-md text-foreground-tertiary">
                Content goes here
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" size="40">
                Label
              </Button>
              <Button variant="primary" size="40">
                Label
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Header only */}
      <h3 className="typography-semibold-body-lg mt-4">Header only</h3>
      <Card className="max-w-sm">
        <CardHeader action={<SettingsIcon className="size-5" />}>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account preferences</CardDescription>
        </CardHeader>
      </Card>

      {/* Content only */}
      <h3 className="typography-semibold-body-lg mt-4">Content only</h3>
      <Card className="max-w-sm">
        <CardContent>
          <p className="typography-regular-body-md text-foreground-default">
            A simple card with just content and no header or footer.
          </p>
        </CardContent>
      </Card>

      {/* No padding (media card) */}
      <h3 className="typography-semibold-body-lg mt-4">No padding</h3>
      <Card className="max-w-sm" noPadding>
        <div className="h-40 w-full rounded-t-2xl bg-neutral-200" />
        <div className="p-4">
          <CardHeader>
            <CardTitle>Media Card</CardTitle>
            <CardDescription>Card with an image banner</CardDescription>
          </CardHeader>
        </div>
      </Card>
    </div>
  );
}

function App() {
  const [dark, setDark] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  React.useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  const sections = [
    { id: "accordion", label: "Accordion" },
    { id: "alert", label: "Alert" },
    { id: "autocomplete", label: "Autocomplete" },
    { id: "audioupload", label: "Audio Upload" },
    { id: "avatar", label: "Avatar" },
    { id: "badge", label: "Badge" },
    { id: "button", label: "Button" },
    { id: "card", label: "Card" },
    { id: "checkbox", label: "Checkbox" },
    { id: "chip", label: "Chip" },
    { id: "count", label: "Count" },
    { id: "datepicker", label: "Date Picker" },
    { id: "dialog", label: "Dialog" },
    { id: "divider", label: "Divider" },
    { id: "drawer", label: "Drawer" },
    { id: "iconbutton", label: "Icon Button" },
    { id: "icons", label: "Icons" },
    { id: "infobox", label: "InfoBox" },
    { id: "loader", label: "Loader" },
    { id: "logo", label: "Logo" },
    { id: "mobilestepper", label: "Mobile Stepper" },
    { id: "pagination", label: "Pagination" },
    { id: "passwordfield", label: "Password Field" },
    { id: "pill", label: "Pill" },
    { id: "progressbar", label: "Progress Bar" },
    { id: "radio", label: "Radio" },
    { id: "searchfield", label: "Search Field" },
    { id: "select", label: "Select" },
    { id: "skeleton", label: "Skeleton" },
    { id: "slider", label: "Slider" },
    { id: "snackbar", label: "Snackbar" },
    { id: "switch", label: "Switch" },
    { id: "switchfield", label: "Switch Field" },
    { id: "switchtoggle", label: "Switch Toggle" },
    { id: "tabs", label: "Tabs" },
    { id: "textarea", label: "Text Area" },
    { id: "textfield", label: "Text Field" },
    { id: "toast", label: "Toast" },
    { id: "loader", label: "Loader" },
    { id: "breadcrumb", label: "Breadcrumb" },
    { id: "skeleton", label: "Skeleton" },
    { id: "tooltip", label: "Tooltip" },
    { id: "typography", label: "Typography" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setTocOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-page text-foreground-default">
      <ToastProvider>
        {/* Dark / Light toggle and TOC */}
        <div className="sticky top-0 z-50 flex items-center justify-between gap-3 border-neutral-200 border-b bg-inherit px-4 py-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setTocOpen((prev) => !prev)}
              className="typography-semibold-body-md flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-solid dark:hover:bg-neutral-800"
              aria-label="Toggle table of contents"
            >
              <HomeIcon className="size-4" />
              <span>Components</span>
              <ChevronRightIcon
                className={`size-4 transition-transform ${tocOpen ? "rotate-90" : ""}`}
              />
            </button>
            {tocOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setTocOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute top-full left-0 z-50 mt-2 max-h-[calc(100vh-100px)] w-64 overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-solid">
                  <div className="p-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => scrollToSection(section.id)}
                        className="typography-semibold-body-md w-full rounded px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        {section.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="typography-semibold-body-md">{dark ? "Dark" : "Light"}</span>
            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${dark ? "bg-brand-accent-default" : "bg-neutral-200"}`}
              aria-label="Toggle dark mode"
            >
              <span
                className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm ring-0 transition-transform ${dark ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>
        </div>

        <main className="container mx-auto px-4 py-12">
          <section className="space-y-8">
            {/* Logo */}
            <LogoDemo />

            {/* Icons */}
            <IconsDemo />

            {/* Typography */}
            <TypographyDemo />

            {/* Avatar */}
            <AvatarDemo />

            {/* Accordion */}
            <AccordionDemo />

            {/* Alert */}
            <AlertDemo />

            {/* Button */}
            <ButtonDemo />

            {/* Badge */}
            <BadgeDemo />

            {/* Icon Button */}
            <IconButtonDemo />

            {/* Pill */}
            <PillDemo />

            {/* Checkbox */}
            <CheckboxDemo />

            {/* Radio */}
            <RadioDemo />

            {/* TextField */}
            <TextFieldShowcase />

            {/* PasswordField */}
            <PasswordFieldShowcase />

            {/* TextArea */}
            <TextAreaShowcase />

            {/* SearchField */}
            <SearchFieldShowcase />

            {/* Autocomplete */}
            <AutocompleteDemo />

            {/* Select */}
            <SelectDemo />

            {/* Count */}
            <CountDemo />

            {/* Chip */}
            <ChipDemo />

            {/* Snackbar */}
            <SnackbarDemo />

            {/* Switch */}
            <SwitchDemo />

            {/* SwitchField */}
            <SwitchFieldDemo />

            {/* SwitchToggle */}
            <SwitchToggleDemo />

            {/* DatePicker */}
            <DatePickerDemo />

            {/* Divider */}
            <DividerDemo />

            {/* Drawer */}
            <DrawerDemo />

            {/* Tabs */}
            <TabsDemo />

            {/* Slider */}
            <SliderDemo />

            {/* Pagination */}
            <PaginationDemo />

            {/* ProgressBar */}
            <ProgressBarDemo />

            {/* MobileStepper */}
            <MobileStepperDemo />

            {/* Tooltip */}
            <TooltipDemo />
            <InfoBoxDemo />

            {/* Audio Upload */}
            <AudioUploadDemo />

            {/* Loader */}
            <LoaderDemo />

            {/* Skeleton */}
            <SkeletonDemo />

            {/* Card */}
            <CardDemo />

            {/* Toast */}
            <ToastDemo />

            {/* Dialog */}
            <DialogDemo />

            {/* Breadcrumb */}
            <BreadcrumbDemo />
          </section>
        </main>
      </ToastProvider>
    </div>
  );
}

export default App;
