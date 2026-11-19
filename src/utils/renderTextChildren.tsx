import { Children, cloneElement, Fragment, isValidElement, type ReactNode } from "react";

type TextChild = string | number | bigint;

function isText(node: unknown): node is TextChild {
  return typeof node === "string" || typeof node === "number" || typeof node === "bigint";
}

function flattenFragments(children: ReactNode, prefix = ""): ReactNode[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return [child];
    const key = `${prefix}${child.key}`;
    if (child.type === Fragment) return flattenFragments(child.props.children, key);
    return [prefix ? cloneElement(child, { key }) : child];
  });
}

export function renderTextChildren(children: ReactNode): ReactNode[] {
  const nodes: ReactNode[] = [];
  let run: TextChild[] = [];
  const flushRun = () => {
    const text = run.join("");
    if (text) nodes.push(<span key={`text-${nodes.length}`}>{text}</span>);
    run = [];
  };
  for (const child of flattenFragments(children)) {
    if (isText(child)) {
      run.push(child);
    } else {
      flushRun();
      nodes.push(child);
    }
  }
  flushRun();
  return nodes;
}

export function renderSlottedText(children: ReactNode): ReactNode {
  if (!isValidElement<{ children?: ReactNode }>(children)) return children;
  const content = children.props.children;
  if (content == null || typeof content === "function") return children;
  return cloneElement(children, undefined, renderTextChildren(content));
}
