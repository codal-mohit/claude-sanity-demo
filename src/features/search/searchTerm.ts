const MAX_LENGTH = 80;

// Turns user input into a GROQ `match` term: each word becomes a prefix match ("next*").
// Returns null when nothing searchable is left.
export function buildSearchTerm(input: string | null | undefined): string | null {
  const words = (input ?? '')
    .slice(0, MAX_LENGTH)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 1);
  return words.length ? words.map((word) => `${word}*`).join(' ') : null;
}
