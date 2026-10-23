"use client";

import { SIGNS, glyph } from "@/lib/zodiac";

export default function ZodiacSelect({
  id,
  label,
  value,
  onChange,
  optional = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  optional?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label} {optional && <span className="normal-case tracking-normal text-cocoa/45">(optional)</span>}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="field cursor-pointer appearance-none">
        <option value="">{optional ? "I'd rather not say" : "Choose a sign"}</option>
        {SIGNS.map((s) => (
          <option key={s.name} value={s.name}>
            {glyph(s.name)} {s.name} · {s.dates}
          </option>
        ))}
      </select>
    </div>
  );
}
