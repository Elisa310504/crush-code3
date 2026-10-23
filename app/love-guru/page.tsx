"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, Sparkle } from "@/components/Decor";
import { ErrorBox, FeatureHeader } from "@/components/ui";
import { postJSON } from "@/lib/useAI";
import { DEFAULT_TEMPERATURE, MODES, modeFor } from "@/lib/temperature";

type Msg =
  | { id: string; role: "user"; content: string }
  | { id: string; role: "assistant"; content: string; temperature: number; mode: string }
  | {
      id: string;
      role: "compare";
      content: string; // reality reply, used as history for the next turn
      reality: { temperature: number; reply: string };
      delulu: { temperature: number; reply: string };
    };

const STORAGE_KEY = "crushcode-guru-v1";
const HISTORY_SENT = 10;
const MAX_INPUT = 800;
const STARTERS = [
  "How do I know if my crush likes me back?",
  "We've been talking for 3 weeks. Should I ask them out?",
  "How do I get over someone I never dated?",
  "What's a cute first-date idea in winter?",
];

const uid = () => Math.random().toString(36).slice(2, 10);

export default function LoveGuruPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [temperature, setTemperature] = useState(DEFAULT_TEMPERATURE);
  const [loading, setLoading] = useState<false | "chat" | "compare">(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<null | (() => void)>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const mode = modeFor(temperature);

  // Remember the conversation in this browser only.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.messages)) setMessages(parsed.messages.slice(-40));
        if (typeof parsed.temperature === "number") setTemperature(parsed.temperature);
      }
    } catch {
      /* ignore */
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: messages.slice(-40), temperature }));
    } catch {
      /* ignore */
    }
  }, [messages, temperature]);
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  function historyWith(question: string) {
    const past = messages.map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.content }));
    return [...past, { role: "user", content: question }].slice(-HISTORY_SENT);
  }

  function validate(q: string) {
    if (!q) {
      setError("Type your question first ♡");
      return false;
    }
    if (q.length > MAX_INPUT) {
      setError(`Please keep it under ${MAX_INPUT} characters.`);
      return false;
    }
    return true;
  }

  async function send(text = input) {
    const q = text.trim();
    if (loading || !validate(q)) return;
    setError(null);
    setLoading("chat");
    const t = temperature;
    const history = historyWith(q);
    const userMsg: Msg = { id: uid(), role: "user", content: q };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    try {
      const res = await postJSON<{ reply: string; temperature: number; mode: string }>("/api/love-guru", {
        messages: history,
        temperature: t,
      });
      setMessages((m) => [...m, { id: uid(), role: "assistant", content: res.reply, temperature: res.temperature, mode: res.mode }]);
    } catch (e) {
      setMessages((m) => m.filter((x) => x.id !== userMsg.id));
      setInput(q);
      setError((e as Error).message);
      setLastAction(() => () => send(q));
    } finally {
      setLoading(false);
    }
  }

  async function compare() {
    const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
    const q = input.trim() || lastUser;
    if (loading || !validate(q)) return;
    setError(null);
    setLoading("compare");
    const fresh = Boolean(input.trim());
    const history = fresh ? historyWith(q) : messages.map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.content })).slice(0, messages.map((m) => m.role).lastIndexOf("user") + 1).slice(-HISTORY_SENT);
    const userMsg: Msg = { id: uid(), role: "user", content: q };
    if (fresh) {
      setMessages((m) => [...m, userMsg]);
      setInput("");
    }
    try {
      const res = await postJSON<{ compare: { reality: { temperature: number; reply: string }; delulu: { temperature: number; reply: string } } }>(
        "/api/love-guru",
        { messages: history, compare: true },
      );
      setMessages((m) => [...m, { id: uid(), role: "compare", content: res.compare.reality.reply, ...res.compare }]);
    } catch (e) {
      if (fresh) {
        setMessages((m) => m.filter((x) => x.id !== userMsg.id));
        setInput(q);
      }
      setError((e as Error).message);
      setLastAction(() => compare);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([]);
    setError(null);
  }

  const percent = (temperature / 2) * 100;

  return (
    <div className="pb-10">
      <FeatureHeader
        no="05"
        kicker="Love Guru"
        before="Your personal AI"
        accent="love advisor."
        subtitle="Ask anything about crushes, dates and heartbreak. Then turn up the LOVE TEMPERATURE™ and watch the advice change."
      />

      <div className="mx-auto grid max-w-7xl gap-8 px-5 md:px-10 lg:grid-cols-[360px_1fr]">
        {/* LOVE TEMPERATURE */}
        <aside className="paper h-fit overflow-hidden lg:sticky lg:top-24">
          <div className="bg-burgundy p-6 text-cream">
            <p className="text-sm font-bold uppercase tracking-[0.28em]">Love Temperature™</p>
            <p className="font-script text-3xl text-blush">How delulu are we feeling today?</p>
          </div>
          <div className="p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="kicker">Temperature</p>
                <p className="text-6xl font-bold tabular-nums text-burgundy" aria-live="polite">{temperature.toFixed(1)}</p>
              </div>
              <span className="mb-2 rounded-full bg-cherry px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-cream">{mode.label}</span>
            </div>
            <label htmlFor="temp" className="sr-only">Love temperature, from 0.0 to 2.0</label>
            <input
              id="temp"
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="mt-5 h-3 w-full cursor-pointer appearance-none rounded-full accent-cherry"
              style={{ background: `linear-gradient(90deg, #6D1233 0%, #E63963 ${percent}%, #FFD6E5 ${percent}%)` }}
            />
            <div className="mt-1 flex justify-between text-xs tabular-nums text-cocoa/50">
              <span>0.0</span><span>1.0</span><span>2.0</span>
            </div>
            <p className="mt-4 italic text-cocoa/75">{mode.blurb}</p>
            {temperature > 1.5 && (
              <p className="mt-2 text-sm text-cherry">Above 1.5 the AI gets very unpredictable, and sometimes a little nonsensical. That&rsquo;s the delulu.</p>
            )}
            <div className="mt-5 grid grid-cols-2 gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setTemperature(m.preset)}
                  aria-pressed={mode.id === m.id}
                  className={`rounded-2xl border-2 px-2 py-3 text-[11px] font-bold uppercase tracking-[0.12em] transition ${
                    mode.id === m.id ? "border-burgundy bg-burgundy text-cream" : "border-burgundy/20 text-burgundy hover:border-cherry hover:bg-blush/50"
                  }`}
                >
                  {m.label}
                  <span className="block text-[10px] font-normal tracking-normal opacity-70">{m.preset.toFixed(1)}</span>
                </button>
              ))}
            </div>
            <p className="mt-5 text-xs leading-relaxed text-cocoa/55">
              This slider sets the real <code>temperature</code> parameter of every Love Guru request. Low = focused and predictable. High = creative and wild.
            </p>
          </div>
        </aside>

        {/* CHAT */}
        <section className="paper flex min-h-[620px] flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-burgundy/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blush"><Heart filled className="h-5 w-5 text-cherry" /></span>
              <div>
                <p className="font-bold text-burgundy">Love Guru</p>
                <p className="text-xs italic text-cocoa/60">{loading ? "typing…" : "online for your heart"}</p>
              </div>
            </div>
            {messages.length > 0 && (
              <button type="button" onClick={clearChat} className="btn-ghost !px-4 !py-2">New chat</button>
            )}
          </div>

          <div ref={scroller} className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-6" style={{ maxHeight: 560 }}>
            {messages.length === 0 && (
              <div className="py-6 text-center">
                <p className="font-script text-5xl text-burgundy">Tell me everything.</p>
                <p className="mt-2 italic text-cocoa/60">Or start with one of these:</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {STARTERS.map((s) => (
                    <button key={s} type="button" className="chip" onClick={() => send(s)} disabled={!!loading}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <p className="max-w-[85%] whitespace-pre-wrap rounded-3xl rounded-br-md bg-burgundy px-5 py-3 text-lg text-cream">{m.content}</p>
                </div>
              ) : m.role === "assistant" ? (
                <div key={m.id} className="flex flex-col items-start">
                  <p className="max-w-[88%] whitespace-pre-wrap rounded-3xl rounded-bl-md bg-blush/60 px-5 py-3 text-lg leading-relaxed">{m.content}</p>
                  <span className="mt-1 pl-3 text-[11px] uppercase tracking-[0.18em] text-cocoa/50">🌡 {m.temperature.toFixed(1)} · {m.mode}</span>
                </div>
              ) : (
                <div key={m.id} className="rounded-3xl border-2 border-dashed border-burgundy/30 p-4">
                  <p className="kicker mb-3 text-center">Reality vs. Delulu ♡ · same question</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-cream p-4 ring-1 ring-burgundy/15">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-burgundy">Reality check · {m.reality.temperature.toFixed(1)}</p>
                      <p className="mt-2 whitespace-pre-wrap leading-relaxed">{m.reality.reply}</p>
                    </div>
                    <div className="rounded-2xl bg-cherry/10 p-4 ring-1 ring-cherry/30">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cherry">Delulu mode · {m.delulu.temperature.toFixed(1)}</p>
                      <p className="mt-2 whitespace-pre-wrap leading-relaxed">{m.delulu.reply}</p>
                    </div>
                  </div>
                </div>
              ),
            )}

            {loading && (
              <div className="flex items-center gap-2 pl-2 text-burgundy" role="status">
                {[0, 1, 2].map((i) => (
                  <Heart key={i} filled className="h-4 w-4 animate-beat text-cherry" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
                <span className="font-script text-2xl">{loading === "compare" ? "asking two Gurus…" : "thinking about love…"}</span>
              </div>
            )}
          </div>

          <div className="border-t border-burgundy/10 p-4 sm:p-5">
            {error && <ErrorBox message={error} onRetry={lastAction ?? undefined} />}
            <form
              className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <label htmlFor="q" className="sr-only">Your message</label>
              <textarea
                id="q"
                rows={2}
                value={input}
                maxLength={MAX_INPUT + 50}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask the Love Guru…"
                className="field-box flex-1 !text-base"
              />
              <div className="flex gap-2 sm:flex-col">
                <button type="submit" className="btn flex-1 !px-6" disabled={!!loading}>Send ♡</button>
                <button
                  type="button"
                  onClick={compare}
                  disabled={!!loading}
                  className="btn-ghost flex-1 whitespace-nowrap !border-cherry !text-cherry"
                  title="Get two answers to the same question: temperature 0.2 vs 1.4"
                >
                  <Sparkle className="h-3 w-3" /> Reality vs. Delulu ♡
                </button>
              </div>
            </form>
            <p className="mt-3 text-xs text-cocoa/50">
              The Guru gives friendly advice, not professional counselling. Your chat is stored only in this browser.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
