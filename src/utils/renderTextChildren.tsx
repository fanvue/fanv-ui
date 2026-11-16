import { Children, cloneElement, isValidElement, type ReactNode } from "react";

/** Text children with stable element boundaries during browser translation. */
export function renderTextChildren(children: ReactNode): ReactNode {
  return Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? <span>{child}</span> : child,
  );
}

/** A native slotted element whose text children retain their own DOM boundaries. */
export function renderSlottedText(children: ReactNode): ReactNode {
  if (!isValidElement<{ children?: ReactNode }>(children) || typeof children.type !== "string") {
    return children;
  }
  return cloneElement(children, undefined, renderTextChildren(children.props.children));
}
