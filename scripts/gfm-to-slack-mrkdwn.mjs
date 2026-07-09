#!/usr/bin/env node
/**
 * Converts GitHub-flavored markdown (the release notes produced by
 * release-please) into Slack mrkdwn, so the release notification renders
 * cleanly instead of showing raw "##", "**" and "[text](url)" markers.
 *
 * Used by .github/workflows/release.yml: reads the raw markdown from the
 * RELEASE_BODY environment variable and writes the converted text, JSON
 * encoded, to stdout so it can be dropped straight into the Slack payload.
 */

import { pathToFileURL } from "node:url";

// Slack section text objects are capped at 3000 characters; leave headroom.
const SLACK_TEXT_LIMIT = 2900;

export function gfmToSlackMrkdwn(markdown) {
  const lines = (markdown ?? "").split("\n");

  const converted = lines.map((rawLine) => {
    // [text](url) -> <url|text>
    let line = rawLine.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, "<$2|$1>");
    // **bold** -> *bold*
    line = line.replace(/\*\*([^*]+)\*\*/g, "*$1*");

    // Headings (#..######) become a bold line. Skip bolding when the heading
    // contains a link, because Slack does not reliably render *<url|text>*.
    const heading = line.match(/^\s*#{1,6}\s+(.*\S)\s*$/);
    if (heading) {
      const content = heading[1];
      return content.includes("<") ? content : `*${content}*`;
    }

    // "* item" / "- item" -> "• item", preserving indentation.
    const bullet = line.match(/^(\s*)[*-]\s+(.*)$/);
    if (bullet) {
      return `${bullet[1]}• ${bullet[2]}`;
    }

    return line;
  });

  return converted
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function truncate(text, limit = SLACK_TEXT_LIMIT) {
  if (text.length <= limit) {
    return text;
  }
  const clipped = text.slice(0, limit);
  const lastBreak = clipped.lastIndexOf("\n");
  const safe = lastBreak > 0 ? clipped.slice(0, lastBreak) : clipped;
  return `${safe.trimEnd()}\n…`;
}

// Run as a CLI only when invoked directly, so tests can import the functions.
const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  const mrkdwn = truncate(gfmToSlackMrkdwn(process.env.RELEASE_BODY ?? ""));
  process.stdout.write(JSON.stringify(mrkdwn));
}
