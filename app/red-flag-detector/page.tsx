"use client";

import { useState } from "react";
import { FlagIcon } from "@/components/Decor";
import { CharCount, ErrorBox, FeatureHeader, Loading } from "@/components/ui";
import { useAI } from "@/lib/useAI";

type Result = { verdict: string; summary: string; explanation: string; advice: string[]; safetyNote: string };

const EXAMPLES = [
  "We text every day, but they cancel our plans last minute almost every week and never suggest a new date.",
  "They introduced me to their friends after a month and always ask how my exams went.",
  "They get upset when I go out without them and want to check my phone.",
];

const STYLES: Record<string, { bg: string; ink: string; flag: string; title: string; script: string }> = {
  "GREEN FLAG": { bg: "bg-[#E7F1EA]", ink: "text-sage", flag: "#3F8A63", title: "Green flag", script: "Keep them close" },
  "MIXED SIGNALS": { bg: "bg-blush/60", ink: "text-burgundy", flag: "#FFD6E5", title: "Mixed signals", script: "Proceed with curiosity" },
  "RED FLAG": { bg: "bg-cherry/15", ink: "text-cherry", flag: "#E63963", title: "Red flag", script: "Protect your peace" },
};

const MAX = 1200;

export default function RedFlagPage() {
  const [situation, setSituation] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const { data, loading, error, run } = useAI<object, Result>("/api/red-flag");

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const s = situation.trim();
    if (s.length < 20) return setFormError("Tell us a little more (at least 20 characters).");
    if (s.length > MAX) return setFormError(`Please keep it under ${MAX} characters.`);
    setFormError(null);
    run({ situation: s });
  }

  const style = data ? STYLES[data.verdict] ?? STYLES["MIXED SIGNALS"] : null;

  return (
    <div className="pb-10">
      <FeatureHeader
        no="02"
        kicker="Red Flag Detector"
        before="Is it love or a"
        accent="warning sign?"
        subtitle="Describe what happened. We'll judge the behaviour, not the person, and tell you honestly."
      />

      <div className="mx-auto max-w-4xl px-5 md:px-10">
        <form onSubmit={submit} className="paper p-7 md:p-10" noValidate>
          <div className="flex items-end justify-between">
            <label htmlFor="situation" className="label">The situation</label>
            <CharCount value={situation} max={MAX} />
          </div>
          <textarea
            id="situation"
            rows={6}
            className="field-box mt-2"
            value={situation}
            maxLength={MAX + 50}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="So… we've been seeing each other for two months and…"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="kicker mr-1 self-center !text-cocoa/50">Try:</span>
            {EXAMPLES.map((ex, i) => (
              <button key={i} type="button" className="chip text-left" onClick={() => setSituation(ex)}>
                {ex.slice(0, 42)}…
              </button>
            ))}
          </div>
          {formError && <p className="mt-4 text-sm text-cherry" role="alert">{formError}</p>}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Analysing…" : "Check the flags ⚑"}
            </button>
            <p className="text-sm italic text-cocoa/55">We only hear your side, so take it as a second opinion.</p>
          </div>
        </form>

        <section aria-live="polite" className="mt-8">
          {loading && <Loading label="Inspecting the flags…" />}
          {!loading && error && <ErrorBox message={error} onRetry={submit} />}
          {!loading && data && style && (
            <article className={`paper animate-fade-up overflow-hidden ${style.bg} p-7 md:p-10`}>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <FlagIcon color={style.flag} className="h-24 w-24 shrink-0 animate-wiggle" />
                <div>
                  <p className="kicker">The verdict</p>
                  <h2 className={`text-5xl font-bold uppercase tracking-tight md:text-6xl ${style.ink}`}>{style.title}</h2>
                  <p className="font-script text-3xl text-burgundy">{style.script}</p>
                </div>
              </div>
              {data.summary && <p className="mt-6 text-2xl italic text-burgundy">&ldquo;{data.summary}&rdquo;</p>}
              <p className="mt-4 text-lg leading-relaxed">{data.explanation}</p>
              {data.advice.length > 0 && (
                <div className="mt-8">
                  <p className="kicker">What to do next</p>
                  <ol className="mt-3 space-y-3">
                    {data.advice.map((a, i) => (
                      <li key={i} className="flex gap-4 rounded-2xl bg-cream/80 p-4">
                        <span className="font-script text-3xl leading-none text-cherry">{i + 1}.</span>
                        <span className="text-lg">{a}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {data.safetyNote && (
                <p role="note" className="mt-6 rounded-2xl border-2 border-cherry bg-cream p-4 text-burgundy">
                  <strong>Your safety comes first: </strong>
                  {data.safetyNote}
                </p>
              )}
            </article>
          )}
        </section>
      </div>
    </div>
  );
}
