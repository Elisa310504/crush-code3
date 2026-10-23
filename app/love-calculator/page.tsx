"use client";

import { useEffect, useState } from "react";
import { Heart, Sparkle } from "@/components/Decor";
import ZodiacSelect from "@/components/ZodiacSelect";
import { EntertainmentNote, ErrorBox, FeatureHeader, Loading } from "@/components/ui";
import { useAI } from "@/lib/useAI";
import { useCountUp } from "@/lib/useCountUp";

type Result = {
  overall: number;
  categories: { name: string; score: number }[];
  headline: string;
  interpretation: string;
  tip: string;
};

export default function LoveCalculatorPage() {
  const [name, setName] = useState("");
  const [crush, setCrush] = useState("");
  const [yourSign, setYourSign] = useState("");
  const [crushSign, setCrushSign] = useState("");
  const { data, loading, error, run, reset } = useAI<object, Result>("/api/love-calculator");
  const [formError, setFormError] = useState<string | null>(null);

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!name.trim() || !crush.trim()) return setFormError("Please enter both names ♡");
    if (name.length > 40 || crush.length > 40) return setFormError("Names can be up to 40 characters.");
    setFormError(null);
    run({ name, crush, yourSign, crushSign });
  }

  return (
    <div className="pb-10">
      <FeatureHeader
        no="01"
        kicker="Love Calculator"
        before="Are you two"
        accent="meant to be?"
        subtitle="Type two names, add your signs if you like, and let our very unscientific formula do the maths."
      />

      <div className="mx-auto grid max-w-6xl gap-8 px-5 md:px-10 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={submit} className="paper space-y-7 p-7 md:p-10" noValidate>
          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="label">Your name</label>
              <input id="name" className="field" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} placeholder="e.g. Emma" autoComplete="given-name" />
            </div>
            <div>
              <label htmlFor="crush" className="label">Your crush&rsquo;s name</label>
              <input id="crush" className="field" value={crush} maxLength={40} onChange={(e) => setCrush(e.target.value)} placeholder="e.g. Max" />
            </div>
          </div>
          <div className="grid gap-7 sm:grid-cols-2">
            <ZodiacSelect id="ys" label="Your sign" value={yourSign} onChange={setYourSign} optional />
            <ZodiacSelect id="cs" label="Their sign" value={crushSign} onChange={setCrushSign} optional />
          </div>
          {formError && <p className="text-sm text-cherry" role="alert">{formError}</p>}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Calculating…" : "Calculate our love ♡"}
            </button>
            {data && (
              <button type="button" className="btn-ghost" onClick={() => { reset(); setName(""); setCrush(""); setYourSign(""); setCrushSign(""); }}>
                Try another pair
              </button>
            )}
          </div>
          <p className="text-sm italic text-cocoa/55">Same names always give the same score. It&rsquo;s a game, not a prophecy.</p>
        </form>

        <section aria-live="polite" className="paper relative min-h-[420px] overflow-hidden bg-blush/40 p-7 md:p-10">
          {loading && <Loading label="Counting butterflies…" />}
          {!loading && error && <ErrorBox message={error} onRetry={submit} />}
          {!loading && !error && !data && <EmptyState />}
          {!loading && data && <ResultView data={data} names={[name, crush]} />}
        </section>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center py-12 text-center">
      <div className="relative">
        <Heart className="h-32 w-32 text-burgundy/20" />
        <span className="absolute inset-0 flex items-center justify-center pb-3 text-4xl font-bold text-burgundy/30">?%</span>
      </div>
      <p className="mt-6 font-script text-4xl text-burgundy">Your score will appear here</p>
    </div>
  );
}

function ResultView({ data, names }: { data: Result; names: string[] }) {
  const value = useCountUp(data.overall);
  const [bars, setBars] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBars(true), 150);
    return () => clearTimeout(t);
  }, [data]);
  const r = 70;
  const c = 2 * Math.PI * r;

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="relative h-44 w-44 shrink-0">
          <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
            <circle cx="80" cy="80" r={r} stroke="#FFD6E5" strokeWidth="12" fill="none" />
            <circle
              cx="80" cy="80" r={r} stroke="#E63963" strokeWidth="12" fill="none" strokeLinecap="round"
              strokeDasharray={c} strokeDashoffset={c - (c * value) / 100}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold tabular-nums text-burgundy">{value}%</span>
            <Heart filled className="mt-1 h-5 w-5 animate-beat text-cherry" />
          </div>
        </div>
        <div className="text-center sm:text-left">
          <p className="kicker">{names[0]} ♡ {names[1]}</p>
          <h2 className="mt-2 text-3xl font-bold leading-tight text-burgundy">{data.headline}</h2>
        </div>
      </div>

      <ul className="mt-8 space-y-4">
        {data.categories.map((cat, i) => (
          <li key={cat.name}>
            <div className="flex justify-between text-sm">
              <span className="uppercase tracking-[0.18em] text-burgundy">{cat.name}</span>
              <span className="font-bold tabular-nums text-cherry">{cat.score}%</span>
            </div>
            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-cream">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cherry to-burgundy transition-[width] duration-[1400ms] ease-out"
                style={{ width: bars ? `${cat.score}%` : "0%", transitionDelay: `${i * 120}ms` }}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 rounded-2xl bg-cream/80 p-6">
        <p className="text-lg leading-relaxed">{data.interpretation}</p>
        {data.tip && (
          <p className="mt-4 flex gap-2 italic text-burgundy">
            <Sparkle className="mt-1.5 h-4 w-4 shrink-0 text-cherry" /> {data.tip}
          </p>
        )}
      </div>
      <EntertainmentNote>Entertainment only · a playful formula, not a scientific claim</EntertainmentNote>
    </div>
  );
}
