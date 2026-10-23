import { NextResponse } from "next/server";
import { chatJSON } from "@/lib/openai";
import { AUDIENCE, RULES, VOICE, userInput } from "@/lib/prompts";
import { clip, handleError, rateLimit, readBody, text } from "@/lib/server";

export const runtime = "nodejs";

const VERDICTS = ["GREEN FLAG", "MIXED SIGNALS", "RED FLAG"] as const;

export async function POST(req: Request) {
  const limited = rateLimit(req, "red-flag", 15);
  if (limited) return limited;
  try {
    const body = await readBody(req);
    const situation = text(body.situation, { field: "Your situation", min: 20, max: 1200 });

    const system = `${VOICE}
${AUDIENCE}
TASK: Assess a dating situation the user describes and classify the behaviour they describe.
STEPS (think them through before answering):
1. List the concrete behaviours described (not assumptions).
2. Weigh healthy signs (consistency, respect, honesty, effort, respecting boundaries) against warning signs (disrespect, control, dishonesty, inconsistency, pressure, isolation, contempt).
3. Choose exactly one verdict:
   - "GREEN FLAG": mostly healthy, respectful, consistent behaviour.
   - "MIXED SIGNALS": unclear, inconsistent or not enough information.
   - "RED FLAG": disrespect, control, manipulation, dishonesty, pressure or any safety concern.
4. Explain the verdict using the user's own details, and give practical next steps.
FORMAT: Return only JSON: {"verdict": "GREEN FLAG" | "MIXED SIGNALS" | "RED FLAG", "summary": string (max 14 words), "explanation": string (60-110 words), "advice": [3 short, practical, specific steps, each max 22 words], "safetyNote": string (only if there is any risk to the user's safety or wellbeing, otherwise "")}
You only see one side of the story, so judge the behaviour described, not the person's character.
${RULES}`;

    const ai = await chatJSON<{
      verdict?: string;
      summary?: string;
      explanation?: string;
      advice?: unknown;
      safetyNote?: string;
    }>({
      temperature: 0.4,
      maxTokens: 420,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userInput("Dating situation", situation) },
      ],
    });

    const verdict = (VERDICTS as readonly string[]).includes(String(ai.verdict).toUpperCase())
      ? String(ai.verdict).toUpperCase()
      : "MIXED SIGNALS";
    const advice = Array.isArray(ai.advice) ? ai.advice.slice(0, 3).map((a) => clip(a, 200)).filter(Boolean) : [];

    return NextResponse.json({
      verdict,
      summary: clip(ai.summary, 120),
      explanation: clip(ai.explanation, 1000),
      advice,
      safetyNote: clip(ai.safetyNote, 400),
    });
  } catch (e) {
    return handleError(e);
  }
}
