import { NextResponse } from "next/server";
import { chatJSON } from "@/lib/openai";
import { AUDIENCE, RULES, VOICE } from "@/lib/prompts";
import { clip, handleError, oneOf, rateLimit, readBody } from "@/lib/server";
import { SIGN_NAMES, getSign, zodiacScore } from "@/lib/zodiac";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = rateLimit(req, "zodiac", 15);
  if (limited) return limited;
  try {
    const body = await readBody(req);
    const a = oneOf(body.signA, SIGN_NAMES, "First zodiac sign") as string;
    const b = oneOf(body.signB, SIGN_NAMES, "Second zodiac sign") as string;
    const score = zodiacScore(a, b);
    const sa = getSign(a)!;
    const sb = getSign(b)!;

    const system = `${VOICE}
${AUDIENCE}
TASK: Write a playful pop-astrology love match for two zodiac signs, in the style of a glossy magazine horoscope page. This is entertainment, not a prediction.
Use classic sun-sign stereotypes (element, ruling traits) with humour and warmth. Keep every section specific to this exact pair.
The entertainment score is already set at ${score}%. Match your tone to it, but do not change it.
FORMAT: Return only JSON with these keys, each 25-45 words:
{"title": string (a cute 3-6 word name for this couple), "romanticCompatibility": string, "biggestStrength": string, "biggestChallenge": string, "relationshipDynamic": string, "loveAdvice": string}
${RULES}`;

    const ai = await chatJSON<Record<string, string>>({
      temperature: 0.9,
      maxTokens: 480,
      messages: [
        { role: "system", content: system },
        { role: "user", content: `Sign 1: ${a} (${sa.element}). Sign 2: ${b} (${sb.element}).` },
      ],
    });

    return NextResponse.json({
      signA: a,
      signB: b,
      score,
      title: clip(ai.title, 80) || `${a} × ${b}`,
      sections: [
        { label: "Romantic Compatibility", text: clip(ai.romanticCompatibility, 400) },
        { label: "Biggest Strength", text: clip(ai.biggestStrength, 400) },
        { label: "Biggest Challenge", text: clip(ai.biggestChallenge, 400) },
        { label: "Relationship Dynamic", text: clip(ai.relationshipDynamic, 400) },
        { label: "Love Advice", text: clip(ai.loveAdvice, 400) },
      ],
    });
  } catch (e) {
    return handleError(e);
  }
}
