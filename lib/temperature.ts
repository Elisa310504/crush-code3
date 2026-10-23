// LOVE TEMPERATURE™ modes. Shared by the slider (client) and the API (server).
export const DEFAULT_TEMPERATURE = 0.7;
export const REALITY_TEMPERATURE = 0.2;
export const DELULU_TEMPERATURE = 1.4;

export const MODES = [
  {
    id: "reality",
    label: "REALITY CHECK",
    preset: 0.2,
    min: 0,
    max: 0.5,
    blurb: "Calm, grounded, brutally honest (but kind).",
    tone: "Be direct, realistic and grounded. Prioritise facts, boundaries and practical next steps. No sugar-coating.",
  },
  {
    id: "sweet",
    label: "SWEET SPOT",
    preset: 0.7,
    min: 0.5,
    max: 1.0,
    blurb: "Warm, balanced best-friend advice.",
    tone: "Be warm, balanced and encouraging, like a supportive best friend who is also honest.",
  },
  {
    id: "flirty",
    label: "FLIRTY ENERGY",
    preset: 1.1,
    min: 1.0,
    max: 1.4,
    blurb: "Playful, bold, a little cheeky.",
    tone: "Be playful, confident and a little cheeky. Suggest bold-but-respectful moves.",
  },
  {
    id: "delulu",
    label: "DELULU MODE",
    preset: 1.6,
    min: 1.4,
    max: 2.01,
    blurb: "Maximum romance, wild ideas. Not legally advice.",
    tone: "Be wildly romantic, dreamy and imaginative, like a rom-com narrator, but still end with one sensible sentence.",
  },
] as const;

export type Mode = (typeof MODES)[number];

export function modeFor(t: number): Mode {
  return MODES.find((m) => t >= m.min && t < m.max) ?? MODES[1];
}
