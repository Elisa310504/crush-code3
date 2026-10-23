"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Sparkle, Squiggle } from "./Decor";

export function FeatureHeader({
  no,
  kicker,
  before,
  accent,
  after,
  subtitle,
}: {
  no: string;
  kicker: string;
  before: string;
  accent: string;
  after?: string;
  subtitle: string;
}) {
  return (
    <header className="relative mx-auto max-w-4xl px-5 pb-10 pt-12 text-center md:pt-20">
      <Link href="/#explore" className="kicker inline-flex items-center gap-2 !text-burgundy/60 hover:!text-cherry">
        ← All features
      </Link>
      <p className="kicker mt-8">
        No. {no} · {kicker}
      </p>
      <h1 className="mt-4 text-[2.6rem] font-bold uppercase leading-[0.95] tracking-tight text-burgundy sm:text-6xl md:text-7xl">
        {before}{" "}
        <span className="relative inline-block font-script text-[1.15em] normal-case tracking-normal text-cherry">
          {accent}
          <Squiggle className="absolute -bottom-2 left-0 h-3 w-full text-blush" />
        </span>{" "}
        {after}
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg italic text-cocoa/75 md:text-xl">{subtitle}</p>
      <Sparkle className="absolute left-4 top-24 hidden h-6 w-6 animate-twinkle text-cherry md:block" />
      <Heart className="absolute right-8 top-32 hidden h-10 w-10 animate-float text-burgundy/40 md:block" />
    </header>
  );
}

export function Loading({ label = "Decoding love…" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center gap-4 py-12 text-burgundy">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <Heart key={i} filled className="h-6 w-6 animate-beat text-cherry" style={{ animationDelay: `${i * 0.18}s` }} />
        ))}
      </div>
      <p className="font-script text-3xl">{label}</p>
    </div>
  );
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-cherry/40 bg-blush/50 px-5 py-4 text-burgundy">
      <p>
        <span className="mr-2 font-bold">Oops ♡</span>
        {message}
      </p>
      {onRetry && (
        <button type="button" className="btn-ghost" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EntertainmentNote({ children }: { children?: React.ReactNode }) {
  return (
    <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-dashed border-burgundy/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-burgundy/80">
      <Sparkle className="h-3 w-3 text-cherry" />
      {children ?? "For entertainment only · not a scientific claim"}
    </p>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <button type="button" onClick={copy} className="btn-ghost" aria-live="polite">
      {copied ? "Copied ♡" : label}
    </button>
  );
}

export function CharCount({ value, max }: { value: string; max: number }) {
  return (
    <span className={`text-xs tabular-nums ${value.length > max ? "text-cherry" : "text-cocoa/45"}`}>
      {value.length}/{max}
    </span>
  );
}
