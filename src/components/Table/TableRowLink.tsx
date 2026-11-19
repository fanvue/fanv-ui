import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/utils/cn";
import { renderContainedText } from "@/utils/renderTextChildren";

/**
 * What a click on an interactive row leaves to the control it landed on. A
 * click on any of these, or on something portalled out of the row such as a
 * menu or dialog, does not open the row's link. `data-table-row-click-ignore`
 * opts out anything else, such as a custom control with no role of its own.
 */
const ROW_CLICK_IGNORES =
  "a, button, summary, input, select, textarea, label, [contenteditable]:not([contenteditable='false']), [role='button'], [role='link'], [role='checkbox'], [role='radio'], [role='switch'], [role='slider'], [role='tab'], [role='combobox'], [role='option'], [role^='menu'], [data-table-row-click-ignore]";

/**
 * Opens the row's {@link TableRowLink} for a plain primary click that landed on
 * the row but not on a control of its own, nor on a row of a table nested in it.
 * A click with a modifier key is left alone: the forwarded click could not carry
 * the modifier, so it would open in this tab what the user asked for in a new one.
 * So is the click that ends a drag to select text.
 *
 * The link is looked up in the row's DOM when the click happens. A
 * `TableRowLink` portalled out of the row, or sitting in a table nested in it,
 * is not the row's link.
 */
export function openTableRowLink(event: React.MouseEvent<HTMLTableRowElement>) {
  const row = event.currentTarget;
  const target = event.target as Element;
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    target.closest("tr") !== row ||
    target.closest(ROW_CLICK_IGNORES) ||
    window.getSelection()?.isCollapsed === false
  ) {
    return;
  }
  const links = row.querySelectorAll<HTMLElement>("[data-table-row-link]");
  Array.from(links)
    .find((link) => link.closest("tr") === row)
    ?.click();
}

export interface TableRowLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Merge props onto the child element instead of rendering an `<a>`. Use it
   * for a router link. The child must render an anchor.
   * @default false
   */
  asChild?: boolean;
}

/**
 * The link an interactive `TableRow` opens, usually the row's name. It is a real
 * link, so the keyboard and "open in a new tab" work as on any link, and it is
 * the row's one tab stop. A click anywhere else on the row, except on another
 * control, opens it too. A `TableRowLink` portalled out of the row, in a popover
 * or dialog, is an ordinary link and does not take over the row's click.
 *
 * @example
 * ```tsx
 * <TableRow interactive>
 *   <TableCell>
 *     <TableRowLink href="/campaigns/summer">Summer launch</TableRowLink>
 *   </TableCell>
 *   <TableCell>1,204 clicks</TableCell>
 * </TableRow>
 * ```
 */
export const TableRowLink = React.forwardRef<HTMLAnchorElement, TableRowLinkProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";
    return (
      <Comp
        ref={ref}
        data-table-row-link=""
        className={cn(
          "text-content-primary no-underline underline-offset-2 hover:underline focus-visible:shadow-focus-ring focus-visible:outline-hidden",
          className,
        )}
        {...props}
      >
        {renderContainedText(props.children)}
      </Comp>
    );
  },
);
TableRowLink.displayName = "TableRowLink";
