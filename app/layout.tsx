import type { Metadata, Viewport } from "next";
import "@fontsource/great-vibes/latin-400.css";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CRUSH CODE ♡ Love is complicated. Let's decode it.",
  description:
    "Your AI-powered digital love diary: love calculator, red flag detector, zodiac match, text decoder, Love Guru chat and love letters.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90' fill='%23E63963'>♥</text></svg>",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF9F3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-cream focus:p-2">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
