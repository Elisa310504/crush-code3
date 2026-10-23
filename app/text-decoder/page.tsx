"use client";

import { useState } from "react";
import { Heart } from "@/components/Decor";
import { CharCount, CopyButton, ErrorBox, FeatureHeader, Loading } from "@/components/ui";
import { useAI } from "@/lib/useAI";

type Result = {
  vibe: string;
  interpretations: { title: string; likelihood: string; explanation: string }[];
  replies: { sweet: string; flirty: string; bold: string };
  reminder: string;
};

const PILL: Record<string, string> = {
  Likely: "bg-cherry text-cream",
  Possible: "bg-blush text-burgundy",
  "Less likely": "bg-cream text-burgundy border border-burgundy/30",
};

const REPLY_STYLES = [
  { key: "sweet", label: "Sweet", note: "warm & genuine", cls: "bg-blush/70" },
  { key: "flirty", label: "Flirty", note: "playful & light", cls: "bg-cream" },
  { key: "bold", label: "Bold", note: "confident & direct", cls: "bg-burgundy text-cream" },
] as const;

export default function TextDecoderPage() {
  const [message, setMessage] = useState("");
  const [context, setContext] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const { data, loading, error, run } = useAI<object, Result>("/api/text-decoder");

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!message.trim()) return setFormError("Paste their message first ✉");
    if (message.length > 600 || context.length > 300) return setFormError("That's a bit too long. Please shorten it.");
    setFormError(null);
    run({ message, context });
  }

  return (
    <div className="pb-10">
      <FeatureHeader
        no="04"
        kicker="Text Decoder"
        before="What did they"
        accent="really mean?"
        subtitle="Paste their message. We'll offer possible readings (we can't read minds) and three replies to send back."
      />

      <div className="mx-auto grid max-w-6xl gap-8 px-5 md:px-10 lg:grid-cols-[0.85fr_1.15fr]">
        <form onSubmit={submit} className="paper h-fit p-7 md:p-9" noValidate>
          <div className="flex items-end justify-between">
            <label htmlFor="msg" className="label">Their message</label>
            <CharCount value={message} max={600} />
          </div>
          <div className="relative mt-3">
            <textarea
              id="msg"
              rows={4}
              className="field-box rounded-bl-md !bg-blush/40"
              value={message}
              maxLength={650}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="haha ok. maybe we could hang out sometime?"
            />
          </div>
          <div className="mt-6 flex items-end justify-between">
            <label htmlFor="ctx" className="label">Context <span className="normal-case tracking-normal text-cocoa/45">(optional)</span></label>
            <CharCount value={context} max={300} />
          </div>
          <textarea
            id="ctx"
            rows={3}
            className="field-box mt-2"
            value={context}
            maxLength={350}
            onChange={(e) => setContext(e.target.value)}
            placeholder="We met at a party two weeks ago, they replied after 4 hours…"
          />
          {formError && <p className="mt-4 text-sm text-cherry" role="alert">{formError}</p>}
          <button className="btn mt-7 w-full" type="submit" disabled={loading}>
            {loading ? "Decoding…" : "Decode it ✉"}
          </button>
        </form>

        <section aria-live="polite">
          {loading && <Loading label="Reading between the lines…" />}
          {!loading && error && <ErrorBox message={error} onRetry={submit} />}
          {!loading && !error && !data && (
            <div className="paper flex min-h-[360px] flex-col items-center justify-center p-10 text-center">
              <div className="max-w-xs rounded-3xl rounded-bl-md bg-blush px-6 py-4 text-left text-lg italic text-burgundy">
                &ldquo;hey… what are you up to?&rdquo;
              </div>
              <p className="mt-6 font-script text-4xl text-burgundy">…what does it mean?!</p>
            </div>
          )}
          {!loading && data && (
            <div className="animate-fade-up space-y-6">
              <div className="paper p-7">
                <p className="kicker">The vibe</p>
                <p className="mt-2 text-3xl font-bold leading-tight text-burgundy">{data.vibe}</p>
                <ul className="mt-6 space-y-4">
                  {data.interpretations.map((it, i) => (
                    <li key={i} className="rounded-2xl border border-burgundy/10 bg-white/50 p-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] ${PILL[it.likelihood] ?? PILL.Possible}`}>
                          {it.likelihood}
                        </span>
                        <h3 className="text-xl font-bold text-burgundy">{it.title}</h3>
                      </div>
                      <p className="mt-2 leading-relaxed">{it.explanation}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="kicker mb-3">Three ways to reply</p>
                <div className="grid gap-4 md:grid-cols-3">
                  {REPLY_STYLES.map((r) => (
                    <div key={r.key} className={`paper flex flex-col justify-between p-6 ${r.cls}`}>
                      <div>
                        <p className="text-2xl font-bold uppercase tracking-[0.15em]">{r.label}</p>
                        <p className="font-script text-2xl opacity-80">{r.note}</p>
                        <p className="mt-4 text-lg leading-relaxed">&ldquo;{data.replies[r.key]}&rdquo;</p>
                      </div>
                      <div className="mt-5 [&_button]:!border-current [&_button]:!text-current">
                        <CopyButton text={data.replies[r.key]} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {data.reminder && (
                <p className="flex items-center gap-3 text-lg italic text-burgundy">
                  <Heart filled className="h-5 w-5 shrink-0 text-cherry" /> {data.reminder}
                </p>
              )}
              <p className="text-xs uppercase tracking-[0.2em] text-cocoa/50">
                Possible readings only · the AI can&rsquo;t know what someone really feels
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
