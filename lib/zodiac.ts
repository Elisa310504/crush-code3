export const SIGNS = [
  { name: "Aries", symbol: "♈", element: "Fire", dates: "Mar 21 – Apr 19" },
  { name: "Taurus", symbol: "♉", element: "Earth", dates: "Apr 20 – May 20" },
  { name: "Gemini", symbol: "♊", element: "Air", dates: "May 21 – Jun 20" },
  { name: "Cancer", symbol: "♋", element: "Water", dates: "Jun 21 – Jul 22" },
  { name: "Leo", symbol: "♌", element: "Fire", dates: "Jul 23 – Aug 22" },
  { name: "Virgo", symbol: "♍", element: "Earth", dates: "Aug 23 – Sep 22" },
  { name: "Libra", symbol: "♎", element: "Air", dates: "Sep 23 – Oct 22" },
  { name: "Scorpio", symbol: "♏", element: "Water", dates: "Oct 23 – Nov 21" },
  { name: "Sagittarius", symbol: "♐", element: "Fire", dates: "Nov 22 – Dec 21" },
  { name: "Capricorn", symbol: "♑", element: "Earth", dates: "Dec 22 – Jan 19" },
  { name: "Aquarius", symbol: "♒", element: "Air", dates: "Jan 20 – Feb 18" },
  { name: "Pisces", symbol: "♓", element: "Water", dates: "Feb 19 – Mar 20" },
] as const;

export type SignName = (typeof SIGNS)[number]["name"];
export const SIGN_NAMES = SIGNS.map((s) => s.name) as unknown as readonly SignName[];

export function getSign(name: string) {
  return SIGNS.find((s) => s.name === name);
}

/** Text-style glyph (prevents emoji rendering on phones). */
export function glyph(name: string) {
  const s = getSign(name);
  return s ? `${s.symbol}︎` : "";
}

/**
 * Deterministic, entertainment-only element score (classic pop-astrology rules):
 * same element = harmonious, Fire+Air / Earth+Water = complementary, others = challenging.
 */
export function zodiacScore(a: string, b: string): number {
  const sa = getSign(a);
  const sb = getSign(b);
  if (!sa || !sb) return 70;
  const ia = SIGNS.indexOf(sa);
  const ib = SIGNS.indexOf(sb);
  const pair = [sa.element, sb.element].sort().join("+");
  let base: number;
  if (sa.element === sb.element) base = 86;
  else if (pair === "Air+Fire" || pair === "Earth+Water") base = 80;
  else if (pair === "Fire+Water" || pair === "Air+Earth") base = 58;
  else base = 66;
  const distance = Math.min(Math.abs(ia - ib), 12 - Math.abs(ia - ib));
  const twist = distance === 6 ? 6 : distance === 0 ? 4 : ((ia * 7 + ib * 7) % 9) - 4;
  return Math.max(35, Math.min(98, base + twist));
}
