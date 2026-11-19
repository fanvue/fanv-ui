import { Children, cloneElement, Fragment, isValidElement, type ReactNode } from "react";

type TextChild = string | number | bigint;

type FlatChild = { key: string; node: ReactNode };

function isText(node: unknown): node is TextChild {
  return typeof node === "string" || typeof node === "number" || typeof node === "bigint";
}

function keySegment(id: string) {
  return `${id.length}:${id}`;
}

function flattenFragments(children: ReactNode, prefix: string, out: FlatChild[]) {
  Children.forEach(children, (child, index) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) {
      if (isText(child)) out.push({ key: prefix + keySegment(`#${index}`), node: child });
      return;
    }
    const key = prefix + keySegment(child.key == null ? `#${index}` : `$${child.key}`);
    if (child.type === Fragment) flattenFragments(child.props.children, key, out);
    else out.push({ key, node: cloneElement(child, { key }) });
  });
}

export function renderTextChildren(children: ReactNode): ReactNode[] {
  const flat: FlatChild[] = [];
  flattenFragments(children, "", flat);
  const nodes: ReactNode[] = [];
  let run: FlatChild[] = [];
  const flushRun = () => {
    const text = run.map(({ node }) => String(node)).join("");
    if (text.trim()) nodes.push(<span key={`text:${run[0]?.key}`}>{text}</span>);
    else if (text) nodes.push(text);
    run = [];
  };
  for (const item of flat) {
    if (isText(item.node)) {
      run.push(item);
    } else {
      flushRun();
      nodes.push(item.node);
    }
  }
  flushRun();
  return nodes;
}

export function renderContainedText(children: ReactNode): ReactNode {
  const flat: FlatChild[] = [];
  flattenFragments(children, "", flat);
  if (flat.every(({ node }) => isText(node))) return flat.map(({ node }) => String(node)).join("");
  return renderTextChildren(children);
}

export function renderSlottedText(children: ReactNode): ReactNode {
  if (!isValidElement<{ children?: ReactNode }>(children) || typeof children.type !== "string") {
    return children;
  }
  const content = children.props.children;
  if (content == null) return children;
  return cloneElement(children, undefined, renderTextChildren(content));
}
