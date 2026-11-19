import { cloneElement, Fragment, isValidElement, type ReactNode } from "react";

const TEXT_ONLY_ELEMENTS = new Set(["textarea", "option", "optgroup", "select", "title"]);

type TextChild = string | number | bigint;

function isText(node: unknown): node is TextChild {
  return typeof node === "string" || typeof node === "number" || typeof node === "bigint";
}

function isEmptySlot(node: unknown) {
  return node == null || typeof node === "boolean";
}

function renderSlots(slots: readonly ReactNode[]): ReactNode[] {
  const out: ReactNode[] = new Array(slots.length).fill(null);
  let runStart = -1;
  let runText = "";
  const closeRun = () => {
    if (runStart < 0) return;
    out[runStart] = runText.trim() ? [<span key="text">{runText}</span>] : runText;
    runStart = -1;
    runText = "";
  };
  for (let index = 0; index < slots.length; index++) {
    const slot = slots[index];
    if (isText(slot)) {
      if (String(slot)) {
        if (runStart < 0) runStart = index;
        runText += String(slot);
      }
    } else if (!isEmptySlot(slot)) {
      closeRun();
      out[index] = renderTextChildren(slot);
    }
  }
  closeRun();
  return out;
}

export function renderTextChildren(children: ReactNode): ReactNode {
  if (isText(children)) return String(children).trim() ? <span>{children}</span> : children;
  if (Array.isArray(children)) return renderSlots(children);
  if (isValidElement<{ children?: ReactNode }>(children) && children.type === Fragment) {
    const content = children.props.children;
    return cloneElement(children, undefined, renderTextChildren(content));
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

export function renderSlottedText(children: ReactNode): ReactNode {
  if (
    !isValidElement<{ children?: ReactNode }>(children) ||
    typeof children.type !== "string" ||
    TEXT_ONLY_ELEMENTS.has(children.type)
  ) {
    return children;
  }
  const content = children.props.children;
  if (content == null) return children;
  return cloneElement(children, undefined, renderTextChildren(content));
}
