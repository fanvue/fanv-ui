import { cloneElement, Fragment, isValidElement, type ReactNode } from "react";

type TextChild = string | number | bigint;

function isText(node: unknown): node is TextChild {
  return typeof node === "string" || typeof node === "number" || typeof node === "bigint";
}

function isEmptySlot(node: unknown) {
  return node == null || typeof node === "boolean";
}

function renderSlots(slots: readonly ReactNode[]): ReactNode[] {
  const out: ReactNode[] = [];
  let runStart = -1;
  let runText = "";
  const closeRun = () => {
    if (runStart < 0) return;
    if (runText.trim()) out[runStart] = <span key={`text:${runStart}`}>{runText}</span>;
    else if (runText) out[runStart] = runText;
    runStart = -1;
    runText = "";
  };
  slots.forEach((slot, index) => {
    if (isText(slot) || isEmptySlot(slot)) {
      out.push(null);
      if (isText(slot) && String(slot)) {
        if (runStart < 0) runStart = index;
        runText += String(slot);
      }
      return;
    }
    closeRun();
    out.push(renderTextChildren(slot));
  });
  closeRun();
  return out;
}

export function renderTextChildren(children: ReactNode): ReactNode {
  if (isText(children)) return String(children).trim() ? <span>{children}</span> : children;
  if (Array.isArray(children)) return renderSlots(children);
  if (isValidElement<{ children?: ReactNode }>(children) && children.type === Fragment) {
    const content = children.props.children;
    return Array.isArray(content)
      ? cloneElement(children, undefined, ...renderSlots(content))
      : cloneElement(children, undefined, renderTextChildren(content));
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
  if (!isValidElement<{ children?: ReactNode }>(children) || typeof children.type !== "string") {
    return children;
  }
  const content = children.props.children;
  if (content == null) return children;
  return Array.isArray(content)
    ? cloneElement(children, undefined, ...renderSlots(content))
    : cloneElement(children, undefined, renderTextChildren(content));
}
