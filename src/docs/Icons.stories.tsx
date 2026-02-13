import type { Meta, StoryObj } from "@storybook/react";
import { type ComponentType, useState } from "react";
import { ArrowRightIcon } from "../components/Icons/ArrowRightIcon";
import { ArrowUpRightIcon } from "../components/Icons/ArrowUpRightIcon";
import { CheckCircleIcon } from "../components/Icons/CheckCircleIcon";
import { CheckIcon } from "../components/Icons/CheckIcon";
import { ChevronLeftIcon } from "../components/Icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../components/Icons/ChevronRightIcon";
import { CloseIcon } from "../components/Icons/CloseIcon";
import { CrossIcon } from "../components/Icons/CrossIcon";
import { CrownIcon } from "../components/Icons/CrownIcon";
import { ErrorCircleIcon } from "../components/Icons/ErrorCircleIcon";
import { ErrorIcon } from "../components/Icons/ErrorIcon";
import { EyeIcon } from "../components/Icons/EyeIcon";
import { FireIcon } from "../components/Icons/FireIcon";
import { HomeIcon } from "../components/Icons/HomeIcon";
import { InfoCircleIcon } from "../components/Icons/InfoCircleIcon";
import { InfoIcon } from "../components/Icons/InfoIcon";
import { MicrophoneIcon } from "../components/Icons/MicrophoneIcon";
import { MinusIcon } from "../components/Icons/MinusIcon";
import { PlusIcon } from "../components/Icons/PlusIcon";
import { SpinnerIcon } from "../components/Icons/SpinnerIcon";
import { StopIcon } from "../components/Icons/StopIcon";
import { SuccessIcon } from "../components/Icons/SuccessIcon";
import type { IconProps } from "../components/Icons/types";
import { VipBadgeIcon } from "../components/Icons/VipBadgeIcon";
import { WarningIcon } from "../components/Icons/WarningIcon";
import { WarningTriangleIcon } from "../components/Icons/WarningTriangleIcon";

const meta = {
  title: "Foundations/Icons",
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

type IconEntry = {
  name: string;
  component: ComponentType<IconProps>;
  tags: string[];
};

const icons: IconEntry[] = [
  {
    name: "ArrowRightIcon",
    component: ArrowRightIcon,
    tags: ["arrow", "right", "navigation", "next"],
  },
  {
    name: "ArrowUpRightIcon",
    component: ArrowUpRightIcon,
    tags: ["arrow", "up", "right", "external", "link"],
  },
  {
    name: "CheckCircleIcon",
    component: CheckCircleIcon,
    tags: ["check", "circle", "success", "done", "complete"],
  },
  { name: "CheckIcon", component: CheckIcon, tags: ["check", "tick", "done", "confirm"] },
  {
    name: "ChevronLeftIcon",
    component: ChevronLeftIcon,
    tags: ["chevron", "left", "back", "navigation"],
  },
  {
    name: "ChevronRightIcon",
    component: ChevronRightIcon,
    tags: ["chevron", "right", "forward", "navigation"],
  },
  { name: "CloseIcon", component: CloseIcon, tags: ["close", "x", "dismiss", "remove"] },
  { name: "CrossIcon", component: CrossIcon, tags: ["cross", "x", "close", "cancel", "remove"] },
  { name: "CrownIcon", component: CrownIcon, tags: ["crown", "premium", "vip", "special"] },
  {
    name: "ErrorCircleIcon",
    component: ErrorCircleIcon,
    tags: ["error", "circle", "alert", "danger"],
  },
  { name: "ErrorIcon", component: ErrorIcon, tags: ["error", "alert", "danger", "warning"] },
  { name: "EyeIcon", component: EyeIcon, tags: ["eye", "view", "visibility", "show", "watch"] },
  { name: "FireIcon", component: FireIcon, tags: ["fire", "hot", "trending", "popular"] },
  { name: "HomeIcon", component: HomeIcon, tags: ["home", "house", "main", "start"] },
  {
    name: "InfoCircleIcon",
    component: InfoCircleIcon,
    tags: ["info", "circle", "information", "help"],
  },
  { name: "InfoIcon", component: InfoIcon, tags: ["info", "information", "help", "details"] },
  {
    name: "MicrophoneIcon",
    component: MicrophoneIcon,
    tags: ["microphone", "mic", "audio", "voice", "record"],
  },
  { name: "MinusIcon", component: MinusIcon, tags: ["minus", "subtract", "remove", "decrease"] },
  { name: "PlusIcon", component: PlusIcon, tags: ["plus", "add", "create", "new", "increase"] },
  { name: "SpinnerIcon", component: SpinnerIcon, tags: ["spinner", "loading", "progress", "wait"] },
  { name: "StopIcon", component: StopIcon, tags: ["stop", "halt", "pause", "end"] },
  {
    name: "SuccessIcon",
    component: SuccessIcon,
    tags: ["success", "check", "done", "complete", "approve"],
  },
  {
    name: "VipBadgeIcon",
    component: VipBadgeIcon,
    tags: ["vip", "badge", "premium", "special", "star"],
  },
  { name: "WarningIcon", component: WarningIcon, tags: ["warning", "caution", "alert"] },
  {
    name: "WarningTriangleIcon",
    component: WarningTriangleIcon,
    tags: ["warning", "triangle", "caution", "alert", "danger"],
  },
];

function IconCard({ entry, size }: { entry: IconEntry; size: string }) {
  const [copied, setCopied] = useState(false);
  const Icon = entry.component;

  const importText = `import { ${entry.name} } from "fanv-ui";`;

  const handleCopy = () => {
    navigator.clipboard.writeText(importText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 16,
        borderRadius: 8,
        border: "1px solid var(--color-neutral-100)",
        backgroundColor: copied ? "var(--color-success-50)" : "var(--color-background-700)",
        cursor: "pointer",
        transition: "background-color 150ms, border-color 150ms",
        width: "100%",
      }}
      title={`Click to copy: ${importText}`}
    >
      <Icon className={size} style={{ color: "var(--color-body-100)" }} />
      <span
        style={{
          fontSize: 11,
          fontFamily: "monospace",
          color: copied ? "var(--color-success-500)" : "var(--color-body-200)",
          textAlign: "center",
          wordBreak: "break-all",
        }}
      >
        {copied ? "Copied!" : entry.name}
      </span>
    </button>
  );
}

