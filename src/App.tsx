import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { MicrophoneIcon } from "./components/Icons/MicrophoneIcon";
import { StopIcon } from "./components/Icons/StopIcon";
import {
  Alert,
  ArrowRightIcon,
  ArrowUpRightIcon,
  Avatar,
  Badge,
  Button,
  Checkbox,
  CheckCircleIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Chip,
  Count,
  CrossIcon,
  CrownIcon,
  DatePicker,
  Divider,
  ErrorCircleIcon,
  FireIcon,
  HomeIcon,
  IconButton,
  InfoCircleIcon,
  Logo,
  MinusIcon,
  Pagination,
  Pill,
  PlusIcon,
  ProgressBar,
  Radio,
  RadioGroup,
  Slider,
  Snackbar,
  SpinnerIcon,
  Switch,
  SwitchField,
  SwitchToggle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toast,
  ToastProvider,
  ToastViewport,
  VipBadgeIcon,
  WarningTriangleIcon,
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
        type="double"
        defaultMonth={new Date(2026, 1)}
        selected={doubleDate}
        onSelect={setDoubleDate}
      />
      <DatePicker
        mode="range"
        type="double"
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
      <Slider defaultValue={[30]} minLabel="Low" maxLabel="High" />
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

function App() {
  const [dark, setDark] = useState(false);
  const InfoIcon = <InfoCircleIcon />;
  const SuccessIcon = <CheckCircleIcon />;
  const WarningIcon = <WarningTriangleIcon />;
  const ErrorIcon = <ErrorCircleIcon />;

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
  });

  const showToast = (type: keyof typeof toasts) => {
    setToasts((prev) => ({ ...prev, [type]: true }));
  };

  const hideToast = (type: keyof typeof toasts) => {
    setToasts((prev) => ({ ...prev, [type]: false }));
  };

  return (
    <div
      className={`min-h-screen ${dark ? "dark bg-body-black-solid-constant text-body-white-solid-constant" : "bg-background-white-solid-constant text-body-100"}`}
    >
      <ToastProvider>
        {/* Dark / Light toggle */}
        <div className="sticky top-0 z-50 flex items-center justify-end gap-3 border-neutral-200 border-b bg-inherit px-4 py-3">
          <span className="typography-body-2-medium">{dark ? "Dark" : "Light"}</span>
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${dark ? "bg-brand-green-500" : "bg-neutral-200"}`}
            aria-label="Toggle dark mode"
          >
            <span
              className={`pointer-events-none inline-block size-5 rounded-full bg-background-white-solid-constant shadow-sm ring-0 transition-transform ${dark ? "translate-x-5" : "translate-x-0"}`}
            />
          </button>
        </div>

        <div className="container mx-auto px-4 py-12">
          <section className="space-y-8">
            <div className="flex flex-wrap items-start gap-8">
              <Logo type="full" color="fullColour" />
              <Logo type="icon" color="fullColour" />
              <Logo type="portrait" color="fullColour" />
              <Logo type="wordmark" color="fullColour" />
              <Logo type="full" color="decolour" />
              <Logo type="icon" color="decolour" />
              <Logo type="portrait" color="decolour" />
              <Logo type="wordmark" color="decolour" />
            </div>
            <div className="rounded-lg bg-background-white-solid-constant p-4">
              <div className="flex flex-wrap items-start gap-8">
                <Logo type="full" color="blackAlways" />
                <Logo type="icon" color="blackAlways" />
                <Logo type="portrait" color="blackAlways" />
                <Logo type="wordmark" color="blackAlways" />
              </div>
            </div>
            <div className="rounded-lg bg-body-black-solid-constant p-4">
              <div className="flex flex-wrap items-start gap-8">
                <Logo type="full" color="whiteAlways" />
                <Logo type="icon" color="whiteAlways" />
                <Logo type="portrait" color="whiteAlways" />
                <Logo type="wordmark" color="whiteAlways" />
              </div>
            </div>

            {/* Icons */}
            <div className="space-y-6">
              {/* Default — inherits currentColor from the page theme */}
              <div className="flex flex-wrap items-end gap-6">
                {(
                  [
                    ["ArrowRightIcon", ArrowRightIcon],
                    ["ArrowUpRightIcon", ArrowUpRightIcon],
                    ["CheckCircleIcon", CheckCircleIcon],
                    ["CheckIcon", CheckIcon],
                    ["ChevronLeftIcon", ChevronLeftIcon],
                    ["ChevronRightIcon", ChevronRightIcon],
                    ["CrossIcon", CrossIcon],
                    ["CrownIcon", CrownIcon],
                    ["ErrorCircleIcon", ErrorCircleIcon],
                    ["FireIcon", FireIcon],
                    ["HomeIcon", HomeIcon],
                    ["InfoCircleIcon", InfoCircleIcon],
                    ["MinusIcon", MinusIcon],
                    ["PlusIcon", PlusIcon],
                    ["SpinnerIcon", SpinnerIcon],
                    ["WarningTriangleIcon", WarningTriangleIcon],
                  ] as const
                ).map(([name, Icon]) => (
                  <div key={name} className="flex flex-col items-center gap-2">
                    <Icon className="size-6" />
                    <span className="text-[10px] text-body-200 leading-tight">
                      {name.replace("Icon", "")}
                    </span>
                  </div>
                ))}
                {/* VipBadge is fixed-size so render separately */}
                <div className="flex flex-col items-center gap-2">
                  <VipBadgeIcon className="size-6" />
                  <span className="text-[10px] text-body-200 leading-tight">VipBadge</span>
                </div>
              </div>

              {/* On light background (always visible in dark mode) */}
              <div className="flex flex-wrap items-end gap-6 rounded-lg bg-background-white-solid-constant p-4 text-body-black-solid-constant">
                {(
                  [
                    ["ArrowRight", ArrowRightIcon],
                    ["ArrowUpRight", ArrowUpRightIcon],
                    ["CheckCircle", CheckCircleIcon],
                    ["Check", CheckIcon],
                    ["ChevronLeft", ChevronLeftIcon],
                    ["ChevronRight", ChevronRightIcon],
                    ["Cross", CrossIcon],
                    ["Crown", CrownIcon],
                    ["ErrorCircle", ErrorCircleIcon],
                    ["Fire", FireIcon],
                    ["Home", HomeIcon],
                    ["InfoCircle", InfoCircleIcon],
                    ["Minus", MinusIcon],
                    ["Plus", PlusIcon],
                    ["Spinner", SpinnerIcon],
                    ["Warning", WarningTriangleIcon],
                  ] as const
                ).map(([name, Icon]) => (
                  <div key={name} className="flex flex-col items-center gap-2">
                    <Icon className="size-6" />
                    <span className="text-[10px] leading-tight opacity-50">{name}</span>
                  </div>
                ))}
                <div className="flex flex-col items-center gap-2">
                  <VipBadgeIcon className="size-6" />
                  <span className="text-[10px] leading-tight opacity-50">VipBadge</span>
                </div>
              </div>

              {/* On dark background (always visible in light mode) */}
              <div className="flex flex-wrap items-end gap-6 rounded-lg bg-body-black-solid-constant p-4 text-body-white-solid-constant">
                {(
                  [
                    ["ArrowRight", ArrowRightIcon],
                    ["ArrowUpRight", ArrowUpRightIcon],
                    ["CheckCircle", CheckCircleIcon],
                    ["Check", CheckIcon],
                    ["ChevronLeft", ChevronLeftIcon],
                    ["ChevronRight", ChevronRightIcon],
                    ["Cross", CrossIcon],
                    ["Crown", CrownIcon],
                    ["ErrorCircle", ErrorCircleIcon],
                    ["Fire", FireIcon],
                    ["Home", HomeIcon],
                    ["InfoCircle", InfoCircleIcon],
                    ["Minus", MinusIcon],
                    ["Plus", PlusIcon],
                    ["Spinner", SpinnerIcon],
                    ["Warning", WarningTriangleIcon],
                  ] as const
                ).map(([name, Icon]) => (
                  <div key={name} className="flex flex-col items-center gap-2">
                    <Icon className="size-6" />
                    <span className="text-[10px] leading-tight opacity-50">{name}</span>
                  </div>
                ))}
                <div className="flex flex-col items-center gap-2">
                  <VipBadgeIcon className="size-6" />
                  <span className="text-[10px] leading-tight opacity-50">VipBadge</span>
                </div>
              </div>

              {/* Sizes */}
              <div className="flex flex-wrap items-end gap-8">
                <div className="flex flex-col items-center gap-1">
                  <HomeIcon className="size-4" />
                  <span className="text-[10px] text-body-200">16px</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <HomeIcon />
                  <span className="text-[10px] text-body-200">20px</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <HomeIcon className="size-6" />
                  <span className="text-[10px] text-body-200">24px</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <HomeIcon className="size-8" />
                  <span className="text-[10px] text-body-200">32px</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <HomeIcon className="size-10" />
                  <span className="text-[10px] text-body-200">40px</span>
                </div>
              </div>
            </div>

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

            <div className="max-w-2xl space-y-4">
              <Alert variant="info" icon={InfoIcon}>
                This is an informational alert message.
              </Alert>
              <Alert variant="success" icon={SuccessIcon}>
                Your changes have been saved successfully.
              </Alert>
              <Alert variant="warning" icon={WarningIcon}>
                Please review your information before proceeding.
              </Alert>
              <Alert variant="error" icon={ErrorIcon}>
                An error occurred while processing your request.
              </Alert>
              <Alert variant="info" icon={InfoIcon} closable>
                This is a closable info alert.
              </Alert>
              <Alert variant="info" icon={InfoIcon} title="Informational title">
                This alert has a title and a description body.
              </Alert>
              <Alert variant="error" icon={ErrorIcon} title="Something went wrong" closable>
                This alert shows title, icon, and closable all together.
              </Alert>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Label</Button>
              <Button variant="secondary">Label</Button>
              <Button variant="tertiary">Label</Button>
              <Button variant="brand">Label</Button>
              <Button variant="link">Label</Button>
              <Button variant="destructive">Label</Button>
              <div className="rounded-lg bg-body-black-solid-constant p-3">
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
                  <div className="rounded-lg bg-body-black-solid-constant p-2">
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
              <div className="rounded-lg bg-body-black-solid-constant p-3">
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
              <div className="rounded-lg bg-body-black-solid-constant p-3">
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
              <Button variant="primary" discount="$X.XX" price="$X.XX/ month">
                Join now
              </Button>
              <div className="rounded-lg bg-body-black-solid-constant p-3">
                <Button
                  variant="white"
                  rightIcon={<CrownIcon />}
                  discount="$X.XX"
                  price="$X.XX/ month"
                >
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
            </div>
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <IconButton variant="primary" icon={<HomeIcon />} />
                <IconButton variant="secondary" icon={<HomeIcon />} />
                <IconButton variant="tertiary" icon={<HomeIcon />} />
                <IconButton variant="brand" icon={<HomeIcon />} />
                <IconButton variant="tertiaryDestructive" icon={<CrossIcon />} />
                <IconButton variant="navTray" icon={<HomeIcon />} />
              </div>

              <div className="rounded-lg bg-body-black-solid-constant p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <IconButton variant="contrast" icon={<HomeIcon />} />
                  <IconButton variant="messaging" icon={<PlusIcon />} />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <IconButton variant="primary" icon={<HomeIcon />} size="24" />
                <IconButton variant="primary" icon={<HomeIcon />} size="32" />
                <IconButton variant="primary" icon={<HomeIcon />} size="40" />
                <IconButton variant="primary" icon={<HomeIcon />} size="52" />
                <IconButton variant="primary" icon={<HomeIcon />} size="72" />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <IconButton variant="primary" icon={<HomeIcon />} disabled />
                <IconButton variant="secondary" icon={<HomeIcon />} disabled />
                <IconButton variant="tertiary" icon={<HomeIcon />} disabled />
                <IconButton variant="brand" icon={<HomeIcon />} disabled />
                <IconButton variant="tertiaryDestructive" icon={<CrossIcon />} disabled />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <IconButton variant="tertiary" icon={<HomeIcon />} counterValue={5} />
                <IconButton variant="tertiary" icon={<HomeIcon />} counterValue={12} />
                <IconButton variant="navTray" icon={<HomeIcon />} counterValue={99} />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <IconButton variant="stop" icon={<StopIcon />} size="52" />
                <IconButton variant="microphone" icon={<MicrophoneIcon />} size="52" />
              </div>
            </div>

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
            </div>

            <div className="flex flex-wrap gap-4">
              <Badge variant="default" leftDot={false}>
                No dot
              </Badge>
              <Badge
                variant="info"
                leftDot={false}
                leftIcon={<InfoCircleIcon className="size-3" />}
              >
                Left icon
              </Badge>
              <Badge
                variant="success"
                leftDot={false}
                rightIcon={<ArrowUpRightIcon className="size-3" />}
              >
                Right icon
              </Badge>
            </div>

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

            <div className="flex flex-col gap-4">
              <Checkbox label="Default checkbox" />
              <Checkbox
                label="Small text size"
                size="small"
                helperText="Label and helper are smaller"
              />
              <Checkbox label="Checked checkbox" checked />
              <Checkbox label="Indeterminate checkbox" checked="indeterminate" />
              <Checkbox label="Disabled checkbox" disabled />
              <Checkbox label="Disabled checked" disabled checked />
              <Checkbox label="Disabled indeterminate" disabled checked="indeterminate" />
              <Checkbox label="With helper text" helperText="This field is required" />
              <Checkbox />
            </div>

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

            {/* Snackbar */}
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
                <span className="typography-body-2-medium">
                  <span>@user.with.username</span> changed their subscription price to{" "}
                  <span>$43.99</span> per month
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

            <div className="flex flex-wrap items-center gap-4">
              <Switch />
              <Switch defaultChecked />
              <Switch size="small" />
              <Switch size="small" defaultChecked />
              <Switch disabled />
              <Switch disabled defaultChecked />
              <Switch size="small" disabled />
              <Switch size="small" disabled defaultChecked />
            </div>

            <div className="flex max-w-2xl flex-col gap-4">
              <SwitchField label="Notifications" />
              <SwitchField label="Notifications" defaultChecked />
              <SwitchField label="Notifications" helperText="Receive push notifications" />
              <SwitchField
                label="Notifications"
                helperText="Receive push notifications"
                defaultChecked
              />
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

            <DatePickerShowcase />
            {/* Divider */}
            <div className="space-y-8">
              <div>
                <h3 className="typography-body-2-semibold mb-4">Default Divider</h3>
                <div className="space-y-4">
                  <p>Section 1</p>
                  <Divider />
                  <p>Section 2</p>
                  <Divider className="w-1/2" />
                  <p>Section 3</p>
                </div>
              </div>

              <div>
                <h3 className="typography-body-2-semibold mb-4">Text Divider</h3>
                <div className="space-y-4">
                  <p>Section 1</p>
                  <Divider label="or" />
                  <p>Section 2</p>
                </div>
              </div>
            </div>

            {/* Snackbar */}
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
                <span className="typography-body-2-medium">
                  <span>@user.with.username</span> changed their subscription price to{" "}
                  <span>$43.99</span> per month
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

            {/* Tabs */}
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
              </Tabs>
              <Tabs defaultValue="t">
                <TabsList>
                  <TabsTrigger value="t" disabled>
                    Tab
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Tabs defaultValue="other">
                <TabsList>
                  <TabsTrigger value="t">Tab</TabsTrigger>
                </TabsList>
              </Tabs>
              <Tabs defaultValue="other">
                <TabsList>
                  <TabsTrigger value="t" disabled>
                    Tab
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <SliderShowcase />

            <PaginationShowcase />

            {/* ProgressBar */}
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
                leftIcon={<FireIcon className="size-5" />}
                helperLeft="Keep it up!"
                helperRight="60 XP to go"
              />
            </div>

            {/* Toast */}
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
              </div>
            </div>
          </section>
        </div>

        {/* Toast instances */}
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
        <ToastViewport />
      </ToastProvider>
    </div>
  );
}

export default App;
