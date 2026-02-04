import { useState } from "react";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Checkbox,
  Count,
  Logo,
  Pill,
  Radio,
  RadioGroup,
} from "./index";
import "./styles/theme.css";

function App() {
  const [dark, setDark] = useState(false);
  const InfoIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
        clipRule="evenodd"
      />
    </svg>
  );

  const SuccessIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  );

  const WarningIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  );

  const ErrorIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
        clipRule="evenodd"
      />
    </svg>
  );

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
            <Logo type="Wordmark" color="Full colour" />
            <Logo type="Portrait" color="Full colour" />
            <Logo type="Full" color="Decolour" />
          </div>
          <div className="rounded-lg bg-background-white-solid-constant p-4">
            <div className="flex flex-wrap items-start gap-8">
              <Logo type="Full" color="Black Always" />
            </div>
          </div>
          <div className="rounded-lg bg-body-black-solid-constant p-4">
            <div className="flex flex-wrap items-start gap-8">
              <Logo type="Full" color="White Always" />
              <Logo type="Icon" color="White Always" />
              <Logo type="Wordmark" color="White Always" />
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
            <Avatar
              size={40}
              fallback={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-6"
                  aria-hidden="true"
                >
                  <title>Checkmark icon</title>
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />
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
            <Button Style="Primary">Label</Button>
            <Button Style="Secondary">Label</Button>
            <Button Style="Tertiary">Label</Button>
            <Button Style="Brand">Label</Button>
            <Button Style="Link">Label</Button>
            <Button Style="Destructive">Label</Button>
            <div className="rounded-lg bg-body-black-solid-constant p-3">
              <Button Style="White">Label</Button>
            </div>
            <Button Style="Switch">Label</Button>
            <Button Style="Tertiary Destructive">Label</Button>
            <Button Style="Text">Label</Button>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <Button Size="48">Label</Button>
            <Button Size="40">Label</Button>
            <Button Size="32">Label</Button>
            <Button Style="Text" Size="24">
              Label
            </Button>
          </div>

          <div className="space-y-3">
            {(["48", "40", "32"] as const).map((size) => (
              <div key={size} className="flex flex-wrap items-center gap-3">
                <Button Style="Primary" Size={size}>
                  Label
                </Button>
                <Button Style="Secondary" Size={size}>
                  Label
                </Button>
                <Button Style="Tertiary" Size={size}>
                  Label
                </Button>
                <Button Style="Brand" Size={size}>
                  Label
                </Button>
                <Button Style="Link" Size={size}>
                  Label
                </Button>
                <Button Style="Destructive" Size={size}>
                  Label
                </Button>
                <div className="rounded-lg bg-body-black-solid-constant p-2">
                  <Button Style="White" Size={size}>
                    Label
                  </Button>
                </div>
                <Button Style="Switch" Size={size}>
                  Label
                </Button>
                <Button Style="Tertiary Destructive" Size={size}>
                  Label
                </Button>
                <Button Style="Text" Size={size}>
                  Label
                </Button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button Style="Primary" disabled>
              Label
            </Button>
            <Button Style="Secondary" disabled>
              Label
            </Button>
            <Button Style="Tertiary" disabled>
              Label
            </Button>
            <Button Style="Brand" disabled>
              Label
            </Button>
            <Button Style="Link" disabled>
              Label
            </Button>
            <Button Style="Destructive" disabled>
              Label
            </Button>
            <div className="rounded-lg bg-body-black-solid-constant p-3">
              <Button Style="White" disabled>
                Label
              </Button>
            </div>
            <Button Style="Switch" disabled>
              Label
            </Button>
            <Button Style="Tertiary Destructive" disabled>
              Label
            </Button>
            <Button Style="Text" disabled>
              Label
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button Style="Primary" loading>
              Label
            </Button>
            <Button Style="Secondary" loading>
              Label
            </Button>
            <Button Style="Tertiary" loading>
              Label
            </Button>
            <Button Style="Brand" loading>
              Label
            </Button>
            <Button Style="Link" loading>
              Label
            </Button>
            <Button Style="Destructive" loading>
              Label
            </Button>
            <div className="rounded-lg bg-body-black-solid-constant p-3">
              <Button Style="White" loading>
                Label
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              Style="Primary"
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" />
                </svg>
              }
            >
              Label
            </Button>
            <Button
              Style="Primary"
              rightIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" />
                </svg>
              }
            >
              Label
            </Button>
            <Button
              Style="Brand"
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" />
                </svg>
              }
              rightIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" />
                </svg>
              }
            >
              Label
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button Style="Switch" Size="40">
              Label
            </Button>
            <Button Style="Switch" Size="40" active>
              Label
            </Button>
            <Button Style="Switch" Size="32">
              Label
            </Button>
            <Button Style="Switch" Size="32" active>
              Label
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button Style="Primary" price="$9.99/month">
              Subscribe
            </Button>
            <Button Style="Primary" discount="$X.XX" price="$X.XX/ month">
              Join now
            </Button>
            <div className="rounded-lg bg-body-black-solid-constant p-3">
              <Button
                Style="White"
                rightIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-5"
                    aria-hidden="true"
                  >
                    <path d="M10 2a1 1 0 011 1v1.323l1.45-.363a1 1 0 01.55 1.92l-1.15.288.5 1.5 2.5-.625a1 1 0 01.62 1.9l-3 1.5a1 1 0 01-.9 0l-3-1.5a1 1 0 01.62-1.9l2.5.625.5-1.5-1.15-.288a1 1 0 01.55-1.92l1.45.363V3a1 1 0 011-1zM4 8h12v8H4V8z" />
                  </svg>
                }
                discount="$X.XX"
                price="$X.XX/ month"
              >
                Join now
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button Style="Primary" asChild>
              <a href="#link">Link as Primary</a>
            </Button>
            <Button Style="Brand" asChild>
              <a href="#link">Link as Brand</a>
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <Badge type="Default">Default</Badge>
            <Badge type="Dark">Dark</Badge>
            <Badge type="Info">Info</Badge>
            <Badge type="Success">Success</Badge>
            <Badge type="Warning">Warning</Badge>
            <Badge type="Error">Error</Badge>
            <Badge type="Special">Special</Badge>
            <Badge type="Brand">Brand</Badge>
            <Badge type="Pink">Pink</Badge>
            <Badge type="Online">Online</Badge>
            <Badge type="Brand light">Brand light</Badge>
            <Badge type="Pink light">Pink light</Badge>
          </div>

          <div className="flex flex-wrap gap-4">
            <Badge type="Default" leftDot={false}>
              No dot
            </Badge>
            <Badge
              type="Info"
              leftDot={false}
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-3"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            >
              Left icon
            </Badge>
            <Badge
              type="Success"
              leftDot={false}
              rightIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-3"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            >
              Right icon
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4">
            <Pill variant="Green">Green</Pill>
            <Pill variant="Grey">Grey</Pill>
            <Pill variant="Blue">Blue</Pill>
            <Pill variant="Gold">Gold</Pill>
            <Pill variant="Pink Light">Pink Light</Pill>
            <Pill variant="Base">Base</Pill>
            <Pill variant="Brand">Brand</Pill>
            <Pill variant="Brand light">Brand light</Pill>
            <Pill variant="Beta">Beta</Pill>
            <Pill variant="Error">Error</Pill>
          </div>

          <div className="flex flex-wrap gap-4">
            <Pill
              variant="Brand"
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-3"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            >
              Left icon
            </Pill>
            <Pill
              variant="Blue"
              rightIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-3"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            >
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
            <Count value={9} size="Small" />
            <Count value={42} size="Medium" />
            <Count value={99} size="Large" />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Count value={150} max={99} size="Medium" />
            <Count value={1000} max={999} size="Large" />
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
