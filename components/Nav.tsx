"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/#explore", label: "Explore" },
  { href: "/love-guru", label: "Love Guru" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-burgundy/10 bg-cream/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10" aria-label="Main">
        <Link href="/" className="group flex items-baseline gap-2 text-xl font-bold tracking-[0.18em] text-burgundy md:text-2xl">
          CRUSH CODE
          <span className="inline-block text-cherry transition group-hover:scale-125 group-hover:animate-beat">♡</span>
        </Link>

        <ul className="hidden items-center gap-10 md:flex">
          {LINKS.map((l) => {
            const active = l.href === pathname;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`relative text-sm uppercase tracking-[0.25em] transition hover:text-cherry ${
                    active ? "text-cherry" : "text-cocoa"
                  } after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-cherry after:transition hover:after:scale-x-100 ${
                    active ? "after:scale-x-100" : ""
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-burgundy/30 text-burgundy md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="text-xl leading-none">{open ? "×" : "☰"}</span>
        </button>
      </nav>

      {open && (
        <ul className="animate-fade-up border-t border-burgundy/10 px-5 pb-6 pt-2 md:hidden">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block border-b border-burgundy/10 py-4 text-lg uppercase tracking-[0.25em] text-burgundy"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