function IconGallery() {
  const [search, setSearch] = useState("");
  const [size, setSize] = useState("size-5");

  const filtered = icons.filter((icon) => {
    const q = search.toLowerCase();
    return icon.name.toLowerCase().includes(q) || icon.tags.some((tag) => tag.includes(q));
  });

  return (
    <div style={{ padding: "40px 48px", maxWidth: 960, fontFamily: "Inter, sans-serif" }}>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 800,
          color: "var(--color-body-100)",
          margin: "0 0 8px",
        }}
      >
        Icons
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "var(--color-body-200)",
          margin: "0 0 12px",
          maxWidth: 640,
          lineHeight: 1.5,
        }}
      >
        {icons.length} icons available. Each icon is a{" "}
        <code
          style={{
            fontSize: 14,
            fontFamily: "monospace",
            padding: "1px 4px",
            backgroundColor: "var(--color-background-600)",
            borderRadius: 3,
          }}
        >
          forwardRef
        </code>{" "}
        SVG component that accepts all standard SVG props. Default size is{" "}
        <code
          style={{
            fontSize: 14,
            fontFamily: "monospace",
            padding: "1px 4px",
            backgroundColor: "var(--color-background-600)",
            borderRadius: 3,
          }}
        >
          size-5
        </code>{" "}
        (20px). Click any icon to copy its import statement.
      </p>
      <div
        style={{
          display: "flex",
          gap: 8,
          margin: "0 0 12px",
          flexWrap: "wrap",
        }}
      >
        <code
          style={{
            fontSize: 13,
            fontFamily: "monospace",
            color: "var(--color-primary-300)",
            padding: "8px 12px",
            backgroundColor: "var(--color-background-600)",
            borderRadius: 6,
          }}
        >
          {'import { CheckIcon } from "fanv-ui";'}
        </code>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          margin: "24px 0 24px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            maxWidth: 320,
            padding: "8px 12px",
            fontSize: 14,
            borderRadius: 6,
            border: "1px solid var(--color-neutral-200)",
            backgroundColor: "var(--color-background-200)",
            color: "var(--color-body-100)",
            outline: "none",
          }}
        />
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { label: "16", value: "size-4" },
            { label: "20", value: "size-5" },
            { label: "24", value: "size-6" },
            { label: "32", value: "size-8" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSize(opt.value)}
              style={{
                padding: "6px 10px",
                fontSize: 12,
                fontFamily: "monospace",
                borderRadius: 4,
                border: "1px solid var(--color-neutral-200)",
                backgroundColor:
                  size === opt.value
                    ? "var(--color-brand-purple-500)"
                    : "var(--color-background-700)",
                color: size === opt.value ? "#fff" : "var(--color-body-200)",
                cursor: "pointer",
              }}
            >
              {opt.label}px
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: "var(--color-body-200)", fontSize: 14, padding: "40px 0" }}>
          No icons matching "{search}".
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: 8,
          }}
        >
          {filtered.map((entry) => (
            <IconCard key={entry.name} entry={entry} size={size} />
          ))}
        </div>
      )}
    </div>
  );
}

export const Gallery: Story = {
  render: () => <IconGallery />,
};
