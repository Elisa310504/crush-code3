"use client";

import { useState } from "react";
import { Bow, Heart, WaxSeal } from "@/components/Decor";
import { CharCount, CopyButton, ErrorBox, FeatureHeader, Loading } from "@/components/ui";
import { LENGTHS, OCCASIONS, RELATIONSHIPS, TONES } from "@/lib/letterOptions";
import { useAI } from "@/lib/useAI";

type Form = {
  recipient: string;
  sender: string;
  relationship: string;
  occasion: string;
  tone: string;
  length: string;
  details: string;
};

export default function LoveLetterPage() {
  const [form, setForm] = useState<Form>({
    recipient: "",
    sender: "",
    relationship: RELATIONSHIPS[0],
    occasion: OCCASIONS[0],
    tone: TONES[0],
    length: "Medium",
    details: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const { data, loading, error, run } = useAI<Form, { letter: string }>("/api/love-letter");
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!form.recipient.trim()) return setFormError("Who is this letter for? ♡");
    if (form.details.length > 400) return setFormError("Please keep the details under 400 characters.");
    setFormError(null);
    run(form);
  }

  const select = (k: keyof Form, label: string, options: readonly string[]) => (
    <div>
      <label htmlFor={k} className="label">{label}</label>
      <select id={k} value={form[k]} onChange={set(k)} className="field cursor-pointer appearance-none">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="pb-10">
      <FeatureHeader
        no="06"
        kicker="Love Letter Generator"
        before="Some feelings deserve more"
        accent="than a text."
        subtitle="Tell us who it's for and how you feel. We'll write it on our finest digital stationery."
      />

      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:px-10 lg:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={submit} className="paper h-fit space-y-6 p-7 md:p-9" noValidate>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="recipient" className="label">Recipient&rsquo;s name</label>
              <input id="recipient" className="field" maxLength={40} value={form.recipient} onChange={set("recipient")} placeholder="My dearest…" />
            </div>
            <div>
              <label htmlFor="sender" className="label">Your name <span className="normal-case tracking-normal text-cocoa/45">(optional)</span></label>
              <input id="sender" className="field" maxLength={40} value={form.sender} onChange={set("sender")} placeholder="Yours truly" />
            </div>
          </div>
          {select("relationship", "Relationship status", RELATIONSHIPS)}
          {select("occasion", "Occasion", OCCASIONS)}
          <div className="grid gap-6">
            {select("tone", "Tone", TONES)}
            <fieldset>
              <legend className="label">Letter length</legend>
              <div className="mt-2 flex gap-2">
                {LENGTHS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    aria-pressed={form.length === l}
                    onClick={() => setForm((f) => ({ ...f, length: l }))}
                    className={`flex-1 rounded-full border-2 px-2 py-2.5 text-xs font-bold uppercase tracking-[0.15em] transition ${
                      form.length === l ? "border-burgundy bg-burgundy text-cream" : "border-burgundy/20 text-burgundy hover:border-cherry"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
          <div>
            <div className="flex items-end justify-between">
              <label htmlFor="details" className="label">Little details <span className="normal-case tracking-normal text-cocoa/45">(optional)</span></label>
              <CharCount value={form.details} max={400} />
            </div>
            <textarea id="details" rows={3} maxLength={450} className="field-box mt-2 !text-base" value={form.details} onChange={set("details")} placeholder="The way they laugh at their own jokes, our first coffee in the rain…" />
          </div>
          {formError && <p className="text-sm text-cherry" role="alert">{formError}</p>}
          <button className="btn w-full" type="submit" disabled={loading}>
            {loading ? "Writing…" : data ? "Write another version ✒" : "Write my letter ✒"}
          </button>
        </form>

        <section aria-live="polite" className="relative">
          {error && !loading && <ErrorBox message={error} onRetry={submit} />}
          <div className="relative mx-auto mt-2 max-w-2xl">
            <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-1 rounded-sm bg-blush" aria-hidden="true" />
            <article className="relative rounded-sm border border-burgundy/20 bg-[#FFFBF6] px-7 pb-14 pt-10 shadow-[0_30px_60px_-25px_rgba(53,26,36,0.45)] sm:px-14">
              <div className="pointer-events-none absolute inset-3 border border-double border-burgundy/25" style={{ borderWidth: 3 }} aria-hidden="true" />
              <Bow className="absolute -top-8 left-1/2 w-24 -translate-x-1/2 text-cherry" />
              <div className="flex items-start justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-burgundy/70" suppressHydrationWarning>{date}</p>
                <div className="flex h-16 w-14 rotate-6 items-center justify-center border-2 border-dashed border-burgundy/40 bg-blush">
                  <Heart filled className="h-7 w-7 text-cherry" />
                </div>
              </div>

              {loading && <Loading label="Dipping the quill…" />}
              {!loading && !data && (
                <div className="lined mt-8 min-h-[340px] text-xl italic leading-[34px] text-cocoa/40">
                  <p className="font-script text-4xl not-italic text-burgundy/50">My dearest {form.recipient || "…"},</p>
                  <p className="mt-2">Your letter will be written here, in ink and in pixels.</p>
                </div>
              )}
              {!loading && data && (
                <div className="lined mt-8 min-h-[340px] animate-fade-up whitespace-pre-wrap text-[1.15rem] leading-[34px] text-cocoa">
                  {data.letter}
                </div>
              )}
              <WaxSeal className="absolute -bottom-8 right-10 h-20 w-20 rotate-[-10deg] drop-shadow-lg" letter={(form.sender || "C").charAt(0).toUpperCase()} />
            </article>
          </div>
          {data && !loading && (
            <div className="mt-14 flex flex-wrap justify-center gap-3">
              <CopyButton text={data.letter} label="Copy letter" />
              <button type="button" className="btn-ghost" onClick={() => submit()}>New version</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
