"use client";

import { useState } from "react";
import { Sparkle, Star } from "@/components/Decor";
import { EntertainmentNote, ErrorBox, FeatureHeader, Loading } from "@/components/ui";
import { useAI } from "@/lib/useAI";
import { useCountUp } from "@/lib/useCountUp";
import { SIGNS, glyph } from "@/lib/zodiac";

type Result = { signA: string; signB: string; score: number; title: string; sections: { label: string; text: string }[] };

function SignPicker({ title, value, onChange }: { title: string; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset>
      <legend className="label">{title}</legend>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {SIGNS.map((s) => {
          const active = value === s.name;
          return (
            <button
              key={s.name}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(s.name)}
              className={`flex flex-col items-center rounded-2xl border-2 px-1 py-3 transition duration-300 ${
                active ? "-translate-y-1 border-burgundy bg-burgundy text-cream shadow-[3px_3px_0_#E63963]" : "border-burgundy/15 bg-cream hover:border-cherry hover:bg-blush/50"
              }`}
            >
              <span className={`text-2xl ${active ? "text-blush" : "text-cherry"}`}>{glyph(s.name)}</span>
              <span className="mt-1 text-xs font-bold uppercase tracking-wider">{s.name}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function ZodiacPage() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const { data, loading, error, run } = useAI<object, Result>("/api/zodiac");

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!a || !b) return setFormError("Pick two signs ✦");
    setFormError(null);
    run({ signA: a, signB: b });
  }

  return (
    <div className="pb-10">
      <FeatureHeader
        no="03"
        kicker="Zodiac Love Match"
        before="Written"
        accent="in the stars?"
        subtitle="Choose two signs and read your cosmic love horoscope. Pure entertainment, sprinkled with stardust."
      />

      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <form onSubmit={submit} className="paper p-7 md:p-10">
          <div className="grid items-start gap-10 md:grid-cols-[1fr_auto_1fr]">
            <SignPicker title="Your sign" value={a} onChange={setA} />
            <div className="flex items-center justify-center self-center font-script text-6xl text-cherry">&amp;</div>
            <SignPicker title="Their sign" value={b} onChange={setB} />
          </div>
          {formError && <p className="mt-6 text-sm text-cherry" role="alert">{formError}</p>}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Reading the stars…" : "Read our stars ✦"}
            </button>
          </div>
        </form>

        <section aria-live="polite" className="mt-8">
          {loading && <Loading label="Consulting the cosmos…" />}
          {!loading && error && <ErrorBox message={error} onRetry={submit} />}
          {!loading && data && <ZodiacResult data={data} />}
        </section>
      </div>
    </div>
  );
}

function ZodiacResult({ data }: { data: Result }) {
  const score = useCountUp(data.score);
  return (
    <article className="paper relative animate-fade-up overflow-hidden bg-cocoa p-7 text-cream md:p-12">
      {[...Array(14)].map((_, i) => (
        <Sparkle
          key={i}
          className="absolute h-3 w-3 animate-twinkle text-blush/50"
          style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, animationDelay: `${i * 0.2}s` }}
        />
      ))}
      <div className="relative text-center">
        <p className="kicker !text-blush">Your cosmic love report</p>
        <p className="mt-4 text-5xl text-blush md:text-6xl">
          {glyph(data.signA)} <span className="font-script text-cherry">&amp;</span> {glyph(data.signB)}
        </p>
        <h2 className="mt-3 text-4xl font-bold uppercase tracking-tight md:text-5xl">{data.title}</h2>
        <p className="mt-2 italic text-cream/70">{data.signA} × {data.signB}</p>
        <p className="mt-6 font-script text-7xl text-cherry">{score}%</p>
        <p className="kicker !text-cream/60">Star score</p>
      </div>
      <div className="relative mt-10 grid gap-5 md:grid-cols-2">
        {data.sections.map((s, i) => (
          <div key={s.label} className={`rounded-2xl border border-cream/15 bg-cream/[0.06] p-6 ${i === 0 ? "md:col-span-2" : ""}`}>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-blush">
              <Star className="h-4 w-4 text-cherry" /> {s.label}
            </p>
            <p className="mt-3 text-lg leading-relaxed text-cream/90">{s.text}</p>
          </div>
        ))}
      </div>
      <div className="relative text-center">
        <span className="[&>p]:!border-cream/40 [&>p]:!text-cream/70">
          <EntertainmentNote>Astrology is for entertainment only · not a prediction</EntertainmentNote>
        </span>
      </div>
    </article>
  );
}
