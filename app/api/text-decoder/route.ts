import { NextResponse } from "next/server";
import { chatJSON } from "@/lib/openai";
import { AUDIENCE, RULES, VOICE, userInput } from "@/lib/prompts";
import { clip, handleError, rateLimit, readBody, text } from "@/lib/server";

export const runtime = "nodejs";

const LIKELIHOOD = ["Likely", "Possible", "Less likely"];

export async function POST(req: Request) {
  const limited = rateLimit(req, "text-decoder", 15);
  if (limited) return limited;
  try {
    const body = await readBody(req);
    const message = text(body.message, { field: "Their message", max: 600 });
    const context = text(body.context, { field: "Context", max: 300, optional: true });

    const system = `${VOICE}
${AUDIENCE}
TASK: Help the user read a text message from their crush, then suggest replies.
STEPS:
1. Look at the wording, length, punctuation, emojis and timing clues in the message.
2. Offer exactly 3 different, reasonable interpretations, from most to least likely. You cannot know what the sender really means, so present them as possibilities.
3. Write 3 replies the user could send, in the user's voice, each under 30 words:
   - "sweet": warm and genuine
   - "flirty": playful and light
   - "bold": confident and direct (still respectful, never pushy)
FORMAT: Return only JSON:
{"vibe": string (one-line read of the overall tone, max 14 words), "interpretations": [{"title": string (max 6 words), "likelihood": "Likely" | "Possible" | "Less likely", "explanation": string (25-45 words)}], "replies": {"sweet": string, "flirty": string, "bold": string}, "reminder": string (one sentence encouraging them to just ask or communicate clearly, max 20 words)}
${RULES}`;

    const ai = await chatJSON<{
      vibe?: string;
      interpretations?: { title?: string; likelihood?: string; explanation?: string }[];
      replies?: { sweet?: string; flirty?: string; bold?: string };
      reminder?: string;
    }>({
      temperature: 0.8,
      maxTokens: 520,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: [userInput("Message from their crush", message), context ? userInput("Context", context) : ""]
            .filter(Boolean)
            .join("\n"),
        },
      ],
    });

    const interpretations = (Array.isArray(ai.interpretations) ? ai.interpretations : []).slice(0, 3).map((i) => ({
      title: clip(i?.title, 80),
      likelihood: LIKELIHOOD.includes(String(i?.likelihood)) ? String(i?.likelihood) : "Possible",
      explanation: clip(i?.explanation, 400),
    }));

    return NextResponse.json({
      vibe: clip(ai.vibe, 140),
      interpretations,
      replies: {
        sweet: clip(ai.replies?.sweet, 240),
        flirty: clip(ai.replies?.flirty, 240),
        bold: clip(ai.replies?.bold, 240),
      },
      reminder: clip(ai.reminder, 200),
    });
  } catch (e) {
    return handleError(e);
  }
}
