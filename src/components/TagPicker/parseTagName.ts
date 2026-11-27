/** A tag name split into its optional leading emoji and its label. */
export interface ParsedTagName {
  /** The emoji typed at the start of the name, if there was one. */
  emoji?: string;
  /** The rest of the name, trimmed. */
  label: string;
}

const EMOJI = String.raw`(?:(?!\p{Regional_Indicator})\p{Emoji_Presentation}|\p{Extended_Pictographic}\u{FE0F})\p{Emoji_Modifier}?`;
const TAG_SEQUENCE = String.raw`[\u{E0020}-\u{E007E}]+\u{E007F}`;
const LEADING_EMOJI = new RegExp(
  String.raw`^(\p{Regional_Indicator}{2}|${EMOJI}(?:\u{200D}${EMOJI})*(?:${TAG_SEQUENCE})?)\s*`,
  "u",
);
const LEADING_INVISIBLES = /^[\u{200B}-\u{200D}\u{FEFF}]+/u;

/**
 * Splits a typed tag name into a leading emoji and a label. A tag only carries an emoji when the
 * name starts with one, such as `"🐳 Whale"`; any other name is label only.
 *
 * @example
 * ```ts
 * parseTagName("🐳 Whale"); // { emoji: "🐳", label: "Whale" }
 * parseTagName("Night owl"); // { label: "Night owl" }
 * ```
 */
export function parseTagName(name: string): ParsedTagName {
  const trimmed = name.trim().replace(LEADING_INVISIBLES, "");
  const match = LEADING_EMOJI.exec(trimmed);
  if (!match?.[1]) return { label: trimmed };
  const label = trimmed.slice(match[0].length).trim();
  return label ? { emoji: match[1], label } : { label: trimmed };
}
