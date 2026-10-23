import Link from "next/link";
import { FEATURES } from "@/lib/features";
import { Heart } from "./Decor";

export default function Footer() {
  return (
    <footer className="mt-24 bg-cocoa text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-10">
        <div>
          <p className="text-2xl font-bold tracking-[0.18em]">
            CRUSH CODE <span className="text-cherry">♡</span>
          </p>
          <p className="mt-3 font-script text-4xl text-blush">Love is complicated.</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">
            Love scores, astrology and AI readings are for entertainment only. Our AI can suggest possibilities, but it
            can&rsquo;t know what another person really thinks or feels. When in doubt, talk to them.
          </p>
        </div>
        <div>
          <p className="kicker !text-blush">Features</p>
          <ul className="mt-4 space-y-2 text-sm">
            {FEATURES.map((f) => (
              <li key={f.href}>
                <Link href={f.href} className="text-cream/80 transition hover:text-blush">
                  {f.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="kicker !text-blush">Need real help?</p>
          <p className="mt-4 text-sm leading-relaxed text-cream/70">
            If you feel unsafe in a relationship, contact local emergency services or a domestic-violence helpline in your
            country. You deserve to feel safe.
          </p>
          <Heart className="mt-6 h-8 w-8 text-cherry" filled />
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs uppercase tracking-[0.3em] text-cream/50">
        © {new Date().getFullYear()} Crush Code · Made with ♡ and a little AI
      </div>
    </footer>
  );
}
