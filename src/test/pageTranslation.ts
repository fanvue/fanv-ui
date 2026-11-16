/** DOM text replacement used to simulate browser page translation. */
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

/** Rendered copy excluding the toast's transient live announcement. */
export function renderedText() {
  const body = document.body.cloneNode(true) as HTMLElement;
  for (const announcement of body.querySelectorAll(':scope > span[role="status"][aria-live]')) {
    announcement.remove();
  }
  return body.textContent;
}
