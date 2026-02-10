import { useState } from "react";
import { MicrophoneIcon } from "./components/Icons/MicrophoneIcon";
import { StopIcon } from "./components/Icons/StopIcon";
import type { DateRange } from "react-day-picker";
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
  Count,
  CrossIcon,
  CrownIcon,
  DatePicker,
  ErrorCircleIcon,
  FireIcon,
  HomeIcon,
  IconButton,
  InfoCircleIcon,
  Logo,
  MinusIcon,
  Pill,
  PlusIcon,
  Radio,
  RadioGroup,
  Snackbar,
  SpinnerIcon,
  VipBadgeIcon,
  WarningTriangleIcon,
} from "./index";
import "./styles/theme.css";

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

function App() {
  const [dark, setDark] = useState(false);
  const InfoIcon = <InfoCircleIcon />;
  const SuccessIcon = <CheckCircleIcon />;
  const WarningIcon = <WarningTriangleIcon />;
  const ErrorIcon = <ErrorCircleIcon />;

  return (
    <div
      className={`min-h-screen ${dark ? "dark bg-body-black-solid-constant text-body-white-solid-constant" : "bg-background-white-solid-constant text-body-100"}`}
    >
      {/* Dark / Light toggle */}
      <div className="sticky top-0 z-50 flex items-center justify-end gap-3 border-neutral-200 border-b bg-inherit px-4 py-3">
        <span className="font-medium text-sm">{dark ? "Dark" : "Light"}</span>
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
            <Logo type="Full" color="Full colour" />
            <Logo type="Icon" color="Full colour" />
            <Logo type="Portrait" color="Full colour" />
            <Logo type="Wordmark" color="Full colour" />
            <Logo type="Full" color="Decolour" />
            <Logo type="Icon" color="Decolour" />
            <Logo type="Portrait" color="Decolour" />
            <Logo type="Wordmark" color="Decolour" />
          </div>
          <div className="rounded-lg bg-background-white-solid-constant p-4">
            <div className="flex flex-wrap items-start gap-8">
              <Logo type="Full" color="Black Always" />
              <Logo type="Icon" color="Black Always" />
              <Logo type="Portrait" color="Black Always" />
              <Logo type="Wordmark" color="Black Always" />
            </div>
          </div>
          <div className="rounded-lg bg-body-black-solid-constant p-4">
            <div className="flex flex-wrap items-start gap-8">
              <Logo type="Full" color="White Always" />
              <Logo type="Icon" color="White Always" />
              <Logo type="Portrait" color="White Always" />
              <Logo type="Wordmark" color="White Always" />
            </div>
          </div>

          {/* Icons */}
          <div className="space-y-6">
            <h2 className="font-bold text-lg">Icons</h2>

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
            <Button variant="switch">Label</Button>
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
                <Button variant="switch" size={size}>
                  Label
                </Button>
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
            <Button variant="switch" disabled>
              Label
            </Button>
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
            <Button variant="switch" size="40">
              Label
            </Button>
            <Button variant="switch" size="40" active>
              Label
            </Button>
            <Button variant="switch" size="32">
              Label
            </Button>
            <Button variant="switch" size="32" active>
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

          <div className="space-y-6">
            <h2 className="font-bold text-lg">Icon Buttons</h2>

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
            <Badge variant="info" leftDot={false} leftIcon={<InfoCircleIcon className="size-3" />}>
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
            <Count value={5} variant="Default" />
            <Count value={12} variant="Brand" />
            <Count value={8} variant="Pink" />
            <Count value={3} variant="Info" />
            <Count value={7} variant="Success" />
            <Count value={15} variant="Warning" />
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
              <span>
                <span className="font-medium">@user.with.username</span> changed their subscription
                price to <span className="font-medium">$43.99</span> per month
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

          <DatePickerShowcase />
        </section>
      </div>
    </div>
  );
}

export default App;
