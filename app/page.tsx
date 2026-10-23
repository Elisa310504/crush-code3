import Link from "next/link";
import { Bow, Envelope, Heart, Sparkle, Squiggle, Star } from "@/components/Decor";
import { FEATURES } from "@/lib/features";

const MARQUEE = ["Mixed signals", "Soulmates", "Situationships", "First dates", "Love letters", "Delulu", "Butterflies", "Red flags"];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-10 md:px-10 md:pb-24 md:pt-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="relative z-10 animate-fade-up">
          <p className="kicker flex items-center gap-3">
            <span className="h-px w-10 bg-burgundy" /> Your digital love diary
          </p>
          <h1 className="mt-6 font-bold uppercase leading-[0.86] tracking-[-0.02em] text-burgundy">
            <span className="block text-[16vw] sm:text-[6.5rem] lg:text-[7rem] xl:text-[8.25rem]">Love is</span>
            <span className="relative -my-2 block pl-[6vw] font-script text-[22vw] normal-case leading-[1.1] tracking-normal text-cherry sm:pl-16 sm:text-[9rem] lg:text-[9.5rem] xl:text-[11rem]">
              complicated.
              <Heart className="absolute -top-2 right-[8%] h-10 w-10 animate-float text-burgundy sm:h-14 sm:w-14" />
            </span>
            <span className="block whitespace-nowrap text-[7.4vw] sm:text-[4.2rem] lg:text-[4.3rem] xl:text-[5.2rem]">Let&rsquo;s decode it.</span>
          </h1>
          <p className="mt-8 max-w-md text-xl italic leading-relaxed text-cocoa/80 md:text-2xl">
            From mixed signals to soulmates.
            <br />
            Your AI-powered guide to everything love.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link href="/love-guru" className="btn text-base">
              Let&rsquo;s talk love ♡
            </Link>
            <Link href="#explore" className="text-sm uppercase tracking-[0.25em] text-burgundy underline decoration-cherry decoration-2 underline-offset-8 hover:text-cherry">
              Explore features
            </Link>
          </div>
        </div>

        {/* Collage */}
        <div className="relative mx-auto h-[400px] w-[86%] max-w-[420px] sm:h-[460px]" aria-hidden="true">
          <div className="absolute inset-x-6 top-4 h-[88%] rotate-[4deg] rounded-[32px] bg-blush" />
          <div className="paper absolute inset-x-0 top-0 flex h-[88%] -rotate-[3deg] flex-col justify-between overflow-hidden p-8">
            <div>
              <p className="kicker">Issue No. 14 · Love</p>
              <p className="mt-3 font-script text-5xl leading-none text-cherry sm:text-6xl">Dear diary,</p>
              <div className="lined mt-4 min-h-28 text-lg italic leading-[34px] text-cocoa/80">
                they replied &ldquo;haha ok&rdquo; after 3 hours.
                <br />
                what does it mean?? ♡
              </div>
            </div>
            <Envelope className="mx-auto w-48 -rotate-6 transition duration-500 hover:rotate-0 sm:w-56" />
          </div>
          <Bow className="absolute -right-2 -top-6 w-24 rotate-12 text-cherry sm:w-28" />
          <div className="absolute -bottom-2 -left-3 rotate-[-8deg] rounded-full bg-burgundy px-5 py-3 text-xs font-bold uppercase tracking-[0.25em] text-cream shadow-lg">
            100% delulu-approved
          </div>
          <Sparkle className="absolute -left-6 top-24 h-7 w-7 animate-twinkle text-cherry" />
          <Star className="absolute bottom-16 right-0 h-8 w-8 animate-wiggle text-burgundy" />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y-2 border-burgundy bg-burgundy py-4 text-cream" aria-hidden="true">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE].map((w, i) => (
            <span key={i} className="flex items-center gap-10 text-2xl uppercase tracking-[0.2em]">
              {i % 3 === 1 ? <span className="font-script text-4xl normal-case tracking-normal text-blush">{w}</span> : w}
              <span className="text-cherry">♡</span>
            </span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section id="explore" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 md:px-10 md:py-28">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="kicker">The contents</p>
            <h2 className="mt-3 text-5xl font-bold uppercase leading-[0.95] text-burgundy md:text-7xl">
              Six ways to
              <br />
              <span className="relative font-script text-[1.2em] normal-case text-cherry">
                decode love
                <Squiggle className="absolute -bottom-1 left-0 h-3 w-full text-blush" />
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-lg italic text-cocoa/70">
            Pick a page from the diary. Every tool is powered by real AI, written with a wink, and meant for fun.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <li key={f.href} className="animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
              <Link
                href={f.href}
                className={`group relative flex h-full min-h-[300px] flex-col justify-between overflow-hidden rounded-[28px] border-2 border-burgundy/15 ${f.tint} p-7 transition duration-500 hover:-translate-y-2 hover:rotate-[-0.6deg] hover:border-burgundy hover:shadow-[8px_8px_0_#6D1233]`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-bold tracking-[0.3em] text-burgundy/60">No. {f.no}</span>
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-burgundy text-2xl text-burgundy transition duration-500 group-hover:rotate-12 group-hover:bg-cherry group-hover:text-cream group-hover:border-cherry">
                    {f.icon}
                  </span>
                </div>
                <div>
                  <p className="kicker !text-cherry">{f.title}</p>
                  <h3 className="mt-3 text-3xl font-bold leading-tight text-burgundy">
                    {f.headline.replace(f.accent, "")}
                    <span className="font-script text-4xl font-normal text-cherry">{f.accent}</span>
                  </h3>
                  <p className="mt-3 italic text-cocoa/70">{f.blurb}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-burgundy">
                    Open <span className="transition group-hover:translate-x-2">→</span>
                  </span>
                </div>
                <Heart className="absolute -bottom-6 -right-6 h-28 w-28 text-burgundy/[0.07] transition duration-700 group-hover:scale-125 group-hover:text-cherry/20" filled />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* QUOTE */}
      <section className="mx-auto max-w-4xl px-5 text-center">
        <Bow className="mx-auto w-20 text-cherry" />
        <blockquote className="mt-6 text-3xl leading-snug text-burgundy md:text-5xl">
          &ldquo;The AI can read the text.
          <br />
          <span className="font-script text-cherry">Only you</span> can read the room.&rdquo;
        </blockquote>
        <p className="kicker mt-6">— The Crush Code editors</p>
      </section>
    </>
  );
}
