import { zodiacScore } from "./zodiac";

export const CATEGORIES = [
  "Romantic Chemistry",
  "Communication",
  "Passion",
  "Emotional Connection",
  "Long-Term Potential",
] as const;

export type LoveCategory = { name: (typeof CATEGORIES)[number]; score: number };

// FNV-1a hash: the same input always gives the same number.
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (const ch of input) {
    h ^= ch.codePointAt(0)!;
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function normalise(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

/**
 * Deterministic entertainment-only score. Same names (in any order) + same signs
 * always produce the same result. Not a scientific or psychological measurement.
 */
export function loveScore(nameA: string, nameB: string, signA = "", signB = "") {
  const pair = [normalise(nameA), normalise(nameB)].sort().join("♡");
  const stars = signA && signB ? zodiacScore(signA, signB) : null;
  const categories: LoveCategory[] = CATEGORIES.map((name) => {
    let score = 22 + (hash(`${pair}|${name}`) % 77); // 22 - 98
    if (stars !== null) score = Math.round(score * 0.75 + stars * 0.25);
    return { name, score: Math.max(0, Math.min(100, score)) };
  });
  const overall = Math.round(categories.reduce((sum, c) => sum + c.score, 0) / categories.length);
  return { overall, categories };
}
