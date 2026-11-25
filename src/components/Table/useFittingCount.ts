import * as React from "react";

function countFitting(available: DOMRect, items: DOMRect[], indicator?: DOMRect): number | null {
  const [first, second] = items;
  const last = items.at(-1);
  if (available.width <= 0 || !first || !last || !indicator) return null;
  if (last.right - available.left <= available.width) return items.length;
  const reserved = (second ? second.left - first.right : 0) + indicator.width;
  const firstHidden = items.findIndex(
    (item) => item.right - available.left + reserved > available.width,
  );
  return Math.max(firstHidden, 1);
}

/**
 * Returns how many leading items fit in a row, or `null` while the row cannot be measured (SSR,
 * jsdom, `display: none`), in which case the caller shows them all.
 *
 * `rulerRef` is an invisible element as wide as the space the items may take. Its only child is a
 * replica row holding every item at its natural width, followed by the widest overflow indicator
 * ("+N"). Because the replica always holds every item, the count it yields never changes the
 * widths that decided it, so showing or hiding the indicator cannot cause another update. The
 * indicator's width is reserved unless every item fits, and the first item always counts.
 */
export function useFittingCount(
  rulerRef: React.RefObject<HTMLElement | null>,
  itemCount: number,
): number | null {
  const [count, setCount] = React.useState<number | null>(null);

  const evaluate = React.useCallback(() => {
    const ruler = rulerRef.current;
    const replica = ruler?.firstElementChild;
    if (!ruler || !replica) return;
    const rects = Array.from(replica.children, (child) => child.getBoundingClientRect());
    setCount(countFitting(ruler.getBoundingClientRect(), rects.slice(0, itemCount), rects.at(-1)));
  }, [rulerRef, itemCount]);

  React.useLayoutEffect(evaluate);

  React.useEffect(() => {
    const ruler = rulerRef.current;
    const replica = ruler?.firstElementChild;
    if (!ruler || !replica) return;
    const observer = new ResizeObserver(evaluate);
    observer.observe(ruler);
    observer.observe(replica);
    return () => observer.disconnect();
  }, [rulerRef, evaluate]);

  return count;
}
