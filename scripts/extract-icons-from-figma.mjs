#!/usr/bin/env node
/**
 * Extracts all icons from the V2 Iconography Figma file via the REST API.
 *
 * Usage:
 *   FIGMA_TOKEN=figd_... node scripts/extract-icons-from-figma.mjs
 *
 * Writes raw SVGs to .icon-migration/raw-svgs/<IconName>/<size>-<fill>.svg
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
if (!FIGMA_TOKEN) {
  console.error("Missing FIGMA_TOKEN env var");
  process.exit(1);
}

const FILE_KEY = "S8zFdcOjt4qN4PrwntuCdt";
const CANVAS_NODE_ID = "16626:13603";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(REPO_ROOT, ".icon-migration/raw-svgs");

const headers = { "X-FIGMA-TOKEN": FIGMA_TOKEN };

async function fetchJson(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`${url} → HTTP ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function pool(items, concurrency, worker) {
  const queue = items.slice();
  const workers = new Array(concurrency).fill(0).map(async () => {
    while (queue.length) {
      const item = queue.shift();
      await worker(item);
    }
  });
  await Promise.all(workers);
}

console.log("Fetching canvas structure…");
const nodesData = await fetchJson(
  `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(CANVAS_NODE_ID)}`,
);
const canvas = nodesData.nodes[CANVAS_NODE_ID].document;

const iconFrames = [];
(function walk(node) {
  if (node.name?.startsWith("Iconography / ")) {
    iconFrames.push(node);
    return;
  }
  node.children?.forEach(walk);
})(canvas);

console.log(`Found ${iconFrames.length} icon frames`);

const sortedFrames = iconFrames
  .map((f) => ({ frame: f, name: f.name.replace("Iconography / ", "").trim() }))
  .sort((a, b) => a.name.localeCompare(b.name));

const seen = Object.create(null);
const variants = [];
for (const { frame, name } of sortedFrames) {
  const iconName = seen[name] ? `${name} 2` : name;
  seen[name] = true;

  (function findVariants(node) {
    if (node.type === "COMPONENT" && /Size=\d+.*Fill=/.test(node.name)) {
      const m = node.name.match(/Size=(\d+).*?Fill=(\w+)/);
      if (m) {
        const size = m[1];
        const rawFill = m[2];
        const fill = rawFill === "No" || rawFill === "Default" ? "outlined" : "filled";
        variants.push({ nodeId: node.id, iconName, size, fill, rawFill });
      }
    }
    node.children?.forEach(findVariants);
  })(frame);
}

console.log(`Total variants to fetch: ${variants.length}`);
const anomalous = variants.filter((v) => v.rawFill !== "No" && v.rawFill !== "Yes");
if (anomalous.length) {
  console.log(
    `Figma naming anomalies normalized: ${anomalous
      .map((v) => `${v.iconName}(${v.size}/${v.rawFill})`)
      .join(", ")}`,
  );
}

const BATCH = 150;
const urlMap = {};
for (let i = 0; i < variants.length; i += BATCH) {
  const batch = variants.slice(i, i + BATCH);
  const ids = batch.map((v) => v.nodeId).join(",");
  console.log(
    `  images batch ${i / BATCH + 1}/${Math.ceil(variants.length / BATCH)} (${batch.length} nodes)…`,
  );
  // Keep svg_simplify_stroke at the default (true) so Figma converts every
  // stroke into filled path geometry. We render <path d> with fill=currentColor
  // and ignore stroke attrs — disabling simplify_stroke would emit
  // <path stroke="..."/> with no fill and outlined icons would render as solid
  // discs. The duplicate-path artefact (e.g. CoinIcon outer ring) is handled
  // by the dedup pass in generate-icons.mjs instead.
  const data = await fetchJson(
    `https://api.figma.com/v1/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=svg`,
  );
  if (data.err) throw new Error(`Figma API error: ${data.err}`);
  Object.assign(urlMap, data.images);
}

let written = 0;
let failed = 0;
await pool(variants, 8, async (v) => {
  const url = urlMap[v.nodeId];
  if (!url) {
    console.warn(`  missing URL: ${v.iconName} ${v.size}-${v.fill}`);
    failed++;
    return;
  }
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  HTTP ${res.status}: ${v.iconName} ${v.size}-${v.fill}`);
    failed++;
    return;
  }
  const svg = await res.text();
  const dir = path.join(OUT_DIR, v.iconName);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${v.size}-${v.fill}.svg`), svg);
  written++;
});

console.log(`Wrote ${written} SVGs across ${Object.keys(seen).length} icons`);
if (failed) console.log(`Failed: ${failed}`);
