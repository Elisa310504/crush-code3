import Link from "next/link";
import { Heart } from "@/components/Decor";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-28 text-center">
      <Heart className="mx-auto h-20 w-20 animate-wiggle text-cherry" />
      <h1 className="mt-6 text-6xl font-bold uppercase text-burgundy">
        Left on <span className="font-script normal-case text-cherry">read.</span>
      </h1>
      <p className="mt-4 text-xl italic text-cocoa/70">This page ghosted us. Let&rsquo;s get you back to love.</p>
      <Link href="/" className="btn mt-10">Back home ♡</Link>
    </section>
  );
}
