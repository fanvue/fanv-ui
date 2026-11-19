import { cloneElement, Fragment, isValidElement, type ReactNode } from "react";

const TEXT_ONLY_ELEMENTS = new Set([
  "textarea",
  "option",
  "optgroup",
  "select",
  "title",
  "text",
  "tspan",
]);

type TextChild = string | number | bigint;

type TextProps = { className?: string } & Record<`data-${string}`, string>;

function isText(node: unknown): node is TextChild {
  return typeof node === "string" || typeof node === "number" || typeof node === "bigint";
}

function isEmptySlot(node: unknown) {
  return node == null || typeof node === "boolean";
}

function textOf(slot: ReactNode): string | null {
  if (isText(slot)) return String(slot);
  if (!Array.isArray(slot)) return null;
  let text = "";
  for (const item of slot) {
    if (isEmptySlot(item)) continue;
    const part = textOf(item);
    if (part === null) return null;
    text += part;
  }
  return text;
}

function renderSlots(slots: readonly ReactNode[], textProps?: TextProps): ReactNode[] {
  const out: ReactNode[] = new Array(slots.length).fill(null);
  let runStart = -1;
  let runText = "";
  const closeRun = () => {
    if (runStart < 0) return;
    out[runStart] = runText.trim()
      ? [
          <span key="text" {...textProps}>
            {runText}
          </span>,
        ]
      : runText;
    runStart = -1;
    runText = "";
  };
  for (let index = 0; index < slots.length; index++) {
    const slot = slots[index];
    const text = textOf(slot);
    if (text !== null) {
      if (text) {
        if (runStart < 0) runStart = index;
        runText += text;
      }
    } else if (!isEmptySlot(slot)) {
      closeRun();
      out[index] = renderTextChildren(slot, textProps);
    }
  }
  closeRun();
  return out;
}

export function renderTextChildren(children: ReactNode, textProps?: TextProps): ReactNode {
  if (isText(children)) {
    return String(children).trim() ? <span {...textProps}>{children}</span> : children;
  }
  if (Array.isArray(children)) return renderSlots(children, textProps);
  if (isValidElement<{ children?: ReactNode }>(children) && children.type === Fragment) {
    const content = children.props.children;
    return cloneElement(children, undefined, renderTextChildren(content, textProps));
  }
  return children;
}

export function renderContainedText(children: ReactNode): ReactNode {
  if (isText(children)) return children;
  if (Array.isArray(children) && children.every((slot) => isText(slot) || isEmptySlot(slot))) {
    return children.filter(isText).join("");
  }
  return renderTextChildren(children);
}

export function renderSlottedText(children: ReactNode, hasSiblings = true): ReactNode {
  if (
    !isValidElement<{ children?: ReactNode }>(children) ||
    typeof children.type !== "string" ||
    TEXT_ONLY_ELEMENTS.has(children.type)
  ) {
    return children;
  }
  const content = children.props.children;
  if (content == null) return children;
  const guarded = hasSiblings ? renderTextChildren(content) : renderContainedText(content);
  return guarded === content ? children : cloneElement(children, undefined, guarded);
}
