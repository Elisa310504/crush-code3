import { NextResponse } from "next/server";
import { chat } from "@/lib/openai";
import { AUDIENCE, RULES, VOICE, userInput } from "@/lib/prompts";
import { handleError, oneOf, rateLimit, readBody, text } from "@/lib/server";
import { LENGTHS, OCCASIONS, RELATIONSHIPS, TONES } from "@/lib/letterOptions";

export const runtime = "nodejs";

const LENGTH_RULES = {
  Short: { words: "90-130 words", tokens: 260 },
  Medium: { words: "170-230 words", tokens: 420 },
  Long: { words: "280-360 words", tokens: 620 },
} as const;

export async function POST(req: Request) {
  const limited = rateLimit(req, "love-letter", 12);
  if (limited) return limited;
  try {
    const body = await readBody(req);
    const recipient = text(body.recipient, { field: "Recipient's name", max: 40 });
    const sender = text(body.sender, { field: "Your name", max: 40, optional: true });
    const relationship = oneOf(body.relationship, RELATIONSHIPS, "Relationship status");
    const occasion = oneOf(body.occasion, OCCASIONS, "Occasion");
    const tone = oneOf(body.tone, TONES, "Tone");
    const length = oneOf(body.length, LENGTHS, "Letter length") as keyof typeof LENGTH_RULES;
    const details = text(body.details, { field: "Personal details", max: 400, optional: true });
    const rule = LENGTH_RULES[length];

    const system = `${VOICE} Today you are a gifted love-letter writer with the elegance of a vintage letter and the honesty of a modern text.
${AUDIENCE}
TASK: Write a personal love letter the user can send to someone.
STEPS:
1. Open with a greeting using the recipient's name.
2. Weave in the personal details (if given) as specific, vivid moments instead of generic compliments.
3. Match the occasion and the relationship status exactly. A crush letter should not sound like a marriage vow.
4. Close with a sign-off line and the sender's name (or "Yours" if no name is given).
FORMAT: Plain text only, ${rule.words}, short paragraphs separated by blank lines. No title, no markdown, no placeholders like [Name].
TONE: ${tone}.
Do not exaggerate or invent big facts (no fake trips, kids or shared history). Keep it sincere and respectful.
${RULES}`;

    const user = [
      userInput("Recipient", recipient),
      userInput("Sender", sender || "not given"),
      `Relationship status: ${relationship}`,
      `Occasion: ${occasion}`,
      details ? userInput("Personal details to include", details) : "No extra details given.",
    ].join("\n");

    const result = await chat({
      temperature: 0.95,
      maxTokens: rule.tokens,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    return NextResponse.json({ letter: result.content.replace(/\*\*/g, "").slice(0, 4000) });
  } catch (e) {
    return handleError(e);
  }
}
