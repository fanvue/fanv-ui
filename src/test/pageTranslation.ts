import { act, cleanup, render } from "@testing-library/react";
import type { ReactElement } from "react";
import { expect } from "vitest";

export function translateTextNodes(root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
    if (
      !node.data.trim() ||
      node.parentElement?.closest('font, [translate="no"], script, style, textarea, svg')
    )
      continue;
    const outer = document.createElement("font");
    const inner = document.createElement("font");
    inner.textContent = node.data;
    outer.append(inner);
    node.replaceWith(outer);
  }
}

export function renderedText() {
  const body = document.body.cloneNode(true) as HTMLElement;
  for (const announcement of body.querySelectorAll(':scope > span[role="status"][aria-live]')) {
    announcement.remove();
  }
  return body.textContent;
}

export async function expectTranslatedTransitions(fixture: (changed: boolean) => ReactElement) {
  const expected = new Map<boolean, string | null>();
  for (const changed of [false, true]) {
    await act(async () => {
      render(fixture(changed));
    });
    expected.set(changed, renderedText());
    cleanup();
  }
  const { rerender } = render(fixture(false));
  translateTextNodes(document.body);
  expect(document.querySelector("font")).not.toBeNull();
  for (const changed of [true, false, true]) {
    await act(async () => rerender(fixture(changed)));
    await expect.poll(renderedText).toBe(expected.get(changed));
    translateTextNodes(document.body);
  }
  cleanup();
}
