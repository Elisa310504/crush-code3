// Hand-drawn style decorations (inline SVG, no image files needed).
type P = { className?: string; style?: React.CSSProperties };

export function Heart({ className, style, filled = false }: P & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 64 58" className={className} style={style} aria-hidden="true" fill="none">
      <path
        d="M32 52C19 43 6 33 6 19 6 10.5 12.5 5 20.5 5c5 0 9 2.8 11.5 7 2.5-4.2 6.5-7 11.5-7C51.5 5 58 10.5 58 19c0 14-13 24-26 33z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31 49.5C20 41.5 9.5 32.5 9 20"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity={filled ? 0 : 0.55}
      />
    </svg>
  );
}

export function Bow({ className, style }: P) {
  return (
    <svg viewBox="0 0 120 84" className={className} style={style} aria-hidden="true" fill="none">
      <g stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M58 36C45 20 22 6 13 15 4 25 18 45 58 40z" />
        <path d="M62 36C75 20 98 6 107 15c9 10-5 30-45 25z" />
        <path d="M24 20c8 4 18 10 28 16M96 20c-8 4-18 10-28 16" opacity=".5" />
        <path d="M55 41 40 78l9-4 4 8 6-38M65 41l15 37-9-4-4 8-6-38" />
        <ellipse cx="60" cy="38" rx="7" ry="8" fill="currentColor" fillOpacity=".15" />
      </g>
    </svg>
  );
}

export function Sparkle({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path d="M12 0c.9 7.4 4 10.8 12 12-8 1.2-11.1 4.6-12 12-.9-7.4-4-10.8-12-12C8 10.8 11.1 7.4 12 0z" fill="currentColor" />
    </svg>
  );
}

export function Star({ className, style }: P) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} aria-hidden="true" fill="none">
      <path
        d="M20 3l4.6 10.6 11.4 1-8.7 7.6 2.7 11.3L20 27.6l-10 5.9 2.7-11.3L4 14.6l11.4-1z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Squiggle({ className, style }: P) {
  return (
    <svg viewBox="0 0 220 18" className={className} style={style} aria-hidden="true" fill="none" preserveAspectRatio="none">
      <path
        d="M2 10c18-9 30 9 48 0s30 9 48 0 30 9 48 0 30 9 48 0 18 4 24 2"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Envelope({ className, style }: P) {
  return (
    <svg viewBox="0 0 240 170" className={className} style={style} aria-hidden="true" fill="none">
      <rect x="6" y="8" width="228" height="154" rx="10" fill="#FFF9F3" stroke="#6D1233" strokeWidth="2.5" />
      <path d="M8 14l112 82L232 14" stroke="#6D1233" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M8 160l84-70M232 160l-84-70" stroke="#6D1233" strokeWidth="1.6" opacity=".5" />
      <circle cx="120" cy="96" r="22" fill="#E63963" />
      <circle cx="120" cy="96" r="16" fill="none" stroke="#FFD6E5" strokeWidth="1.4" strokeDasharray="3 3" />
      <path
        d="M120 106c-5-3.6-10-7.6-10-13a5.5 5.5 0 0 1 10-3 5.5 5.5 0 0 1 10 3c0 5.4-5 9.4-10 13z"
        fill="#FFF9F3"
      />
      <rect x="186" y="22" width="34" height="40" rx="2" fill="#FFD6E5" stroke="#6D1233" strokeWidth="1.6" strokeDasharray="2 2.5" />
      <path d="M203 48c-3-2-6-4.5-6-8a3.4 3.4 0 0 1 6-1.8 3.4 3.4 0 0 1 6 1.8c0 3.5-3 6-6 8z" fill="#E63963" />
    </svg>
  );
}

export function WaxSeal({ className, style, letter = "C" }: P & { letter?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} style={style} aria-hidden="true">
      <path
        d="M40 4c6 0 8 4 13 5s10-1 13 4-1 9 1 14 7 7 6 13-6 7-7 12 2 10-3 14-9 0-14 3-7 7-13 7-8-4-13-6-10 2-13-3 1-9-1-14-7-7-6-13 6-7 7-12-2-10 3-14 9 0 14-3 4-7 10-7z"
        fill="#6D1233"
      />
      <circle cx="40" cy="40" r="23" fill="none" stroke="#E63963" strokeWidth="1.6" opacity=".8" />
      <text x="40" y="51" textAnchor="middle" fontFamily="'Great Vibes', cursive" fontSize="32" fill="#FFD6E5">
        {letter}
      </text>
    </svg>
  );
}

export function FlagIcon({ className, color }: P & { color: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="none">
      <path d="M14 6v54" stroke="#351A24" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M16 9c10-5 18 4 28 0s12-2 14-1v26c-2-1-6-3-14 1s-18-5-28 0z" fill={color} stroke="#351A24" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}
