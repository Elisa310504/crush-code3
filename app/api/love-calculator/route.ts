import { NextResponse } from "next/server";
import { chatJSON } from "@/lib/openai";
import { loveScore } from "@/lib/loveScore";
import { AUDIENCE, RULES, VOICE, userInput } from "@/lib/prompts";
import { clip, handleError, oneOf, rateLimit, readBody, text } from "@/lib/server";
import { SIGN_NAMES } from "@/lib/zodiac";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = rateLimit(req, "love-calculator", 15);
  if (limited) return limited;
  try {
    const body = await readBody(req);
    const name = text(body.name, { field: "Your name", max: 40 });
    const crush = text(body.crush, { field: "Your crush's name", max: 40 });
    const yourSign = oneOf(body.yourSign, SIGN_NAMES, "Your zodiac sign", true);
    const crushSign = oneOf(body.crushSign, SIGN_NAMES, "Your crush's zodiac sign", true);

    // The score itself is deterministic and calculated here, not by the AI.
    const { overall, categories } = loveScore(name, crush, yourSign, crushSign);

    const system = `${VOICE}
${AUDIENCE}
TASK: Write a fun, personalised interpretation of a love-calculator result. The scores were produced by a playful formula. Do not change, recompute or question them.
STEPS:
1. React to the overall score in one punchy line.
2. Comment on the strongest and the weakest category by name.
3. Finish with one light-hearted, practical tip.
FORMAT: Return only JSON: {"headline": string (max 8 words), "interpretation": string (70-110 words, one paragraph), "tip": string (one sentence, max 25 words)}
${RULES}`;

    const user = [
      userInput("Person 1", name),
      userInput("Person 2", crush),
      `Zodiac signs: ${yourSign || "not given"} and ${crushSign || "not given"}`,
      `Overall score: ${overall}%`,
      `Category scores: ${categories.map((c) => `${c.name} ${c.score}%`).join(", ")}`,
    ].join("\n");

    const ai = await chatJSON<{ headline?: string; interpretation?: string; tip?: string }>({
      temperature: 0.9,
      maxTokens: 320,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    return NextResponse.json({
      overall,
      categories,
      headline: clip(ai.headline, 90) || "The stars are taking notes",
      interpretation: clip(ai.interpretation, 900),
      tip: clip(ai.tip, 220),
    });
  } catch (e) {
    return handleError(e);
  }
}
