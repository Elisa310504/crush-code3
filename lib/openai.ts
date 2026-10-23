// Server-only OpenAI helper. Never import this file from a "use client" component.
// The API key is read from process.env on the server and is never sent to the browser.

export const MODEL = process.env.OPENAI_MODEL || "gpt-4o";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export class AIError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.status = status;
  }
}

type ChatOptions = {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  json?: boolean;
};

export function clampTemperature(value: unknown, fallback = 0.7): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.round(Math.min(2, Math.max(0, n)) * 10) / 10;
}

/**
 * Keeps high-temperature answers readable. Temperature is still sent exactly as chosen,
 * but above 1.0 we narrow top_p (nucleus sampling) so the model can't pick the
 * very unlikely "nonsense" tokens. 1.0 -> 1.0, 1.4 -> 0.8, 2.0 -> 0.5.
 */
export function topPFor(temperature: number): number {
  const t = clampTemperature(temperature);
  if (t <= 1) return 1;
  return Math.round((1 - 0.5 * (t - 1)) * 100) / 100;
}

export async function chat({ messages, temperature = 0.7, maxTokens = 400, json = false }: ChatOptions) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new AIError(
      "The AI isn't connected yet. Add OPENAI_API_KEY in your Vercel project's Environment Variables and redeploy.",
      500,
    );
  }

  let res: Response;
  try {
    res = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        // The real temperature parameter (0.0 - 2.0) sent to OpenAI.
        temperature: clampTemperature(temperature),
        top_p: topPFor(temperature),
        max_tokens: maxTokens,
        ...(json ? { response_format: { type: "json_object" } } : {}),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    throw new AIError("The AI took too long to answer. Please try again.", 504);
  }

  if (!res.ok) {
    let detail = "";
    try {
      const err = await res.json();
      detail = err?.error?.message ?? "";
    } catch {
      /* ignore */
    }
    console.error(`[openai] ${res.status}: ${detail}`);
    if (res.status === 401) throw new AIError("The OpenAI API key is invalid. Check OPENAI_API_KEY in Vercel.", 500);
    if (res.status === 404) throw new AIError(`The AI model "${MODEL}" is not available for this API key.`, 500);
    if (res.status === 429)
      throw new AIError("The AI is overwhelmed right now (or the OpenAI credit ran out). Please try again in a moment.", 503);
    throw new AIError("The AI couldn't answer right now. Please try again.", 502);
  }

  const data = await res.json();
  const choice = data?.choices?.[0];
  const content: unknown = choice?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new AIError("The AI returned an empty answer. Please try again.");
  }
  return { content: content.trim(), finishReason: String(choice?.finish_reason ?? "") };
}

export async function chatJSON<T>(options: Omit<ChatOptions, "json">): Promise<T> {
  const { content } = await chat({ ...options, json: true });
  try {
    return JSON.parse(content) as T;
  } catch {
    throw new AIError("The AI's answer got a little tangled. Please try again.");
  }
}
