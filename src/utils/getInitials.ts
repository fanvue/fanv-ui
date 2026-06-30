/** Trim leading/trailing whitespace and collapse internal runs of whitespace to a single space. */
const cleanSpaces = (str: string): string => str.trim().replace(/\s+/g, " ");

/**
 * Returns the first letters of the first one or two words in a given string, capitalized.
 * @example
 *   getInitials("Ciao Bello"); // "CB"
 *   getInitials("JavaScript"); // "J"
 *   getInitials(undefined); // ""
 */
export const getInitials = (str?: string | null): string => {
  if (!str) return "";
  return cleanSpaces(str)
    .split(" ")
    .map((word) => (word.length ? ([...word][0] ?? "").toUpperCase() : ""))
    .slice(0, 2)
    .join("");
};
