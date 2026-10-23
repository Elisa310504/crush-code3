import { NextResponse } from "next/server";
import { chat, clampTemperature, topPFor, type ChatMessage } from "@/lib/openai";
import { AUDIENCE, RULES, VOICE } from "@/lib/prompts";
import { ValidationError, handleError, rateLimit, readBody, text } from "@/lib/server";
import { DELULU_TEMPERATURE, REALITY_TEMPERATURE, modeFor } from "@/lib/temperature";

export const runtime = "nodejs";

const MAX_HISTORY = 10; // only the last 10 messages are sent, to keep costs low
const MAX_MESSAGE = 800;

function systemPrompt(temperature: number) {
  const mode = modeFor(temperature);
  return `${VOICE} Your name is Love Guru.
${AUDIENCE}
TASK: Give personal relationship advice in a chat. Continue the conversation naturally and remember what the user said earlier in this chat.
CURRENT MODE: ${mode.label}. ${mode.tone}
FORMAT: Reply in 60-140 words of clear, correct English made of real words and complete sentences, however playful the mode. Plain text: no headings, no bold, no markdown. Use at most 3 short bullet points ("- ") only if listing steps. You may ask one short follow-up question when details are missing.
Only discuss love, dating, friendship, self-worth and relationships. If asked about something unrelated, gently steer back.
${RULES}`;
}

function parseHistory(value: unknown): ChatMessage[] {
  if (!Array.isArray(value) || value.length === 0) throw new ValidationError("Please type a message first.");
  const recent = value.slice(-MAX_HISTORY);
  const messages: ChatMessage[] = recent.map((m) => {
    const role = (m as { role?: unknown })?.role;
    if (role !== "user" && role !== "assistant") throw new ValidationError("Invalid chat history.");
    const content = text((m as { content?: unknown }).content, { field: "Message", max: role === "user" ? MAX_MESSAGE : 2000 });
    return { role, content };
  });
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (messages.at(-1)?.role !== "user") throw new ValidationError("The last message must be from you.");
  return messages;
}

// Remove markdown the chat bubble can't display (e.g. **bold**).
const clean = (s: string) => s.replace(/\*\*|__|^#+\s*/gm, "").trim();

export async function POST(req: Request) {
  try {
    const body = await readBody(req);
    const compare = body.compare === true;

    const limited = rateLimit(req, "love-guru", 40, compare ? 2 : 1);
    if (limited) return limited;

    const history = parseHistory(body.messages);

    if (compare) {
      // Same question, two real API calls with different temperatures.
      const [reality, delulu] = await Promise.all([
        chat({
          temperature: REALITY_TEMPERATURE,
          maxTokens: 260,
          messages: [{ role: "system", content: systemPrompt(REALITY_TEMPERATURE) }, ...history],
        }),
        chat({
          temperature: DELULU_TEMPERATURE,
          maxTokens: 260,
          messages: [{ role: "system", content: systemPrompt(DELULU_TEMPERATURE) }, ...history],
        }),
      ]);
      return NextResponse.json({
        compare: {
          reality: { temperature: REALITY_TEMPERATURE, topP: topPFor(REALITY_TEMPERATURE), reply: clean(reality.content) },
          delulu: { temperature: DELULU_TEMPERATURE, topP: topPFor(DELULU_TEMPERATURE), reply: clean(delulu.content) },
        },
      });
    }

    const temperature = clampTemperature(body.temperature);
    const result = await chat({
      temperature,
      maxTokens: 300,
      messages: [{ role: "system", content: systemPrompt(temperature) }, ...history],
    });
    return NextResponse.json({ reply: clean(result.content), temperature, topP: topPFor(temperature), mode: modeFor(temperature).label });
  } catch (e) {
    return handleError(e);
  }
}
